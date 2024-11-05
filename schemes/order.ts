import Joi, { ObjectSchema } from "joi";

const createOrderSchema: ObjectSchema = Joi.object({
  pizzaItems: Joi.array()
    .items(
      Joi.object({
        pizzaId: Joi.number().integer().required().messages({
          "number.base": "Pizza ID must be a number",
          "number.integer": "Pizza ID must be an integer",
          "any.required": "Pizza ID is required",
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a number",
          "number.integer": "Quantity must be an integer",
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Pizza items must be an array",
      "array.min": "At least one pizza item is required",
      "any.required": "Pizza items are required",
    }),

  deliveryAddress: Joi.string().min(5).required().messages({
    "string.base": "Delivery address must be a string",
    "string.min": "Delivery address must be at least 5 characters long",
    "any.required": "Delivery address is required",
  }),
});

export { createOrderSchema };
