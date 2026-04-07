const express = require("express");
const mysql = require("mysql2");          // ✅ Chỉ dùng mysql2
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

// ✅ Chỉ dùng 1 lần cors
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Kết nối DB
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "qlphongkham",
  charset: "utf8mb4",
});

db.connect((err) => {
  if (err) console.error("Lỗi kết nối DB:", err);
  else console.log("Kết nối DB thành công!");
});

// ✅ Middleware xác thực token
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ Message: "Chưa đăng nhập" });
  jwt.verify(token, "jwt-secret-key", (err, decoded) => {
    if (err) return res.status(403).json({ Message: "Token không hợp lệ" });
    req.name = decoded.name;
    req.matk = decoded.matk;
    next();
  });
};

app.get("/", (req, res) => res.send("OK SERVER"));

app.get("/auth", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name, matk: req.matk });
});

// ✅ Đăng nhập — giữ cả matk để dùng cho verifyUser
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM taikhoan WHERE tendn=? AND matkhau=?";
  db.query(sql, [req.body.tendn, req.body.matkhau], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length > 0) {
      const { tendn: name, matk } = data[0];
      const token = jwt.sign({ name, matk }, "jwt-secret-key", { expiresIn: "1d" });
      res.cookie("token", token);
      return res.json({ Status: "Success" });
    }
    return res.json({ Status: "Error", Message: "Sai tài khoản hoặc mật khẩu!" });
  });
});

// ✅ Route dropdown bác sĩ
app.get("/api/nhan-vien/bac-si", verifyUser, (req, res) => {
  db.query("SELECT manv, hoten FROM nhanvien WHERE chucvu = 'Bac si'", (err, data) => {
    if (err) return res.status(500).json({ message: "Lỗi truy vấn", error: err });
    res.json(data);
  });
});

// ✅ CRUD đăng ký khám
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

app.post("/api/dang-ky-kham", verifyUser, (req, res) => {
  const { hoten, lydokham, manv } = req.body;
  if (!hoten || !lydokham || !manv)
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  const sql = "INSERT INTO dangkykham (hoten, manv, lydokham, ngaydangky, trangthai) VALUES (?, ?, ?, NOW(), 'Cho kham')";
  db.query(sql, [hoten, manv, lydokham], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi tạo phiếu", error: err });
    res.status(201).json({
      madk: result.insertId, hoten, lydokham, manv,
      ngaydangky: new Date().toISOString().split("T")[0],
      trangthai: "Cho kham",
    });
  });
});

app.put("/api/dang-ky-kham/:madk", verifyUser, (req, res) => {
  const { hoten, lydokham, manv } = req.body;
  if (!hoten || !lydokham || !manv)
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  db.query(
    "UPDATE dangkykham SET hoten=?, lydokham=?, manv=? WHERE madk=?",
    [hoten, lydokham, manv, req.params.madk],
    (err) => {
      if (err) return res.status(500).json({ message: "Lỗi cập nhật", error: err });
      res.json({ message: "Cập nhật thành công" });
    }
  );
});

app.delete("/api/dang-ky-kham/:madk", verifyUser, (req, res) => {
  db.query("DELETE FROM dangkykham WHERE madk=?", [req.params.madk], (err) => {
    if (err) return res.status(500).json({ message: "Lỗi xóa", error: err });
    res.json({ message: "Xóa thành công" });
  });
});

// ✅ Routes từ file riêng
const nhanvienRoute = require("./nhanvien")(db);
app.use("/api/nhan-vien", verifyUser, nhanvienRoute);

const thuocRoute = require("./thuoc")(db);
app.use("/api/thuoc", verifyUser, thuocRoute);

const dichvuRoute = require("./dichvu")(db);
app.use("/api/dichvu", verifyUser, dichvuRoute);

app.get("/api/loai-thuoc", verifyUser, (req, res) => {
  db.query("SELECT * FROM loaithuoc", (err, data) => {
    if (err) return res.status(500).json({ message: "Lỗi", error: err });
    res.json(data);
  });
});

// ✅ Chỉ 1 lần app.listen
app.listen(4000, () => console.log("Server chạy tại port 4000"));