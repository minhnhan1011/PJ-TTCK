import { useState, useEffect, useRef } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import { message, Spin } from "antd";
import "./DangKyKhamPage.css";

// ─── Hằng số ───────────────────────────────────────────────────────────────

const API = "http://localhost:4000/api";

const TRANG_THAI_LABEL = {
  "Cho kham":   { text: "Chờ khám",    className: "badge-orange" },
  "Dang kham":  { text: "Đang khám",   className: "badge-green"  },
  "Hoan thanh": { text: "Hoàn thành",  className: "badge-purple" },
};

const LY_DO_KHAM = [
  "Khám tổng quát", "Sốt / Cảm cúm", "Đau bụng",
  "Đau đầu", "Tai mũi họng", "Da liễu", "Khác",
];

const FORM_RONG = { mabn: "", tenbn: "", lydokham: "", manv: "", trangthai: "Cho kham" };

// ─── Helper fetch ──────────────────────────────────────────────────────────

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

// ─── Component tìm kiếm bệnh nhân ─────────────────────────────────────────

function TimKiemBenhNhan({ danhSachBN, mabn, tenbn, onChange, error, disabled }) {
  const [tuKhoa,     setTuKhoa]     = useState(tenbn || "");
  const [moDropdown, setMoDropdown] = useState(false);
  const [viTri,      setViTri]      = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef(null);

  // Đồng bộ lại khi tenbn thay đổi từ bên ngoài (vd: khi mở modal edit)
  useEffect(() => { setTuKhoa(tenbn || ""); }, [tenbn]);

  const tinhViTri = () => {
    if (!inputRef.current) return;
    const r = inputRef.current.getBoundingClientRect();
    setViTri({ top: r.bottom + 4, left: r.left, width: r.width });
  };

  const ketQua = tuKhoa.trim()
    ? danhSachBN.filter((bn) =>
        bn.hoten.toLowerCase().includes(tuKhoa.toLowerCase()) ||
        String(bn.mabn).includes(tuKhoa)
      )
    : danhSachBN;

  const chon = (bn) => {
    setTuKhoa(bn.hoten);
    setMoDropdown(false);
    onChange({ mabn: String(bn.mabn), tenbn: bn.hoten });
  };

  const handleChange = (e) => {
    setTuKhoa(e.target.value);
    setMoDropdown(true);
    onChange({ mabn: "", tenbn: e.target.value }); // reset mabn khi gõ lại
  };

  const handleBlur = () => {
    setTimeout(() => {
      setMoDropdown(false);
      // Nếu chưa chọn hợp lệ (mabn rỗng) thì xóa text
      if (!mabn) { setTuKhoa(""); onChange({ mabn: "", tenbn: "" }); }
    }, 150);
  };

  if (disabled) {
    return (
      <div className="form-group">
        <label>Bệnh nhân</label>
        <input value={tuKhoa} disabled className="input-disabled" style={{ width: "100%" }} />
      </div>
    );
  }

  return (
    <div className="form-group">
      <label>Bệnh nhân <span className="required">*</span></label>
      <input
        ref={inputRef}
        type="text"
        placeholder="Nhập tên hoặc mã bệnh nhân..."
        value={tuKhoa}
        className={error ? "input-error" : ""}
        onChange={handleChange}
        onFocus={() => { tinhViTri(); setMoDropdown(true); }}
        onBlur={handleBlur}
        autoComplete="off"
        style={{ width: "100%" }}
      />
      {error && <div className="error-text">{error}</div>}

      {moDropdown && ketQua.length > 0 && (
        <ul className="bn-dropdown" style={{ top: viTri.top, left: viTri.left, width: viTri.width }}>
          {ketQua.map((bn) => (
            <li key={bn.mabn} className="bn-dropdown-item" onMouseDown={() => chon(bn)}>
              <span className="bn-dropdown-ten">{bn.hoten}</span>
              <span className="bn-dropdown-ma">#{bn.mabn}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Component modal form ──────────────────────────────────────────────────

function ModalForm({ title, onSubmit, onClose, form, setForm, errors, danhSachBS, danhSachBN, submitting, isEdit }) {
  const benhNhanChon = danhSachBN.find((bn) => String(bn.mabn) === String(form.mabn));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-form" onClick={(e) => e.stopPropagation()}>

        <div className="modal-form-header">
          <h3>
            <i className="fas fa-clipboard-list" style={{ marginRight: "0.5rem", color: "#2563eb" }} />
            {title}
          </h3>
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="modal-form-body">

          {/* Bệnh nhân — khóa khi chỉnh sửa, tìm kiếm khi thêm mới */}
          <TimKiemBenhNhan
            danhSachBN={danhSachBN}
            mabn={form.mabn}
            tenbn={form.tenbn}
            onChange={({ mabn, tenbn }) => setForm({ ...form, mabn, tenbn })}
            error={errors.mabn}
            disabled={isEdit}
          />

          {/* Thông tin bệnh nhân sau khi chọn (chỉ hiện khi thêm mới) */}
          {!isEdit && benhNhanChon && (
            <div className="bn-info-box">
              <div><span>Họ tên:</span> {benhNhanChon.hoten}</div>
              <div><span>Giới tính:</span> {benhNhanChon.gioitinh ?? "—"}</div>
              <div><span>Ngày sinh:</span> {benhNhanChon.ngaysinh ? new Date(benhNhanChon.ngaysinh).toLocaleDateString("vi-VN") : "—"}</div>
              <div><span>SĐT:</span> {benhNhanChon.sdt ?? "—"}</div>
            </div>
          )}

          {/* Lý do khám */}
          <div className="form-group">
            <label>Lý do khám <span className="required">*</span></label>
            <select
              value={form.lydokham}
              onChange={(e) => setForm({ ...form, lydokham: e.target.value })}
              className={errors.lydokham ? "input-error" : ""}
            >
              <option value="">-- Chọn lý do --</option>
              {LY_DO_KHAM.map((ly) => <option key={ly}>{ly}</option>)}
            </select>
            {errors.lydokham && <div className="error-text">{errors.lydokham}</div>}
          </div>

          {/* Bác sĩ — luôn cho sửa */}
          <div className="form-group">
            <label>Bác sĩ phụ trách <span className="required">*</span></label>
            <select
              value={form.manv}
              onChange={(e) => setForm({ ...form, manv: e.target.value })}
              className={errors.manv ? "input-error" : ""}
            >
              <option value="">-- Chọn bác sĩ --</option>
              {danhSachBS.map((bs) => <option key={bs.manv} value={String(bs.manv)}>{bs.hoten}</option>)}
            </select>
            {errors.manv && <div className="error-text">{errors.manv}</div>}
          </div>

          {/* Trạng thái — chỉ hiện khi chỉnh sửa */}
          {isEdit && (
            <div className="form-group">
              <label>Trạng thái</label>
              <select
                value={form.trangthai}
                onChange={(e) => setForm({ ...form, trangthai: e.target.value })}
              >
                <option value="Cho kham">Chờ khám</option>
                <option value="Dang kham">Đang khám</option>
                <option value="Hoan thanh">Hoàn thành</option>
              </select>
            </div>
          )}
        </div>

        <div className="modal-form-footer">
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-save" onClick={onSubmit} disabled={submitting}>
            <i className="fas fa-save" style={{ marginRight: "0.4rem" }} />
            {submitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Lưu & Cấp STT"}
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Trang chính ───────────────────────────────────────────────────────────

export default function DangKyKhamPage() {
  const [danhSach,   setDanhSach]   = useState([]);
  const [danhSachBS, setDanhSachBS] = useState([]);
  const [danhSachBN, setDanhSachBN] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search,     setSearch]     = useState("");
  const [modal,      setModal]      = useState(null);
  const [editItem,   setEditItem]   = useState(null);
  const [form,       setForm]       = useState(FORM_RONG);
  const [errors,     setErrors]     = useState({});

  // ── Tải dữ liệu ──────────────────────────────────────────────────────────

  const taiDanhSach = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/dang-ky-kham");
      setDanhSach(Array.isArray(data) ? data : []);
    } catch {
      message.error("Không thể tải danh sách đăng ký khám!");
      setDanhSach([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const taiTatCa = async () => {
      taiDanhSach();
      try {
        const [bs, bn] = await Promise.all([
          apiFetch("/nhan-vien/bac-si"),
          apiFetch("/benh-nhan"),
        ]);
        setDanhSachBS(Array.isArray(bs) ? bs : []);
        setDanhSachBN(Array.isArray(bn) ? bn : []);
      } catch {
        message.error("Không thể tải danh sách bác sĩ / bệnh nhân!");
      }
    };
    taiTatCa();
  }, []);

  // ── Validate ──────────────────────────────────────────────────────────────

  const validate = (isEdit) => {
    const e = {};
    if (!isEdit && !form.mabn) e.mabn = "Vui lòng chọn bệnh nhân";
    if (!form.lydokham)        e.lydokham = "Vui lòng chọn lý do khám";
    if (!form.manv)            e.manv = "Vui lòng chọn bác sĩ";
    return e;
  };

  // ── Mở modal ─────────────────────────────────────────────────────────────

  const moThemMoi = () => {
    setForm(FORM_RONG);
    setErrors({});
    setModal("add");
  };

  const moChinhSua = (item) => {
    setEditItem(item);
    setForm({
      mabn:      String(item.mabn),
      tenbn:     item.hoten,
      lydokham:  item.lydokham  ?? "",
      manv:      String(item.manv  ?? ""),
      trangthai: item.trangthai ?? "Cho kham",
    });
    setErrors({});
    setModal("edit");
  };

  const dongModal = () => setModal(null);

  // ── Thêm / Sửa / Xóa ─────────────────────────────────────────────────────

  const handleThem = async () => {
    const e = validate(false);
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      await apiFetch("/dang-ky-kham", {
        method: "POST",
        body: JSON.stringify({ mabn: form.mabn, lydokham: form.lydokham, manv: form.manv }),
      });
      message.success("Lập phiếu đăng ký khám thành công!");
      dongModal();
      taiDanhSach();
    } catch (err) {
      message.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSua = async () => {
    const e = validate(true);
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      await apiFetch(`/dang-ky-kham/${editItem.madk}`, {
        method: "PUT",
        body: JSON.stringify({
          mabn:      form.mabn,
          lydokham:  form.lydokham,
          manv:      form.manv,
          trangthai: form.trangthai,
        }),
      });
      message.success("Cập nhật phiếu đăng ký thành công!");
      dongModal();
      taiDanhSach();
    } catch (err) {
      message.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleXoa = async (madk) => {
    if (!window.confirm("Bạn có chắc muốn xóa phiếu đăng ký này?")) return;
    try {
      await apiFetch(`/dang-ky-kham/${madk}`, { method: "DELETE" });
      message.success("Xóa phiếu đăng ký thành công!");
      taiDanhSach();
    } catch (err) {
      message.error(err.message);
    }
  };

  // ── Dữ liệu tính toán ────────────────────────────────────────────────────

  const thongKe = {
    tong:      danhSach.length,
    choKham:   danhSach.filter((d) => d.trangthai === "Cho kham").length,
    dangKham:  danhSach.filter((d) => d.trangthai === "Dang kham").length,
    hoanThanh: danhSach.filter((d) => d.trangthai === "Hoan thanh").length,
  };

  const danhSachLoc = danhSach.filter((d) =>
    [String(d.madk), d.hoten ?? "", d.tenbs ?? ""].some((f) =>
      f.toLowerCase().includes(search.toLowerCase())
    )
  );

  const propsModal = { form, setForm, errors, danhSachBS, danhSachBN, submitting };

  // ── Render ────────────────────────────────────────────────────────────────

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
            <button className="btn-primary" onClick={moThemMoi}>
              <i className="fas fa-plus" /> Lập phiếu khám mới
            </button>
          </div>

          <div className="stat-cards">
            {[
              { label: "Tổng đăng ký", value: thongKe.tong,      color: "blue"   },
              { label: "Chờ khám",     value: thongKe.choKham,   color: "orange" },
              { label: "Đang khám",    value: thongKe.dangKham,  color: "green"  },
              { label: "Hoàn thành",   value: thongKe.hoanThanh, color: "purple" },
            ].map(({ label, value, color }) => (
              <div key={color} className={`stat-card ${color}`}>
                <div className="stat-label">{label}</div>
                <div className="stat-number">{value}</div>
              </div>
            ))}
          </div>

          <Spin spinning={loading} tip="Đang tải dữ liệu...">
            <div className="table-container">
              <div className="table-toolbar">
                <div className="search-box">
                  <i className="fas fa-search" />
                  <input
                    placeholder="Tìm theo tên BN, mã ĐK, bác sĩ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã ĐK</th><th>STT</th><th>Bệnh nhân</th>
                      <th>Lý do khám</th><th>Bác sĩ phụ trách</th>
                      <th>Ngày đăng ký</th><th>Trạng thái</th>
                      <th style={{ textAlign: "right" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {danhSachLoc.length === 0 ? (
                      <tr><td colSpan="8" className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
                    ) : (
                      danhSachLoc.map((item) => {
                        const tt = TRANG_THAI_LABEL[item.trangthai];
                        return (
                          <tr key={item.madk}>
                            <td>{item.madk}</td>
                            <td>{item.stt ?? "—"}</td>
                            <td>{item.hoten}</td>
                            <td>{item.lydokham}</td>
                            <td>{item.tenbs ?? "—"}</td>
                            <td>{new Date(item.ngaydangky).toLocaleDateString("vi-VN")}</td>
                            <td><span className={`badge ${tt?.className ?? ""}`}>{tt?.text ?? item.trangthai}</span></td>
                            <td style={{ textAlign: "right" }}>
                              <button className="btn-icon btn-edit"   onClick={() => moChinhSua(item)} title="Chỉnh sửa"><i className="fas fa-edit"  /></button>
                              <button className="btn-icon btn-delete" onClick={() => handleXoa(item.madk)} title="Xóa"><i className="fas fa-trash" /></button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="table-pagination">
                <div>Hiển thị <strong>{danhSachLoc.length}</strong> đăng ký</div>
              </div>
            </div>
          </Spin>
        </div>
      </div>

      {modal === "add" && (
        <ModalForm title="Lập phiếu đăng ký khám"  onSubmit={handleThem} onClose={dongModal} {...propsModal} />
      )}
      {modal === "edit" && (
        <ModalForm title="Chỉnh sửa phiếu đăng ký" onSubmit={handleSua}  onClose={dongModal} isEdit {...propsModal} />
      )}
    </div>
  );
}
