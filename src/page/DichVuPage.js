import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./DichVuPage.css";

export default function DichVuPage() {
  const [dichvus, setDichvus] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ tendv: "", gia: "" });
  const [showConfirm, setShowConfirm] = useState(null);

  // 1. Lấy danh sách dịch vụ từ API
  const fetchDichVu = () => {
    axios
      .get("http://localhost:4000/api/dichvu")
      .then((res) => {
        setDichvus(res.data);
      })
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  };

  useEffect(() => {
    fetchDichVu();
  }, []);

  const handleSave = () => {
   
    if (!form.tendv || !form.gia) {
      alert("Vui lòng nhập đầy đủ tên và giá dịch vụ!");
      return;
    }

  
    const data = { tendv: form.tendv, gia: form.gia };

    if (editItem) {
      // Cập nhật dịch vụ đã có
      axios
        .put(`http://localhost:4000/api/dichvu/update/${editItem.madv}`, data)
        .then(() => {
          fetchDichVu();
          setShowModal(false);
        })
        .catch((err) => alert("Lỗi khi cập nhật: " + err.response?.status));
    } else {
      // Thêm dịch vụ mới
      axios
        .post("http://localhost:4000/api/dichvu/add", data)
        .then(() => {
          fetchDichVu();
          setShowModal(false);
        })
        .catch((err) => alert("Lỗi khi thêm mới: " + err.response?.status));
    }
  };

  // 3. Xử lý Xóa dịch vụ
  const handleDelete = () => {
    axios
      .delete(`http://localhost:4000/api/dichvu/delete/${showConfirm}`)
      .then(() => {
        fetchDichVu();
        setShowConfirm(null);
      })
      .catch((err) => console.error("Lỗi khi xóa:", err));
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
          <div className="page-topbar">
            <div>
              <h1>Danh mục Dịch vụ</h1>
              <p>Cấu hình tên dịch vụ và đơn giá làm cơ sở tính viện phí.</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => {
                setEditItem(null);
                setForm({ tendv: "", gia: "" });
                setShowModal(true);
              }}
            >
              <i className="fas fa-plus" style={{ marginRight: "8px" }}></i>
              Thêm Dịch vụ mới
            </button>
          </div>

          <div className="table-container">
            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <i
                className="fas fa-search"
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "12px",
                  color: "#64748b",
                }}
              ></i>
              <input
                className="form-group input"
                style={{ paddingLeft: "40px", margin: 0 }}
                placeholder="Tìm kiếm tên dịch vụ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã DV</th>
                  <th>Tên Dịch vụ</th>
                  <th style={{ textAlign: "right" }}>Giá (VNĐ)</th>
                  <th style={{ textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {dichvus
                  .filter((i) =>
                    i.tendv.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((item, index) => (
                    <tr key={item.madv}>
                      <td>#{index + 1}</td>

                      <td style={{ fontWeight: "500" }}>{item.tendv}</td>
                      <td
                        style={{
                          textAlign: "right",
                          color: "#2563eb",
                          fontWeight: "600",
                        }}
                      >
                        {/* Hiển thị 'gia' thay vì 'giadv' để tránh lỗi NaN */}
                        {Number(item.gia || 0).toLocaleString()}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="btn-icon edit"
                          onClick={() => {
                            setEditItem(item);
                            setForm({ tendv: item.tendv, gia: item.gia });
                            setShowModal(true);
                          }}
                        >
                          <i className="fas fa-edit"></i> Sửa
                        </button>
                        <button
                          className="btn-icon delete"
                          onClick={() => setShowConfirm(item.madv)}
                        >
                          <i className="fas fa-trash-alt"></i> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {dichvus.length === 0 && (
              <p style={{ textAlign: "center", padding: "20px" }}>
                Đang tải dữ liệu...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* MODAL THÊM/SỬA */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3>
                <i
                  className="fas fa-file-medical"
                  style={{ marginRight: "10px", color: "#2563eb" }}
                ></i>
                {editItem ? "Cập nhật Dịch vụ" : "Thêm Dịch vụ mới"}
              </h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-form-body">
              <div className="form-group">
                <label>
                  Tên Dịch vụ <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên dịch vụ..."
                  value={form.tendv}
                  onChange={(e) => setForm({ ...form, tendv: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>
                  Giá Dịch vụ (VNĐ) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  placeholder="VD: 200000"
                  value={form.gia}
                  onChange={(e) => setForm({ ...form, gia: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-form-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button className="btn-save" onClick={handleSave}>
                <i className="fas fa-save" style={{ marginRight: "8px" }}></i>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* XÁC NHẬN XÓA */}
      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(null)}>
          <div
            className="modal-form"
            style={{ width: "400px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-form-header" style={{ borderBottom: "none" }}>
              <h3 style={{ color: "#ef4444" }}>Xác nhận xóa</h3>
            </div>
            <div
              className="modal-form-body"
              style={{ textAlign: "center", paddingTop: 0 }}
            >
              <p>
                Bạn có chắc chắn muốn xóa dịch vụ{" "}
                <strong>#{showConfirm}</strong>?
              </p>
            </div>
            <div
              className="modal-form-footer"
              style={{ background: "none", borderTop: "none" }}
            >
              <button
                className="btn-cancel"
                onClick={() => setShowConfirm(null)}
              >
                Hủy
              </button>
              <button
                className="btn-save"
                style={{ backgroundColor: "#ef4444" }}
                onClick={handleDelete}
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
