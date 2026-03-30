import { useEffect, useState } from "react";
import { getOneReport } from "../../../api/admin/ReportApi";
import { API_SERVER_HOST } from "../../../api/config";
import ProcessComponent from "./ProcessComponent";

const ReadComponent = ({ reportId }) => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    getOneReport(reportId).then((data) => {
      // 백엔드 getRead는 ProcessedReportDTO를 반환하고 그 안에 reportDTO(원본신고)가 들어있음.
      setReport(data);
    });
  }, [reportId]);

  if (!report) return <div>로딩 중...</div>;

  // 원본 신고 정보 추출 (백엔드 필드명: reportDTO)
  const reportDetail = report.reportDTO;

  return (
    <div className="report-read-container">
      <h2>신고 상세 확인</h2>
      <div className="report-info">
        <p>
          <strong>신고 유형:</strong> {reportDetail.reportType}
        </p>
        <p>
          <strong>대상자:</strong> {reportDetail.targetMemberId} (
          {reportDetail.targetType} No.{reportDetail.targetNo})
        </p>
        <p>
          <strong>신고 사유:</strong> {reportDetail.reason || "상세 사유 없음"}
        </p>
        <p>
          <strong>신고자:</strong> {reportDetail.memberEmail}
        </p>
      </div>

      <div className="report-evidence">
        <label>증거 첨부 이미지</label>
        <div className="image-list">
          {reportDetail.uploadFileNames &&
            reportDetail.uploadFileNames.map((img, i) => (
              <img
                key={i}
                src={`${API_SERVER_HOST}/api/report/view/${img}`}
                alt="증거이미지"
                style={{
                  width: "200px",
                  margin: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            ))}
        </div>
      </div>

      <hr />

      {/* 백엔드에서 status는 Integer(0:접수, 1:완료)로 관리됩니다. */}
      {reportDetail.status === 0 ? (
        <ProcessComponent reportId={reportId} />
      ) : (
        <div className="processed-info">
          <h4>처리 완료된 신고입니다.</h4>
          <p>
            <strong>관리자 메모:</strong> {report.actionNote}
          </p>
          <p>
            <strong>처리 담당자:</strong> {report.adminEmail}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReadComponent;
