import { useEffect, useState } from "react";
import {
  getReplyList,
  addReply,
  modifyReply,
  removeReply,
} from "../../api/BoardReplyApi";
import { useSelector } from "react-redux";
import useReport from "../../hooks/useReport";
import ReportModal from "../../common/ReportModal";

import "./BoardReplyComponent.css";

const BoardReplyComponent = ({ boardNo }) => {
  const [replyList, setReplyList] = useState([]);
  const [content, setContent] = useState("");
  const [openReplyNo, setOpenReplyNo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [modifyReplyNo, setModifyReplyNo] = useState(null);
  const [modifyContent, setModifyContent] = useState("");

  const loginState = useSelector((state) => state.loginSlice);
  const email = loginState?.email;

  const { showModal, setShowModal, sendReport } = useReport();
  const [targetData, setTargetData] = useState(null);

  const loadReplies = () => {
    getReplyList(boardNo).then((data) => setReplyList(data));
  };

  useEffect(() => {
    loadReplies();
  }, [boardNo]);

  const parentReplies = replyList.filter((r) => !r.parentReplyNo);
  const childReplies = replyList.filter((r) => r.parentReplyNo);

  const handleAddReply = () => {
    if (!email) return alert("로그인이 필요합니다.");
    if (!content.trim()) return alert("내용을 입력해주세요.");
    addReply({ boardNo, content, email, parentReplyNo: null }).then(() => {
      setContent("");
      loadReplies();
    });
  };

  const handleAddChildReply = (parentNo) => {
    if (!email) return alert("로그인이 필요합니다.");
    if (!replyContent.trim()) return alert("내용을 입력해주세요.");
    addReply({
      boardNo,
      content: replyContent,
      email,
      parentReplyNo: parentNo,
    }).then(() => {
      setReplyContent("");
      setOpenReplyNo(null);
      loadReplies();
    });
  };

  const handleModifySubmit = (replyNo) => {
    if (!modifyContent.trim()) return alert("내용을 입력해주세요.");
    modifyReply(replyNo, modifyContent).then(() => {
      setModifyReplyNo(null);
      setModifyContent("");
      loadReplies();
    });
  };

  const handleDelete = (replyNo) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    removeReply(replyNo).then(() => loadReplies());
  };

  const openReport = (reply) => {
    setTargetData({
      targetType: "코멘트",
      targetNo: reply.replyNo,
      targetMemberId: reply.email,
    });
    setShowModal(true);
  };

  return (
    <div className="reply-container">
      <hr className="reply-divider" />
      <h3 className="reply-title">댓글</h3>

      {/* 1. 댓글 입력 섹션 */}
      <div className="reply-input-section">
        <textarea
          className="reply-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="따뜻한 댓글 한마디를 남겨주세요 🍯"
        />
        <div className="reply-btn-group">
          <button className="reply-submit-btn" onClick={handleAddReply}>
            등록
          </button>
        </div>
      </div>

      {/* 2. 댓글 리스트 */}
      <div className="reply-list">
        {parentReplies.map((reply) => (
          <div key={reply.replyNo} className="reply-item">
            {/* 상단 정보 */}
            <div className="reply-info">
              <span className="reply-writer">{reply.writer}</span>
              <span className="reply-date">{reply.regDate?.split("T")[0]}</span>
            </div>

            {/* 본문 / 수정 모드 */}
            {modifyReplyNo === reply.replyNo ? (
              <div className="modify-box">
                <textarea
                  className="modify-textarea"
                  value={modifyContent}
                  onChange={(e) => setModifyContent(e.target.value)}
                />
                <div className="modify-btns">
                  <button onClick={() => handleModifySubmit(reply.replyNo)}>
                    완료
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setModifyReplyNo(null)}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="reply-text">
                {reply.enabled === 0 ? (
                  <span className="deleted-text">삭제된 댓글입니다.</span>
                ) : (
                  reply.content
                )}
              </div>
            )}

            {/* 액션 버튼 */}
            {reply.enabled !== 0 && (
              <div className="reply-actions">
                {email && (
                  <button
                    onClick={() => {
                      setOpenReplyNo(
                        reply.replyNo === openReplyNo ? null : reply.replyNo,
                      );
                      setReplyContent("");
                    }}
                  >
                    답글쓰기
                  </button>
                )}
                {email && reply.email === email ? (
                  <>
                    <button
                      onClick={() => {
                        setModifyReplyNo(reply.replyNo);
                        setModifyContent(reply.content);
                      }}
                    >
                      수정
                    </button>
                    <button onClick={() => handleDelete(reply.replyNo)}>
                      삭제
                    </button>
                  </>
                ) : (
                  email && (
                    <button onClick={() => openReport(reply)}>🚨 신고</button>
                  )
                )}
              </div>
            )}

            {/* 대댓글 입력창 */}
            {openReplyNo === reply.replyNo && (
              <div className="child-reply-input">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="답글을 입력하세요"
                />
                <div className="child-reply-btns">
                  <button onClick={() => handleAddChildReply(reply.replyNo)}>
                    등록
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setOpenReplyNo(null)}
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* 3. 대댓글 리스트 (들여쓰기) */}
            <div className="child-reply-list">
              {childReplies
                .filter((child) => child.parentReplyNo === reply.replyNo)
                .map((child) => (
                  <div key={child.replyNo} className="child-reply-item">
                    <div className="reply-info">
                      <span className="reply-writer">{child.writer}</span>
                      <span className="reply-date">
                        {child.regDate?.split("T")[0]}
                      </span>
                    </div>

                    {modifyReplyNo === child.replyNo ? (
                      <div className="modify-box">
                        <textarea
                          className="modify-textarea"
                          value={modifyContent}
                          onChange={(e) => setModifyContent(e.target.value)}
                        />
                        <div className="modify-btns">
                          <button
                            onClick={() => handleModifySubmit(child.replyNo)}
                          >
                            완료
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => setModifyReplyNo(null)}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="reply-text">
                        {child.enabled === 0 ? (
                          <span className="deleted-text">
                            삭제된 댓글입니다.
                          </span>
                        ) : (
                          child.content
                        )}
                      </div>
                    )}

                    <div className="reply-actions">
                      {child.enabled !== 0 && email && child.email === email ? (
                        <>
                          <button
                            onClick={() => {
                              setModifyReplyNo(child.replyNo);
                              setModifyContent(child.content);
                            }}
                          >
                            수정
                          </button>
                          <button onClick={() => handleDelete(child.replyNo)}>
                            삭제
                          </button>
                        </>
                      ) : (
                        child.enabled !== 0 &&
                        email && (
                          <button onClick={() => openReport(child)}>
                            🚨 신고
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* 신고 모달 */}
      {showModal && targetData && (
        <ReportModal
          show={showModal}
          targetData={targetData}
          callbackFn={() => setShowModal(false)}
          submitFn={sendReport}
        />
      )}
    </div>
  );
};

export default BoardReplyComponent;
