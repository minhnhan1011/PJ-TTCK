import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./ThanhToanPage.css";

const INITIAL_INVOICES = [
  { mapt: "PT-001", mapk: "PK-001", hoten: "Nguyễn Văn An", mabn: "BN-001", tongtien: 200000, ngaythu: "20/03/2024", trangthai: "Đã thanh toán", nhanvien: "Kế toán D" },
  { mapt: "PT-002", mapk: "PK-002", hoten: "Trần Thị Bích", mabn: "BN-002", tongtien: 300000, ngaythu: "20/03/2024", trangthai: "Đã thanh toán", nhanvien: "Kế toán D" },
  { mapt: "PT-003", mapk: "PK-003", hoten: "Phạm Hồng Nhung", mabn: "BN-003", tongtien: 550000, ngaythu: "", trangthai: "Chờ thanh toán", nhanvien: "" },
];

const SERVICES_DETAIL = [
  { ten: "Khám tổng quát", gia: 500000 },
  { ten: "Xét nghiệm máu", gia: 300000 },
  { ten: "Siêu âm bụng", gia: 400000 },
];

export default function ThanhToanPage() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(null);

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    return inv.hoten.toLowerCase().includes(q) || inv.mapt.toLowerCase().includes(q) || inv.mabn.toLowerCase().includes(q);
  });

  const formatCurrency = (n) => n.toLocaleString("vi-VN");

  const stats = {
    total: invoices.length,
    revenue: invoices.filter((i) => i.trangthai === "Đã thanh toán").reduce((s, i) => s + i.tongtien, 0),
    pending: invoices.filter((i) => i.trangthai === "Chờ thanh toán").length,
    paid: invoices.filter((i) => i.trangthai === "Đã thanh toán").length,
  };

  const handleCancel = (mapt) => {
    setInvoices(invoices.map((i) => i.mapt === mapt ? { ...i, trangthai: "Đã hủy" } : i));
    setShowConfirm(null);
  };

  const totalDV = SERVICES_DETAIL.reduce((s, d) => s + d.gia, 0);

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          <div className="page-topbar">
            <div>
              <h1>Thanh toán Dịch vụ</h1>
              <p>Xử lý thanh toán cho bệnh nhân và dịch vụ y tế.</p>
            </div>
            <button className="btn-green">
              <i className="fas fa-plus"></i> Tạo Hóa đơn mới
            </button>
          </div>

          <div className="stat-cards">
            <div className="stat-card green">
              <div className="stat-label">Hóa đơn hôm nay</div>
              <div className="stat-number">{stats.total}</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-label">Doanh thu hôm nay</div>
              <div className="stat-number">{formatCurrency(stats.revenue)}</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Chờ thanh toán</div>
              <div className="stat-number">{stats.pending}</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Đã thanh toán</div>
              <div className="stat-number">{stats.paid}</div>
            </div>
          </div>

          <div className="two-col-layout">
            {/* Left: Payment form */}
            <div className="panel">
              <h2>Thông tin Thanh toán</h2>
              <div style={{ marginBottom: "1rem" }}>
                <label className="field-label">Dịch vụ đã chọn</label>
                <div className="service-list">
                  {SERVICES_DETAIL.map((s, i) => (
                    <div key={i} className="service-row">
                      <span>{s.ten}</span>
                      <span style={{ fontWeight: 500 }}>{formatCurrency(s.gia)} VNĐ</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label className="field-label">Tổng tiền</label>
                <input type="text" className="field-input" value={`${formatCurrency(totalDV)} VNĐ`} readOnly />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label className="field-label">Phương thức thanh toán</label>
                <div className="payment-methods">
                  <label><input type="radio" name="payment" defaultChecked /> <i className="fas fa-money-bill-wave" style={{ color: "#16a34a", marginRight: "0.25rem" }}></i> Tiền mặt</label>
                  <label><input type="radio" name="payment" /> <i className="fas fa-credit-card" style={{ color: "#2563eb", marginRight: "0.25rem" }}></i> Thẻ tín dụng</label>
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label className="field-label">Ghi chú</label>
                <textarea className="field-textarea" placeholder="Nhập ghi chú nếu có..." rows="3"></textarea>
              </div>
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                <i className="fas fa-check"></i> Xác nhận Thanh toán
              </button>
            </div>

            {/* Right: Invoice preview */}
            <div className="panel">
              <h2>Hóa đơn</h2>
              <div className="invoice-preview">
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "1.1rem" }}>ClinicFlow</h3>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>123 Nguyễn Văn Linh, Q7, TP.HCM</p>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>ĐT: 0123 456 789</p>
                </div>
                <div className="invoice-meta">
                  <div className="meta-row"><span>Mã hóa đơn:</span><span style={{ fontWeight: 500 }}>HD-20240320-001</span></div>
                  <div className="meta-row"><span>Ngày:</span><span>20/03/2024</span></div>
                  <div className="meta-row"><span>Bệnh nhân:</span><span>Nguyễn Văn An (BN-001)</span></div>
                </div>
                <table className="invoice-table">
                  <thead>
                    <tr><th>Dịch vụ</th><th style={{ textAlign: "right" }}>Thành tiền</th></tr>
                  </thead>
                  <tbody>
                    {SERVICES_DETAIL.map((s, i) => (
                      <tr key={i}><td>{s.ten}</td><td style={{ textAlign: "right" }}>{formatCurrency(s.gia)}</td></tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr><td style={{ fontWeight: 600 }}>Tổng cộng</td><td style={{ textAlign: "right", fontWeight: 600 }}>{formatCurrency(totalDV)} VNĐ</td></tr>
                  </tfoot>
                </table>
                <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#6b7280", marginTop: "1rem" }}>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button className="btn-secondary" style={{ flex: 1 }}><i className="fas fa-print"></i> In hóa đơn</button>
                <button className="btn-secondary green" style={{ flex: 1 }}><i className="fas fa-download"></i> Tải PDF</button>
              </div>
            </div>
          </div>

          {/* Invoice list */}
          <div className="table-container" style={{ marginTop: "1.5rem" }}>
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm theo mã hóa đơn, tên BN..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  {filtered.length === 0 ? (
                    <tr><td colSpan="8" className="empty-state"><p>Không tìm thấy phiếu thu nào</p></td></tr>
                  ) : filtered.map((inv) => (
                    <tr key={inv.mapt}>
                      <td className="code-cell">{inv.mapt}</td>
                      <td style={{ fontWeight: 500 }}>{inv.hoten}</td>
                      <td>{inv.mapk}</td>
                      <td style={{ textAlign: "right", fontWeight: 500 }}>{formatCurrency(inv.tongtien)}</td>
                      <td style={{ color: "#6b7280" }}>{inv.ngaythu || "-"}</td>
                      <td>{inv.nhanvien || "-"}</td>
                      <td>
                        <span className={`badge-status ${inv.trangthai === "Đã thanh toán" ? "badge-green" : inv.trangthai === "Đã hủy" ? "badge-red" : "badge-orange"}`}>{inv.trangthai}</span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-view" title="Xem"><i className="fas fa-eye"></i></button>
                          {inv.trangthai === "Chờ thanh toán" && (
                            <button className="btn-delete" title="Hủy phiếu" onClick={() => setShowConfirm(inv.mapt)}><i className="fas fa-ban"></i></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon"><i className="fas fa-exclamation-triangle"></i></div>
            <h3>Hủy Phiếu thu?</h3>
            <p>Trạng thái phiếu thu sẽ được cập nhật thành "Đã hủy".</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowConfirm(null)}>Hủy</button>
              <button className="btn-danger" onClick={() => handleCancel(showConfirm)}>Xác nhận hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
