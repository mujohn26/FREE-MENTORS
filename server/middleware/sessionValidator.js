import * as HttpStatus from 'http-status-codes';
import Joi from 'joi';

export const validcreateSession = (req, res, next) => {
  const schema = {
    mentorid: Joi.number().required(),
    questions: Joi.string().required(),

  };
  const result = Joi.validate(req.body, schema);
  if (result.error !== null) {
    return res.status(HttpStatus.BAD_REQUEST).send(
      {
        status: HttpStatus.BAD_REQUEST,
        error: result.error.details[0].message,
      },
    );
  }
  next();
};

export const validReviewMentor = (req, res, next) => {
  const schema = {
    score: Joi.number().min(1).max(5).required(),
    remark: Joi.string().required(),

  };
  const result = Joi.validate(req.body, schema);
  if (result.error !== null) {
    return res.status(HttpStatus.BAD_REQUEST).send(
      {
        status: HttpStatus.BAD_REQUEST,
        error: result.error.details[0].message,
      },
    );
  }
  next();
};
