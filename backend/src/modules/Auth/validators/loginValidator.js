import Joi from "joi";

const loginValidate = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().required()
});

export default loginValidate;