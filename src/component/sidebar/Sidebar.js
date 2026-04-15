import { useState, useEffect } from "react"; // Thêm useEffect
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const navItems = [
  { to: "/", icon: "fa-chart-pie", label: "Tổng quan", roles: ["admin"] },
  { to: "/benh-nhan", icon: "fa-users", label: "Quản lý Bệnh nhân", roles: ["admin"] },
  { to: "/nhan-vien", icon: "fa-user-md", label: "Quản lý Nhân sự", roles: ["admin"] },
  { to: "/kiosk", icon: "fa-ticket-alt", label: "Kiosk lấy số", roles: ["admin"] },
  { to: "/dang-ky-kham", icon: "fa-clipboard-list", label: "Quản lý Đăng ký", roles: ["tieptan"] },
  { to: "/dich-vu", icon: "fa-microscope", label: "Dịch vụ y tế", roles: ["admin", "tieptan"] },
  { to: "/kham-benh", icon: "fa-stethoscope", label: "Quản lý Khám bệnh", roles: ["bacsi"] },
  { to: "/loai-thuoc", icon: "fa-pills", label: "Quản lý Loại thuốc", roles: ["admin", "bacsi"] },
  { to: "/don-thuoc", icon: "fa-prescription-bottle-alt", label: "Quản lý Đơn thuốc", roles: ["bacsi","duocsi"] },
  { to: "/thuoc", icon: "fa-capsules", label: "Quản lý Thuốc", roles: ["admin", "duocsi"] },
  { to: "/xet-nghiem", icon: "fa-flask", label: "Phiếu Xét nghiệm", roles: ["bacsi", "ktv"] },
  { to: "/thanh-toan", icon: "fa-credit-card", label: "Quản lý Thanh toán", roles: ["thungan"] },
];

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  
  // Lấy role từ localStorage
  const userRole = localStorage.getItem("userRole") || "";


  console.log("Vai trò đang nhận trong Sidebar:", userRole);

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setMobileOpen(true)}>
        <i className="fas fa-bars"></i>
      </button>

      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)}></div>}

      <div className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="logo">
          <span className="logo-text">ClinicFlow</span>
          <button className="sidebar-close" onClick={() => setMobileOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <ul className="menu">
          {filteredNavItems.length > 0 ? (
            filteredNavItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.to}
                  className={location.pathname === item.to ? "active" : ""}
                  onClick={() => setMobileOpen(false)}
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))
          ) : (
            <li style={{color: "white", padding: "10px"}}>Không có menu cho role: {userRole}</li>
          )}
        </ul>

        <div className="logout">
          <Link to="/login" onClick={() => localStorage.removeItem("userRole")}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Đăng xuất</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Sidebar;