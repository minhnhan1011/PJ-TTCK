import { useState, useEffect } from "react";
import axios from "axios";
import { message, Spin } from "antd";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./DichVuPage.css";

export default function DichVuPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    tendv: "",
    gia: "",
    trangthai: "Hoạt động",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);

  axios.defaults.withCredentials = true;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/dich-vu");
      const sortedData = res.data.sort((a, b) => a.madv - b.madv);
      setData(sortedData);
    } catch (err) {
      message.error("Lỗi tải danh sách dịch vụ!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm({ tendv: "", gia: "", trangthai: "Hoạt động" });
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ tendv: item.tendv, gia: item.gia, trangthai: item.trangthai });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.tendv || !form.gia) {
      setFormErrors({
        tendv: !form.tendv ? "Vui lòng nhập tên dịch vụ" : "",
        gia: !form.gia ? "Vui lòng nhập giá" : "",
      });
      return;
    }

    setSubmitting(true);
    try {
      if (editItem) {
        await axios.put(
          `http://localhost:4000/api/dich-vu/${editItem.madv}`,
          form,
        );
      } else {
        await axios.post("http://localhost:4000/api/dich-vu", form);
      }
      message.success(editItem ? "Cập nhật thành công!" : "Thêm dịch vụ thành công!");
      setShowModal(false);
      fetchData();
    } catch (err) {
      message.error("Lỗi khi lưu dữ liệu!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/dich-vu/${showConfirm}`);
      message.success("Xóa dịch vụ thành công!");
      setShowConfirm(null);
      fetchData();
    } catch (err) {
      message.error("Lỗi khi xóa!");
    }
  };

  const filteredData = data.filter((item) =>
    item.tendv.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          <div className="page-topbar">
            <div>
              <h1>Danh mục Dịch vụ Khám & Xét nghiệm</h1>
              <p>Quản lý cấu hình đơn giá dịch vụ y tế.</p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-plus-circle"></i> Thêm Dịch vụ mới
            </button>
          </div>

          <Spin spinning={loading} tip="Đang tải...">
          <div className="table-container">
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  placeholder="Tìm kiếm tên dịch vụ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "100px" }}>Mã DV</th>
                  <th>Tên Dịch vụ</th>
                  <th style={{ textAlign: "right" }}>Giá Dịch vụ (VNĐ)</th>
                  <th style={{ textAlign: "center" }}>Trạng thái</th>
                  <th style={{ textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.madv}>
                    {/* index bắt đầu từ 0, nên +1 sẽ ra 1, 2, 3... theo đúng thứ tự hàng */}
                    <td>DV{index + 1}</td>
                    <td>
                      <strong>{item.tendv}</strong>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {Number(item.gia).toLocaleString()} đ
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        className={`status-badge ${item.trangthai === "Hoạt động" ? "active" : "inactive"}`}
                      >
                        {item.trangthai}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-icon edit"
                        onClick={() => openEdit(item)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => setShowConfirm(item.madv)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </Spin>
        </div>
      </div>

      {/* MODAL THEO GIAO DIỆN BẢNG 2 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <div className="header-left">
                <i className="fas fa-stethoscope modal-icon-blue"></i>
                <span className="modal-title">
                  {editItem ? "Cập nhật Dịch vụ" : "Thêm Dịch vụ mới"}
                </span>
              </div>
              <button
                className="btn-close-x"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="input-group-new">
                <label>
                  Tên Dịch vụ <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên dịch vụ..."
                  value={form.tendv}
                  onChange={(e) => setForm({ ...form, tendv: e.target.value })}
                  className={formErrors.tendv ? "input-error" : ""}
                />
                {formErrors.tendv && (
                  <small className="error-text">{formErrors.tendv}</small>
                )}
              </div>

              <div className="input-group-new">
                <label>
                  Giá Dịch vụ (VNĐ) <span className="text-red">*</span>
                </label>
                <input
                  type="number"
                  placeholder="VD: 200000"
                  value={form.gia}
                  onChange={(e) => setForm({ ...form, gia: e.target.value })}
                  className={formErrors.gia ? "input-error" : ""}
                />
                {formErrors.gia && (
                  <small className="error-text">{formErrors.gia}</small>
                )}
                <div className="input-group-new">
                  <label>Trạng thái</label>
                  <select
                    value={form.trangthai}
                    onChange={(e) =>
                      setForm({ ...form, trangthai: e.target.value })
                    }
                    className="modal-select"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-huy-new"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button className="btn-luu-new" onClick={handleSave} disabled={submitting}>
                <i className="fas fa-save"></i> {submitting ? "Đang lưu..." : (editItem ? "Cập nhật" : "Lưu")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <i
              className="fas fa-exclamation-triangle"
              style={{ color: "#ef4444", fontSize: "2rem" }}
            ></i>
            <h3>Xác nhận xóa?</h3>
            <p>Dịch vụ này sẽ bị xóa vĩnh viễn khỏi danh mục.</p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <button
                className="btn-huy-new"
                onClick={() => setShowConfirm(null)}
              >
                Hủy
              </button>
              <button
                className="btn-danger"
                onClick={handleDelete}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
