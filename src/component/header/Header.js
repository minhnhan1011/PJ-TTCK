import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ userName = "Admin Quản lý", userRole = "Quản trị viên" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-right">
        <button className="header-bell">
          <i className="fas fa-bell"></i>
          <span className="badge">3</span>
        </button>
        <div className="header-user">
          <div className="header-user-info">
            <div className="header-user-name">{userName}</div>
            <div className="header-user-role">{userRole}</div>
          </div>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0056b3&color=fff&rounded=true`}
            alt="Avatar"
            className="header-avatar"
          />
        </div>
        <button className="header-logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Đăng xuất
        </button>
      </div>
    </header>
  );
}
