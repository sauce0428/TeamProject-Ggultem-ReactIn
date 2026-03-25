import React, { useEffect, useState } from "react";
import { getList } from "../../../api/admin/BlackListApi";
import useCustomMove from "../../../hooks/useCustomMove";
import PageComponent from "../../common/PageComponent";
import BlackListModal from "./BlackListModal";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  current: 0,
};

const BlackListDashboard = () => {
  // movePage를 추가로 가져옵니다.
  const { page, size, refresh, moveToAdd, movePage } = useCustomMove();

  const [serverData, setServerData] = useState(initState);
  const [showModal, setShowModal] = useState(false);
  const [currentBlId, setCurrentBlId] = useState(null);

  useEffect(() => {
    getList({ page, size }).then((data) => {
      console.log("API 응답 데이터:", data);
      // 서버 응답이 null이거나 dtoList가 없을 경우를 대비해 기본값 설정
      setServerData(data || initState);
    });
  }, [page, size, refresh]);

  const handleClickRead = (blId) => {
    setCurrentBlId(blId);
    setShowModal(true);
  };

  const closeAfterAction = (isChanged) => {
    setShowModal(false);
    setCurrentBlId(null);
    if (isChanged) {
      // 데이터가 변경되었을 때 현재 페이지를 다시 불러옴
      movePage({ page: page });
    }
  };

  return (
    <div>
      <div>
        <h3>Blacklist Dashboard</h3>
        <div>전체 기록: {serverData.totalCount}건</div>
        <div>
          현재 페이지 차단 상태(Y):{" "}
          {/* 옵셔널 체이닝(?.)을 사용해 안전하게 필터링 */}
          {serverData.dtoList?.filter((item) => item.status === "Y").length ||
            0}
          명
        </div>
      </div>

      <hr />

      <div>
        <button onClick={moveToAdd}>신규 등록</button>
      </div>

      <table
        border="1"
        style={{
          width: "100%",
          textAlign: "center",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>EMAIL</th>
            <th>REASON</th>
            <th>ADMIN</th>
            <th>START_DATE</th>
            <th>END_DATE</th>
            <th>STATUS</th>
            <th>MANAGE</th>
          </tr>
        </thead>
        <tbody>
          {serverData.dtoList && serverData.dtoList.length > 0 ? (
            serverData.dtoList.map((item) => (
              <tr key={item.blId}>
                <td>{item.blId}</td>
                {/* 이메일이 null이면 '정보 없음' 표시 */}
                <td>{item.email || "정보 없음"}</td>
                <td>{item.reason}</td>
                <td>{item.adminId}</td>
                {/* 날짜 데이터 포맷팅 안전하게 처리 */}
                <td>{item.startDate ? item.startDate.split("T")[0] : "-"}</td>
                <td>{item.endDate ? item.endDate.split("T")[0] : "영구"}</td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => handleClickRead(item.blId)}>
                    상세보기
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">데이터가 존재하지 않습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이징: movePage 함수를 전달해야 정확한 페이지 이동이 가능합니다. */}
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <PageComponent serverData={serverData} movePage={movePage} />
      </div>

      {showModal && (
        <BlackListModal blId={currentBlId} callbackFn={closeAfterAction} />
      )}
    </div>
  );
};

export default BlackListDashboard;
