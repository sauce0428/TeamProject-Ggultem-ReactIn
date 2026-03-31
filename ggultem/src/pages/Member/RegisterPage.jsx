import Header from "../../include/Header";
import Footer from "../../include/Footer";
import RegisterComponent from "../../components/Member/RegisterComponent";
import "./RegisterPage.css"; // CSS 파일 임포트

const RegisterPage = () => {
  return (
    <div className="sign-up-page-container">
      {/* 헤더 영역 */}
      <div className="sign-up-header-section">
        <Header />
      </div>

      {/* 로그인 컴포넌트가 배치될 중앙 박스 */}
      <div className="sign-up-content-wrapper">
        <RegisterComponent />
      </div>
      <div className="sign-up-footer-section">
        <Footer />
      </div>
    </div>
  );
};

export default RegisterPage;
