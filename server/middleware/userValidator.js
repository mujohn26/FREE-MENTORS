import Joi from 'joi';

export const validsignUp = (req, res, next) => {
  const schema = {
    firstName: Joi.string().alphanum().required(),
    lastName: Joi.string().alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    address: Joi.string().required(),
    bio: Joi.string().required(),
    occupation: Joi.string().required(),
    expertise: Joi.string().required(),
    isAdmin: Joi.boolean(),
    isMentor: Joi.boolean(),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error !== null) {
    res.status(400).send(
      {
        status: 400,
        error: result.error.details[0].message,
      },
    );
  }
  next();
};


export const validSignin = (req, res, next) => {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.required(),
  };
  const result = Joi.validate(req.body, schema);

  if (result.error !== null) {
    res.status(400).send(
      {
        status: 400,
        error: result.error.details[0].message,
      },
    );
  }
  next();
};
