<<<<<<< HEAD
import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./BenhNhanPage.css";

export default function BenhNhanPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ hoten: "", ngaysinh: "", gioitinh: "Nam", sdt: "", diachi: "" });
  const [formErrors, setFormErrors] = useState({});

  return (
    <div className="benhnhan-layout">
      <Sidebar />1
      <div className="benhnhan-main">
        <Header />
        <div className="benhnhan-content">
          {/* Top bar */}
          <div className="benhnhan-topbar">
            <div>
              <h1>Danh sách Bệnh nhân</h1>
              <p>Quản lý hồ sơ bệnh nhân và lịch sử khám chữa bệnh.</p>
            </div>
            <button className="btn-add-patient" onClick={() => { setForm({ hoten: "", ngaysinh: "", gioitinh: "Nam", sdt: "", diachi: "" }); setFormErrors({}); setShowModal(true); }}>
              <i className="fas fa-user-plus"></i> Thêm Bệnh nhân mới
            </button>
          </div>

          {/* Stats */}
          <div className="stat-cards">
            <div className="stat-card blue">
              <div className="stat-label">Tổng BN</div>
              <div className="stat-number">0</div>
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
                <input
                  type="text"
                  placeholder="Tìm theo tên, SĐT..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
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
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                      Chưa có dữ liệu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="table-pagination">
              <div>
                Hiển thị <strong>0</strong> bệnh nhân
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm bệnh nhân */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3><i className="fas fa-user-plus" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>Thêm Bệnh nhân mới</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-form-body">
              <div className="form-group">
                <label>Họ và Tên <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Nhập họ tên..."
                  value={form.hoten}
                  onChange={(e) => setForm({ ...form, hoten: e.target.value })}
                  className={formErrors.hoten ? "input-error" : ""}
                />
                {formErrors.hoten && <div className="error-text">{formErrors.hoten}</div>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    value={form.ngaysinh}
                    onChange={(e) => setForm({ ...form, ngaysinh: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Giới tính</label>
                  <select
                    value={form.gioitinh}
                    onChange={(e) => setForm({ ...form, gioitinh: e.target.value })}
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
                  placeholder="VD: 0901234567"
                  value={form.sdt}
                  onChange={(e) => setForm({ ...form, sdt: e.target.value })}
                  className={formErrors.sdt ? "input-error" : ""}
                />
                {formErrors.sdt && <div className="error-text">{formErrors.sdt}</div>}
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  placeholder="Nhập địa chỉ..."
                  value={form.diachi}
                  onChange={(e) => setForm({ ...form, diachi: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-form-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-save" onClick={() => setShowModal(false)}>
                <i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
=======
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Space, message, Input } from 'antd';
import Sidebar from "../component/sidebar/Sidebar"; // Import Sidebar của nhóm
import Header from "../component/header/Header";   // Import Header của nhóm
import "./NhanVienPage.css"; // Nếu Trúc muốn thêm CSS riêng

const NhanVienPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNhanVien = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/nhan-vien', { withCredentials: true });
      setData(response.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNhanVien();
  }, []);

  const columns = [
    { title: 'HỌ VÀ TÊN', dataIndex: 'hoten', key: 'hoten' },
    { title: 'CHỨC VỤ', dataIndex: 'chucvu', key: 'chucvu' },
    { title: 'SỐ ĐIỆN THOẠI', dataIndex: 'sdt', key: 'sdt' },
    { title: 'ĐỊA CHỈ', dataIndex: 'diachi', key: 'diachi' },
    {
      title: 'THAO TÁC',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button type="primary" ghost>Sửa</Button>
          <Button danger ghost>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-layout">
      {/* 1. Thanh bên màu xanh bên trái */}
      <Sidebar /> 

      <div className="page-main">
        {/* 2. Thanh trên cùng */}
        <Header /> 

        <div className="page-content" style={{ padding: '24px' }}>
          {/* 3. Phần tiêu đề và nút thêm mới y hệt ảnh 2 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>Quản lý Nhân sự</h1>
              <p style={{ color: '#666' }}>Quản lý thông tin bác sĩ, y tá và nhân viên phòng khám.</p>
            </div>
            <Button type="primary" icon={<i className="fas fa-plus"></i>} size="large" style={{ borderRadius: '8px' }}>
               + Thêm nhân viên mới
            </Button>
          </div>

          {/* 4. Các thẻ thống kê cho chuyên nghiệp */}
          <div className="stat-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
             <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #2563eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>TỔNG NHÂN VIÊN</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{data.length}</div>
             </div>
             {/* Trúc có thể thêm các thẻ khác như: Bác sĩ, Y tá... tương tự */}
          </div>

          {/* 5. Ô tìm kiếm và Bảng dữ liệu */}
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Input 
              placeholder="Tìm theo tên, SĐT..." 
              prefix={<i className="fas fa-search" style={{ color: '#ccc' }}></i>}
              style={{ width: '300px', marginBottom: '20px', borderRadius: '8px' }}
            />
            <Table 
              dataSource={data} 
              columns={columns} 
              rowKey="manv" 
              loading={loading}
              pagination={{ pageSize: 8 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NhanVienPage;
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
