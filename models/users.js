const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validator: {
            validator(value) {
                return validator.isURL(value);
            },
            message: "You must enter a valid URL",
        },
    },
    password: {
        type: String,
        require: true,
        select: false,
    },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
    username,
    password
) {
    if (!password) {
        console.log("password is missing ");
        return Promise.reject(new Error("Incorrect username or password"));
    }
    return this.findOne({ username })
        .select("+password")
        .then((user) => {
            if (!user) {
                console.log("User not found with username:", username);
                return Promise.reject(
                    new Error("Incorrect username or password")
                );
            }
            return bcrypt.compare(password, user.password).then((matched) => {
                console.log("True password", matched);
                if (!matched) {
                    return Promise.reject(
                        new Error("Incorrect username or password")
                    );
                }
                return user;
            });
        });
};

module.exports = mongoose.model("user", userSchema);
