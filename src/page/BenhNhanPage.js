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