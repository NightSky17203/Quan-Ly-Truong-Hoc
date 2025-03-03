import express, { application, query } from 'express';
import {createRegister} from '../../Controller/client/Register.controller.js'; 

const router = express.Router();

router.get("/",createRegister);

export default router; 