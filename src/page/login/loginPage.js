import "../login/loginPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/* cấu hình axios 1 lần */
axios.defaults.withCredentials = true;

function LoginPage() {
  const [values, setValues] = useState({
    tendn: "",
    matkhau: "",
  });

  const navigate = useNavigate();

  // xử lý nhập input
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // xử lý login
  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:4000/login", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          alert("Đăng nhập thành công!");
          navigate("/"); // về home
        } else {
          alert("Tài khoản hoặc mật khẩu không đúng");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Có lỗi xảy ra khi đăng nhập");
      });
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