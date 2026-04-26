import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Table, Button, Space, message, Modal, Form, Input, Select, Tag } from 'antd'; // Thêm import Tag
import { SearchOutlined } from '@ant-design/icons';
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./NhanVienPage.css";

const NhanVienPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/nhanvien', { withCredentials: true });
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      message.error("Không thể lấy dữ liệu nhân viên!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredData = useMemo(() => {
    const lowerSearch = searchText.toLowerCase();
    return data.filter(item => 
      item.hoten.toLowerCase().includes(lowerSearch) || 
      item.chucvu.toLowerCase().includes(lowerSearch)
    );
  }, [data, searchText]);

  const showModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        await axios.put(`http://localhost:4000/api/nhanvien/${editingItem.manv}`, values, { withCredentials: true });
        message.success("Cập nhật thành công!");
      } else {
        await axios.post('http://localhost:4000/api/nhanvien', values, { withCredentials: true });
        message.success("Thêm mới thành công!");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      if (!error.errorFields) message.error("Lỗi lưu dữ liệu!");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      okText: 'Xóa',
      okType: 'danger',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:4000/api/nhanvien/${id}`, { withCredentials: true });
          message.success("Đã xóa!");
          loadData();
        } catch (error) { message.error("Lỗi xóa!"); }
      },
    });
  };

  // THÊM CỘT TRẠNG THÁI VÀO ĐÂY
  const columns = [
    { title: 'Mã NV', dataIndex: 'manv', key: 'manv', width: 80 },
    { title: 'Họ tên', dataIndex: 'hoten', key: 'hoten' },
    { title: 'Chức vụ', dataIndex: 'chucvu', key: 'chucvu' },
    { title: 'Số điện thoại', dataIndex: 'sdt', key: 'sdt' },
    { title: 'Địa chỉ', dataIndex: 'diachi', key: 'diachi' },
    {
      title: 'Trạng thái',
      dataIndex: 'trangthai',
      key: 'trangthai',
      render: (trangthai) => {
        // Render màu sắc tùy theo trạng thái
        let color = trangthai === 1 ? 'green' : 'volcano';
        let text = trangthai === 1 ? 'Đang làm' : 'Nghỉ làm';
        return <Tag color={color}>{text}</Tag>;
      }
    },
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
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontWeight: 'bold', margin: 0 }}>Quản lý Nhân viên</h2>
            
            <Input 
              placeholder="Tìm theo tên hoặc chức vụ..." 
              prefix={<SearchOutlined />} 
              style={{ width: 350, borderRadius: '8px' }} 
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />

            <Button type="primary" size="large" onClick={() => showModal()}>+ Thêm nhân viên mới</Button>
          </div>
          
          <div className="table-container" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
            <Table 
              dataSource={filteredData} 
              columns={columns} 
              rowKey="manv" 
              loading={loading} 
              pagination={{ pageSize: 7 }} 
            />
          </div>
        </div>
      </div>

      <Modal 
        title={editingItem ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"} 
        open={isModalOpen} 
        onOk={handleSave} 
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
          <Form.Item name="hoten" label="Họ và Tên" rules={[{ required: true, message: 'Nhập họ tên!' }]}>
            <Input placeholder="Ví dụ: Nguyễn Lê Thanh Trúc" />
          </Form.Item>
          
          <Form.Item name="chucvu" label="Chức vụ" rules={[{ required: true, message: 'Chọn chức vụ!' }]}>
            <Select placeholder="Chọn chức vụ">
              <Select.Option value="Bac si">Bác sĩ</Select.Option>
              <Select.Option value="Y ta">Y tá</Select.Option>
              <Select.Option value="Ke toan">Kế toán</Select.Option>
              <Select.Option value="Ky thuat vien">Kỹ thuật viên</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="sdt" 
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Nhập số điện thoại!' },
              { pattern: /^[0-9]{10}$/, message: 'Phải đúng 10 chữ số!' }
            ]}
          >
            <Input placeholder="Nhập 10 chữ số..." maxLength={10} />
          </Form.Item>

          <Form.Item name="diachi" label="Địa chỉ">
            <Input.TextArea placeholder="Nhập địa chỉ..." rows={2} />
          </Form.Item>

          {/* THÊM TRƯỜNG CHỌN TRẠNG THÁI VÀO FORM */}
          <Form.Item 
            name="trangthai" 
            label="Trạng thái" 
            rules={[{ required: true, message: 'Chọn trạng thái!' }]}
            initialValue={1} // Mặc định khi mở form thêm mới là "Đang làm"
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value={1}>Đang làm</Select.Option>
              <Select.Option value={0}>Nghỉ làm</Select.Option>
            </Select>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default NhanVienPage;