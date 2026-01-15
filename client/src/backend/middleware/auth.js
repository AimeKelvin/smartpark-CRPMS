// Middleware to check if user is authenticated via session
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({
    message: 'Unauthorized access. Please login.'
  });
};
module.exports = {
  isAuthenticated
};