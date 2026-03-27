import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import "./homePage.css";

function HomePage() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <div className="content">
          <Header />
        </div>
      </div>
    </div>
  );
}

export default HomePage;