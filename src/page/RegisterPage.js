import { useState } from "react";
import { Link } from "react-router-dom";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [values, setValues] = useState({
    hoten: "",
    tendn: "",
    matkhau: "",
    xacnhanmatkhau: "",
    email: "",
    sdt: "",
  });

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // TODO: Gọi API đăng ký
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Đăng ký tài khoản</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="hoten"
            placeholder="Họ và tên"
            value={values.hoten}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="tendn"
            placeholder="Tên đăng nhập"
            value={values.tendn}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="sdt"
            placeholder="Số điện thoại"
            value={values.sdt}
            onChange={handleChange}
          />

          <input
            type="password"
            name="matkhau"
            placeholder="Mật khẩu"
            value={values.matkhau}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="xacnhanmatkhau"
            placeholder="Xác nhận mật khẩu"
            value={values.xacnhanmatkhau}
            onChange={handleChange}
            required
          />

          <button type="submit">Đăng ký</button>
        </form>

        <p className="login-text">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
