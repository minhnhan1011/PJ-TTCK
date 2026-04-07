<<<<<<< HEAD
import { useState } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./ThuocPage.css";

export default function ThuocPage() {
  const [search, setSearch] = useState("");
  const [filterLoai, setFilterLoai] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ tent: "", malt: "", dongia: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);

  const openAdd = () => {
    setEditItem(null);
    setForm({ tent: "", malt: "", dongia: "" });
    setFormErrors({});
    setShowModal(true);
  };

=======
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Table, Tag, Button, Space, message, Modal, Form, Input, InputNumber, DatePicker, Select, Badge, Card, Row, Col } from 'antd';
import { SearchOutlined, AlertOutlined, BoxPlotOutlined, CalendarOutlined } from '@ant-design/icons';
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import moment from 'moment'; 
import "./ThuocPage.css"; 

const ThuocPage = () => {
  const [thuocList, setThuocList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loaiThuoc, setLoaiThuoc] = useState([]); 
  const [searchText, setSearchText] = useState(''); // State tìm kiếm
  const [filterStatus, setFilterStatus] = useState('all'); // State bộ lọc
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [resThuoc, resLoai] = await Promise.all([
        axios.get('http://localhost:4000/api/thuoc', { withCredentials: true }),
        axios.get('http://localhost:4000/api/loai-thuoc', { withCredentials: true })
      ]);
      setThuocList(Array.isArray(resThuoc.data) ? resThuoc.data : []);
      setLoaiThuoc(Array.isArray(resLoai.data) ? resLoai.data : []);
    } catch (error) {
      message.error("Lỗi tải dữ liệu!");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  // --- NGHIỆP VỤ TÌM KIẾM VÀ LỌC ---
  const filteredData = useMemo(() => {
    return thuocList.filter(item => {
      const matchSearch = item.tent.toLowerCase().includes(searchText.toLowerCase());
      const diff = moment(item.hansudung).diff(moment(), 'months');
      const isExpired = moment(item.hansudung).isBefore(moment());
      const isNearExpired = !isExpired && diff <= 6;
      const isOutStock = item.soluong <= 5;

      if (filterStatus === 'expired') return matchSearch && isExpired;
      if (filterStatus === 'warning') return matchSearch && isNearExpired;
      if (filterStatus === 'lowStock') return matchSearch && isOutStock;
      return matchSearch;
    });
  }, [thuocList, searchText, filterStatus]);

  // --- NGHIỆP VỤ THỐNG KÊ (BADGE) ---
  const stats = useMemo(() => {
    const expired = thuocList.filter(i => moment(i.hansudung).isBefore(moment())).length;
    const warning = thuocList.filter(i => {
      const d = moment(i.hansudung).diff(moment(), 'months');
      return d >= 0 && d <= 6;
    }).length;
    const lowStock = thuocList.filter(i => i.soluong <= 5).length;
    return { expired, warning, lowStock };
  }, [thuocList]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        ngaysanxuat: values.ngaysanxuat.format('YYYY-MM-DD'),
        hansudung: values.hansudung.format('YYYY-MM-DD'),
        trangthai: 'Con han'
      };

      if (editingItem) {
        await axios.put(`http://localhost:4000/api/thuoc/${editingItem.mat}`, payload, { withCredentials: true });
        message.success("Cập nhật thành công!");
      } else {
        await axios.post('http://localhost:4000/api/thuoc', payload, { withCredentials: true });
        message.success("Nhập kho thành công!");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) { message.error("Kiểm tra lại dữ liệu!"); }
  };

  const columns = [
    { title: 'TÊN THUỐC', dataIndex: 'tent', key: 'tent', render: (t) => <b>{t}</b> },
    { title: 'LOẠI', dataIndex: 'tenlt', key: 'tenlt' },
    { 
      title: 'ĐƠN GIÁ', 
      dataIndex: 'dongia', 
      render: (gia) => <span style={{color: '#059669', fontWeight: 'bold'}}>{Number(gia).toLocaleString()} đ</span> 
    },
    { 
      title: 'TỒN KHO', 
      render: (_, r) => (
        <Badge count={r.soluong <= 5 ? 'Gấp' : 0} offset={[10, 0]}>
          <b style={{ color: r.soluong <= 5 ? '#ef4444' : 'inherit' }}>{r.soluong} {r.donvi}</b>
        </Badge>
      )
    },
    { 
      title: 'THỜI HẠN', 
      render: (_, r) => (
        <div style={{ fontSize: '11px' }}>
          <div>NSX: {moment(r.ngaysanxuat).format('DD/MM/YYYY')}</div>
          <div style={{ color: '#64748b' }}>HSD: {moment(r.hansudung).format('DD/MM/YYYY')}</div>
        </div>
      )
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'hansudung',
      render: (hsd) => {
        const diff = moment(hsd).diff(moment(), 'months');
        if (moment(hsd).isBefore(moment())) return <Tag color="red">Hết hạn</Tag>;
        if (diff <= 6) return <Tag color="orange">Cảnh báo ({diff} th)</Tag>;
        return <Tag color="green">An toàn</Tag>;
      }
    },
    {
      title: 'THAO TÁC',
      render: (_, r) => (
        <Button type="link" onClick={() => {
          setEditingItem(r);
          form.setFieldsValue({...r, ngaysanxuat: moment(r.ngaysanxuat), hansudung: moment(r.hansudung)});
          setIsModalOpen(true);
        }}>Sửa</Button>
      )
    }
  ];

>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header />
        <div className="page-content">
<<<<<<< HEAD
          <div className="page-topbar">
            <div>
              <h1>Danh mục Thuốc</h1>
              <p>Quản lý danh sách thuốc, loại thuốc và đơn giá trong hệ thống.</p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-plus-circle"></i> Thêm Thuốc mới
            </button>
          </div>

          <div className="table-container">
            <div className="table-toolbar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input placeholder="Tìm kiếm theo tên thuốc..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select className="filter-select" value={filterLoai} onChange={(e) => setFilterLoai(e.target.value)}>
                <option value="">Tất cả loại</option>
              </select>
              <div style={{ fontSize: "0.85rem", color: "#6b7280", marginLeft: "auto" }}>Tổng: <strong style={{ color: "#2563eb" }}>0</strong> thuốc</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "6rem" }}>Mã thuốc</th>
                    <th>Tên thuốc</th>
                    <th>Loại thuốc</th>
                    <th style={{ textAlign: "right", width: "12rem" }}>Đơn giá (VNĐ)</th>
                    <th style={{ textAlign: "right", width: "10rem" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan="5" className="empty-state"><p>Chưa có dữ liệu</p></td></tr>
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <div>Hiển thị <strong>0</strong> thuốc</div>
            </div>
=======
          {/* PHẦN THỐNG KÊ NHANH (BADGES) */}
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={6}>
              <Card size="small" className="stat-card" onClick={() => setFilterStatus('all')} style={{cursor:'pointer', borderLeft: '4px solid #3b82f6'}}>
                <BoxPlotOutlined /> Tổng: <b>{thuocList.length}</b> loại
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="stat-card" onClick={() => setFilterStatus('lowStock')} style={{cursor:'pointer', borderLeft: '4px solid #ef4444'}}>
                <AlertOutlined style={{color:'#ef4444'}}/> Sắp hết hàng: <Badge count={stats.lowStock} />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="stat-card" onClick={() => setFilterStatus('warning')} style={{cursor:'pointer', borderLeft: '4px solid #f59e0b'}}>
                <CalendarOutlined style={{color:'#f59e0b'}}/> Sắp hết hạn: <Badge count={stats.warning} showZero color="#f59e0b" />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="stat-card" onClick={() => setFilterStatus('expired')} style={{cursor:'pointer', borderLeft: '4px solid #dc2626'}}>
                <AlertOutlined style={{color:'#dc2626'}}/> Đã hết hạn: <Badge count={stats.expired} showZero />
              </Card>
            </Col>
          </Row>

          <div className="page-header-flex" style={{marginBottom: 15}}>
            <Space size="middle">
              <Input 
                placeholder="Tìm tên thuốc..." 
                prefix={<SearchOutlined />} 
                style={{ width: 250 }} 
                onChange={e => setSearchText(e.target.value)}
              />
              <Select defaultValue="all" style={{ width: 150 }} onChange={setFilterStatus}>
                <Select.Option value="all">Tất cả thuốc</Select.Option>
                <Select.Option value="lowStock">Sắp hết hàng</Select.Option>
                <Select.Option value="warning">Sắp hết hạn</Select.Option>
                <Select.Option value="expired">Đã hết hạn</Select.Option>
              </Select>
            </Space>
            <Button type="primary" size="large" onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }}>+ Nhập thuốc</Button>
          </div>

          <div className="table-container">
            <Table dataSource={filteredData} columns={columns} rowKey="mat" loading={loading} pagination={{pageSize: 8}} />
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3><i className="fas fa-capsules" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>{editItem ? "Cập nhật Thuốc" : "Thêm Thuốc mới"}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-form-body">
              <div className="form-group">
                <label>Tên thuốc <span className="required">*</span></label>
                <input type="text" placeholder="Nhập tên thuốc..." value={form.tent} onChange={(e) => setForm({ ...form, tent: e.target.value })} className={formErrors.tent ? "input-error" : ""} />
                {formErrors.tent && <div className="error-text">{formErrors.tent}</div>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Loại thuốc</label>
                  <select value={form.malt} onChange={(e) => setForm({ ...form, malt: e.target.value })}>
                    <option value="">-- Chọn loại thuốc --</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Đơn giá (VNĐ) <span className="required">*</span></label>
                  <input type="number" placeholder="VD: 10000" value={form.dongia} onChange={(e) => setForm({ ...form, dongia: e.target.value })} className={formErrors.dongia ? "input-error" : ""} />
                  {formErrors.dongia && <div className="error-text">{formErrors.dongia}</div>}
                </div>
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
            <h3>Xóa Thuốc?</h3>
            <p>Chỉ xóa được thuốc chưa từng được kê đơn (bảng DonThuoc).</p>
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
      <Modal title={editingItem ? "Sửa thuốc" : "Nhập thuốc mới"} open={isModalOpen} onOk={handleSave} onCancel={() => setIsModalOpen(false)} width={700}>
        <Form form={form} layout="vertical">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <Form.Item name="tent" label="Tên thuốc" rules={[{required:true}]}><Input /></Form.Item>
                <Form.Item name="malt" label="Loại thuốc" rules={[{required:true}]}>
                    <Select>{loaiThuoc.map(l => <Select.Option key={l.malt} value={l.malt}>{l.tenlt}</Select.Option>)}</Select>
                </Form.Item>
                <Form.Item name="dongia" label="Đơn giá" rules={[{required:true}]}><InputNumber style={{width:'100%'}}/></Form.Item>
                <Form.Item name="soluong" label="Số lượng" rules={[{required:true}]}><InputNumber min={0} style={{width:'100%'}}/></Form.Item>
                <Form.Item name="donvi" label="Đơn vị tính" rules={[{required:true}]}>
                    <Select><Select.Option value="Viên">Viên</Select.Option><Select.Option value="Hộp">Hộp</Select.Option><Select.Option value="Lọ">Lọ</Select.Option></Select>
                </Form.Item>
                <div/>
                <Form.Item name="ngaysanxuat" label="Ngày sản xuất" rules={[{required:true}]}><DatePicker style={{width:'100%'}} format="DD/MM/YYYY"/></Form.Item>
                <Form.Item name="hansudung" label="Hạn sử dụng" rules={[{required:true}]}><DatePicker style={{width:'100%'}} format="DD/MM/YYYY"/></Form.Item>
            </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ThuocPage;
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
