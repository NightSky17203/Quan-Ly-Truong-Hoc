import express, { application, query } from 'express';
import facultyController from '../../Controller/client/faculty.controller.js'; 
import { verifytoken } from '../../Middleware/Auth.middleware.js';
const router = express.Router();

router.post("/insert",verifytoken,facultyController.insert);
router.get("/list",verifytoken,facultyController.listFaculty);
router.post("/update",verifytoken,facultyController.updateFaculty);
router.delete("/delete",verifytoken,facultyController.deleteFaculty);

export default router; 