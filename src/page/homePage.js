import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./homePage.css";

const QUEUE_DATA = [
  { madk: "DK-0158", hoten: "Nguyễn Văn An", bacsi: "BS. Trần Hoài Nam", gio: "08:15 AM", trangthai: "Đang chờ" },
  { madk: "DK-0159", hoten: "Trần Thị Bích", bacsi: "BS. Lê Minh Tâm", gio: "08:30 AM", trangthai: "Đang khám" },
  { madk: "DK-0160", hoten: "Phạm Hồng Nhung", bacsi: "-", gio: "08:45 AM", trangthai: "Đã tiếp nhận" },
];

export default function HomePage() {
  const [queue] = useState(QUEUE_DATA);

  const getBadge = (tt) => {
    if (tt === "Đang chờ") return "badge-status badge-orange";
    if (tt === "Đang khám") return "badge-status badge-green";
    return "badge-status badge-gray";
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          <h1 className="home-title">Bảng điều khiển Giám đốc</h1>

          <div className="stat-cards">
            <div className="stat-card blue">
              <div className="stat-label">Bệnh nhân hôm nay</div>
              <div className="stat-number">42</div>
              <div className="stat-sub"><i className="fas fa-arrow-up"></i> +8% so với hôm qua</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Đang chờ khám</div>
              <div className="stat-number">08</div>
              <div className="stat-sub" style={{ color: "#9ca3af" }}>Trung bình đợi: 14 phút</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Doanh thu (VNĐ)</div>
              <div className="stat-number">12.4M</div>
              <div className="stat-sub"><i className="fas fa-arrow-up"></i> Vượt mục tiêu</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Bác sĩ trực</div>
              <div className="stat-number">04</div>
              <div className="stat-sub" style={{ color: "#9ca3af" }}>Trên tổng số 12 bác sĩ</div>
            </div>
          </div>

          <div className="table-container">
            <div className="table-toolbar" style={{ justifyContent: "space-between" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.05rem" }}>Danh sách hàng đợi hiện tại</h2>
              <button className="btn-primary">
                <i className="fas fa-plus"></i> Đăng ký khám mới
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã Đăng ký</th>
                    <th>Họ Tên Bệnh Nhân</th>
                    <th>Bác sĩ phụ trách</th>
                    <th>Giờ đến</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((q) => (
                    <tr key={q.madk}>
                      <td className="code-cell">{q.madk}</td>
                      <td style={{ fontWeight: 500 }}>{q.hoten}</td>
                      <td>{q.bacsi}</td>
                      <td style={{ color: "#6b7280" }}>{q.gio}</td>
                      <td><span className={getBadge(q.trangthai)}>{q.trangthai}</span></td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit" title="Chỉnh sửa"><i className="fas fa-edit"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}