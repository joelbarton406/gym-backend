import Joi from "joi";

export const memberLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const memberSignupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone_number: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
  first_name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2).required(),
  profile_type: Joi.string().valid("staff", "client", "admin").required(),
});

export const validate = (body: unknown, schema: Joi.ObjectSchema<any>) => {
  const { error, value } = schema.validate(body);
  if (error) {
    if (error instanceof Joi.ValidationError) {
      throw new Error("Joi Validation error: " + error.details[0].message);
    }
  }
  return value;
};
