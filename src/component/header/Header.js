import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <input type="text" placeholder="Tìm kiếm..." className="search-input" />
      </div>

      <div className="header-right">
        <div className="header-notify">
          <span className="notification-icon"></span>
        </div>
        <div className="header-login">
          <span className="login-btn">
            <a href="/login">Đăng nhập</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
