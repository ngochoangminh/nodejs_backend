const jwt = require('jsonwebtoken')
require('dotenv').config();

const authenticate_token = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log('token: \n',token);
        if (!token)
            return res.status(401).json({
                msg: 'Invalid authentication! token does not exits',
            });
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, user) => {
            if (err){
                return res.status(401).json({
                    msg: 'Invalid authentication! token expried',
                });
            }
            req.user = user;
            next();
        });
    } catch (err) {
        return res.json({
            status: 400,
            msg: err.message,
        })
    }
}

module.exports = authenticate_token;