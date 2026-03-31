import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAccessToken } from "../api/MemberApi"; // 아직 안 만든 함수
import { setCookie } from "../util/cookieUtil";
import "./KakaoRedirectPage.css";
import { useDispatch } from "react-redux";
import { login } from "../slice/loginSlice";
import useCustomLogin from "../hooks/useCustomLogin";

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const authCode = searchParams.get("code"); // URL에서 code 추출
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { moveToPath } = useCustomLogin();
  const isProcessing = useRef(false);

  useEffect(() => {
    if (authCode) {
      if (isProcessing.current || !authCode) return;
      isProcessing.current = true;

      getAccessToken(authCode)
        .then((memberInfo) => {
          console.log("로그인 성공 데이터:", memberInfo);

          dispatch(login(memberInfo));

          if (memberInfo && !memberInfo.error) {
            alert(`${memberInfo.nickname}님, 환영합니다! 🍯`);
            moveToPath("/");
          }
        })
        .catch((err) => {
          console.error("로그인 에러 상세:", err);

          // 서버에서 ResponseEntity로 보냈다면 data.error에 담겨옵니다.
          const errorStatus = err.response?.data?.error;

          if (errorStatus === "DELETED_USER") {
            alert("탈퇴한 계정입니다. 재가입은 고객센터에 문의해주세요.");
            navigate("/", { replace: true });
          } else if (errorStatus === "STOP_USER") {
            alert("정지된 계정입니다. 고객센터에 문의해주세요.");
            navigate("/", { replace: true });
          } else {
            alert("로그인 중 오류가 발생했습니다.");
            navigate("/login", { replace: true });
          }
        })
        .finally(() => {
          isProcessing.current = false;
        });
    }
  }, [authCode, dispatch, navigate, moveToPath]);

  return (
    <div className="google-loading-wrapper">
      <div className="google-loading-container">
        {/* 꿀단지 애니메이션 효과를 위한 아이콘 공간 */}
        <div className="google-loading-honey">🍯</div>
        <div className="google-loading-text">카카오 로그인 중입니다...</div>
        <div className="google-loading-bar">
          <div className="google-loading-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default KakaoRedirectPage;
