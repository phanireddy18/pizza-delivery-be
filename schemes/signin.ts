import Joi, { ObjectSchema } from "joi";

const signinSchema: ObjectSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be of type string",
    "string.email": "Invalid email format",
    "string.empty": "Email is a required field",
  }),
  password: Joi.string().min(4).max(22).required().messages({
    "string.base": "Password must be of type string",
    "string.min": "Password must be at least 4 characters long",
    "string.empty": "Password is a required field",
  }),
});

export { signinSchema };
