import React, { useEffect, useState } from "react";
import { getOne, deleteOne } from "../../../api/admin/BlackListApi";
import { useNavigate } from "react-router";

const ReadComponent = ({ blId }) => {
  const [blackList, setBlackList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (blId) {
      getOne(blId)
        .then((data) => {
          setBlackList(data);
        })
        .catch((err) => {
          console.error("상세 정보 로딩 실패:", err);
          alert("데이터를 불러올 수 없습니다.");
        });
    }
  }, [blId]);

  const handleDelete = () => {
    if (window.confirm("제재 내역을 해제(삭제)하시겠습니까?")) {
      deleteOne(blId)
        .then(() => {
          alert("삭제되었습니다.");
          // 목록으로 돌아갈 때 캐시 무시를 위해 날짜 파라미터를 쓰기도 함
          navigate("/admin/blacklist/list");
        })
        .catch((err) => {
          console.error("삭제 중 오류:", err);
          alert("삭제에 실패했습니다. (서버 에러)");
        });
    }
  };

  if (!blackList) return <div className="loading">데이터를 불러오는 중...</div>;

  return (
    <div className="codegroupinfo-wrapper">
      <div className="codegroupinfo-container">
        <div className="codegroupinfo-header">
          <h2 className="codegroupinfo-title">블랙리스트 상세 정보</h2>
          <div className="codegroupinfo-actions">
            <button
              className="codegroupinfo-btn modify"
              onClick={() => navigate(`/admin/blacklist/modify/${blId}`)}
            >
              수정하기
            </button>
            <button className="codegroupinfo-btn delete" onClick={handleDelete}>
              삭제하기
            </button>
            <button
              className="codegroupinfo-btn list"
              onClick={() => navigate("/admin/blacklist/list")}
            >
              목록으로
            </button>
          </div>
        </div>

        <div className="codegroupinfo-details">
          <div className="codegroupinfo-row">
            <label>제재 번호</label>
            <span>{blackList.blId}</span>
          </div>
          <div className="codegroupinfo-row">
            <label>대상 이메일</label>
            {/* ✅ userId -> email로 수정 */}
            <span>{blackList.email || "정보 없음"}</span>
          </div>
          <div className="codegroupinfo-row">
            <label>제재 사유</label>
            <span>{blackList.reason || "입력된 사유 없음"}</span>
          </div>
          <div className="codegroupinfo-row">
            <label>처리 관리자</label>
            <span>{blackList.adminId || "-"}</span>
          </div>
          <div className="codegroupinfo-row">
            <label>상태</label>
            <span
              style={{
                color: blackList.status === "Y" ? "red" : "blue",
                fontWeight: "bold",
              }}
            >
              {blackList.status === "Y" ? "제재중 (활동제한)" : "해제됨"}
            </span>
          </div>
          <div className="codegroupinfo-row">
            <label>제재 시작일</label>
            <span>
              {blackList.startDate
                ? blackList.startDate.replace("T", " ")
                : "-"}
            </span>
          </div>
          <div className="codegroupinfo-row">
            <label>제재 종료일</label>
            <span>
              {blackList.endDate
                ? blackList.endDate.replace("T", " ")
                : "영구 제재"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadComponent;
