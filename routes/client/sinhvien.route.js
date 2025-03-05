import express, { query } from 'express'; 
import sinhvienController from '../../Controller/client/Student.controller.js';
import {verifytoken} from '../../Middleware/auth.Middleware.js';
const router = express.Router();

router.get("/list",verifytoken,sinhvienController.listStudent);
router.post("/insert",verifytoken,sinhvienController.insertStudent);    
router.post("/update",verifytoken,sinhvienController.updateStudent);
router.post("/update/status",verifytoken,sinhvienController.updateStudentStatus);
router.delete("/delete",verifytoken,sinhvienController.deleteStudent);

export default router; 