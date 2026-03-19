import { useEffect, useState } from "react";
import { getList, API_SERVER_HOST } from "../../api/BoardApi";
import useCustomMove from "../../hooks/useCustomMove";

const initState = {
  email: "",
  title: "",
  writer: "",
  content: "",
  viewCount: 0,
  regDate: null,
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const BoardList = () => {
  const { page, size, keyword, searchType, refresh } = useCustomMove();
  const [serverData, setServerData] = useState(initState);

  useEffect(() => {
    getList(page, size, keyword, searchType).then((data) => {
      setServerData(data);
    });
  }, [page, size, keyword, searchType, refresh]);

  return (
    <div className="board-list-wrapper">
      <div className="board-list-container">
        {/* 상단 헤더 섹션 */}
        <div className="board-header">
          <h2 className="board-title">🍯 꿀템 커뮤니티</h2>
          <p className="board-subtitle">자유롭게 정보를 나누고 소통해보세요!</p>

          <div className="board-actions">
            <span className="total-count">
              전체 게시글 {serverData.totalCount || 0}개
            </span>
            <button
              className="write-btn"
              //onClick={() => navigate("/board/register")}
            >
              글쓰기 ✍️
            </button>
          </div>
        </div>

        {/* 테이블 섹션 */}
        <div className="table-responsive">
          <table className="board-table">
            <thead>
              <tr>
                <th className="th-no">번호</th>
                <th className="th-title">제목</th>
                <th className="th-writer">작성자</th>
                <th className="th-date">날짜</th>
                <th className="th-views">조회수</th>
              </tr>
            </thead>
            <tbody>
              {serverData.dtoList && serverData.dtoList.length > 0 ? (
                serverData.dtoList.map((board) => (
                  <tr
                    key={board.bno}
                    className="board-row"
                    //onClick={() => navigate(`/board/read/${board.bno}`)}
                  >
                    <td className="td-no">{board.bno}</td>
                    <td className="td-title">
                      <div className="title-wrapper">
                        {board.uploadFileNames &&
                          board.uploadFileNames.length > 0 && (
                            <span className="img-icon">🖼️</span>
                          )}
                        <span className="title-text">{board.title}</span>
                      </div>
                    </td>
                    <td className="td-writer">{board.writer}</td>
                    <td className="td-date">
                      {board.regDate
                        ? board.regDate.substring(0, 10)
                        : "2026-03-19"}
                    </td>
                    <td className="td-views">{board.viewCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-row">
                    게시글이 존재하지 않습니다. 첫 번째 주인공이 되어보세요!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 들어갈 자리 (필요시 추가) */}
        {/* <PageComponent serverData={serverData} movePage={moveToList} /> */}
      </div>
    </div>
  );
};

export default BoardList;
