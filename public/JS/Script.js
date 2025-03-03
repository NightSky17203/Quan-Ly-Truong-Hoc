import RegisterService from "../../Service/Register.service";
function register() {
    var form = JSON.stringify(Object.fromEntries(new FormData(document.getElementById("register-form"))));
    console.log("Đã nhận form");
    console.log(form)
    RegisterService.create(form);
    console.log("Đã gọi API");
}
export { register };

