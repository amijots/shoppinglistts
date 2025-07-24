const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.header("token");
    if (!token) {
        return res.status(400).send("Error! JSON Web Token not valid");
    }

    try {
        const decoded = jwt.verify(token, "randomString");
        req.user = decoded.user;
        next();
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "There is an error in the computation of the JSON Web Token"})
    }
}