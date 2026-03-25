import React, { useState } from "react";
import { postAdd, checkMemberByEmail } from "../../../api/admin/BlackListApi";
import useCustomMove from "../../../hooks/useCustomMove";

const initState = {
  email: "",
  reason: "",
  endDate: "", // yyyy-MM-dd 형식 저장
};

const AddComponent = () => {
  const [blackList, setBlackList] = useState({ ...initState });
  const [isVerifying, setIsVerifying] = useState(false);
  const { moveToBlackListList } = useCustomMove();

  const handleChange = (e) => {
    setBlackList({ ...blackList, [e.target.name]: e.target.value });
  };

  const handleClickAdd = async () => {
    // 1. 필수 입력값 체크
    if (!blackList.email) {
      alert("차단할 유저의 이메일을 입력해주세요.");
      return;
    }

    setIsVerifying(true);

    try {
      // 2. [검증] Member 테이블에 해당 이메일이 있는지 확인
      const exists = await checkMemberByEmail(blackList.email);

      if (!exists) {
        alert(
          "존재하지 않는 회원 이메일입니다. 가입된 회원만 차단 가능합니다.",
        );
        setIsVerifying(false);
        return;
      }

      // 3. [데이터 보정]
      // LocalDateTime(yyyy-MM-dd'T'HH:mm:ss) 형식을 맞추기 위해 초 단위까지 명시합니다.
      const dataToSend = {
        email: blackList.email,
        reason: blackList.reason || "사유 없음",
        adminId: "admin_01", // 백엔드 DTO에 전달될 필수 관리자 ID
        status: "Y", // 초기 상태값
        // 날짜가 있다면 T23:59:59를 붙여 문자열 완성, 없으면 null 전송
        endDate: blackList.endDate ? `${blackList.endDate}T23:59:59` : null,
      };

      console.log("서버로 전송되는 최종 데이터:", dataToSend);

      // 4. [서버 전송]
      const result = await postAdd(dataToSend);
      console.log("등록 결과:", result);

      alert("해당 유저가 블랙리스트에 등록되었습니다.");
      moveToBlackListList();
    } catch (error) {
      // 콘솔에서 구체적인 500 에러 원인을 파악하기 위해 error 객체 전체를 출력합니다.
      console.error(
        "차단 등록 중 상세 오류:",
        error.response?.data || error.message,
      );
      alert(
        "등록에 실패했습니다. 입력한 이메일이나 날짜 형식을 다시 확인해주세요.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h3 style={{ marginBottom: "20px" }}>신규 블랙리스트 등록</h3>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          차단 대상 이메일
        </label>
        <input
          type="email"
          name="email"
          value={blackList.email}
          onChange={handleChange}
          placeholder="user@example.com"
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          차단 사유
        </label>
        <textarea
          name="reason"
          value={blackList.reason}
          onChange={handleChange}
          placeholder="차단 사유를 상세히 입력하세요"
          style={{ width: "100%", padding: "8px", minHeight: "100px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          차단 종료일
        </label>
        <input
          type="date"
          name="endDate"
          value={blackList.endDate}
          onChange={handleChange}
          style={{ padding: "8px" }}
        />
        <span style={{ fontSize: "12px", color: "#888", marginLeft: "10px" }}>
          (미지정 시 영구 차단)
        </span>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleClickAdd}
          disabled={isVerifying}
          style={{
            padding: "10px 20px",
            backgroundColor: isVerifying ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isVerifying ? "not-allowed" : "pointer",
          }}
        >
          {isVerifying ? "유저 확인 중..." : "차단 등록"}
        </button>
        <button
          onClick={moveToBlackListList}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default AddComponent;
