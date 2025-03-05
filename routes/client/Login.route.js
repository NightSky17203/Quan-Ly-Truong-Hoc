import express, { application, query } from 'express';
import loginController from '../../Controller/client/Login.controller.js';

const router = express.Router();

router.post("/",loginController.Login);
router.get("/refreshtoken",loginController.refreshToken);

export default router; 