import express, { application, query } from 'express';
import {createRegister} from '../../Controller/client/view.controller.js'; 

const router = express.Router();

router.get("/register",createRegister);

export default router; 