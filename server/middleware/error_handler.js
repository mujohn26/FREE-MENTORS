// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  res.status(500)
    .send({
      status: 500,
      error: 'not Found',
    });
};
export default errorHandler;
