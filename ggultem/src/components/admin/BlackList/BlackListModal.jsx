import React, { useEffect, useState } from "react";
import { getOne, putOne, deleteOne } from "../../../api/admin/BlackListApi";

const initState = {
  blId: 0,
  email: "", // 초기값을 null이 아닌 빈 문자열로 설정
  reason: "",
  adminId: "",
  status: "",
  startDate: "",
  endDate: "",
};

const BlackListModal = ({ blId, callbackFn }) => {
  const [blackList, setBlackList] = useState({ ...initState });

  // 1. 데이터 불러오기
  useEffect(() => {
    if (blId) {
      getOne(blId).then((data) => {
        console.log("상세 데이터 로드:", data);

        // 💡 중요: 서버 데이터가 null인 필드가 있다면 빈 문자열("")로 치환하여 에러 방지
        setBlackList({
          ...data,
          email: data.email || "",
          reason: data.reason || "",
          adminId: data.adminId || "",
          status: data.status || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
        });
      });
    }
  }, [blId]);

  const handleChange = (e) => {
    setBlackList({ ...blackList, [e.target.name]: e.target.value });
  };

  // 2. 수정 처리
  const handleClickModify = () => {
    putOne(blackList).then(() => {
      alert("수정되었습니다.");
      callbackFn(true); // 리스트 새로고침을 위해 true 전달
    });
  };

  // 3. 삭제(해제) 처리
  const handleClickDelete = () => {
    if (window.confirm("정말 차단을 해제하시겠습니까?")) {
      deleteOne(blId).then(() => {
        alert("차단이 해제되었습니다.");
        callbackFn(true);
      });
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <h3>블랙리스트 상세/수정</h3>
        <hr />

        <div style={modalStyles.formGroup}>
          <label>ID: </label>
          <input type="text" value={blackList.blId} readOnly />
        </div>

        <div style={modalStyles.formGroup}>
          <label>EMAIL: </label>
          {/* value가 null이 되지 않도록 보장됨 */}
          <input
            type="text"
            name="email"
            value={blackList.email}
            onChange={handleChange}
            readOnly
          />
        </div>

        <div style={modalStyles.formGroup}>
          <label>사유: </label>
          <textarea
            name="reason"
            value={blackList.reason}
            onChange={handleChange}
          />
        </div>

        <div style={modalStyles.formGroup}>
          <label>관리자ID: </label>
          <input
            type="text"
            name="adminId"
            value={blackList.adminId}
            onChange={handleChange}
          />
        </div>

        <div style={modalStyles.formGroup}>
          <label>종료일: </label>
          <input
            type="date"
            name="endDate"
            value={blackList.endDate ? blackList.endDate.split("T")[0] : ""}
            onChange={handleChange}
          />
        </div>

        <div style={modalStyles.buttonArea}>
          <button onClick={handleClickModify}>수정 저장</button>
          <button onClick={handleClickDelete}>차단 해제</button>
          <button onClick={() => callbackFn(false)}>닫기</button>
        </div>
      </div>
    </div>
  );
};

// 최소한의 모달 레이아웃 스타일
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "500px",
  },
  formGroup: { marginBottom: "15px" },
  buttonArea: {
    marginTop: "20px",
    textAlign: "right",
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
};

export default BlackListModal;
