import express, { application, query } from 'express';
import {verifytoken} from '../../Middleware/Auth.middleware.js';
const router = express.Router();

router.get("/",verifytoken,(req,res)=>{
    res.json({
        status: 200,
        success: true,
        message: '  token hợp lệ',
        data: {
          user: req.user
        }
      });
});

export default router; 