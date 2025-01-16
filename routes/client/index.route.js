import homeRoutes from "./home.route.js"
import sinhvienRoutes from "./sinhvien.route.js"

export default (app)=>{
    app.use("/quanlykhoa", homeRoutes);
    app.use("/quanlysinhvien",sinhvienRoutes);
}