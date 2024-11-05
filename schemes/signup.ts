import Joi, { ObjectSchema } from "joi";

const signupSchema: ObjectSchema = Joi.object({
  username: Joi.string().min(4).max(12).required().messages({
    "string.base": "Username must be of type string",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 20 characters long",
    "string.empty": "Username is a required field",
  }),
  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.base": "Phone number must be of type string",
      "string.pattern.base": "Phone number must be exactly 10 digits",
      "string.empty": "Phone number is a required field",
    }),
  password: Joi.string().min(4).max(22).required().messages({
    "string.base": "Password must be of type string",
    "string.min": "Password must be at least 4 characters long",
    "string.empty": "Password is a required field",
  }),

  email: Joi.string().email().required().messages({
    "string.base": "Email must be of type string",
    "string.email": "Invalid email format",
    "string.empty": "Email is a required field",
  }),
});

export { signupSchema };
