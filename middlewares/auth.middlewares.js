const jwt = require("jsonwebtoken");



function verifyToken(req, res, next) {
   

    try {
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);

        console.log("This is the payload from the token: ", payload);

        next();

    } catch (error) {
        res.status(401).json({ errorMessage: "Invalid or expired token." });
    }
}

module.exports = verifyToken;
