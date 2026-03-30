import { useEffect, useState } from "react";
import { getReportList } from "../../../api/admin/ReportApi";
import useCustomMove from "../../../hooks/useCustomMove";

const ListComponent = () => {
  const { page, size, moveToRead } = useCustomMove();
  const [serverData, setServerData] = useState({
    dtoList: [],
    totalCount: 0,
    // ... 나머지 페이징 정보 초기값
  });

  useEffect(() => {
    getReportList({ page, size }).then((data) => {
      // 데이터가 null로 넘어올 경우를 대비한 방어 코드
      if (data) {
        setServerData(data);
      }
    });
  }, [page, size]);

  return (
    <div className="notice-modify-container">
      <div className="notice-modify-title">신고 접수 목록</div>

      <table
        className="report-table"
        style={{ width: "100%", textAlign: "center" }}
      >
        <thead>
          <tr style={{ background: "#f8f9fa", height: "50px" }}>
            <th>번호</th>
            <th>유형</th>
            <th>대상자</th>
            <th>상태</th>
            <th>신고일</th>
          </tr>
        </thead>
        <tbody>
          {serverData.dtoList && serverData.dtoList.length > 0 ? (
            serverData.dtoList.map((report) => (
              <tr
                key={report.reportId}
                onClick={() => moveToRead(report.reportId)}
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  height: "50px",
                }}
              >
                {/* 1. 번호: 이건 DTO 최상위에 있어서 그대로 둡니다. */}
                <td>{report.reportId}</td>

                {/* 2. 유형: reportDTO 주머니 안에서 꺼내야 합니다. */}
                <td>{report.reportDTO?.reportType || "유형 없음"}</td>

                {/* 3. 대상자: reportDTO 주머니 안에서 꺼내야 합니다. */}
                <td>{report.reportDTO?.targetMemberId || "대상 없음"}</td>

                {/* 4. 상태: reportStatus 필드를 사용합니다. */}
                <td>{report.reportStatus}</td>

                {/* 5. 신고일: reportDTO 안의 regDate를 사용합니다. */}
                <td>
                  {report.reportDTO?.regDate
                    ? new Date(report.reportDTO.regDate).toLocaleDateString()
                    : "날짜 정보 없음"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: "50px", color: "#ccc" }}>
                접수된 신고 내역이 존재하지 않습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* 페이징 컴포넌트 위치 */}
    </div>
  );
};

export default ListComponent;
