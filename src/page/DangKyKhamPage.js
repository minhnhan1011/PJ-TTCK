import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./DangKyKhamPage.css";

const INITIAL_DATA = [
  { madk: "DK-001", mabn: "BN-001", hoten: "Nguyễn Văn An", stt: 1, lydokham: "Sốt cao", ngaydangky: "20/03/2024 08:15", trangthai: "Cho kham", manv: "NV-001" },
  { madk: "DK-002", mabn: "BN-002", hoten: "Trần Thị Bích", stt: 2, lydokham: "Đau bụng", ngaydangky: "20/03/2024 08:30", trangthai: "Dang kham", manv: "NV-002" },
  { madk: "DK-003", mabn: "BN-003", hoten: "Phạm Hồng Nhung", stt: 3, lydokham: "Khám tổng quát", ngaydangky: "20/03/2024 09:00", trangthai: "Hoan thanh", manv: "NV-001" },
];

const TT_LABELS = { "Cho kham": "Chờ khám", "Dang kham": "Đang khám", "Hoan thanh": "Hoàn thành", "Huy": "Đã hủy" };

export default function DangKyKhamPage() {
  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ hoten: "", lydokham: "", mabn: "" });
  const [formErrors, setFormErrors] = useState({});

  const filtered = data.filter((d) => {
    const q = search.toLowerCase();
    return d.hoten.toLowerCase().includes(q) || d.mabn.toLowerCase().includes(q) || d.madk.toLowerCase().includes(q);
  });

  const stats = {
    total: data.length,
    waiting: data.filter((d) => d.trangthai === "Cho kham").length,
    inProgress: data.filter((d) => d.trangthai === "Dang kham").length,
    done: data.filter((d) => d.trangthai === "Hoan thanh").length,
  };

  const getBadge = (tt) => {
    if (tt === "Cho kham") return "badge-status badge-orange";
    if (tt === "Dang kham") return "badge-status badge-blue";
    if (tt === "Hoan thanh") return "badge-status badge-green";
    if (tt === "Huy") return "badge-status badge-red";
    return "badge-status badge-gray";
  };

  const openAdd = () => {
    setForm({ hoten: "", lydokham: "", mabn: "" });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSave = () => {
    const errs = {};
    if (!form.hoten.trim()) errs.hoten = "Họ tên bắt buộc";
    if (!form.lydokham.trim()) errs.lydokham = "Lý do khám bắt buộc";
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const stt = data.length + 1;
    const newItem = {
      madk: "DK-" + String(stt).padStart(3, "0"),
      mabn: form.mabn || "BN-NEW",
      hoten: form.hoten,
      stt,
      lydokham: form.lydokham,
      ngaydangky: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      trangthai: "Cho kham",
      manv: "NV-001",
    };
    setData([...data, newItem]);
    setShowModal(false);
  };

  const handleChangeStatus = (madk, newTT) => {
    setData(data.map((d) => d.madk === madk ? { ...d, trangthai: newTT } : d));
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          <div className="page-topbar">
            <div>
              <h1>Quản lý Đăng ký khám</h1>
              <p>Lập phiếu đăng ký khám, hủy/đổi lịch khám bệnh nhân.</p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-plus"></i> Lập phiếu khám mới
            </button>
          </div>

          <div className="stat-cards">
            <div className="stat-card blue">
              <div className="stat-label">Tổng đăng ký</div>
              <div className="stat-number">{stats.total}</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Chờ khám</div>
              <div className="stat-number">{stats.waiting}</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Đang khám</div>
              <div className="stat-number">{stats.inProgress}</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Hoàn thành</div>
              <div className="stat-number">{stats.done}</div>
            </div>
          </div>

          <div className="table-container">
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm theo tên BN, mã BN, mã ĐK..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã ĐK</th>
                    <th>STT</th>
                    <th>Bệnh nhân</th>
                    <th>Lý do khám</th>
                    <th>Ngày đăng ký</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="7" className="empty-state"><p>Không tìm thấy đăng ký nào</p></td></tr>
                  ) : filtered.map((d) => (
                    <tr key={d.madk}>
                      <td className="code-cell">{d.madk}</td>
                      <td style={{ fontWeight: 700, textAlign: "center" }}>{d.stt}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{d.hoten}</div>
                        <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{d.mabn}</div>
                      </td>
                      <td>{d.lydokham}</td>
                      <td style={{ color: "#6b7280" }}>{d.ngaydangky}</td>
                      <td><span className={getBadge(d.trangthai)}>{TT_LABELS[d.trangthai] || d.trangthai}</span></td>
                      <td>
                        <div className="action-btns">
                          {d.trangthai === "Cho kham" && (
                            <>
                              <button className="btn-edit" title="Bắt đầu khám" onClick={() => handleChangeStatus(d.madk, "Dang kham")}><i className="fas fa-play"></i></button>
                              <button className="btn-delete" title="Hủy" onClick={() => handleChangeStatus(d.madk, "Huy")}><i className="fas fa-ban"></i></button>
                            </>
                          )}
                          {d.trangthai === "Dang kham" && (
                            <button className="btn-view" title="Hoàn tất" onClick={() => handleChangeStatus(d.madk, "Hoan thanh")}><i className="fas fa-check-circle"></i></button>
                          )}
                          <button className="btn-view" title="Xem"><i className="fas fa-eye"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>{filtered.length}</strong> trong tổng số <strong>{data.length}</strong> đăng ký</div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3><i className="fas fa-clipboard-list" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>Lập phiếu đăng ký khám</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-form-body">
              <div className="form-group">
                <label>Mã Bệnh nhân (nếu có)</label>
                <input type="text" placeholder="VD: BN-001 (bỏ trống nếu BN mới)" value={form.mabn} onChange={(e) => setForm({ ...form, mabn: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Họ và Tên <span className="required">*</span></label>
                <input type="text" placeholder="Nhập họ tên bệnh nhân..." value={form.hoten} onChange={(e) => setForm({ ...form, hoten: e.target.value })} className={formErrors.hoten ? "input-error" : ""} />
                {formErrors.hoten && <div className="error-text">{formErrors.hoten}</div>}
              </div>
              <div className="form-group">
                <label>Lý do khám <span className="required">*</span></label>
                <select value={form.lydokham} onChange={(e) => setForm({ ...form, lydokham: e.target.value })} className={formErrors.lydokham ? "input-error" : ""}>
                  <option value="">-- Chọn lý do --</option>
                  <option>Khám tổng quát</option>
                  <option>Sốt / Cảm cúm</option>
                  <option>Đau bụng</option>
                  <option>Đau đầu</option>
                  <option>Tai mũi họng</option>
                  <option>Da liễu</option>
                  <option>Khác</option>
                </select>
                {formErrors.lydokham && <div className="error-text">{formErrors.lydokham}</div>}
              </div>
            </div>
            <div className="modal-form-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-save" onClick={handleSave}><i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>Lưu & Cấp STT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
