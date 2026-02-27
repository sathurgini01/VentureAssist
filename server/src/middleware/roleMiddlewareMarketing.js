export const allowMarketingRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userRole = String(req.user.role || "")
      .trim()
      .toLowerCase();
    const allowedRoles = roles.map((role) => String(role).trim().toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden: insufficient permissions",
        currentRole: req.user.role || null,
        requiredRoles: roles,
        hint: "Login with a user that has one of requiredRoles"
      });
    }

    next();
  };
};