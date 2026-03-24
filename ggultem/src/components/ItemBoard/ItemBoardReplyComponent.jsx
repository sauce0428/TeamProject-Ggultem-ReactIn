import { useEffect, useState } from "react";
import {
  getReplyList,
  addReply,
  modifyReply,
  removeReply,
} from "../../api/ItemBoardReplyApi";
import { useSelector } from "react-redux";

const ItemBoardReplyComponent = ({ itemId }) => {
  const [replyList, setReplyList] = useState([]);
  const [content, setContent] = useState("");

  const [openReplyNo, setOpenReplyNo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const [modifyReplyNo, setModifyReplyNo] = useState(null);
  const [modifyContent, setModifyContent] = useState("");

  // 로그인 정보
  const loginState = useSelector((state) => state.loginSlice);
  const email = loginState?.email;

  const loadReplies = () => {
    if (!itemId) return;
    getReplyList(itemId).then((data) => {
      setReplyList(data);
    });
  };

  useEffect(() => {
    loadReplies();
  }, [itemId]);

  // 댓글 등록
  const handleAddReply = () => {
    if (!email) return alert("로그인이 필요합니다.");
    if (!content.trim()) return alert("내용 입력");

    // 400 에러 방지를 위해 숫자 타입 강제 변환 및 필드 정제
    const replyObj = {
      itemId: Number(itemId), // Long 타입 대응 (숫자)
      content: content,
      email: email,
      parentReplyNo: 0,
      enabled: 1,
    };

    addReply(replyObj)
      .then(() => {
        setContent("");
        loadReplies();
      })
      .catch((err) => {
        console.error("Payload 확인 요망:", replyObj);
        alert("등록 실패: 데이터 형식을 확인하세요.");
      });
  };

  // 대댓글 등록
  const handleAddChildReply = (parentNo) => {
    if (!email) return alert("로그인이 필요합니다.");
    if (!replyContent.trim()) return alert("내용 입력");

    const childReplyObj = {
      itemId: Number(itemId),
      content: replyContent,
      email: email,
      parentReplyNo: Number(parentNo), // 확실하게 숫자로 전달
      enabled: 1,
    };

    addReply(childReplyObj).then(() => {
      setReplyContent("");
      setOpenReplyNo(null);
      loadReplies();
    });
  };

  const handleModify = (reply) => {
    setModifyReplyNo(reply.replyNo);
    setModifyContent(reply.content);
  };

  const handleModifySubmit = (replyNo) => {
    if (!modifyContent.trim()) return alert("내용 입력");

    // 수정 시 필요한 최소한의 정보를 객체로 만듭니다.
    const modifyObj = {
      replyNo: replyNo,
      content: modifyContent,
      enabled: 1, // 수정 후에도 활성 상태 유지
    };

    modifyReply(replyNo, modifyObj) // 객체 전체를 전달
      .then(() => {
        setModifyReplyNo(null);
        setModifyContent("");
        loadReplies(); // 다시 불러오기
      })
      .catch((err) => {
        alert("수정 실패");
      });
  };
  const handleDelete = (replyNo) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    removeReply(replyNo).then(() => {
      loadReplies();
    });
  };

  return (
    <div className="reply-wrapper" style={{ marginTop: "20px" }}>
      <hr />
      <h3>댓글 ({replyList.length})</h3>

      {/* 입력 영역 */}
      <div style={{ marginBottom: "20px" }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요"
          style={{ width: "100%", height: "80px", padding: "10px" }}
        />
        <button onClick={handleAddReply} style={{ marginTop: "5px" }}>
          등록
        </button>
      </div>

      {/* 리스트 영역 */}
      {replyList.map((reply) => (
        <div
          key={reply.replyNo}
          style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}
        >
          <strong>{reply.email}</strong>

          <div style={{ margin: "5px 0" }}>
            {modifyReplyNo === reply.replyNo ? (
              <>
                <textarea
                  value={modifyContent}
                  onChange={(e) => setModifyContent(e.target.value)}
                />
                <button onClick={() => handleModifySubmit(reply.replyNo)}>
                  완료
                </button>
                <button onClick={() => setModifyReplyNo(null)}>취소</button>
              </>
            ) : (
              <div>
                {reply.enabled === 0 ? "삭제된 댓글입니다" : reply.content}
              </div>
            )}
          </div>

          <div style={{ fontSize: "12px", color: "#666" }}>
            {reply.enabled !== 0 && (
              <>
                {email && (
                  <span
                    onClick={() => setOpenReplyNo(reply.replyNo)}
                    style={{ cursor: "pointer", marginRight: "10px" }}
                  >
                    답글
                  </span>
                )}
                {reply.email === email && (
                  <>
                    <span
                      onClick={() => handleModify(reply)}
                      style={{ cursor: "pointer", marginRight: "10px" }}
                    >
                      수정
                    </span>
                    <span
                      onClick={() => handleDelete(reply.replyNo)}
                      style={{ cursor: "pointer" }}
                    >
                      삭제
                    </span>
                  </>
                )}
              </>
            )}
          </div>

          {/* 대댓글 입력창 */}
          {openReplyNo === reply.replyNo && (
            <div style={{ marginLeft: "20px", marginTop: "10px" }}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="답글 입력"
              />
              <button onClick={() => handleAddChildReply(reply.replyNo)}>
                등록
              </button>
              <button onClick={() => setOpenReplyNo(null)}>취소</button>
            </div>
          )}

          {/* 대댓글 리스트 */}
          <div style={{ marginLeft: "20px", backgroundColor: "#f9f9f9" }}>
            {reply.childList?.map((child) => (
              <div
                key={child.replyNo}
                style={{ padding: "5px", borderBottom: "1px dashed #ddd" }}
              >
                <strong>ㄴ {child.email}</strong>
                <div>
                  {modifyReplyNo === child.replyNo ? (
                    <>
                      <input
                        value={modifyContent}
                        onChange={(e) => setModifyContent(e.target.value)}
                      />
                      <button onClick={() => handleModifySubmit(child.replyNo)}>
                        완료
                      </button>
                    </>
                  ) : child.enabled === 0 ? (
                    "삭제된 댓글"
                  ) : (
                    child.content
                  )}
                </div>
                {child.enabled !== 0 && child.email === email && (
                  <div style={{ fontSize: "11px" }}>
                    <span
                      onClick={() => handleModify(child)}
                      style={{ cursor: "pointer", marginRight: "5px" }}
                    >
                      수정
                    </span>
                    <span
                      onClick={() => handleDelete(child.replyNo)}
                      style={{ cursor: "pointer" }}
                    >
                      삭제
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemBoardReplyComponent;
