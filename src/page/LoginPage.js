import { useState } from "react";
<<<<<<< HEAD
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
=======
import Loading from "../component/loading/Loading";
import { toast } from "react-toastify";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a

export default function LoginPage() {
  const [values, setValues] = useState({
    tendn: "",
    matkhau: "",
  });

<<<<<<< HEAD
=======
  // --- 1. KHAI BÁO BIẾN LOADING ĐANG THIẾU ---
  const [loading, setLoading] = useState(false);
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
  const navigate = useNavigate();

  // xử lý nhập input
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

<<<<<<< HEAD
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
=======
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
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
        }
      })
      .catch((err) => {
        console.error(err);
<<<<<<< HEAD
        alert("Có lỗi xảy ra khi đăng nhập");
=======
        toast.error("Lỗi kết nối server!");
      })
      .finally(() => {
        setLoading(false);
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
      });
  };

  return (
<<<<<<< HEAD
    <div className="login-container">
      <div className="login-box">
=======
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
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a

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

<<<<<<< HEAD
          <button type="submit">Đăng nhập</button>
=======
          <button type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
        </form>

        <p className="signup-text">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
<<<<<<< HEAD

      </div>
    </div>
  );
}
=======
      </div>
    </div>
  );
}
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
