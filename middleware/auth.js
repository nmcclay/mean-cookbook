module.exports = {
  setRole: function (role) {
    return function (req, res, next) {
      req.session.role = role;
      req.session.save(function (err) {
        next();
      });
    }
  },
  requireRole: function (role) {
    return function (req, res, next) {
      if (req.session.role && req.session.role === role) {
        next();
      } else {
        var error = new Error("Requires Admin");
        res.status(403).json({
          status: 403,
          message: error.message,
          name: error.name
        });
      }
    }
  }
};