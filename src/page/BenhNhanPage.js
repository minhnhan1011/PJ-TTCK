import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./BenhNhanPage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function BenhNhanPage() {
  const [benhnhan, setBenhnhan] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const params = useParams();
  const [values, setValues] = useState({
    mabn: '',
    hoten: '',
    ngaysinh: '',
    gioitinh: '',
    diachi: '',
    sdt: ''
  });
  const [updateValues, setUpdateValues] = useState({
    mabn: '',
    hoten: '',
    ngaysinh: '',
    gioitinh: '',
    diachi: '',
    sdt: ''
  });
  const id = params.id;

  useEffect(() => {
    axios.get('http://localhost:4000/benhnhan')
      .then(res => setBenhnhan(res.data))
      .catch(err => console.log(err))
  }, [])

  function handleInput(e) {
    setValues(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  function handleUpdateInput(e) {
    setUpdateValues(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Mở modal update và điền sẵn dữ liệu của bệnh nhân được chọn
  const handleOpenUpdate = (bn) => {
    setUpdateValues({
      mabn: bn.mabn,
      hoten: bn.hoten,
      ngaysinh: bn.ngaysinh,
      gioitinh: bn.gioitinh,
      diachi: bn.diachi,
      sdt: bn.sdt
    });
    setShowUpdateModal(true);
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.post('http://localhost:4000/updatebn/' + updateValues.mabn, updateValues)
      .then(res => {
        alert("Cập nhật bệnh nhân thành công!");
        setShowUpdateModal(false);
        axios.get('http://localhost:4000/benhnhan')
          .then(res => setBenhnhan(res.data))
          .catch(err => console.log(err))
      })
      .catch(err => {
        console.log(err);
        alert("Có lỗi xảy ra khi cập nhật bệnh nhân");
      });
  }

  const handleDelete = (mabn) => {
    axios.get('http://localhost:4000/deletebn/' + mabn)
      .then(res => window.location.reload())
  }

  const handleCreate = (e) => {
    e.preventDefault();
    axios.post('http://localhost:4000/thembn', values)
      .then(res => {
        alert("Thêm bệnh nhân thành công!");
        setShowModal(false);
        axios.get('http://localhost:4000/benhnhan')
          .then(res => setBenhnhan(res.data))
          .catch(err => console.log(err))
      })
      .catch(err => {
        console.log(err);
        alert("Có lỗi xảy ra khi thêm bệnh nhân");
      });
  }

  return (
    <div className="benhnhan-layout">
      <Sidebar />

      <div className="benhnhan-main">
        <Header />

        <div className="benhnhan-content">
          {/* Top bar */}
          <div className="benhnhan-topbar">
            <div>
              <h1>Danh sách Bệnh nhân</h1>
              <p>Quản lý hồ sơ bệnh nhân và lịch sử khám chữa bệnh.</p>
            </div>
            <button className="btn-add-patient" onClick={() => setShowModal(true)}>
              <i className="fas fa-user-plus"></i> Thêm Bệnh nhân mới
            </button>
          </div>

          {/* Stats */}
          <div className="stat-cards">
            <div className="stat-card blue">
              <div className="stat-label">Tổng BN</div>
              <div className="stat-number">{benhnhan.length}</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">BN đang điều trị</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Đăng ký mới hôm nay</div>
              <div className="stat-number">0</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Tái khám tuần này</div>
              <div className="stat-number">0</div>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Tìm theo tên, SĐT..." />
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="patient-table">
                <thead>
                  <tr>
                    <th>Mã BN</th>
                    <th>Họ và Tên</th>
                    <th>Giới tính</th>
                    <th>Ngày sinh</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {benhnhan.length > 0 ? (
                    benhnhan.map((bn, index) => (
                      <tr key={index}>
                        <td>{bn.mabn}</td>
                        <td>{bn.hoten}</td>
                        <td>{bn.gioitinh}</td>
                        <td>{bn.ngaysinh}</td>
                        <td>{bn.sdt}</td>
                        <td>{bn.diachi}</td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="btn btn-warning btn-sm"
                            style={{ marginRight: "6px" }}
                            onClick={() => handleOpenUpdate(bn)}
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(bn.mabn)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-pagination">
              <div>
                Hiển thị <strong>{benhnhan.length}</strong> bệnh nhân
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Thêm bệnh nhân */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-form">
            <div className="modal-form-header">
              <h3>
                <i className="fas fa-user-plus" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>
                Thêm Bệnh nhân mới
              </h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="modal-form-body">
                <div className="form-group">
                  <label>Mã bệnh nhân <span className="required">*</span></label>
                  <input type="text" name="mabn" placeholder="Nhập mã bệnh nhân..." onChange={handleInput} required />
                </div>

                <div className="form-group">
                  <label>Họ và Tên <span className="required">*</span></label>
                  <input type="text" name="hoten" placeholder="Nhập họ tên..." onChange={handleInput} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày sinh</label>
                    <input type="date" name="ngaysinh" onChange={handleInput} />
                  </div>
                  <div className="form-group">
                    <label>Giới tính</label>
                    <select name="gioitinh" onChange={handleInput}>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Số điện thoại <span className="required">*</span></label>
                  <input type="text" name="sdt" placeholder="VD: 0901234567" onChange={handleInput} required />
                </div>

                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input type="text" name="diachi" placeholder="Nhập địa chỉ..." onChange={handleInput} />
                </div>
              </div>

              <div className="modal-form-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-save">
                  <i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cập nhật bệnh nhân */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-form">
            <div className="modal-form-header">
              <h3>
                <i className="fas fa-user-edit" style={{ marginRight: "0.5rem", color: "#d97706" }}></i>
                Cập nhật Bệnh nhân
              </h3>
              <button className="btn-close" onClick={() => setShowUpdateModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="modal-form-body">
                <div className="form-group">
                  <label>Mã bệnh nhân</label>
                  {/* Chỉ hiển thị, không cho sửa mã BN */}
                  <input
                    type="text"
                    name="mabn"
                    value={updateValues.mabn}
                    readOnly
                    style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                  />
                </div>

                <div className="form-group">
                  <label>Họ và Tên <span className="required">*</span></label>
                  <input
                    type="text"
                    name="hoten"
                    placeholder="Nhập họ tên..."
                    value={updateValues.hoten}
                    onChange={handleUpdateInput}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày sinh</label>
                    <input
                      type="date"
                      name="ngaysinh"
                      value={updateValues.ngaysinh}
                      onChange={handleUpdateInput}
                    />
                  </div>
                  <div className="form-group">
                    <label>Giới tính</label>
                    <select
                      name="gioitinh"
                      value={updateValues.gioitinh}
                      onChange={handleUpdateInput}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Số điện thoại <span className="required">*</span></label>
                  <input
                    type="text"
                    name="sdt"
                    placeholder="VD: 0901234567"
                    value={updateValues.sdt}
                    onChange={handleUpdateInput}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    name="diachi"
                    placeholder="Nhập địa chỉ..."
                    value={updateValues.diachi}
                    onChange={handleUpdateInput}
                  />
                </div>
              </div>

              <div className="modal-form-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowUpdateModal(false)}>Hủy</button>
                <button type="submit" className="btn-save" style={{ backgroundColor: "#d97706", borderColor: "#d97706" }}>
                  <i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}