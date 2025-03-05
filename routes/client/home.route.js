import express, { application, query } from 'express';
import facultyController from '../../Controller/client/faculty.controller.js'; 

const router = express.Router();

router.post("/insert",facultyController.insert);
router.get("/list",facultyController.listFaculty);
router.post("/update",facultyController.updateFaculty);
router.post("/delete",facultyController.deleteFaculty);

export default router; 