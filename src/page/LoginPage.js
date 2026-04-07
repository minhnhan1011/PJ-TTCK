import { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Spin } from "antd";

export default function LoginPage() {
  const [values, setValues] = useState({
    tendn: "",
    matkhau: "",
  });
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    axios
      .post("http://localhost:4000/login", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          message.success("Đăng nhập thành công!");
          navigate("/"); // về home
        } else {
          message.error("Tài khoản hoặc mật khẩu không đúng!");
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Có lỗi xảy ra khi đăng nhập!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h2>Đăng nhập</h2>

        <Spin spinning={loading} tip="Đang đăng nhập...">
          <form onSubmit={handleLogin}>
            <input
              type="text"
              name="tendn"
              placeholder="Tên đăng nhập"
              value={values.tendn}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <input
              type="password"
              name="matkhau"
              placeholder="Mật khẩu"
              value={values.matkhau}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>
        </Spin>

        <p className="signup-text">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>

      </div>
    </div>
  );
}
