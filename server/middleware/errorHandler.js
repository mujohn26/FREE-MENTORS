const errorHandler = (err, req, res) => {
  res.status(500)
    .send({
      status: 500,
      error: 'not Found',
    });
};
export default errorHandler;
