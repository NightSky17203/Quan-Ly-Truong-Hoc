import express, { query } from 'express'; 
import teacherController from '../../Controller/client/teacher.controller.js';

const router = express.Router();

router.get("/list",teacherController.listTeacher);
router.post("/insert",teacherController.insertTeacher);    
router.post("/update",teacherController.updateTeacher);
router.post("/update/status",teacherController.updateTeacherStatus);
router.post("/delete",teacherController.deleteTeacher);

export default router; 