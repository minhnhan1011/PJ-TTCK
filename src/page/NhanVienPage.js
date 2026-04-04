import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Space, message, Modal, Form, Input, Select } from 'antd';
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./NhanVienPage.css";

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

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
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