import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifytoken = (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1] || 
    req.query.token || 
    req.body.token;

        if (token == null) {
            return res.status(403).json({ 
            success: false, 
            message: 'Token không được cung cấp' 
        });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = decoded;

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
            success: false,
            message: 'Token đã hết hạn'
        });
        }
            return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ'
        });
        }
};
export {verifytoken};
export default {verifytoken};