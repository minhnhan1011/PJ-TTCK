import { useState } from "react";
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

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Nút hamburger cho mobile */}
      <button className="sidebar-toggle" aria-label="Mở menu" onClick={() => setMobileOpen(true)}>
        <i className="fas fa-bars"></i>
      </button>

      {/* Overlay khi mở sidebar trên mobile */}
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)}></div>}

      <div className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="logo">
          <span className="logo-text">ClinicFlow</span>
          <button className="sidebar-close" onClick={() => setMobileOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <ul className="menu">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link to={item.to} className={location.pathname === item.to ? "active" : ""} onClick={() => setMobileOpen(false)}>
                <i className={`fas ${item.icon}`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="logout">
          <Link to="/login" onClick={() => setMobileOpen(false)}>
            Đăng xuất
          </Link>
        </div>
      </div>
    </>
  );
}

export default Sidebar;