$(document).ready(function () {
    $('#eye').click(function () {
        $(this).toggleClass('open');
        $(this).children('i').toggleClass('fa-eye-slash  fa-eye');
        if ($(this).hasClass('open')) {
            $(this).prev().attr('type', 'text');
        } else {
            $(this).prev().attr('type', 'password');
        }
    });
});
 

 function checkLogin() {
    const isLogin = localStorage.getItem('tokenLogin') && localStorage.getItem('tokenLogin') 
    if (!isLogin){
        window.location.replace = ('loginadmin.html');
    }else{
        window.location.replace =('admin.html');
    }
}

 function Login() {
    const Listaccount = [
        {
            Tênđăngnhập: "admin1",
            Mậtkhẩu: "123456"
        },
        {
            Tênđăngnhập: "admin2",
            Mậtkhẩu: "123456"
        },  
        {
            Tênđăngnhập: "admin3",
            Mậtkhẩu: "123456"
        },
    ];
const Tênđăngnhập = document.getElementById('Tên đăng nhập').value;
const Mậtkhẩu = document.getElementById('Mật khẩu').value;
if (Tênđăngnhập && Mậtkhẩu){
    const checkLogin = Listaccount.some(value => value.Tênđăngnhập === Tênđăngnhập && value.Mậtkhẩu === Mậtkhẩu);
    if (checkLogin){
         window.location.replace('admin.html')
         localStorage.setItem('tokenLogin', Tênđăngnhập)
    } else{
        alert("Sai tài khoản hoặc mật khẩu vui lòng nhập lại");
    }
}else {
        alert("Vui lòng nhập đủ thông tin");
            
    }
 }
 /*
 function renderaccountname(){
    const accountname = localStorage.getItem('tokenLogin')
    document.getElementById('accountname').innerText = accountname;
 }*/
function Logout(){
    localStorage.removeItem('tokenLogin')
    window.location.replace('loginadmin.html')
}
 