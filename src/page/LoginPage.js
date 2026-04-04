import { useState } from "react";
import Loading from "../component/loading/Loading";
import { toast } from "react-toastify";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
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

    // TODO: Gọi API đăng nhập từ backend
    setLoading(true);
    toast.info("Đang xử lý đăng nhập...");
  };

  return (
    <div className="login-page">
      {loading && <Loading text="Đang đăng nhập..." />}
      <div className="login-container">
        {/* Left banner */}
        <div className="login-banner">
          <div className="login-banner-content">
            <div className="login-banner-title">
              <i className="fas fa-hospital-user"></i> ClinicFlow
            </div>
            <p className="login-banner-desc">
              Hệ thống quản lý phòng khám toàn diện, tối ưu quy trình y tế.
            </p>
          </div>
          <div className="login-banner-footer">
            © 2025 ClinicFlow Management System.
          </div>
          <div className="login-banner-circle bottom"></div>
          <div className="login-banner-circle top"></div>
        </div>

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
