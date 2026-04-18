import { useState, useEffect } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import { message, Spin } from "antd";
import "./KhamBenhPage.css";

const API = "http://localhost:4000/api";

const TRANG_THAI_LABEL = {
  "Cho kham": { text: "Chờ khám", className: "badge-orange" },
  "Dang kham": { text: "Đang khám", className: "badge-green" },
  "Hoan thanh": { text: "Hoàn thành", className: "badge-purple" },
};

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Lỗi server");
  }
  return res.json();
}

function ModalXacNhanXetNghiem({ item, onClose }) {
  const [danhSachDV, setDanhSachDV] = useState([]); // State lưu dịch vụ
  const [selectedDV, setSelectedDV] = useState(""); // Dịch vụ bác sĩ chọn

  // Lấy danh sách dịch vụ từ Server khi mở Modal
  useEffect(() => {
    fetch("http://localhost:4000/api/dich-vu", { credentials: "include" })
      .then(res => res.json())
      .then(data => setDanhSachDV(data))
      .catch(err => console.error("Lỗi lấy dịch vụ:", err));
  }, []);

  const handleXacNhan = () => {
    if (!selectedDV) {
      message.warning("Vui lòng chọn một loại dịch vụ xét nghiệm!");
      return;
    }
    
    const existing = JSON.parse(localStorage.getItem("xetnghiem_queue") || "[]");
    
    // Tìm thông tin dịch vụ đã chọn để lưu vào queue
    const dvInfo = danhSachDV.find(d => d.madv === parseInt(selectedDV));

    if (!existing.find((x) => x.madk === item.madk)) {
      existing.push({ 
        ...item, 
        madv: dvInfo.madv,
        tendv: dvInfo.tendv, // Lưu tên dịch vụ để trang xét nghiệm hiển thị
        thoiGianGui: new Date().toISOString() 
      });
      localStorage.setItem("xetnghiem_queue", JSON.stringify(existing));
    }
    message.success(`Đã gửi yêu cầu ${dvInfo.tendv} cho ${item.hoten}!`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-form modal-confirm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <h3><i className="fas fa-flask" /> Xác nhận yêu cầu xét nghiệm</h3>
        </div>

        <div className="modal-form-body">
          <p className="confirm-question">Chọn loại dịch vụ cần thực hiện:</p>
          
          {/* THÊM SELECT BOX Ở ĐÂY */}
          <div className="form-group">
            <select 
              className="form-control" 
              value={selectedDV} 
              onChange={(e) => setSelectedDV(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value="">-- Chọn dịch vụ --</option>
              {danhSachDV.map(dv => (
                <option key={dv.madv} value={dv.madv}>
                  {dv.tendv} ({dv.gia.toLocaleString()} VNĐ)
                </option>
              ))}
            </select>
          </div>

          <div className="kham-info-box" style={{ marginTop: '15px' }}>
            <div className="kham-info-row">
              <span className="kham-info-label">Bệnh nhân:</span>
              <span className="kham-info-value">{item.hoten}</span>
            </div>
          </div>
        </div>

        <div className="modal-form-footer">
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-save btn-xetnghiem" onClick={handleXacNhan}>
            Có, gửi yêu cầu
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalCapNhatTrangThai({ item, onClose, onSaved }) {
  const [trangthai, setTrangthai] = useState(item.trangthai ?? "Cho kham");
  const [submitting, setSubmitting] = useState(false);
  const handleLuu = async () => {
    setSubmitting(true);
    try {
      await apiFetch(`/dang-ky-kham/${item.madk}`, {
        method: "PUT",
        body: JSON.stringify({
          mabn: item.mabn,
          lydokham: item.lydokham,
          manv: item.manv,
          trangthai,
        }),
      });
      message.success("Cập nhật trạng thái thành công!");
      onSaved();
      onClose();
    } catch (err) {
      message.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <h3>
            <i
              className="fas fa-stethoscope"
              style={{ marginRight: "0.5rem", color: "#2563eb" }}
            />
            Cập nhật trạng thái khám
          </h3>
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="modal-form-body">
          {/* Thông tin chỉ đọc */}
          <div className="kham-info-box">
            <div className="kham-info-row">
              <span className="kham-info-label">Mã phiếu:</span>
              <span className="kham-info-value">{item.madk}</span>
            </div>
            <div className="kham-info-row">
              <span className="kham-info-label">Bệnh nhân:</span>
              <span className="kham-info-value">{item.hoten}</span>
            </div>
            <div className="kham-info-row">
              <span className="kham-info-label">Bác sĩ:</span>
              <span className="kham-info-value">{item.tenbs ?? "—"}</span>
            </div>
            <div className="kham-info-row">
              <span className="kham-info-label">Lý do khám:</span>
              <span className="kham-info-value">{item.lydokham}</span>
            </div>
            <div className="kham-info-row">
              <span className="kham-info-label">Ngày đăng ký:</span>
              <span className="kham-info-value">
                {new Date(item.ngaydangky).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>

          {/* Trạng thái — phần duy nhất được chỉnh sửa */}
          <div className="form-group" style={{ marginTop: "1rem" }}>
            <label style={{ fontWeight: 600 }}>Trạng thái khám</label>
            <div className="trang-thai-options">
              {[
                {
                  value: "Cho kham",
                  label: "Chờ khám",
                  icon: "fa-clock",
                  color: "#f97316",
                },
                {
                  value: "Dang kham",
                  label: "Đang khám",
                  icon: "fa-user-md",
                  color: "#22c55e",
                },
                {
                  value: "Hoan thanh",
                  label: "Hoàn thành",
                  icon: "fa-check-circle",
                  color: "#8b5cf6",
                },
              ].map(({ value, label, icon, color }) => (
                <label
                  key={value}
                  className={`tt-option ${trangthai === value ? "tt-option-active" : ""}`}
                  style={{ "--tt-color": color }}
                >
                  <input
                    type="radio"
                    name="trangthai"
                    value={value}
                    checked={trangthai === value}
                    onChange={() => setTrangthai(value)}
                  />
                  <i className={`fas ${icon}`} />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-form-footer">
          <button className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button
            className="btn-save"
            onClick={handleLuu}
            disabled={submitting}
          >
            <i className="fas fa-save" style={{ marginRight: "0.4rem" }} />
            {submitting ? "Đang lưu..." : "Lưu trạng thái"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Trang chính ───────────────────────────────────────────────────────────

export default function KhamBenhPage() {
  const [danhSach, setDanhSach] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTT, setFilterTT] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [xetNghiemItem, setXetNghiemItem] = useState(null);
  // ── Tải dữ liệu ──────────────────────────────────────────────────────────

  const taiDanhSach = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/dang-ky-kham");
      setDanhSach(Array.isArray(data) ? data : []);
    } catch {
      message.error("Không thể tải danh sách khám bệnh!");
      setDanhSach([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    taiDanhSach();
  }, []);

  // ── Thống kê ──────────────────────────────────────────────────────────────

  const thongKe = {
    homNay: danhSach.filter((d) => {
      const ngay = new Date(d.ngaydangky);
      const hom = new Date();
      return ngay.toDateString() === hom.toDateString();
    }).length,
    hoanThanh: danhSach.filter((d) => d.trangthai === "Hoan thanh").length,
    dangCho: danhSach.filter((d) => d.trangthai === "Cho kham").length,
    dangKham: danhSach.filter((d) => d.trangthai === "Dang kham").length,
  };

  // ── Lọc danh sách ────────────────────────────────────────────────────────

  const danhSachLoc = danhSach.filter((d) => {
    const khopSearch = [String(d.madk), d.hoten ?? "", d.tenbs ?? ""].some(
      (f) => f.toLowerCase().includes(search.toLowerCase()),
    );
    const khopTT = filterTT ? d.trangthai === filterTT : true;
    return khopSearch && khopTT;
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          <div className="page-topbar">
            <div>
              <h1>Quản lý Khám bệnh</h1>
              <p>
                Theo dõi và cập nhật trạng thái các buổi khám bệnh của bệnh
                nhân.
              </p>
            </div>
          </div>

          {/* Thống kê */}
          <div className="stat-cards">
            <div className="stat-card blue">
              <div className="stat-label">Lịch khám hôm nay</div>
              <div className="stat-number">{thongKe.homNay}</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Đã hoàn thành</div>
              <div className="stat-number">{thongKe.hoanThanh}</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Đang chờ</div>
              <div className="stat-number">{thongKe.dangCho}</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Đang khám</div>
              <div className="stat-number">{thongKe.dangKham}</div>
            </div>
          </div>

          {/* Bảng danh sách */}
          <Spin spinning={loading} tip="Đang tải dữ liệu...">
            <div className="table-container">
              <div className="table-toolbar">
                <div className="search-box">
                  <i className="fas fa-search" />
                  <input
                    placeholder="Tìm theo tên BN, mã phiếu, bác sĩ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="filter-select"
                  value={filterTT}
                  onChange={(e) => setFilterTT(e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="Cho kham">Chờ khám</option>
                  <option value="Dang kham">Đang khám</option>
                  <option value="Hoan thanh">Hoàn thành</option>
                </select>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã phiếu</th>
                      <th>STT</th>
                      <th>Bệnh nhân</th>
                      <th>Bác sĩ</th>
                      <th>Lý do khám</th>
                      <th>Ngày đăng ký</th>
                      <th>Trạng thái</th>
                      <th style={{ textAlign: "right" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {danhSachLoc.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="empty-state">
                          <p>Chưa có dữ liệu</p>
                        </td>
                      </tr>
                    ) : (
                      danhSachLoc.map((item) => {
                        const tt = TRANG_THAI_LABEL[item.trangthai];
                        return (
                          <tr key={item.madk}>
                            <td>{item.madk}</td>
                            <td>{item.stt ?? "—"}</td>
                            <td>{item.hoten}</td>
                            <td>{item.tenbs ?? "—"}</td>
                            <td>{item.lydokham}</td>
                            <td>
                              {new Date(item.ngaydangky).toLocaleDateString(
                                "vi-VN",
                              )}
                            </td>
                            <td>
                              <span className={`badge ${tt?.className ?? ""}`}>
                                {tt?.text ?? item.trangthai}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <button
                                className="btn-icon btn-edit"
                                onClick={() => setEditItem(item)}
                                title="Cập nhật trạng thái"
                              >
                                <i className="fas fa-stethoscope" />
                              </button>
                              <button
                                className="btn-icon btn-flask"
                                onClick={() => setXetNghiemItem(item)}
                                title="Yêu cầu xét nghiệm"
                              >
                                <i className="fas fa-flask" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="table-pagination">
                <div>
                  Hiển thị <strong>{danhSachLoc.length}</strong> phiếu khám
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </div>

      {/* Modal cập nhật trạng thái */}
      {editItem && (
        <ModalCapNhatTrangThai
          item={editItem}
          onClose={() => setEditItem(null)}
          onSaved={taiDanhSach}
        />
      )}

      {xetNghiemItem && (
        <ModalXacNhanXetNghiem
          item={xetNghiemItem}
          onClose={() => setXetNghiemItem(null)}
        />
      )}
    </div>
  );
}
