import "./Loading.css";

export default function Loading({ text = "Đang tải dữ liệu..." }) {
  return (
    <div className="loading-overlay">
      <div className="loading-box">
        <div className="loading-spinner"></div>
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
}
