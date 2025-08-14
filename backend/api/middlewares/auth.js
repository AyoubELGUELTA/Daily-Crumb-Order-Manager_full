const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {

    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ message: "Token missing, no authorization for such action." });


    jwt.verify(token, process.env.JWT_SESSION_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token or expired" }); // Forbidden

        req.user = user; // attach decoded token payload to request
        next();
    });
}

module.exports = authenticateToken;