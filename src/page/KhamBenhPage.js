import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./KhamBenhPage.css";

const INITIAL_DATA = [
  { mapk: "PK-001", hoten: "Nguyễn Văn An", mabn: "BN-001", bacsi: "BS. Trần Hoài Nam", thoigian: "20/03/2024 09:00", trangthai: "Hoàn thành", chuandoan: "Cảm cúm", trieuchung: "Đau đầu, chóng mặt" },
  { mapk: "PK-002", hoten: "Trần Thị Bích", mabn: "BN-002", bacsi: "BS. Lê Minh Tâm", thoigian: "20/03/2024 10:30", trangthai: "Đang khám", chuandoan: "", trieuchung: "Sốt, ho, đau họng" },
  { mapk: "PK-003", hoten: "Phạm Hồng Nhung", mabn: "BN-003", bacsi: "BS. Trần Hoài Nam", thoigian: "20/03/2024 14:00", trangthai: "Đang chờ", chuandoan: "", trieuchung: "Đau bụng, buồn nôn" },
];

export default function KhamBenhPage() {
  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [filterTT, setFilterTT] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ hoten: "", bacsi: "", chuandoan: "", trieuchung: "" });

  const filtered = data.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = d.hoten.toLowerCase().includes(q) || d.mabn.toLowerCase().includes(q);
    const matchTT = !filterTT || d.trangthai === filterTT;
    return matchSearch && matchTT;
  });

  const stats = {
    total: data.length,
    done: data.filter((d) => d.trangthai === "Hoàn thành").length,
    waiting: data.filter((d) => d.trangthai === "Đang chờ").length,
    cancelled: data.filter((d) => d.trangthai === "Hủy bỏ").length,
  };

  const getBadge = (tt) => {
    if (tt === "Hoàn thành") return "badge-status badge-green";
    if (tt === "Đang khám") return "badge-status badge-blue";
    if (tt === "Đang chờ") return "badge-status badge-orange";
    if (tt === "Hủy bỏ") return "badge-status badge-red";
    return "badge-status badge-gray";
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ hoten: item.hoten, bacsi: item.bacsi, chuandoan: item.chuandoan, trieuchung: item.trieuchung });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editItem) {
      setData(data.map((d) => d.mapk === editItem.mapk ? { ...d, ...form } : d));
    }
    setShowModal(false);
    setEditItem(null);
  };

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
              <div className="stat-number">{stats.total}</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Đã hoàn thành</div>
              <div className="stat-number">{stats.done}</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Đang chờ</div>
              <div className="stat-number">{stats.waiting}</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Hủy bỏ</div>
              <div className="stat-number">{stats.cancelled}</div>
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
                  {filtered.length === 0 ? (
                    <tr><td colSpan="7" className="empty-state"><p>Không tìm thấy phiếu khám nào</p></td></tr>
                  ) : filtered.map((d) => (
                    <tr key={d.mapk}>
                      <td className="code-cell">{d.mapk}</td>
                      <td>
                        <div className="data-table name-cell">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(d.hoten)}&background=e0f2fe&color=0284c7&size=32`} alt={d.hoten} />
                          <div>
                            <div className="name">{d.hoten}</div>
                            <div className="sub">{d.mabn}</div>
                          </div>
                        </div>
                      </td>
                      <td>{d.bacsi}</td>
                      <td style={{ color: "#6b7280" }}>{d.thoigian}</td>
                      <td><span className={getBadge(d.trangthai)}>{d.trangthai}</span></td>
                      <td style={{ maxWidth: "10rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.trieuchung}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-view" title="Xem chi tiết"><i className="fas fa-eye"></i></button>
                          <button className="btn-edit" title="Chỉnh sửa" onClick={() => openEdit(d)}><i className="fas fa-edit"></i></button>
                          <button className="btn-result" title="Kết quả"><i className="fas fa-file-medical"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>1-{filtered.length}</strong> trong tổng số <strong>{data.length}</strong> phiếu khám</div>
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
              <button className="btn-save" onClick={handleSave}><i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
