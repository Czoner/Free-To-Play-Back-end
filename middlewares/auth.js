const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/Config");
const { UnauthorizedError } = require("../utils/UnauthorizedError");

module.exports.middleware = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        console.error("Authorization header is missing", authorization);
        return next(new UnauthorizedError("Unauthorized"));
    }

    const token = authorization.replace("Bearer ", "");
    let payload;

    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.error("JWT verification failed:", err);
        return next(new UnauthorizedError("Unauthorized"));
    }

    req.user = payload;
    return next();
};
