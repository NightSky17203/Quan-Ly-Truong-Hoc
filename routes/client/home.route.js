import express, { application, query } from 'express';
import homeController from '../../Controller/client/home.controller.js'; 

const router = express.Router();

router.get("/",homeController.index);
router.post("/them",homeController.create);
export default router; 