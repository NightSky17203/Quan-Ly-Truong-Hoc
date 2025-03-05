import express, { query } from 'express'; 
import teacherController from '../../Controller/client/teacher.controller.js';
import {verifytoken} from '../../Middleware/auth.Middleware.js';
const router = express.Router();

router.get("/list",verifytoken,teacherController.listTeacher);
router.post("/insert",verifytoken,teacherController.insertTeacher);    
router.post("/update",verifytoken,teacherController.updateTeacher);
router.post("/update/status",verifytoken,teacherController.updateTeacherStatus);
router.delete("/delete",verifytoken,teacherController.deleteTeacher);

export default router; 