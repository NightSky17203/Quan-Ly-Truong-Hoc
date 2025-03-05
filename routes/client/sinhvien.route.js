import express, { query } from 'express'; 
import sinhvienController from '../../Controller/client/Student.controller.js';

const router = express.Router();

router.get("/list",sinhvienController.listStudent);
router.post("/insert",sinhvienController.insertStudent);    
router.post("/update",sinhvienController.updateStudent);
router.post("/update/status",sinhvienController.updateStudentStatus);
router.post("/delete",sinhvienController.deleteStudent);

export default router; 