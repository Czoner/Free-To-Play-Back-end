const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users.js");
const { JWT_SECRET } = require("../utils/Config");
const { BadRequestError } = require("../utils/BadRequestError");
const { UnauthorizedError } = require("../utils/UnauthorizedError");
const { NotFoundError } = require("../utils/NotFoundError");
const { ConflictError } = require("../utils/ConflictError");

//POST the use

const creatingUser = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!email) {
        throw new BadRequestError("Email is missing or null");
    }
    if (!password) {
        throw new BadRequestError("Password is missing or null");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return User.create({ username, email, password: hashedPassword })
        .then((user) => {
            if (!user) {
                throw new NotFoundError("No user with matching ID found");
            }
            res.status(201).send({
                username: user.username,
                email: user.email,
            });
        })
        .catch((err) => {
            console.error("Error creating user:", err);
            if (err.name === "ValidationError") {
                next(new BadRequestError("Invalid data"));
            } else if (err.name === "MongoServerError" || err.code === 11001) {
                next(new ConflictError(err.message));
            } else {
                next(err);
            }
        });
};

// GET the user aka one single user

const getCurrentUser = (req, res, next) => {
    const userId = req.user._id;
    return User.findById(userId)
        .orFail()
        .then((user) => {
            if (!user) {
                throw new NotFoundError("No user with matching ID found");
            }
            res.status(200).send(user);
        })
        .catch((err) => {
            console.error(err);
            if (err.name === "DocumentNotFoundError") {
                next(new NotFoundError("No user with matching ID found"));
            } else if (err.name === "CastError") {
                next(
                    new BadRequestError(
                        "The name string is in an invalid format"
                    )
                );
            } else {
                next(err);
            }
        });
};

// SIGN in for the user

const login = (req, res, next) => {
    const { email, password } = req.body;
    if (!email) {
        throw new BadRequestError("Email is missing or null");
    }

    return User.findUserByCredentials(email, password)
        .then((user) => {
            if (!user) {
                throw new NotFoundError("No user with matching ID found");
            }
            const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
                expiresIn: "7d",
            });

            res.status(200).send({ token });
        })
        .catch((err) => {
            console.error(err);
            if (err.message === "Incorrect email or password") {
                next(new UnauthorizedError("Incorrect email or password"));
            } else {
                next(err);
            }
        });
};

module.exports = {
    creatingUser,
    getCurrentUser,
    login,
};
