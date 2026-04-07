<<<<<<< HEAD
import { useState } from "react";
=======
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Space, message, Modal, Form, Input, Select } from 'antd';
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./NhanVienPage.css";

<<<<<<< HEAD
const ROLES = ["Bác sĩ", "Tiếp tân", "Kế toán", "Kỹ thuật viên", "Dược sĩ", "Admin"];

export default function NhanVienPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ hoten: "", chucvu: "Bác sĩ", sdt: "", diachi: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);

  const openAdd = () => {
    setEditItem(null);
    setForm({ hoten: "", chucvu: "Bác sĩ", sdt: "", diachi: "" });
    setFormErrors({});
    setShowModal(true);
  };

=======
const NhanVienPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // 1. Lấy danh sách nhân viên
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/nhan-vien', { withCredentials: true });
      setData(res.data);
    } catch (error) {
      message.error("Không thể lấy dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // 2. Xử lý khi nhấn nút "Thêm mới" hoặc "Sửa"
  const showModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      form.setFieldsValue(item); // Đổ dữ liệu cũ vào form nếu là sửa
    } else {
      form.resetFields(); // Xóa trắng form nếu là thêm mới
    }
    setIsModalOpen(true);
  };

  // 3. Xử lý Lưu (Cả Thêm và Sửa)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        // Gọi API Sửa (Bạn cần viết thêm route PUT /api/nhan-vien/:id ở backend nếu chưa có)
        await axios.put(`http://localhost:4000/api/nhan-vien/${editingItem.manv}`, values, { withCredentials: true });
        message.success("Cập nhật thành công!");
      } else {
        // Gọi API Thêm
        await axios.post('http://localhost:4000/api/nhan-vien', values, { withCredentials: true });
        message.success("Thêm nhân viên mới thành công!");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu dữ liệu!");
    }
  };

  // 4. Xử lý Xóa
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa nhân viên này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:4000/api/nhan-vien/${id}`, { withCredentials: true });
          message.success("Đã xóa nhân viên!");
          loadData();
        } catch (error) {
          message.error("Lỗi khi xóa nhân viên!");
        }
      },
    });
  };

  const columns = [
    { title: 'Họ tên', dataIndex: 'hoten', key: 'hoten' },
    { title: 'Chức vụ', dataIndex: 'chucvu', key: 'chucvu' },
    { title: 'Số điện thoại', dataIndex: 'sdt', key: 'sdt' },
    { title: 'Địa chỉ', dataIndex: 'diachi', key: 'diachi' },
    {
      title: 'Thao tác',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button type="primary" ghost onClick={() => showModal(record)}>Sửa</Button>
          <Button danger ghost onClick={() => handleDelete(record.manv)}>Xóa</Button>
        </Space>
      ),
    },
  ];

>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
<<<<<<< HEAD
        <div className="page-content">
          <div className="page-topbar">
            <div>
              <h1>Danh mục Nhân viên</h1>
              <p>Quản lý hồ sơ Bác sĩ, Kế toán, Tiếp tân và phân quyền tài khoản.</p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-user-plus"></i> Thêm Nhân viên
            </button>
          </div>

          <div className="table-container">
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm theo tên hoặc mã NV..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select className="filter-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="">Tất cả chức vụ</option>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã NV</th>
                    <th>Họ và Tên</th>
                    <th>Chức vụ</th>
                    <th>Số điện thoại</th>
                    <th>Tài khoản (tendn)</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan="6" className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>0</strong> nhân viên</div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3><i className="fas fa-user-md" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>{editItem ? "Cập nhật Nhân viên" : "Thêm Nhân viên mới"}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-form-body">
              <div className="form-group">
                <label>Họ và Tên <span className="required">*</span></label>
                <input type="text" placeholder="Nhập họ tên..." value={form.hoten} onChange={(e) => setForm({ ...form, hoten: e.target.value })} className={formErrors.hoten ? "input-error" : ""} />
                {formErrors.hoten && <div className="error-text">{formErrors.hoten}</div>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Chức vụ</label>
                  <select value={form.chucvu} onChange={(e) => setForm({ ...form, chucvu: e.target.value })}>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Số điện thoại <span className="required">*</span></label>
                  <input type="text" placeholder="VD: 0901234567" value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} className={formErrors.sdt ? "input-error" : ""} />
                  {formErrors.sdt && <div className="error-text">{formErrors.sdt}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input type="text" placeholder="Nhập địa chỉ..." value={form.diachi} onChange={(e) => setForm({ ...form, diachi: e.target.value })} />
              </div>
            </div>
            <div className="modal-form-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-save" onClick={() => setShowModal(false)}><i className="fas fa-save" style={{ marginRight: "0.4rem" }}></i>Lưu</button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon"><i className="fas fa-exclamation-triangle"></i></div>
            <h3>Xóa Nhân viên?</h3>
            <p>Chỉ xóa được nhân viên chưa liên kết phiếu khám hoặc tài khoản.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowConfirm(null)}>Hủy</button>
              <button className="btn-danger" onClick={() => setShowConfirm(null)}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
=======
        <div className="page-content" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2>Quản lý Nhân viên</h2>
            <Button type="primary" onClick={() => showModal()}>+ Thêm nhân viên mới</Button>
          </div>
          
          <Table dataSource={data} columns={columns} rowKey="manv" loading={loading} />
        </div>
      </div>

      {/* MODAL FORM THÊM/SỬA */}
      <Modal 
        title={editingItem ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"} 
        open={isModalOpen} 
        onOk={handleSave} 
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" name="nhanvien_form">
          <Form.Item name="hoten" label="Họ và Tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
            <Input placeholder="Nhập họ tên..." />
          </Form.Item>
          <Form.Item name="chucvu" label="Chức vụ" rules={[{ required: true }]}>
            <Select placeholder="Chọn chức vụ">
              <Select.Option value="Bac si">Bác sĩ</Select.Option>
              <Select.Option value="Y ta">Y tá</Select.Option>
              <Select.Option value="Ke toan">Kế toán</Select.Option>
              <Select.Option value="Ky thuat vien">Kỹ thuật viên</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="sdt" label="Số điện thoại">
            <Input placeholder="Nhập số điện thoại..." />
          </Form.Item>
          <Form.Item name="diachi" label="Địa chỉ">
            <Input placeholder="Nhập địa chỉ..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NhanVienPage;
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
