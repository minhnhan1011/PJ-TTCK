import "./Sidebar.css";
import { Link } from "react-router-dom";

const menuItems = [
  { name: "Tổng quan", path: "/" },
  { name: "Bệnh nhân", path: "/benh-nhan" },
  { name: "Xét nghiệm", path: "/xet-nghiem" },
  { name: "Dịch vụ y tế", path: "/dich-vu" },
  { name: "Khám bệnh", path: "/kham-benh" },
  { name: "Thanh toán", path: "/thanh-toan" },
  { name: "Nhân sự", path: "/nhan-su" },
];

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <span className="logo-text">ClinicFlow</span>
      </div>
      <ul className="menu">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link to={item.path}>
              <i>{item.icon}</i>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="logout">
        <Link to="/login">
          Đăng xuất
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;