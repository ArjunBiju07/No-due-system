const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        const isAuthorized = roles.includes(userRole) || 
                             (userRole === 'both' && (roles.includes('teacher') || roles.includes('tutor')));

        if (!isAuthorized) {
            return res.status(403).json({
                message: `User role ${userRole} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
