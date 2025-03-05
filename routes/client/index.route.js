import homeRoutes from "./home.route.js"
import sinhvienRoutes from "./sinhvien.route.js"
import registerRoutes from "./register.route.js"
import viewRoutes from "./view.route.js"
import teacherRoutes from "./teacher.route.js"
import loginRoutes from "./Login.route.js"
import authRoutes from "../Auth/auth.route.js"

export default (app)=>{
    app.use("/api/v1/faculty", homeRoutes);
    app.use("/api/v1/student",sinhvienRoutes);
    app.use("/api/v1/register",registerRoutes);
    app.use("/api/v1/teacher",teacherRoutes);
    app.use("/api/v1/login",loginRoutes);
    app.use("/api/v1/auth",authRoutes);
    app.use("/",viewRoutes);
}
