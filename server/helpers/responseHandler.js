
class response {
static errorMessage = (req, res, msg, status) => {
  res.status(status).json({
    status,
    error: msg,

  });
};

static successMessage = (req, res, msg, status, data) => {
  res.status(status).json({
    status,
    message: msg,
    data,
  });
};


}
export default response;
