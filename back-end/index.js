const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Middleware bảo vệ
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ Message: "Chưa đăng nhập" });
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) return res.status(403).json({ Message: "Token sai" });
        req.name = decoded.name;
        next();
    });
};

// --- ĐĂNG NHẬP ---
app.post("/login", (req, res) => {
    const sql = "SELECT * FROM taikhoan WHERE tendn=? AND matkhau=?";
    db.query(sql, [req.body.tendn, req.body.matkhau], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length > 0) {
            const token = jwt.sign({ name: data[0].tendn }, "jwt-secret-key", { expiresIn: "1d" });
            res.cookie("token", token);
            return res.json({ Status: "Success" });
        }
        return res.json({ Status: "Error", Message: "Sai tài khoản!" });
    });
});

// --- CÁC ROUTE CHI TIẾT ---
const nhanvienRoute = require("./nhanvien")(db);
app.use("/api/nhan-vien", verifyUser, nhanvienRoute);

const thuocRoute = require("./thuoc")(db);
app.use("/api/thuoc", verifyUser, thuocRoute);

const dichvuRoute = require("./dichvu")(db);
app.use("/api/dichvu", verifyUser, dichvuRoute);

// API phụ cho Dropdown
app.get("/api/loai-thuoc", verifyUser, (req, res) => {
    db.query("SELECT * FROM loaithuoc", (err, data) => res.json(data));
});

app.listen(4000, () => console.log("Server chạy tại port 4000"));