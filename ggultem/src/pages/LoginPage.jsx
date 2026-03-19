import Header from "../include/Header";
import Footer from "../include/Footer";
import LoginComponent from "../components/Member/LoginComponent";
import "./LoginPage.css"; // CSS 파일 임포트

const LoginPage = () => {
  return (
    <div className="login-page-container">
      {/* 헤더 영역 */}
      <div className="login-header-section">
        <Header />
      </div>

      {/* 로그인 컴포넌트가 배치될 중앙 박스 */}
      <div className="login-content-wrapper">
        <LoginComponent />
      </div>
      <div className="login-footer-section">
        <Footer />
      </div>
    </div>
  );
};

export default LoginPage;
