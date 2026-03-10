import Joi from 'joi';

const registerSchema = Joi.object({
    username : Joi.string().min(3).max(15).required(),
    email : Joi.string().email().required(),
    password: Joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
        .message("Password must contain uppercase, lowercase, number, special character and be at least 8 characters long")
        .required(),
    role : Joi.string().valid("admin", "user").required(),
    bio : Joi.string().optional(),
    skills : Joi.array().items(Joi.string()).optional(),
    experienceLevel : Joi.string().optional(),
    location : Joi.string().optional(),
    profileImage : Joi.string().optional(),
    resume : Joi.string().optional()

});

export default registerSchema;