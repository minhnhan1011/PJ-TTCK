import { useState } from "react";
import Loading from "../component/loading/Loading";
import { toast } from "react-toastify";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

export default function LoginPage() {
  const [values, setValues] = useState({
    tendn: "",
    matkhau: "",
  });

  // --- 1. KHAI BÁO BIẾN LOADING ĐANG THIẾU ---
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // xử lý nhập input
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // --- 2. XỬ LÝ LOGIN KẾT NỐI VỚI BACKEND PORT 4000 ---
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Cấu hình axios để gửi kèm cookie (withCredentials)
    axios.post("http://localhost:4000/login", values, { withCredentials: true })
      .then((res) => {
        if (res.data.Status === "Success") {
          toast.success("Đăng nhập thành công!");
          navigate("/"); // Chuyển về trang chủ sau khi login
          window.location.reload(); // Reload để cập nhật trạng thái auth
        } else {
          toast.error(res.data.Message || "Tên đăng nhập hoặc mật khẩu không đúng!");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Lỗi kết nối server!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-page">
      {/* 3. HIỂN THỊ LOADING KHI BIẾN loading = true */}
      {loading && <Loading text="Đang đăng nhập..." />}
      
      <div className="login-container">
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

          <button type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <p className="signup-text">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}