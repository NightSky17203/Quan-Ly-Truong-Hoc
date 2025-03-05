export const createRegister = async (req, res) => {
    try {
      // Render view với dữ liệu từ service
      res.render("client/pages/Register/sign-up.ejs", { 
        PageTitle : "Đăng Ký"
      });
    } catch (error) {
      res.status(500).render('error', { message: error.message });
    }
  };
export default {createRegister,};