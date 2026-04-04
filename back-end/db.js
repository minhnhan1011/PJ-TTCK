const mysql = require('mysql2');

// Cấu hình này chỉ chạy trên máy của Trúc (Wamp)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: '', // Wamp mặc định để trống, không ảnh hưởng đến code của bạn khác
  database: 'qlphongkham', // Tên DB trong file .sql bạn gửi
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool.promise();