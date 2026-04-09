import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPasswordPage.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gọi API quên mật khẩu
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2>Quên mật khẩu</h2>
        <p className="forgot-desc">
          Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email đã đăng ký"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Gửi yêu cầu</button>
        </form>

        <p className="back-login-text">
          <Link to="/login">← Quay lại Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
