<<<<<<< HEAD
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./homePage.css";

export default function HomePage() {
  return (
    <div className="page-layout">
=======
import { useState, useEffect } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import Loading from "../component/loading/Loading";
import { toast } from "react-toastify";
import "./homePage.css";

export default function HomePage() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // TODO: const res = await apiGet("/dashboard");
        toast.info("Sẵn sàng kết nối API Dashboard");
      } catch {
        toast.error("Lỗi tải dữ liệu tổng quan!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-layout">
      {loading && <Loading text="Đang tải dữ liệu tổng quan..." />}
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          <h1 className="home-title">Bảng điều khiển Giám đốc</h1>

          <div className="stat-cards">
            <div className="stat-card blue">
              <div className="stat-label">Bệnh nhân hôm nay</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Đang chờ khám</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Doanh thu (VNĐ)</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Bác sĩ trực</div>
              <div className="stat-number">0</div>
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
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                      Chưa có dữ liệu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
