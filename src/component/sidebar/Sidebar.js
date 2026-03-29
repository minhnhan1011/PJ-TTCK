import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const navItems = [
  { to: "/", icon: "fa-chart-pie", label: "Tổng quan" },
  { to: "/benh-nhan", icon: "fa-users", label: "Bệnh nhân" },
  { to: "/dang-ky-kham", icon: "fa-clipboard-list", label: "Đăng ký khám" },
  { to: "/kiosk", icon: "fa-ticket-alt", label: "Kiosk lấy số" },
  { to: "/kham-benh", icon: "fa-stethoscope", label: "Khám bệnh" },
  { to: "/xet-nghiem", icon: "fa-flask", label: "Xét nghiệm" },
  { to: "/don-thuoc", icon: "fa-prescription-bottle-alt", label: "Đơn thuốc" },
  { to: "/dich-vu", icon: "fa-microscope", label: "Dịch vụ y tế" },
  { to: "/thanh-toan", icon: "fa-credit-card", label: "Thanh toán" },
  { to: "/nhan-vien", icon: "fa-user-md", label: "Nhân sự" },
  { to: "/thuoc", icon: "fa-capsules", label: "Thuốc" },
  { to: "/loai-thuoc", icon: "fa-pills", label: "Loại thuốc" },
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
