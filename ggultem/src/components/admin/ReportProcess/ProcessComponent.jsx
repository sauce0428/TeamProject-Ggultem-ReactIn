// 신고를 수정하는 것이 아닌 신고에 대해 조치를 취하는 행위이기 때문에 Modify가 아닌 Process로 명명하였음.
// 차후 다른 컴퍼넌트의 구조와 다른 것에 대해 혼동을 방지하기 위한 주석.
// 공지사항은 일반적인 CRUD 형태이고, Report쪽은 WorkFlow 중심이라 구조가 다를 수밖에 없음.
import { useState } from "react";
import { completeReportProcess } from "../../../api/admin/ReportApi";

const ProcessComponent = ({ reportId }) => {
  // 로그인한 관리자 정보 (나중에 세션이나 리덕스에서 가져와야 함)
  const adminEmail = "admin@test.com";

  const [processData, setProcessData] = useState({
    reportId: reportId,
    adminEmail: adminEmail,
    actionNote: "", // 백엔드 actionNote와 매칭
    reportStatus: "처리완료", // 고정값
    memberStatus: 0, // 0: 일반, 2: 7일, 3: 30일, 4: 영구정지
  });

  const handleClickProcess = () => {
    if (!processData.actionNote) {
      alert("조치 내용을 입력해주세요.");
      return;
    }

    // API 호출 (기존 작성하신 completeReportProcess 사용)
    completeReportProcess(processData).then((data) => {
      alert("신고 처리가 완료되었습니다.");
      // moveToList(); // 목록 이동 로직 추가 가능
    });
  };

  return (
    <div className="process-form">
      <h3>관리자 신고 조치</h3>
      <div className="form-group">
        <label>제재 수위 선택</label>
        <select
          value={processData.memberStatus}
          onChange={(e) =>
            setProcessData({
              ...processData,
              memberStatus: parseInt(e.target.value),
            })
          }
        >
          <option value={0}>조치 없음 (반려)</option>
          <option value={2}>7일 정지</option>
          <option value={3}>30일 정지</option>
          <option value={4}>영구 정지</option>
        </select>
      </div>

      <div className="form-group">
        <label>조치 사유 (관리자 메모)</label>
        <textarea
          placeholder="사용자 정지 사유 및 조치 내용을 상세히 기록하세요."
          value={processData.actionNote}
          onChange={(e) =>
            setProcessData({ ...processData, actionNote: e.target.value })
          }
        />
      </div>

      <button className="submit-btn" onClick={handleClickProcess}>
        처리 확정
      </button>
    </div>
  );
};

export default ProcessComponent;
