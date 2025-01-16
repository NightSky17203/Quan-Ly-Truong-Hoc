import express, { query } from 'express'; 
import sinhvienController from '../../Controller/client/sinhvien.controller.js';

const router = express.Router();

router.get("/",sinhvienController.index)
    
export default router;  