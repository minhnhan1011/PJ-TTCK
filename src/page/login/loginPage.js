import "../login/loginPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// cấu hình axios (chỉ cần 1 lần)
axios.defaults.withCredentials = true;

function LoginPage() {
  const [values, setValues] = useState({
    tendn: "",
    matkhau: "",
  });

  const navigate = useNavigate();

  // xử lý nhập input
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  // xử lý login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/login", values);

      if (res.data.Status === "Success") {
        // Lưu role vào localStorage
        // Lưu ý: Kiểm tra xem Backend trả về res.data.vaitro hay res.data.role
        const userRole = res.data.vaitro; 
        localStorage.setItem("vaitro", userRole);

        alert("Đăng nhập thành công!");
        
        // Dùng cái này để chuyển hướng nhanh mà không reset app
        navigate("/"); 
        // Hoặc nếu muốn reset hoàn toàn để Header nhận role mới ngay lập tức:
        // window.location.href = "/";
      } else {
        alert(res.data.Error || "Tài khoản hoặc mật khẩu không đúng");
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi đăng nhập");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="tendn"
            placeholder="Tên đăng nhập"
            value={values.tendn}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="matkhau"
            placeholder="Mật khẩu"
            value={values.matkhau}
            onChange={handleChange}
            required
          />

          <button type="submit">Đăng nhập</button>
        </form>

        <p className="signup-text">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
