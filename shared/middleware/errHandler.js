
export const errHandler = (err, req, res, next) => {
  return res.status(err?.status || 500).json({
    susess: false,
    error: {
      name: err.name,
      message: err.message || 'Internal Server Error',
    }
  })
}