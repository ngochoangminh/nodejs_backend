const jwt = require('jsonwebtoken')

const authenticate_token = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token)
            return res.status(401).json({
                status: 401,
                msg: 'Invalid authentication!',
            });
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, user) => {
            if (err)
                return res.status(403).json({
                    status: 401,
                    msg: 'Invalid authentication!',
                });
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