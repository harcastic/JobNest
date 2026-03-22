import Joi from "joi";

const appSchema = Joi.object({
    fullName : Joi.string().min(3).required(),
    email : Joi.string().email().required(),
    phone : Joi.string().required(),
    location : Joi.string().required(),

    resume: Joi.string().uri().required(),
    portfolio : Joi.string().uri().optional(),

    experience : Joi.string().required(),
    skills : Joi.string().min(0).optional(),
    
    availability : Joi.string().optional(),
    salaryExpectation : Joi.string().optional(),
    workAuthorization : Joi.boolean().required(),

});

export default appSchema;