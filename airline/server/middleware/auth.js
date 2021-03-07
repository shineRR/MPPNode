const jwt = require('jsonwebtoken');
const user = require('../Model/user');

const auth = (req, res, next) =>{
    try {
        if (!req.headers.authorization){
            console.log("no token");
            throw new Error();
        }

        let token = req.headers.authorization.replace('Bearer ', '');
        console.log(token);

        const data = jwt.verify(token, "SECRET_KEY", {HttpOnly: true});
        console.log(data);
        next()
    } catch (error) {
        console.log("Unauthorized");
        res.status(401).json({message: "Unauthorized user"})
    }
};

module.exports = auth;