const jwt = require("jsonwebtoken");
const User = require("../models/users");
require("dotenv").config();

const verifyManager = async (req, res, next) => {
    try {
        let token = req.headers['jwttoken'];
        if (token == null) return res.sendStatus(401)
        const user = jwt.verify(token, process.env.TOKEN_KEY);
        let userData = await User.findOne({ _id: user["id"] })
        if (!userData) {
            res.status(403).send({
                message: "unauthorised user"
            });
        } else {
            let isUser = await User.findOne({ role: 'manager' });
            if (!isUser) {
                res.status(403).send({
                    message: "unauthorised person"
                });
            } else {
                req.user = user;
                next();
            }
        }
    } catch (err) {
        res.send(err)
    }
};
module.exports = verifyManager;
