/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
import Joi from 'joi';

export const validcreateSession = (req, res, next) => {
  // using JOI npm
  const schema = {
    mentorid: Joi.number().required(),
    questions: Joi.string().required(),

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

export const validReviewMentor = (req, res, next) => {
  // using JOI npm
  const schema = {
    score: Joi.number().required(),
    remark: Joi.string().required(),

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
