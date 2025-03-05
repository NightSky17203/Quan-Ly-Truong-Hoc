import express, { application, query } from 'express';
import registerController from '../../Controller/client/Register.controller.js'; 

const router = express.Router();

router.post("/",registerController.Sign_up);

export default router; 