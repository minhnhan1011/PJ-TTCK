import { useState } from "react";
import "./LoginPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { message, Spin } from "antd";

export default function LoginPage() {
  const [values, setValues] = useState({
    tendn: "",
    matkhau: "",
  });
  const [loading, setLoading] = useState(false);

  // Xử lý nhập liệu
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Xử lý đăng nhập
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post("http://localhost:4000/login", values)
      .then((res) => {
        // Kiểm tra Status trả về từ Server
        if (res.data.Status === "Success") {
          message.success("Đăng nhập thành công!");

          // LẤY VAI TRÒ TỪ SERVER TRẢ VỀ
          // Lưu ý: res.data.vaitro phải khớp với tên bạn SELECT trong SQL ở Backend
          const role = res.data.vaitro;

          if (role) {
            localStorage.setItem("userRole", role);
            
            // Dùng href để reload toàn bộ ứng dụng, đảm bảo Sidebar nhận Role mới
            window.location.href = "/";
          } else {
            message.error("Không tìm thấy vai trò người dùng!");
          }
        } else {
          message.error(res.data.Error || "Tài khoản hoặc mật khẩu không đúng!");
        }
      })
      .catch((err) => {
        console.error("Login Error:", err);
        message.error("Không thể kết nối đến máy chủ!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Hệ Thống ClinicFlow</h2>
        <Spin spinning={loading} tip="Đang kiểm tra thông tin...">
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                name="tendn"
                placeholder="Tên đăng nhập"
                value={values.tendn}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="matkhau"
                placeholder="Mật khẩu"
                value={values.matkhau}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
            </button>
          </form>
        </Spin>
        <p className="signup-text">
          Nhân viên mới? <Link to="/register">Đăng ký tài khoản</Link>
        </p>
      </div>
    </div>
  );
}