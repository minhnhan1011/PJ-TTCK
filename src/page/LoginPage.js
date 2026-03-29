import { useState } from "react";
import "./LoginPage.css";

export default function LoginPage() {
  const [tendn, setTendn] = useState("");
  const [matkhau, setMatkhau] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const validate = () => {
    const errs = {};
    if (!tendn.trim()) errs.tendn = "Vui lòng nhập tên đăng nhập";
    if (!matkhau.trim()) errs.matkhau = "Vui lòng nhập mật khẩu";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // TODO: Gọi API đăng nhập từ backend
    setLoading(true);
  };

  return (
    <div className="login-page">
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

        {/* Right form */}
        <div className="login-form-panel">
          <h2 className="login-form-title">Đăng nhập</h2>
          <p className="login-form-subtitle">
            Vui lòng nhập thông tin tài khoản của bạn
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <div className="input-wrapper">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  placeholder="Nhập tendn..."
                  value={tendn}
                  onChange={(e) => setTendn(e.target.value)}
                  className={errors.tendn ? "input-error" : ""}
                />
              </div>
              {errors.tendn && <div className="error-text">{errors.tendn}</div>}
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={matkhau}
                  onChange={(e) => setMatkhau(e.target.value)}
                  className={errors.matkhau ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
              {errors.matkhau && <div className="error-text">{errors.matkhau}</div>}
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                Nhớ tài khoản
              </label>
              <span className="forgot-link">Quên mật khẩu?</span>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              <span>{loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}</span>
              {loading && <i className="fas fa-spinner fa-spin"></i>}
            </button>

            {loginError && <div className="login-error-msg">{loginError}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
