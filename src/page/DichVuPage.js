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
    trangthai: "Hoat dong",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);

  // 👉 LẤY ROLE TỪ LOCALSTORAGE
  const role = localStorage.getItem("vaitro");

  axios.defaults.withCredentials = true;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/dich-vu");
      // Sắp xếp dữ liệu theo mã dịch vụ tăng dần
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
    if (role !== "admin") return;
    setEditItem(null);
    setForm({ tendv: "", gia: "", trangthai: "Hoat dong" });
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (item) => {
    if (role !== "admin") return;
    setEditItem(item);
    setForm({ tendv: item.tendv, gia: item.gia, trangthai: item.trangthai });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSave = async () => {
    if (role !== "admin") {
      message.error("Bạn không có quyền thực hiện thao tác này!");
      return;
    }

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
      message.success(
        editItem ? "Cập nhật thành công!" : "Thêm dịch vụ thành công!",
      );
      setShowModal(false);
      fetchData();
    } catch (err) {
      message.error("Lỗi khi lưu dữ liệu!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (role !== "admin") return;
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

            {/* 👉 CHỈ ADMIN THẤY NÚT THÊM */}
            {role === "admin" && (
              <button className="btn-primary" onClick={openAdd}>
                <i className="fas fa-plus-circle"></i> Thêm Dịch vụ mới
              </button>
            )}
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
                    <th style={{ width: "100px" }}>STT</th>
                    <th>Tên Dịch vụ</th>
                    <th style={{ textAlign: "right" }}>Giá Dịch vụ (VNĐ)</th>
                    <th style={{ textAlign: "center" }}>Trạng thái</th>
                    {/* 👉 CHỈ HIỆN TIÊU ĐỀ CỘT THAO TÁC NẾU LÀ ADMIN */}
                    {role === "admin" && (
                      <th style={{ textAlign: "right" }}>Thao tác</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={item.madv}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{item.tendv}</strong>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {Number(item.gia).toLocaleString()} đ
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          className={`status-badge ${item.trangthai === "Hoat dong" ? "active" : "inactive"}`}
                        >
                          {item.trangthai === "Hoat dong"
                            ? "Hoạt động"
                            : "Ngưng nhận"}
                        </span>
                      </td>

                      {/*CHỈ HIỆN CÁC NÚT SỬA/XÓA NẾU LÀ ADMIN */}
                      {role === "admin" && (
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
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Spin>
        </div>
      </div>

      {/* MODAL THÊM/SỬA (CHỈ RENDER NẾU LÀ ADMIN) */}
      {showModal && role === "admin" && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <span className="modal-title">
                {editItem ? "Cập nhật Dịch vụ" : "Thêm Dịch vụ mới"}
              </span>
              <button
                className="btn-close-x"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Tên dịch vụ</label>
                <input
                  className={formErrors.tendv ? "error" : ""}
                  placeholder="Nhập tên dịch vụ"
                  value={form.tendv}
                  onChange={(e) => setForm({ ...form, tendv: e.target.value })}
                />
                {formErrors.tendv && (
                  <span className="error-text">{formErrors.tendv}</span>
                )}
              </div>

              <div className="form-group">
                <label>Giá dịch vụ</label>
                <input
                  type="number"
                  className={formErrors.gia ? "error" : ""}
                  placeholder="Nhập giá tiền"
                  value={form.gia}
                  onChange={(e) => setForm({ ...form, gia: e.target.value })}
                />
                {formErrors.gia && (
                  <span className="error-text">{formErrors.gia}</span>
                )}
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={form.trangthai}
                  onChange={(e) =>
                    setForm({ ...form, trangthai: e.target.value })
                  }
                >
                  <option value="Hoat dong">Hoạt động</option>
                  <option value="Ngung nhan">Ngưng nhận</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={submitting}
              >
                {submitting
                  ? "Đang lưu..."
                  : editItem
                    ? "Cập nhật"
                    : "Lưu dịch vụ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-container confirm-modal">
            <div className="modal-body">
              <i className="fas fa-exclamation-triangle warning-icon"></i>
              <h3>Xác nhận xóa?</h3>
              <p>
                Bạn có chắc chắn muốn xóa dịch vụ này không? Hành động này không
                thể hoàn tác.
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowConfirm(null)}>Hủy</button>
              <button className="btn-danger" onClick={handleDelete}>
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
