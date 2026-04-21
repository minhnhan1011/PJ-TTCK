import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./ThanhToanPage.css";

// Tạo mã phiếu thu tự động
const generateMaPT = () => {
  const now = new Date();
  return `PT${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${Date.now().toString().slice(-4)}`;
};

const formatVND = (num) => Number(num).toLocaleString("vi-VN") + " VNĐ";

export default function ThanhToanPage() {
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [phieuthu, setPhieuthu] = useState([]);
  const [thongke, setThongke] = useState({
    tongHoaDon: 0,
    doanhThu: 0,
    choThanhToan: 0,
    daThanhToan: 0,
  });
  const [benhnhan, setBenhnhan] = useState([]);
  const invoiceRef = useRef(null);

  // Form state
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

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    fetchPhieuthu();
    fetchThongke();
    fetchBenhnhan();
  }, []);

  // ===== ĐỌC DỮ LIỆU PREFILL TỪ KHAMBENHPAGE =====
  // Chạy sau khi benhnhan đã được load để đảm bảo dropdown hiển thị đúng
  useEffect(() => {
    if (benhnhan.length === 0) return; // Chờ danh sách bệnh nhân load xong

    const raw = localStorage.getItem("thanhtoan_prefill");
    if (!raw) return;

    try {
      const prefill = JSON.parse(raw);

      // Tự động mở modal tạo hóa đơn nếu có prefill
      setForm((prev) => ({
        ...prev,
        mapt: generateMaPT(),
        mapk: prefill.mapk ? String(prefill.mapk) : "",
        hoten: prefill.hoten ?? "",
        tongtien: prefill.tongTien ?? "",
        ghichu: "",
      }));

      // Mở modal để người dùng xác nhận trước khi thanh toán
      setShowModal(true);
    } catch (e) {
      console.error("Lỗi đọc prefill:", e);
    }

    // Xóa sau khi đọc để tránh tự động điền lại lần sau
    localStorage.removeItem("thanhtoan_prefill");
  }, [benhnhan]);
  // ===================================================

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
      .then((res) => {
        setBenhnhan(res.data);
      })
      .catch((err) => console.log("Lỗi fetch:", err));
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "mapk") {
      const selectedPK = benhnhan.find(
        (p) => Number(p.mapk) === Number(value)
      );
      setForm((prev) => ({
        ...prev,
        mapk: value,
        hoten: selectedPK ? selectedPK.hoten : "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Xác nhận thanh toán
  const handleThanhToan = (e) => {
    e.preventDefault();

    if (!form.mapk || !form.tongtien) {
      alert("Vui lòng nhập đầy đủ thông tin bệnh nhân và tổng tiền!");
      return;
    }

    const { hoten, ...dataToSubmit } = form;

    const finalData = {
      ...dataToSubmit,
      ngaythu: new Date().toISOString().split("T")[0],
    };

    console.log("Dữ liệu gửi lên server:", finalData);

    axios
      .post("http://localhost:4000/themphieuthu", finalData)
      .then(() => {
        alert("Thanh toán thành công!");
        setShowModal(false);

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

        fetchPhieuthu();
        fetchThongke();
      })
      .catch((err) => {
        console.error("Chi tiết lỗi:", err.response?.data || err.message);
        alert(
          "Có lỗi xảy ra khi lưu vào database! Hãy kiểm tra mã phiếu khám."
        );
      });
  };

  // Hủy phiếu thu
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

  // In hóa đơn PDF bằng print CSS
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
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  // Lọc theo search
  const filteredPhieuthu = phieuthu.filter(
    (pt) =>
      (pt.mapt &&
        String(pt.mapt).toLowerCase().includes(search.toLowerCase())) ||
      (pt.hoten && pt.hoten.toLowerCase().includes(search.toLowerCase()))
  );

  // Màu trạng thái
  const trangthaiColor = (tt) => {
    if (!tt) return {};
    if (tt.includes("thanh toan") || tt.includes("Thanh toán"))
      return {
        color: "#16a34a",
        background: "#dcfce7",
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: 13,
      };
    if (tt.includes("huy") || tt.includes("Hủy"))
      return {
        color: "#dc2626",
        background: "#fee2e2",
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: 13,
      };
    return {
      color: "#d97706",
      background: "#fef3c7",
      padding: "2px 10px",
      borderRadius: 12,
      fontSize: 13,
    };
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          {/* Top bar */}
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
                setShowModal(true);
              }}
            >
              <i className="fas fa-plus"></i> Tạo Hóa đơn mới
            </button>
          </div>

          {/* Stats */}
          <div className="stat-cards">
            <div className="stat-card green">
              <div className="stat-label">Hóa đơn hôm nay</div>
              <div className="stat-number">{thongke.tongHoaDon || 0}</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-label">Doanh thu hôm nay</div>
              <div className="stat-number">
                {Number(thongke.doanhThu || 0).toLocaleString("vi-VN")}
              </div>
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

          {/* Two col: form + invoice preview */}
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
                    <option value="">
                      -- Chọn bệnh nhân cần thanh toán --
                    </option>
                    {benhnhan.map((item) => (
                      <option key={item.mapk} value={String(item.mapk)}>
                        Mã PK: {item.mapk} - {item.hoten}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label className="field-label">
                    Tổng tiền (VNĐ) <span style={{ color: "red" }}>*</span>
                  </label>
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
                      <i
                        className="fas fa-money-bill-wave"
                        style={{ color: "#16a34a", marginRight: "0.25rem" }}
                      ></i>
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

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <i className="fas fa-check"></i> Xác nhận Thanh toán
                </button>
              </form>
            </div>

            {/* RIGHT: Invoice preview */}
            <div className="panel">
              <h2>Hóa đơn</h2>
              <div className="invoice-preview" ref={invoiceRef}>
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                    ClinicFlow
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                    123 Nguyễn Văn Linh, Q7, TP.HCM
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                    ĐT: 0123 456 789
                  </p>
                </div>
                <div className="invoice-meta">
                  <div className="meta-row">
                    <span>Mã hóa đơn:</span>
                    <span style={{ fontWeight: 500 }}>
                      {form.mapt || "--"}
                    </span>
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
                    {form.tongtien ? (
                      <tr>
                        <td>Dịch vụ khám chữa bệnh</td>
                        <td style={{ textAlign: "right" }}>
                          {formatVND(form.tongtien)}
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          style={{ textAlign: "center", color: "#9ca3af" }}
                        >
                          Chưa có dữ liệu
                        </td>
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
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "0.85rem",
                    color: "#6b7280",
                    marginTop: "1rem",
                  }}
                >
                  Cảm ơn quý khách đã sử dụng dịch vụ!
                </p>
              </div>

              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}
              >
                <button
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={handlePrint}
                >
                  <i className="fas fa-print"></i> In hóa đơn
                </button>
                <button
                  className="btn-secondary green"
                  style={{ flex: 1 }}
                  onClick={handlePrint}
                >
                  <i className="fas fa-download"></i> Tải PDF
                </button>
              </div>
            </div>
          </div>

          {/* Danh sách phiếu thu */}
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
                    <th>Bệnh nhân</th>
                    <th>Mã PK</th>
                    <th style={{ textAlign: "right" }}>Tổng tiền (VNĐ)</th>
                    <th>Ngày thu</th>
                    <th>Nhân viên</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPhieuthu.length > 0 ? (
                    filteredPhieuthu.map((pt, idx) => (
                      <tr key={idx}>
                        <td>{pt.mapt}</td>
                        <td>{pt.hoten || "--"}</td>
                        <td>{pt.mapk}</td>
                        <td style={{ textAlign: "right" }}>
                          {Number(pt.tongtien).toLocaleString("vi-VN")}
                        </td>
                        <td>
                          {pt.ngaythu
                            ? new Date(pt.ngaythu).toLocaleString("vi-VN")
                            : "--"}
                        </td>
                        <td>{pt.manv}</td>
                        <td>
                          <span style={trangthaiColor(pt.trangthai)}>
                            {pt.trangthai}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {pt.trangthai !== "Da huy" && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => setShowConfirm(pt.mapt)}
                            >
                              Hủy
                            </button>
                          )}
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
            <div
              style={{
                padding: "0.75rem 1rem",
                color: "#6b7280",
                fontSize: 14,
              }}
            >
              Hiển thị <strong>{filteredPhieuthu.length}</strong> phiếu thu
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tạo hóa đơn mới */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-form"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 520 }}
          >
            <div className="modal-form-header">
              <h3>
                <i
                  className="fas fa-file-invoice"
                  style={{ marginRight: "0.5rem", color: "#16a34a" }}
                ></i>
                Tạo Hóa đơn mới
              </h3>
              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
              >
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
                  <label>
                    Bệnh nhân <span style={{ color: "red" }}>*</span>
                  </label>
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

                {/* Hiển thị tên bệnh nhân đã chọn */}
                {form.hoten && (
                  <div
                    className="form-group"
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <i
                      className="fas fa-user-check"
                      style={{ color: "#16a34a" }}
                    />
                    <span style={{ color: "#15803d", fontWeight: 500 }}>
                      {form.hoten}
                    </span>
                  </div>
                )}

                <div className="form-group">
                  <label>
                    Tổng tiền (VNĐ) <span style={{ color: "red" }}>*</span>
                  </label>
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
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-save">
                  <i
                    className="fas fa-check"
                    style={{ marginRight: "0.4rem" }}
                  ></i>
                  Xác nhận Thanh toán
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm hủy phiếu */}
      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(null)}>
          <div
            className="confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Hủy Phiếu thu?</h3>
            <p>
              Trạng thái phiếu thu <strong>{showConfirm}</strong> sẽ được cập
              nhật thành "Đã hủy".
            </p>
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowConfirm(null)}
              >
                Đóng
              </button>
              <button
                className="btn-danger"
                onClick={() => handleHuy(showConfirm)}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
