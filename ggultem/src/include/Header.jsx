import { Link } from "react-router";
import "./Header.css";
// 로고 이미지 경로를 프로젝트 구조에 맞게 수정하세요 (예: src/assets/logo.png)
import logoImg from "../assets/logo.png";

export default function Header() {
  return (
    <header className="custom-header">
      <nav className="nav-container">
        {/* 로고 영역 */}
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <img src={logoImg} alt="꿀템 로고" className="header-logo-img" />
          </Link>
        </div>

        {/* 메뉴 영역 */}
        <div className="nav-center">
          <Link to="/itemBoard" className="nav-link">
            중고거래
          </Link>
          <Link to="/report" className="nav-link">
            사기조회
          </Link>
          <Link to="/board" className="nav-link">
            커뮤니티
          </Link>
          <Link to="/notice" className="nav-link">
            공지사항
          </Link>
          <Link to="/business" className="nav-link">
            비즈니스
          </Link>
        </div>

        {/* 우측 유저 메뉴 */}
        <div className="nav-right">
          <Link to="/login" className="nav-auth-btn">
            로그인
          </Link>
        </div>
      </nav>
    </header>
  );
}
