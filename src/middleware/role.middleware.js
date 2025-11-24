const permit = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).send('Unauthorized');
  if (!allowedRoles.includes(req.user.role)) return res.status(403).send('Forbidden');
  next();
};
module.exports = permit;
