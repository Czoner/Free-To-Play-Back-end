const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
    if (validator.isURL(value)) {
        return value;
    }
    return helpers.error("string.uri");
};

const UpdateProfValidation = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30).messages({
            "string.min": 'The minimum length of the "name" field is 2',
            "string.max": 'The maximum length of the "name" field is 30',
            "string.empty": 'The "username" field must be filled in',
        }),
    }),
});

const UserInfoBodyValidation = celebrate({
    body: Joi.object().keys({
        username: Joi.string().required().min(2).max(30).messages({
            "string.min": 'The minimum length of the "name" field is 2',
            "string.max": 'The maximum length of the "name" field is 30',
            "string.empty": 'The "username" field must be filled in',
        }),
        email: Joi.string().required().email().messages({
            "string.empty": "You must enter an email",
        }),
        password: Joi.string().required().min(2).max(30).messages({
            "string.empty": "You must enter an password",
        }),
    }),
});

const AuthenticationBody = celebrate({
    body: Joi.object().keys({
        username: Joi.string().required().min(2).max(30).messages({
            "string.empty": "You must enter a username",
        }),
        password: Joi.string().required().messages({
            "string.empty": "You must enter an password",
        }),
    }),
});

module.exports = {
    AuthenticationBody,
    UserInfoBodyValidation,
    UpdateProfValidation,
};
