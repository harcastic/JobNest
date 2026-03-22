
import Joi from 'joi';

const jobSchemaValidation = Joi.object({
    title : Joi.string().required(),
    companyName : Joi.string().required(),
    aboutCompany : Joi.string().required(),
    jobDescription : Joi.string().required(),
    location : Joi.string().required(),
    country : Joi.string().required(),
    duration : Joi.string().optional(),
    salary : Joi.string().optional(),
    jobType : Joi.string().valid("Onsite", "Hybrid", "Remote").required(), 
    timing : Joi.string().optional(),
    skillsRequired : Joi.array().items(Joi.string()).optional(),
    importantDates : Joi.object({
        applicationDeadline : Joi.date().optional(),
        startDate : Joi.date().optional()
    }).optional()
})

export default jobSchemaValidation;