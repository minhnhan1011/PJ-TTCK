import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { message } from "antd";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./DonThuocPage.css";

const emptyLine = { malt: "", mat: "", soluong: "", lieudung: "" };

export default function DonThuocPage() {
  const userRole = localStorage.getItem("userRole") || "";
  const canEdit = !["tieptan", "duocsi"].includes(userRole);

  const [data, setData] = useState([]);
  const [thuocList, setThuocList] = useState([]);
  const [loaiThuocList, setLoaiThuocList] = useState([]);
  const [phieuKhamList, setPhieuKhamList] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formMapk, setFormMapk] = useState("");
  const [formLines, setFormLines] = useState([{ ...emptyLine }]);
  const [form, setForm] = useState({ malt: "", mat: "", soluong: "", lieudung: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);
  const [showGiaoConfirm, setShowGiaoConfirm] = useState(null);
  const [duocsiFilter, setDuocsiFilter] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tongTienMapk, setTongTienMapk] = useState("");
  const [tongTien, setTongTien] = useState(null);
  const [expandedDt, setExpandedDt] = useState(null);

  const loadData = () => {
    axios.get("http://localhost:4000/api/don-thuoc", { withCredentials: true })
      .then(res => setData(Array.isArray(res.data) ? res.data : []))
      .catch(() => message.error("Lỗi tải danh sách đơn thuốc!"));
    axios.get("http://localhost:4000/api/thuoc", { withCredentials: true })
      .then(res => setThuocList(Array.isArray(res.data) ? res.data : []))
      .catch(() => message.error("Lỗi tải danh sách thuốc!"));
    axios.get("http://localhost:4000/api/loai-thuoc", { withCredentials: true })
      .then(res => setLoaiThuocList(Array.isArray(res.data) ? res.data : []))
      .catch(() => message.error("Lỗi tải danh sách loại thuốc!"));
    axios.get("http://localhost:4000/api/phieukham/list", { withCredentials: true })
      .then(res => setPhieuKhamList(Array.isArray(res.data) ? res.data : []))
      .catch(() => message.error("Lỗi tải danh sách phiếu khám!"));
  };
  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const s = search.toLowerCase();
    return data.filter(i => String(i.mapk).includes(s) || (i.tenbn || "").toLowerCase().includes(s) || (i.tent || "").toLowerCase().includes(s) || (i.tenlt || "").toLowerCase().includes(s));
  }, [data, search]);

  // Gom chi tiết theo mã đơn thuốc (madt)
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(item => {
      if (!map[item.madt]) {
        map[item.madt] = {
          madt: item.madt, mapk: item.mapk, tenbn: item.tenbn,
          payment_status: item.payment_status,
          dispense_status: item.dispense_status,
          paid_at: item.paid_at,
          items: []
        };
      }
      map[item.madt].items.push(item);
    });
    return Object.values(map);
  }, [filtered]);

  // Dược sĩ: lọc chỉ đơn cần giao khi bật filter
  const displayGroups = useMemo(() => {
    if (userRole === "duocsi" && duocsiFilter)
      return grouped.filter(g => g.payment_status === "Da thanh toan" && g.dispense_status === "Chua giao");
    return grouped;
  }, [grouped, userRole, duocsiFilter]);

  // Lọc thuốc theo loại thuốc đã chọn
  const getThuocByLoai = (malt) => {
    if (!malt) return [];
    return thuocList.filter(t => String(t.malt) === String(malt));
  };

  const openAdd = () => {
    setEditItem(null);
    setFormMapk("");
    setFormLines([{ ...emptyLine }]);
    setFormErrors({});
    setShowModal(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ malt: item.malt || "", mat: item.mat, soluong: item.soluong, lieudung: item.lieudung || "" });
    setFormErrors({});
    setShowModal(true);
  };

  const updateLine = (idx, field, value) => {
    setFormLines(prev => prev.map((l, i) => {
      if (i !== idx) return l;
      const updated = { ...l, [field]: value };
      if (field === "malt") updated.mat = "";
      return updated;
    }));
  };
  const addLine = () => setFormLines(prev => [...prev, { ...emptyLine }]);
  const removeLine = (idx) => {
    if (formLines.length <= 1) return;
    setFormLines(prev => prev.filter((_, i) => i !== idx));
  };

  const validateAdd = () => {
    const errs = {};
    if (!formMapk) errs.mapk = "Vui lòng chọn phiếu khám";
    const lineErrs = formLines.map(l => {
      const e = {};
      if (!l.malt) e.malt = true;
      if (!l.mat) e.mat = true;
      if (!l.soluong || Number(l.soluong) <= 0) e.soluong = true;
      return e;
    });
    const hasLineErr = lineErrs.some(e => Object.keys(e).length > 0);
    if (hasLineErr) errs.lines = lineErrs;
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const validateEdit = () => {
    const errs = {};
    if (!form.malt) errs.malt = "Vui lòng chọn loại thuốc";
    if (!form.mat) errs.mat = "Vui lòng chọn thuốc";
    if (!form.soluong || Number(form.soluong) <= 0) errs.soluong = "Số lượng phải > 0";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (editItem) {
      if (!validateEdit()) return;
      setSubmitting(true);
      const payload = { mat: Number(form.mat), soluong: Number(form.soluong), lieudung: form.lieudung };
      axios.put(`http://localhost:4000/api/don-thuoc/${editItem.mact}`, payload, { withCredentials: true })
        .then(() => { message.success("Cập nhật thành công!"); setShowModal(false); loadData(); })
        .catch(err => message.error(err.response?.data?.message || "Có lỗi xảy ra!"))
        .finally(() => setSubmitting(false));
    } else {
      if (!validateAdd()) return;
      setSubmitting(true);
      const items = formLines.filter(l => l.mat && Number(l.soluong) > 0).map(l => ({ mat: Number(l.mat), soluong: Number(l.soluong), lieudung: l.lieudung }));
      axios.post("http://localhost:4000/api/don-thuoc", { mapk: Number(formMapk), items }, { withCredentials: true })
        .then(() => { message.success(`Kê đơn thành công (${items.length} thuốc)!`); setShowModal(false); loadData(); })
        .catch(err => message.error(err.response?.data?.message || "Có lỗi xảy ra!"))
        .finally(() => setSubmitting(false));
    }
  };

  const handleDelete = () => {
    if (!showConfirm) return;
    axios.delete(`http://localhost:4000/api/don-thuoc/${showConfirm.mact}`, { withCredentials: true })
      .then(() => { message.success("Xóa thành công!"); setShowConfirm(null); loadData(); })
      .catch(err => message.error(err.response?.data?.message || "Không thể xóa!"));
  };

  const handleGiaoThuoc = () => {
    if (!showGiaoConfirm) return;
    axios.put(`http://localhost:4000/api/don-thuoc/giao/${showGiaoConfirm.madt}`, {}, { withCredentials: true })
      .then(() => { message.success("Đã xác nhận giao thuốc!"); setShowGiaoConfirm(null); loadData(); })
      .catch(err => message.error(err.response?.data?.message || "Có lỗi xảy ra!"));
  };

  const handleTinhTien = () => {
    if (!tongTienMapk) { message.warning("Vui lòng chọn phiếu khám!"); return; }
    axios.get(`http://localhost:4000/api/don-thuoc/tong-tien/${tongTienMapk}`, { withCredentials: true })
      .then(res => setTongTien(res.data.tongtien))
      .catch(() => message.error("Lỗi tính tiền!"));
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          <div className="page-topbar">
            <div>
              <h1>Quản lý Đơn thuốc</h1>
              <p>Kê đơn, cập nhật và quản lý đơn thuốc theo phiếu khám.</p>
            </div>
            {canEdit && <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-prescription-bottle-alt"></i> Kê đơn thuốc
            </button>}
          </div>

          {/* Tính tiền thuốc theo mã PK */}
          <div className="tinh-tien-bar">
            <div className="tinh-tien-group">
              <select value={tongTienMapk} onChange={e => { setTongTienMapk(e.target.value); setTongTien(null); }} style={{ minWidth: "280px" }}>
                <option value="">-- Chọn phiếu khám --</option>
                {phieuKhamList.map(pk => (
                  <option key={pk.mapk} value={pk.mapk}>
                    PK-{String(pk.mapk).padStart(3, "0")} | BN-{String(pk.mabn).padStart(3, "0")} | {pk.tenbn} | {pk.lydokham}
                  </option>
                ))}
              </select>
              <button className="btn-green" onClick={handleTinhTien}><i className="fas fa-calculator"></i> Tính tiền thuốc</button>
            </div>
            {tongTien !== null && (
              <div className="tinh-tien-result">
                Tổng tiền thuốc PK <strong>#{tongTienMapk}</strong>: <span className="tong-tien-value">{Number(tongTien).toLocaleString()} đ</span>
              </div>
            )}
          </div>

          <div className="table-container">
            <div className="table-toolbar" style={{ justifyContent: "space-between" }}>
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm theo mã PK, tên BN, loại thuốc, tên thuốc..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {userRole === "duocsi" && (
                  <label className="filter-toggle">
                    <input type="checkbox" checked={duocsiFilter} onChange={e => setDuocsiFilter(e.target.checked)} />
                    <span>Chỉ xem đơn cần giao</span>
                  </label>
                )}
                <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Tổng: <strong style={{ color: "#2563eb" }}>{displayGroups.length}</strong> đơn thuốc</div>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "2.5rem" }}></th>
                    <th>Mã ĐT</th>
                    <th>Mã PK</th>
                    <th>Bệnh nhân</th>
                    <th style={{ textAlign: "center" }}>Số thuốc</th>
                    <th style={{ textAlign: "center" }}>Thanh toán</th>
                    <th style={{ textAlign: "center" }}>Giao thuốc</th>
                    {userRole === "duocsi" && <th style={{ textAlign: "center" }}>Thảo tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {displayGroups.length === 0 ? (
                    <tr><td colSpan={userRole === "duocsi" ? 8 : 7} className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
                  ) : displayGroups.map(g => {
                    const isOpen = expandedDt === g.madt;
                    return (
                      <React.Fragment key={g.madt}>
                        <tr className={`dt-row-master ${isOpen ? "dt-row-active" : ""}`} onClick={() => setExpandedDt(isOpen ? null : g.madt)} style={{ cursor: "pointer" }}>
                          <td style={{ textAlign: "center", fontSize: "0.8rem", color: "#6b7280" }}>
                            <i className={`fas fa-chevron-${isOpen ? "down" : "right"}`}></i>
                          </td>
                          <td className="code-cell">ĐT-{String(g.madt).padStart(3, "0")}</td>
                          <td className="code-cell">PK-{String(g.mapk).padStart(3, "0")}</td>
                          <td>{g.tenbn || "—"}</td>
                          <td style={{ textAlign: "center", fontWeight: 600, color: "#2563eb" }}>{g.items.length}</td>
                          <td style={{ textAlign: "center" }}>
                            <span className={`status-badge ${g.payment_status === "Da thanh toan" ? "badge-paid" : "badge-unpaid"}`}>
                              {g.payment_status === "Da thanh toan" ? "Đã TT" : "Chưa TT"}
                            </span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <span className={`status-badge ${g.dispense_status === "Da giao" ? "badge-dispensed" : "badge-pending"}`}>
                              {g.dispense_status === "Da giao" ? "Đã giao" : "Chưa giao"}
                            </span>
                          </td>
                          {userRole === "duocsi" && (
                            <td style={{ textAlign: "center" }} onClick={e => e.stopPropagation()}>
                              {g.payment_status === "Da thanh toan" && g.dispense_status === "Chua giao" && (
                                <button className="btn-giao" onClick={() => setShowGiaoConfirm(g)}>
                                  <i className="fas fa-box-open"></i> Giao thuốc
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                        {isOpen && (
                          <tr className="dt-row-detail">
                            <td colSpan={userRole === "duocsi" ? 8 : 7} style={{ padding: 0 }}>
                              <div className="dt-detail-wrapper">
                                <table className="dt-detail-table">
                                  <thead>
                                    <tr>
                                      <th>Loại thuốc</th>
                                      <th>Tên thuốc</th>
                                      <th style={{ textAlign: "center" }}>Số lượng</th>
                                      <th>Liều dùng</th>
                                      <th style={{ textAlign: "right" }}>Đơn giá</th>
                                      <th style={{ textAlign: "right" }}>Thành tiền</th>
                                      {canEdit && <th style={{ textAlign: "right" }}>Thao tác</th>}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {g.items.map(item => (
                                      <tr key={item.mact}>
                                        <td>{item.tenlt || "—"}</td>
                                        <td>{item.tent || "—"}</td>
                                        <td style={{ textAlign: "center" }}>{item.soluong}</td>
                                        <td>{item.lieudung || "—"}</td>
                                        <td style={{ textAlign: "right", color: "#059669", fontWeight: 600 }}>{item.dongia ? Number(item.dongia).toLocaleString() + " đ" : "—"}</td>
                                        <td style={{ textAlign: "right", fontWeight: 700, color: "#2563eb" }}>{item.dongia ? (item.soluong * item.dongia).toLocaleString() + " đ" : "—"}</td>
                                        {canEdit && <td>
                                          <div className="action-btns">
                                            <button className="btn-edit" title="Sửa" onClick={(e) => { e.stopPropagation(); openEdit(item); }}><i className="fas fa-pen"></i></button>
                                            <button className="btn-delete" title="Xóa" onClick={(e) => { e.stopPropagation(); setShowConfirm(item); }}><i className="fas fa-trash"></i></button>
                                          </div>
                                        </td>}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>{displayGroups.length}</strong> đơn thuốc</div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-form modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3><i className="fas fa-prescription-bottle-alt" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>{editItem ? "Cập nhật Đơn thuốc" : "Kê đơn thuốc mới"}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-form-body">
              {/* Chọn phiếu khám từ combobox - chỉ hiển thị khi thêm mới */}
              {!editItem && (
                <div className="form-group">
                  <label>Phiếu khám <span className="required">*</span></label>
                  <select value={formMapk} onChange={(e) => setFormMapk(e.target.value)} className={formErrors.mapk ? "input-error" : ""}>
                    <option value="">-- Chọn phiếu khám --</option>
                    {phieuKhamList.map(pk => (
                      <option key={pk.mapk} value={pk.mapk}>
                        PK-{String(pk.mapk).padStart(3, "0")} | BN-{String(pk.mabn).padStart(3, "0")} | {pk.tenbn} | {pk.lydokham}
                      </option>
                    ))}
                  </select>
                  {formErrors.mapk && <div className="error-text">{formErrors.mapk}</div>}
                </div>
              )}

              {editItem ? (
                /* === SỬA: chọn loại thuốc → chọn thuốc === */
                <>
                  <div className="form-group">
                    <label>Loại thuốc <span className="required">*</span></label>
                    <select value={form.malt} onChange={(e) => setForm({ ...form, malt: e.target.value, mat: "" })} className={formErrors.malt ? "input-error" : ""}>
                      <option value="">-- Chọn loại thuốc --</option>
                      {loaiThuocList.map(lt => <option key={lt.malt} value={lt.malt}>{lt.tenlt}</option>)}
                    </select>
                    {formErrors.malt && <div className="error-text">{formErrors.malt}</div>}
                  </div>
                  <div className="form-group">
                    <label>Thuốc <span className="required">*</span></label>
                    <select value={form.mat} onChange={(e) => setForm({ ...form, mat: e.target.value })} className={formErrors.mat ? "input-error" : ""} disabled={!form.malt}>
                      <option value="">-- Chọn thuốc --</option>
                      {getThuocByLoai(form.malt).map(t => <option key={t.mat} value={t.mat}>{t.tent} ({t.donvi} — {Number(t.dongia).toLocaleString()}đ)</option>)}
                    </select>
                    {formErrors.mat && <div className="error-text">{formErrors.mat}</div>}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Số lượng <span className="required">*</span></label>
                      <input type="number" min="1" value={form.soluong} onChange={(e) => setForm({ ...form, soluong: e.target.value })} className={formErrors.soluong ? "input-error" : ""} />
                      {formErrors.soluong && <div className="error-text">{formErrors.soluong}</div>}
                    </div>
                    <div className="form-group">
                      <label>Liều dùng</label>
                      <input type="text" placeholder="VD: Sau ăn, 2 lần/ngày" value={form.lieudung} onChange={(e) => setForm({ ...form, lieudung: e.target.value })} />
                    </div>
                  </div>
                </>
              ) : (
                /* === THÊM MỚI: nhiều dòng thuốc, mỗi dòng chọn loại → chọn thuốc === */
                <>
                  <div className="drug-lines-header">
                    <label style={{ fontWeight: 600, fontSize: "0.95rem" }}>Danh sách thuốc kê đơn</label>
                    <button type="button" className="btn-add-line" onClick={addLine}><i className="fas fa-plus"></i> Thêm dòng</button>
                  </div>
                  <div className="drug-lines">
                    {formLines.map((line, idx) => {
                      const lineErr = formErrors.lines?.[idx] || {};
                      return (
                        <div className="drug-line" key={idx}>
                          <span className="drug-line-no">{idx + 1}</span>
                          <div className="drug-line-fields">
                            <select value={line.malt} onChange={(e) => updateLine(idx, "malt", e.target.value)} className={lineErr.malt ? "input-error" : ""}>
                              <option value="">-- Loại thuốc --</option>
                              {loaiThuocList.map(lt => <option key={lt.malt} value={lt.malt}>{lt.tenlt}</option>)}
                            </select>
                            <select value={line.mat} onChange={(e) => updateLine(idx, "mat", e.target.value)} className={lineErr.mat ? "input-error" : ""} disabled={!line.malt}>
                              <option value="">-- Chọn thuốc --</option>
                              {getThuocByLoai(line.malt).map(t => <option key={t.mat} value={t.mat}>{t.tent} ({t.donvi} — {Number(t.dongia).toLocaleString()}đ)</option>)}
                            </select>
                            <input type="number" min="1" placeholder="SL" value={line.soluong} onChange={(e) => updateLine(idx, "soluong", e.target.value)} className={lineErr.soluong ? "input-error" : ""} style={{ width: "80px" }} />
                            <input type="text" placeholder="Liều dùng" value={line.lieudung} onChange={(e) => updateLine(idx, "lieudung", e.target.value)} style={{ flex: 1, minWidth: "120px" }} />
                          </div>
                          <button type="button" className="btn-remove-line" onClick={() => removeLine(idx)} title="Xóa dòng" disabled={formLines.length <= 1}>
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <div className="modal-form-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-save" onClick={handleSave} disabled={submitting}><i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>{submitting ? "Đang lưu..." : (editItem ? "Lưu" : `Kê đơn (${formLines.filter(l => l.mat && l.soluong > 0).length} thuốc)`)}</button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon"><i className="fas fa-exclamation-triangle"></i></div>
            <h3>Xóa thuốc khỏi đơn?</h3>
            <p>Bạn có chắc muốn xóa <strong>{showConfirm.tent}</strong> khỏi đơn?</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowConfirm(null)}>Hủy</button>
              <button className="btn-danger" onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      {showGiaoConfirm && (
        <div className="modal-overlay" onClick={() => setShowGiaoConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon confirm-icon-green"><i className="fas fa-box-open"></i></div>
            <h3>Xác nhận giao thuốc</h3>
            <p>Xác nhận đã giao thuốc đơn <strong>ĐT-{String(showGiaoConfirm.madt).padStart(3, "0")}</strong> cho bệnh nhân <strong>{showGiaoConfirm.tenbn}</strong>?</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowGiaoConfirm(null)}>Hủy</button>
              <button className="btn-giao-confirm" onClick={handleGiaoThuoc}><i className="fas fa-check"></i> Xác nhận giao</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
