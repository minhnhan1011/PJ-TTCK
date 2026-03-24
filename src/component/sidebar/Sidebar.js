import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", icon: "fa-chart-pie", label: "Tổng quan" },
  { to: "/benh-nhan", icon: "fa-users", label: "Bệnh nhân" },
  { to: "/kiosk", icon: "fa-ticket-alt", label: "Kiosk lấy số" },
  { to: "/xet-nghiem", icon: "fa-flask", label: "Xét nghiệm" },
  { to: "/dich-vu", icon: "fa-microscope", label: "Dịch vụ y tế" },
  { to: "/kham-benh", icon: "fa-stethoscope", label: "Khám bệnh" },
  { to: "/thanh-toan", icon: "fa-credit-card", label: "Thanh toán" },
  { to: "/nhan-vien", icon: "fa-user-md", label: "Nhân sự" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="logo">
        <i className="fas fa-hospital-user"></i> ClinicFlow
      </div>

      <nav className="nav">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={location.pathname === item.to ? "active" : ""}
          >
            <i className={`fas ${item.icon}`}></i> {item.label}
          </Link>
        ))}

        <div className="divider"></div>

        <Link to="/login" className="logout-link">
          <i className="fas fa-sign-out-alt"></i> Đăng xuất
        </Link>
      </nav>

      <div className="status">
        Trạng thái: <span className="online">● Online</span>
      </div>
    </aside>
  );
}
