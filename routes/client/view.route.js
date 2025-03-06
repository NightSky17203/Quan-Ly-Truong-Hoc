import express, { application, query } from 'express';
import viewController from '../../Controller/client/view.controller.js'; 

const router = express.Router();

router.get("/register",viewController.createRegister);
router.get("/login",viewController.viewLogin);

export default router; 