const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
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
    email,
    password
) {
    if (!password) {
        return Promise.reject(new Error("Incorrect email or password"));
    }
    return this.findOne({ email })
        .select("+password")
        .then((user) => {
            if (!user) {
                return Promise.reject(new Error("Incorrect email or password"));
            }
            return bcrypt.compare(password, user.password).then((matched) => {
                console.log(matched);
                if (!matched) {
                    return Promise.reject(
                        new Error("Incorrect email or password")
                    );
                }
                return user;
            });
        });
};

module.exports = mongoose.model("user", userSchema);
