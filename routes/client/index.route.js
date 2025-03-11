import homeRoutes from "./Faculty.route.js"
import sinhvienRoutes from "./Student.route.js"
import registerRoutes from "./Register.route.js"
import viewRoutes from "./View.route.js"
import teacherRoutes from "./Teacher.route.js"
import loginRoutes from "./Login.route.js"
import authRoutes from "../Auth/auth.route.js"
import authMiddleware from "../../Middleware/Auth.middleware.js"

export default (app)=>{
    app.use("/api/v1/register",registerRoutes);
    app.use("/",viewRoutes);
    app.use("/api/v1",authRoutes);
    app.use("/api/v1/faculty", homeRoutes);
    app.use("/api/v1/student",sinhvienRoutes);
    app.use("/api/v1/teacher",teacherRoutes);
    app.use("/api/v1/login",loginRoutes);
}
