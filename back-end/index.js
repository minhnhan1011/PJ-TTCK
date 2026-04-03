const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "qlphongkham",
});

db.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối cơ sở dữ liệu:", err);
  } else {
    console.log("Kết nối cơ sở dữ liệu thành công!");
  }
});

app.get("/", (req, res) => {
  res.send("OK SERVER");
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Message: "Bạn đã sai" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Message: "Bạn đã sai" });
      } else {
        req.name = decoded.name;
        req.matk = decoded.matk;
        next();
      }
    });
  }
};

app.get("/auth", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name, matk: req.matk });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM taikhoan WHERE tendn=? AND matkhau=?";
  db.query(sql, [req.body.tendn, req.body.matkhau], (err, data) => {
    if (err) {
      return res.json("Tài khoản hoặc mật khẩu đã sai");
    }
    if (data.length > 0) {
      const name = data[0].tendn;
      const matk = data[0].matk;
      const token = jwt.sign({ name, matk }, "jwt-secret-key", {
        expiresIn: "1d",
      });
      res.cookie("token", token);
      return res.json({ Status: "Success" });
    } else {
      return res.json({ Status: "not Success" });
    }
  });
});


// GET danh sách bác sĩ cho dropdown
app.get("/api/nhan-vien/bac-si", verifyUser, (req, res) => {
  db.query("SELECT manv, hoten FROM nhanvien WHERE chucvu = 'Bac si'", (err, data) => {
    if (err) return res.status(500).json({ message: "Lỗi truy vấn", error: err });
    res.json(data);
  });
});

// GET danh sách đăng ký khám
app.get("/api/dang-ky-kham", verifyUser, (req, res) => {
  const sql = `
    SELECT dk.madk, dk.hoten, dk.lydokham, dk.ngaydangky, dk.trangthai,
           nv.manv, nv.hoten AS tenbs
    FROM dangkykham dk
    LEFT JOIN nhanvien nv ON dk.manv = nv.manv
    ORDER BY dk.madk DESC
  `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ message: "Lỗi truy vấn", error: err });
    res.json(data);
  });
});

// POST tạo phiếu đăng ký
app.post("/api/dang-ky-kham", verifyUser, (req, res) => {
  const { hoten, lydokham, manv } = req.body;

  if (!hoten || !lydokham || !manv) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  const sql = `INSERT INTO dangkykham (hoten, manv, lydokham, ngaydangky, trangthai) VALUES (?, ?, ?, NOW(), 'Cho kham')`;
  db.query(sql, [hoten, manv, lydokham,ngaydangky, trangthai, madk], (err, result) => {
    if (err) {
      console.log("Lỗi SQL:", err);
      return res.status(500).json({ message: "Lỗi tạo phiếu", error: err });
    }
    res.status(201).json({
      madk: result.insertId,
      hoten,
      lydokham,
      manv,
      ngaydangky: new Date().toISOString().split("T")[0],
      trangthai: "Cho kham",
    });
  });
});


app.listen(4000, () => {
  console.log("Server running on port 4000");
});