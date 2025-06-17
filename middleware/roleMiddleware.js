module.exports = function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Přístup zamítnut (nedostatečná role nebo nepřihlášený)" });
    }
    next();
  };
};


