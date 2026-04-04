import { useState, useEffect } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import Loading from "../component/loading/Loading";
import { toast } from "react-toastify";
import "./ThanhToanPage.css";

export default function ThanhToanPage() {
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // TODO: const res = await apiGet("/thanh-toan");
        toast.info("Sẵn sàng kết nối API Thanh toán");
      } catch {
        toast.error("Lỗi tải dữ liệu thanh toán!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-layout">
      {loading && <Loading text="Đang tải dữ liệu thanh toán..." />}
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
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-label">Doanh thu hôm nay</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Chờ thanh toán</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Đã thanh toán</div>
              <div className="stat-number">0</div>
            </div>
          </div>

          <div className="two-col-layout">
            {/* Left: Payment form */}
            <div className="panel">
              <h2>Thông tin Thanh toán</h2>
              <div style={{ marginBottom: "1rem" }}>
                <label className="field-label">Dịch vụ đã chọn</label>
                <div className="service-list">
                  <div style={{ padding: "1rem", textAlign: "center", color: "#9ca3af" }}>Chưa có dịch vụ</div>
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label className="field-label">Tổng tiền</label>
                <input type="text" className="field-input" value="0 VNĐ" readOnly />
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
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => toast.success("Xác nhận thanh toán thành công!")}>
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
                  <div className="meta-row"><span>Mã hóa đơn:</span><span style={{ fontWeight: 500 }}>--</span></div>
                  <div className="meta-row"><span>Ngày:</span><span>--</span></div>
                  <div className="meta-row"><span>Bệnh nhân:</span><span>--</span></div>
                </div>
                <table className="invoice-table">
                  <thead>
                    <tr><th>Dịch vụ</th><th style={{ textAlign: "right" }}>Thành tiền</th></tr>
                  </thead>
                  <tbody>
                    <tr><td colSpan="2" style={{ textAlign: "center", color: "#9ca3af" }}>Chưa có dữ liệu</td></tr>
                  </tbody>
                  <tfoot>
                    <tr><td style={{ fontWeight: 600 }}>Tổng cộng</td><td style={{ textAlign: "right", fontWeight: 600 }}>0 VNĐ</td></tr>
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
                  <tr><td colSpan="8" className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
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
              <button className="btn-danger" onClick={() => { toast.success("Hủy phiếu thu thành công!"); setShowConfirm(null); }}>Xác nhận hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
