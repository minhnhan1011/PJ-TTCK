import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./KhamBenhPage.css";

export default function KhamBenhPage() {
  const [search, setSearch] = useState("");
  const [filterTT, setFilterTT] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ chuandoan: "", trieuchung: "" });

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          <div className="page-topbar">
            <div>
              <h1>Quản lý Khám bệnh</h1>
              <p>Theo dõi và quản lý các buổi khám bệnh của bệnh nhân.</p>
            </div>
          </div>

          <div className="stat-cards">
            <div className="stat-card blue">
              <div className="stat-label">Lịch khám hôm nay</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Đã hoàn thành</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Đang chờ</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Hủy bỏ</div>
              <div className="stat-number">0</div>
            </div>
          </div>

          <div className="table-container">
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm theo tên BN, mã BN, bác sĩ..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select className="filter-select" value={filterTT} onChange={(e) => setFilterTT(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                <option value="Đang chờ">Đang chờ</option>
                <option value="Đang khám">Đang khám</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Hủy bỏ">Hủy bỏ</option>
              </select>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã phiếu khám</th>
                    <th>Bệnh nhân</th>
                    <th>Bác sĩ</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th>Triệu chứng</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan="7" className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>0</strong> phiếu khám</div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3><i className="fas fa-stethoscope" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>Cập nhật Phiếu khám</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-form-body">
              <div className="form-group">
                <label>Chẩn đoán</label>
                <textarea rows="3" value={form.chuandoan} onChange={(e) => setForm({ ...form, chuandoan: e.target.value })} placeholder="Nhập chẩn đoán..." />
              </div>
              <div className="form-group">
                <label>Triệu chứng</label>
                <textarea rows="3" value={form.trieuchung} onChange={(e) => setForm({ ...form, trieuchung: e.target.value })} placeholder="Nhập triệu chứng..." />
              </div>
            </div>
            <div className="modal-form-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-save" onClick={() => setShowModal(false)}><i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
