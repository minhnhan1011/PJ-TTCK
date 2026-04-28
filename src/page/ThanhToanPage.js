import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./ThanhToanPage.css";

const generateMaPT = () => {
  const now = new Date();
  return `PT${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${Date.now().toString().slice(-4)}`;
};

const formatVND = (num) => Number(num).toLocaleString("vi-VN") + " VNĐ";

export default function ThanhToanPage() {
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [phieuthu, setPhieuthu] = useState([]);
  const [thongke, setThongke] = useState({
    tongHoaDon: 0,
    doanhThu: 0,
    choThanhToan: 0,
    daThanhToan: 0,
  });
  const [benhnhan, setBenhnhan] = useState([]);
  const [chiPhiDetail, setChiPhiDetail] = useState(null);
  const [loadingChiPhi, setLoadingChiPhi] = useState(false);
  const invoiceRef = useRef(null);

  const [form, setForm] = useState({
    mapt: generateMaPT(),
    mapk: "",
    manv: 1,
    tongtien: "",
    trangthai: "Da thanh toan",
    ghichu: "",
    hoten: "",
    ngaythu: new Date().toLocaleDateString("vi-VN"),
  });

  useEffect(() => {
    fetchPhieuthu();
    fetchThongke();
    fetchBenhnhan();
  }, []);

  useEffect(() => {
    if (benhnhan.length === 0) return;
    const raw = localStorage.getItem("thanhtoan_prefill");
    if (!raw) return;
    try {
      const prefill = JSON.parse(raw);
      setForm((prev) => ({
        ...prev,
        mapt: generateMaPT(),
        mapk: prefill.mapk ? String(prefill.mapk) : "",
        hoten: prefill.hoten ?? "",
        tongtien: prefill.tongTien ?? "",
        ghichu: "",
      }));
      setShowModal(true);
    } catch (e) {
      console.error("Lỗi đọc prefill:", e);
    }
    localStorage.removeItem("thanhtoan_prefill");
  }, [benhnhan]);

  const fetchPhieuthu = () => {
    axios
      .get("http://localhost:4000/phieuthu")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setPhieuthu(data);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  };

  const fetchThongke = () => {
    axios
      .get("http://localhost:4000/thongke/homay")
      .then((res) => setThongke(res.data))
      .catch((err) => console.log(err));
  };

  const fetchBenhnhan = () => {
    axios
      .get("http://localhost:4000/phieukham")
      .then((res) => setBenhnhan(res.data))
      .catch((err) => console.log("Lỗi fetch:", err));
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "mapk") {
      const selectedPK = benhnhan.find((p) => Number(p.mapk) === Number(value));
      setForm((prev) => ({
        ...prev,
        mapk: value,
        hoten: selectedPK ? selectedPK.hoten : "",
        tongtien: "",
      }));
      setChiPhiDetail(null);

      if (selectedPK?.madk) {
        setLoadingChiPhi(true);
        axios
          .get(`http://localhost:4000/api/chi-phi-kham/${selectedPK.madk}`, {
            withCredentials: true,
          })
          .then((res) => {
            setForm((prev) => ({ ...prev, tongtien: res.data.tongTien }));
            setChiPhiDetail(res.data.chiTiet || []);
          })
          .catch((err) => {
            console.error("Lỗi lấy chi phí:", err);
            setChiPhiDetail([]);
          })
          .finally(() => setLoadingChiPhi(false));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

 const handleThanhToan = (e) => {
  e.preventDefault();
  if (!form.mapk || !form.tongtien) {
    alert("Vui lòng nhập đầy đủ thông tin bệnh nhân và tổng tiền!");
    return;
  }
    const finalData = {
      mapt: form.mapt,
      mapk: form.mapk,
      manv: form.manv,
      tongtien: form.tongtien,
      trangthai: form.trangthai,
      ghichu: form.ghichu,
      hoten: form.hoten,
      ngaythu: new Date().toISOString().split("T")[0],
    };
    axios
    .post("http://localhost:4000/themphieuthu", finalData)
    .then(() => {
      alert("Thanh toán thành công!");
      
      setShowModal(false); 
      fetchPhieuthu();
      fetchThongke();
      fetchBenhnhan();
    })
    .catch((err) => {
        console.error("Chi tiết lỗi:", err.response?.data || err.message);
        alert("Có lỗi xảy ra khi lưu vào database! Hãy kiểm tra mã phiếu khám.");
      });
  };

  const handleHuy = (mapt) => {
    axios
      .post(`http://localhost:4000/huyphieuthu/${mapt}`)
      .then(() => {
        setShowConfirm(null);
        fetchPhieuthu();
        fetchThongke();
      })
      .catch((err) => console.log(err));
  };

  // ✅ MỚI: Xóa phiếu thu
  const handleXoa = (mapt) => {
    axios
      .delete(`http://localhost:4000/xoaphieuthu/${mapt}`)
      .then(() => {
        setShowDeleteConfirm(null);
        fetchPhieuthu();
        fetchThongke();
      })
      .catch((err) => {
        console.error("Lỗi xóa:", err);
        alert("Có lỗi khi xóa phiếu thu!");
      });
  };

  const handlePrint = () => {
    const content = invoiceRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <meta charset="UTF-8"/>
          <title>Hóa đơn</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; font-size: 14px; }
            h3 { margin: 0 0 4px; font-size: 18px; }
            p { margin: 2px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { padding: 8px; border: 1px solid #ddd; }
            th { background: #f3f4f6; }
            tfoot td { font-weight: bold; font-size: 15px; }
            .center { text-align: center; }
            .right { text-align: right; }
            .meta { margin: 12px 0; }
            .meta-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #eee; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-style: italic; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  const filteredPhieuthu = phieuthu.filter(
    (pt) =>
      (pt.mapt && String(pt.mapt).toLowerCase().includes(search.toLowerCase())) ||
      (pt.hoten && pt.hoten.toLowerCase().includes(search.toLowerCase()))
  );

  const trangthaiColor = (tt) => {
    if (!tt) return {};
    if (tt.includes("thanh toan") || tt.includes("Thanh toán"))
      return { color: "#16a34a", background: "#dcfce7", padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 };
    if (tt.includes("huy") || tt.includes("Hủy"))
      return { color: "#dc2626", background: "#fee2e2", padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 };
    return { color: "#d97706", background: "#fef3c7", padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 };
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">

          {/* ===== TOP BAR ===== */}
          <div className="page-topbar">
            <div>
              <h1>Thanh toán Dịch vụ</h1>
              <p>Xử lý thanh toán cho bệnh nhân và dịch vụ y tế.</p>
            </div>
            <button
              className="btn-green"
              onClick={() => {
                setForm({
                  mapt: generateMaPT(),
                  mapk: "",
                  manv: 1,
                  tongtien: "",
                  trangthai: "Da thanh toan",
                  ghichu: "",
                  hoten: "",
                  ngaythu: new Date().toLocaleDateString("vi-VN"),
                });
                setChiPhiDetail(null);
                setShowModal(true);
              }}
            >
              <i className="fas fa-plus"></i> Tạo Hóa đơn mới
            </button>
          </div>

          {/* ===== STATS ===== */}
          <div className="stat-cards">
            <div className="stat-card green">
              <div className="stat-label">Hóa đơn hôm nay</div>
              <div className="stat-number">{thongke.tongHoaDon || 0}</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-label">Doanh thu hôm nay</div>
              <div className="stat-number">{Number(thongke.doanhThu || 0).toLocaleString("vi-VN")}</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Chờ thanh toán</div>
              <div className="stat-number">{thongke.choThanhToan || 0}</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Đã thanh toán</div>
              <div className="stat-number">{thongke.daThanhToan || 0}</div>
            </div>
          </div>

          {/* ===== TWO COL: FORM + INVOICE PREVIEW ===== */}
          <div className="two-col-layout">

            {/* LEFT: Form thanh toán */}
            <div className="panel">
              <h2>Thông tin Thanh toán</h2>
              <form onSubmit={handleThanhToan}>
                <div style={{ marginBottom: "1rem" }}>
                  <label className="field-label">Chọn Phiếu Khám *</label>
                  <select
                    name="mapk"
                    value={form.mapk}
                    onChange={handleInput}
                    className="field-input"
                    required
                  >
                    <option value="">-- Chọn bệnh nhân cần thanh toán --</option>
                    {benhnhan.map((item) => (
                      <option key={item.mapk} value={String(item.mapk)}>
                        Mã PK: {item.mapk} - {item.hoten}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label className="field-label">Tổng tiền (VNĐ) <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    className="field-input"
                    name="tongtien"
                    placeholder="Nhập số tiền..."
                    value={form.tongtien}
                    onChange={handleInput}
                    min="0"
                    required
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label className="field-label">Phương thức thanh toán</label>
                  <div className="payment-methods">
                    <label>
                      <input type="radio" name="payment" defaultChecked />
                      <i className="fas fa-money-bill-wave" style={{ color: "#16a34a", marginRight: "0.25rem" }}></i>
                      Tiền mặt
                    </label>
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label className="field-label">Ghi chú</label>
                  <textarea
                    className="field-textarea"
                    name="ghichu"
                    placeholder="Nhập ghi chú nếu có..."
                    rows="3"
                    value={form.ghichu}
                    onChange={handleInput}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  <i className="fas fa-check"></i> Xác nhận Thanh toán
                </button>
              </form>
            </div>

            {/* RIGHT: Invoice preview */}
            <div className="panel">
              <h2>Hóa đơn</h2>
              <div className="invoice-preview" ref={invoiceRef}>
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "1.1rem" }}>ClinicFlow</h3>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>123 Nguyễn Văn Linh, Q7, TP.HCM</p>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>ĐT: 0123 456 789</p>
                </div>
                <div className="invoice-meta">
                  <div className="meta-row">
                    <span>Mã hóa đơn:</span>
                    <span style={{ fontWeight: 500 }}>{form.mapt || "--"}</span>
                  </div>
                  <div className="meta-row">
                    <span>Ngày:</span>
                    <span>{form.ngaythu}</span>
                  </div>
                  <div className="meta-row">
                    <span>Bệnh nhân:</span>
                    <span>{form.hoten || "--"}</span>
                  </div>
                  <div className="meta-row">
                    <span>Phương thức:</span>
                    <span>Tiền mặt</span>
                  </div>
                  {form.ghichu && (
                    <div className="meta-row">
                      <span>Ghi chú:</span>
                      <span>{form.ghichu}</span>
                    </div>
                  )}
                </div>
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Dịch vụ</th>
                      <th style={{ textAlign: "right" }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chiPhiDetail && chiPhiDetail.length > 0 ? (
                      chiPhiDetail.map((item, i) => (
                        <tr key={i}>
                          <td>
                            <span style={{ fontSize: 12, color: "#6b7280" }}>
                              [{item.loai === "Thuoc" ? "Thuốc" : "Dịch vụ"}]
                            </span>{" "}
                            {item.ten} × {item.soluong}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {Number(item.thanh_tien).toLocaleString("vi-VN")}
                          </td>
                        </tr>
                      ))
                    ) : form.tongtien ? (
                      <tr>
                        <td>Dịch vụ khám chữa bệnh</td>
                        <td style={{ textAlign: "right" }}>{formatVND(form.tongtien)}</td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan="2" style={{ textAlign: "center", color: "#9ca3af" }}>Chưa có dữ liệu</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Tổng cộng</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        {form.tongtien ? formatVND(form.tongtien) : "0 VNĐ"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#6b7280", marginTop: "1rem" }}>
                  Cảm ơn quý khách đã sử dụng dịch vụ!
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={handlePrint}>
                  <i className="fas fa-print"></i> In hóa đơn
                </button>
                <button className="btn-secondary green" style={{ flex: 1 }} onClick={handlePrint}>
                  <i className="fas fa-download"></i> Tải PDF
                </button>
              </div>
            </div>
          </div>

          {/* ===== DANH SÁCH PHIẾU THU ===== */}
          <div className="table-container" style={{ marginTop: "1.5rem" }}>
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  placeholder="Tìm theo mã hóa đơn, tên BN..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã phiếu thu</th>
                    {/* ✅ ĐÃ SỬA: Bệnh nhân lấy đúng từ JOIN phieukham→dangkykham→benhnhan */}
                    <th>Bệnh nhân</th>
                    <th>Mã PK</th>
                    <th style={{ textAlign: "right" }}>Tổng tiền (VNĐ)</th>
                    <th>Ngày thu</th>
                    <th>Nhân viên</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: "center" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPhieuthu.length > 0 ? (
                    filteredPhieuthu.map((pt, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: "#1d4ed8", fontSize: 13 }}>{pt.mapt}</td>
                        {/* ✅ hoten giờ lấy đúng từ benhnhan qua join ở backend */}
                        <td>{pt.hoten || <span style={{ color: "#9ca3af" }}>--</span>}</td>
                        <td>{pt.mapk}</td>
                        <td style={{ textAlign: "right", fontWeight: 500 }}>
                          {Number(pt.tongtien).toLocaleString("vi-VN")}
                        </td>
                        <td>
                          {pt.ngaythu ? new Date(pt.ngaythu).toLocaleString("vi-VN") : "--"}
                        </td>
                        <td>{pt.manv}</td>
                        <td>
                          <span style={trangthaiColor(pt.trangthai)}>{pt.trangthai}</span>
                        </td>
                        {/* ✅ MỚI: Cả nút Hủy lẫn nút Xóa */}
                        <td>
                          <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap" }}>
                            {pt.trangthai !== "Da huy" && (
                              <button
                                className="btn btn-danger btn-sm"
                                style={{
                                  background: "#fff7ed",
                                  color: "#c2410c",
                                  border: "1px solid #fed7aa",
                                  borderRadius: 6,
                                  padding: "4px 10px",
                                  fontSize: 12,
                                  cursor: "pointer",
                                  fontWeight: 500,
                                }}
                                onClick={() => setShowConfirm(pt.mapt)}
                              >
                                <i className="fas fa-ban" style={{ marginRight: 4 }}></i>Hủy
                              </button>
                            )}
                            <button
                              style={{
                                background: "#fef2f2",
                                color: "#dc2626",
                                border: "1px solid #fca5a5",
                                borderRadius: 6,
                                padding: "4px 10px",
                                fontSize: 12,
                                cursor: "pointer",
                                fontWeight: 500,
                              }}
                              onClick={() => setShowDeleteConfirm(pt.mapt)}
                            >
                              <i className="fas fa-trash" style={{ marginRight: 4 }}></i>Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="empty-state">
                        <p>Chưa có dữ liệu</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "0.75rem 1rem", color: "#6b7280", fontSize: 14 }}>
              Hiển thị <strong>{filteredPhieuthu.length}</strong> phiếu thu
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL TẠO HÓA ĐƠN MỚI ===== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-form"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 520 }}
          >
            <div className="modal-form-header">
              <h3>
                <i className="fas fa-file-invoice" style={{ marginRight: "0.5rem", color: "#16a34a" }}></i>
                Tạo Hóa đơn mới
              </h3>
              <button className="btn-close" onClick={() => { setShowModal(false); setChiPhiDetail(null); }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleThanhToan}>
              <div className="modal-form-body">

                <div className="form-group">
                  <label>Mã phiếu thu</label>
                  <input
                    type="text"
                    className="field-input"
                    value={form.mapt}
                    readOnly
                    style={{ background: "#f3f4f6", cursor: "not-allowed" }}
                  />
                </div>

                <div className="form-group">
                  <label>Bệnh nhân <span style={{ color: "red" }}>*</span></label>
                  <select
                    className="field-input"
                    name="mapk"
                    value={form.mapk}
                    onChange={handleInput}
                    required
                  >
                    <option value="">-- Chọn phiếu khám cần thu --</option>
                    {benhnhan.map((pk) => (
                      <option key={pk.mapk} value={String(pk.mapk)}>
                        {pk.hoten || "Bệnh nhân"} (Mã PK: {pk.mapk})
                      </option>
                    ))}
                  </select>
                </div>

                {form.hoten && (
                  <div style={{
                    background: "#f0fdf4", border: "1px solid #bbf7d0",
                    borderRadius: 8, padding: "10px 14px", marginBottom: "1rem",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <i className="fas fa-user-check" style={{ color: "#16a34a" }} />
                    <span style={{ color: "#15803d", fontWeight: 500 }}>{form.hoten}</span>
                  </div>
                )}

                {loadingChiPhi && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    color: "#6b7280", fontSize: 13, marginBottom: "1rem",
                    padding: "8px 12px", background: "#f9fafb", borderRadius: 6,
                  }}>
                    <i className="fas fa-spinner fa-spin" style={{ color: "#16a34a" }}></i>
                    Đang tính chi phí...
                  </div>
                )}

                {!loadingChiPhi && chiPhiDetail && chiPhiDetail.length > 0 && (
                  <div className="form-group">
                    <label>Chi tiết chi phí</label>
                    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", marginBottom: "0.5rem" }}>
                      <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "#f3f4f6" }}>
                            <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Loại</th>
                            <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Tên</th>
                            <th style={{ padding: "6px 10px", textAlign: "center", fontWeight: 600, color: "#374151" }}>SL</th>
                            <th style={{ padding: "6px 10px", textAlign: "right", fontWeight: 600, color: "#374151" }}>Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chiPhiDetail.map((item, i) => (
                            <tr key={i} style={{ borderTop: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                              <td style={{ padding: "6px 10px" }}>
                                <span style={{
                                  background: item.loai === "Thuoc" ? "#dbeafe" : "#fef9c3",
                                  color: item.loai === "Thuoc" ? "#1d4ed8" : "#92400e",
                                  borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 600,
                                }}>
                                  {item.loai === "Thuoc" ? "Thuốc" : "Dịch vụ"}
                                </span>
                              </td>
                              <td style={{ padding: "6px 10px", color: "#374151" }}>{item.ten}</td>
                              <td style={{ padding: "6px 10px", textAlign: "center", color: "#6b7280" }}>{item.soluong}</td>
                              <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 500, color: "#111827" }}>
                                {Number(item.thanh_tien).toLocaleString("vi-VN")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {!loadingChiPhi && chiPhiDetail && chiPhiDetail.length === 0 && form.mapk && (
                  <div style={{
                    background: "#fffbeb", border: "1px solid #fde68a",
                    borderRadius: 8, padding: "10px 14px", marginBottom: "1rem",
                    fontSize: 13, color: "#92400e", display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <i className="fas fa-exclamation-triangle" style={{ color: "#d97706" }}></i>
                    Không tìm thấy chi tiết chi phí. Vui lòng nhập tổng tiền thủ công.
                  </div>
                )}

                <div className="form-group">
                  <label>Tổng tiền (VNĐ) <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="number"
                    className="field-input"
                    name="tongtien"
                    placeholder="Nhập số tiền..."
                    value={form.tongtien}
                    onChange={handleInput}
                    min="0"
                    required
                    style={chiPhiDetail && chiPhiDetail.length > 0
                      ? { background: "#f0fdf4", fontWeight: 600, color: "#15803d" }
                      : {}}
                  />
                  {chiPhiDetail && chiPhiDetail.length > 0 && (
                    <span style={{ fontSize: 12, color: "#16a34a", marginTop: 4, display: "block" }}>
                      <i className="fas fa-check-circle"></i> Đã tự động tính từ đơn thuốc &amp; dịch vụ
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Phương thức</label>
                  <input
                    type="text"
                    className="field-input"
                    value="Tiền mặt"
                    readOnly
                    style={{ background: "#f3f4f6" }}
                  />
                </div>

                <div className="form-group">
                  <label>Ghi chú</label>
                  <textarea
                    className="field-textarea"
                    name="ghichu"
                    rows="2"
                    placeholder="Ghi chú nếu có..."
                    value={form.ghichu}
                    onChange={handleInput}
                  />
                </div>
              </div>

              <div className="modal-form-footer">
                <button type="button" className="btn-cancel" onClick={() => { setShowModal(false); setChiPhiDetail(null); }}>
                  Hủy
                </button>
                <button type="submit" className="btn-save">
                  <i className="fas fa-check" style={{ marginRight: "0.4rem" }}></i>
                  Xác nhận Thanh toán
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== CONFIRM HỦY PHIẾU ===== */}
      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Hủy Phiếu thu?</h3>
            <p>
              Trạng thái phiếu thu <strong>{showConfirm}</strong> sẽ được cập nhật thành "Đã hủy".
            </p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowConfirm(null)}>Đóng</button>
              <button className="btn-danger" onClick={() => handleHuy(showConfirm)}>Xác nhận hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ✅ MỚI: CONFIRM XÓA PHIẾU ===== */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon" style={{ color: "#dc2626", background: "#fee2e2" }}>
              <i className="fas fa-trash"></i>
            </div>
            <h3>Xóa Phiếu thu?</h3>
            <p>
              Phiếu thu <strong>{showDeleteConfirm}</strong> sẽ bị{" "}
              <span style={{ color: "#dc2626", fontWeight: 600 }}>xóa vĩnh viễn</span>{" "}
              khỏi hệ thống. Hành động này <strong>không thể hoàn tác</strong>.
            </p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(null)}>Đóng</button>
              <button
                className="btn-danger"
                style={{ background: "#dc2626" }}
                onClick={() => handleXoa(showDeleteConfirm)}
              >
                <i className="fas fa-trash" style={{ marginRight: 4 }}></i>
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
