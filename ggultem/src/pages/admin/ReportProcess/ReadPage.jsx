import { useParams } from "react-router-dom";
import ReadComponent from "../../../components/admin/ReportProcess/ReadComponent";

const ReadPage = () => {
  const { reportId } = useParams();

  // ⭐ 파라미터 뒤에 붙은 쿼리스트링(?page=...)을 제거하고 순수 숫자 ID만 추출
  const cleanReportId = reportId ? reportId.split("?")[0] : null;

  return (
    <div className="notice-page-wrapper">
      <main className="notice-main-content">
        {/* 정제된 숫자 ID를 컴포넌트에 전달 */}
        <ReadComponent reportId={cleanReportId} />
      </main>
    </div>
  );
};

export default ReadPage;
