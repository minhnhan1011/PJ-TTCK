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
  "Da xet nghiem": { text: "Đã xét nghiệm", className: "badge-blue" },
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

// --- MODAL CHI TIẾT THANH TOÁN ---
function ModalChiTietChiPhi({ data, onClose }) {
  const [daThanhToan, setDaThanhToan] = useState(false);

  const chiTiet = Array.isArray(data?.chiTiet) ? data.chiTiet : [];
  const danhSachThuoc = chiTiet.filter((item) => item.loai === "Thuoc");
  const danhSachDV = chiTiet.filter((item) => item.loai === "Dich vu");

  const handleThanhToan = () => {
    setDaThanhToan(true);
    message.success(`Đã xác nhận thanh toán cho ${data.hoten}!`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-form"
        style={{ maxWidth: "800px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-form-header">
          <h3>Chi tiết chi phí: {data.hoten}</h3>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-form-body">
          {daThanhToan ? (
            // --- Màn hình xác nhận thanh toán thành công ---
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "#dcfce7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="fas fa-check-circle"
                  style={{ fontSize: "2.5rem", color: "#16a34a" }}
                />
              </div>
              <h3 style={{ margin: 0, color: "#16a34a", fontSize: "1.3rem" }}>
                Đã gửi yêu cầu thanh toán thành công
              </h3>
              <p style={{ margin: 0, color: "#6b7280", textAlign: "center" }}>
                Đã xác nhận cho <strong>{data.hoten}</strong>
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  color: "#dc2626",
                }}
              >
                {(data.tongTien || 0).toLocaleString()} VNĐ
              </p>
            </div>
          ) : (
            // --- Nội dung chi tiết chi phí ---
            <>
              <h4 style={{ color: "#7c3aed" }}>Dịch vụ kỹ thuật</h4>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên dịch vụ</th>
                    <th style={{ textAlign: "right" }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {danhSachDV.length === 0 ? (
                    <tr>
                      <td colSpan="2" style={{ textAlign: "center" }}>
                        Chưa có dịch vụ.
                      </td>
                    </tr>
                  ) : (
                    danhSachDV.map((ct, idx) => (
                      <tr key={idx}>
                        <td>{ct.ten}</td>
                        <td style={{ textAlign: "right" }}>
                          {(ct.gia || 0).toLocaleString()} đ
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <h4 style={{ marginTop: "20px", color: "#059669" }}>Đơn thuốc</h4>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên thuốc</th>
                    <th>SL</th>
                    <th style={{ textAlign: "right" }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {danhSachThuoc.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                        Chưa có thuốc.
                      </td>
                    </tr>
                  ) : (
                    danhSachThuoc.map((ct, idx) => (
                      <tr key={idx}>
                        <td>{ct.ten}</td>
                        <td>{ct.soluong}</td>
                        <td style={{ textAlign: "right" }}>
                          {(ct.thanh_tien || 0).toLocaleString()} đ
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div
                style={{
                  marginTop: "20px",
                  textAlign: "right",
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  color: "#dc2626",
                }}
              >
                TỔNG CỘNG: {(data.tongTien || 0).toLocaleString()} VNĐ
              </div>
            </>
          )}
        </div>

        <div className="modal-form-footer">
          <button className="btn-cancel" onClick={onClose}>
            Đóng
          </button>
          {!daThanhToan && (
            <button
              className="btn-save"
              style={{ background: "#16a34a", borderColor: "#16a34a" }}
              onClick={handleThanhToan}
            >
              <i
                className="fas fa-credit-card"
                style={{ marginRight: "0.4rem" }}
              />
              Gửi yêu cầu thanh toán
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- MODAL XÁC NHẬN XÉT NGHIỆM ---
function ModalXacNhanXetNghiem({ item, onClose }) {
  const [danhSachDV, setDanhSachDV] = useState([]);
  const [selectedDV, setSelectedDV] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/dich-vu", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const ds = Array.isArray(data) ? data : [];
        const filtered = ds.filter((dv) => dv.trangthai === "Hoat dong");
        setDanhSachDV(filtered);
      })
      .catch((err) => {
        console.error("Lỗi lấy dịch vụ:", err);
        setDanhSachDV([]);
      });
  }, []);

  const handleXacNhan = () => {
    if (!selectedDV) {
      message.warning("Vui lòng chọn một loại dịch vụ xét nghiệm!");
      return;
    }
    const existing = JSON.parse(
      localStorage.getItem("xetnghiem_queue") || "[]",
    );
    const dvInfo = danhSachDV.find((d) => d.madv === parseInt(selectedDV));

    if (!dvInfo) {
      message.error("Không tìm thấy thông tin dịch vụ!");
      return;
    }

    if (!existing.find((x) => x.madk === item.madk)) {
      existing.push({
        ...item,
        madv: dvInfo.madv,
        tendv: dvInfo.tendv,
        mapk: item.mapk,
        thoiGianGui: new Date().toISOString(),
      });
      localStorage.setItem("xetnghiem_queue", JSON.stringify(existing));
    }
    message.success(`Đã gửi yêu cầu ${dvInfo.tendv} cho ${item.hoten}!`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-form modal-confirm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-form-header">
          <h3>
            <i className="fas fa-flask" /> Xác nhận yêu cầu xét nghiệm
          </h3>
        </div>
        <div className="modal-form-body">
          <p className="confirm-question">Chọn loại dịch vụ cần thực hiện:</p>
          <div className="form-group">
            <select
              className="form-control"
              value={selectedDV}
              onChange={(e) => setSelectedDV(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            >
              <option value="">-- Chọn dịch vụ --</option>
              {danhSachDV?.map((dv) => (
                <option key={dv.madv} value={dv.madv}>
                  {dv.tendv} ({(dv.gia || 0).toLocaleString()} VNĐ)
                </option>
              ))}
            </select>
          </div>
          <div className="kham-info-box" style={{ marginTop: "15px" }}>
            <div className="kham-info-row">
              <span className="kham-info-label">Bệnh nhân:</span>
              <span className="kham-info-value">{item.hoten}</span>
            </div>
          </div>
        </div>
        <div className="modal-form-footer">
          <button className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="btn-save btn-xetnghiem" onClick={handleXacNhan}>
            Có, gửi yêu cầu
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MODAL CẬP NHẬT TRẠNG THÁI ---
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
              <span className="kham-info-label">Lý do khám:</span>
              <span className="kham-info-value">{item.lydokham}</span>
            </div>
          </div>
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
                  <i className={`fas ${icon}`} /> {label}
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

// --- MODAL XÁC NHẬN XÓA ---
function ModalXacNhanXoa({ item, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const handleXoa = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/dang-ky-kham/${item.madk}`, { method: "DELETE" });
      message.success(`Đã xóa phiếu khám của ${item.hoten}!`);
      onDeleted();
      onClose();
    } catch (err) {
      message.error(err.message || "Xóa thất bại, vui lòng thử lại!");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-wrap">
          <div
            className="confirm-icon"
            style={{ background: "#fee2e2", color: "#dc2626" }}
          >
            <i className="fas fa-trash-alt" style={{ fontSize: "1.8rem" }} />
          </div>
        </div>
        <h3>Xóa phiếu khám?</h3>
        <p>
          Bạn có chắc muốn xóa phiếu khám của <strong>{item.hoten}</strong> (Mã:{" "}
          {item.madk})?
          <br />
          <span style={{ color: "#dc2626", fontSize: "0.85rem" }}>
            Hành động này không thể hoàn tác.
          </span>
        </p>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onClose} disabled={deleting}>
            Hủy
          </button>
          <button
            className="btn-danger"
            onClick={handleXoa}
            disabled={deleting}
            style={{ background: "#dc2626", borderColor: "#dc2626" }}
          >
            <i className="fas fa-trash-alt" style={{ marginRight: "0.4rem" }} />
            {deleting ? "Đang xóa..." : "Xác nhận xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- TRANG CHÍNH ---
export default function KhamBenhPage() {
  const [danhSach, setDanhSach] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTT, setFilterTT] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [xetNghiemItem, setXetNghiemItem] = useState(null);
  const [chiTietPhi, setChiTietPhi] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

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

  const xemChiPhi = async (item) => {
    try {
      const data = await apiFetch(`/chi-phi-kham/${item.madk}`);
      setChiTietPhi({
        ...data,
        hoten: item.hoten,
        mapk: item.mapk,
        madk: item.madk,
        chiTiet: Array.isArray(data.chiTiet) ? data.chiTiet : [],
      });
    } catch (err) {
      message.info("Chưa có thông tin thuốc hoặc dịch vụ cho bệnh nhân này.");
    }
  };

  const danhSachLoc = danhSach.filter((d) => {
    const khopSearch = [String(d.madk), d.hoten ?? "", d.tenbs ?? ""].some(
      (f) => f.toLowerCase().includes(search.toLowerCase()),
    );
    const khopTT = filterTT ? d.trangthai === filterTT : true;
    return khopSearch && khopTT;
  });

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          <div className="page-topbar">
            <div>
              <h1>Quản lý Khám bệnh</h1>
              <p>Theo dõi và cập nhật trạng thái các buổi khám bệnh.</p>
            </div>
          </div>

          <Spin spinning={loading} tip="Đang tải dữ liệu...">
            <div className="table-container">
              <div className="table-toolbar">
                <div className="search-box">
                  <i className="fas fa-search" />
                  <input
                    placeholder="Tìm theo tên BN..."
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
                      <th>Ngày đăng ký</th>
                      <th>Trạng thái</th>
                      <th style={{ textAlign: "right" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {danhSachLoc.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="empty-state">
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
                                className="btn-icon btn-view"
                                onClick={() => xemChiPhi(item)}
                                title="Xem chi phí"
                                style={{ color: "#059669", marginRight: "8px" }}
                              >
                                <i className="fas fa-file-invoice-dollar" />
                              </button>

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
                                style={{ marginLeft: "8px" }}
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
            </div>
          </Spin>
        </div>
      </div>

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
      {chiTietPhi && (
        <ModalChiTietChiPhi
          data={chiTietPhi}
          onClose={() => setChiTietPhi(null)}
        />
      )}

      {deleteItem && (
        <ModalXacNhanXoa
          item={deleteItem}
          onClose={() => setDeleteItem(null)}
          onDeleted={taiDanhSach}
        />
      )}
    </div>
  );
}
