import { body, validationResult } from "express-validator";

const UserValidationResponse = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};

const registerUserValidator = [
    body("displayName")
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Enter valid Email Address"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Minimum length of the password must be 6")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[@$!%*?&]/)
        .withMessage("Password must contain at least one special character"),

    body("profile_photo")
        .optional({ nullable: true })
        .isURL()
        .withMessage("profile_photo must be a valid URL"),

    body("education_background")
        .optional({ nullable: true })
        .isString()
        .withMessage("education_background must be a string"),

    body("bio")
        .optional({ nullable: true })
        .isString()
        .withMessage("bio must be a string"),

    body("interests")
        .optional({ nullable: true })
        .isArray()
        .withMessage("interests must be an array of interests")
        .custom(arr => arr.every(i => typeof i === "string"))
        .withMessage("each interest must be a word"),
   

    UserValidationResponse

];

const loginUserValidator = [


    body("email")
        .optional()
        .isString()
        .withMessage("email did not matched"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be of length 6"),

    (req, res, next) => {
        if (!req.body.email && !req.body.password) {

            return res.status(400).json({
                errors: [{ msg: "Email and password is required" }]
            });
        }
        UserValidationResponse(req, res, next);
    },

];


export {
    registerUserValidator,
    loginUserValidator
};