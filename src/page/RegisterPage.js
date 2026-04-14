// ===== FRONTEND: RegisterPage.jsx =====
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    hoten: "",
    tendn: "",
    matkhau: "",
    xacnhanmatkhau: "",
    email: "",
    sdt: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation phía client
    if (values.matkhau !== values.xacnhanmatkhau) {
      return setError("Mật khẩu xác nhận không khớp.");
    }

    if (values.matkhau.length < 6) {
      return setError("Mật khẩu phải có ít nhất 6 ký tự.");
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.Status === "success") {
        setSuccess("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.Message || "Đăng ký thất bại.");
      }
    } catch (err) {
      setError("Không thể kết nối đến server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Đăng ký tài khoản</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

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

          <button type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <p className="login-text">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
