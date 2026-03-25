import axios from "axios";

// 1. 서버 호스트 설정 (본인의 백엔드 포트에 맞게 수정하세요)
export const API_SERVER_HOST = "http://localhost:8080";

// 2. 컨트롤러의 @RequestMapping("/api/admin/blacklist")과 반드시 일치해야 합니다.
const prefix = `${API_SERVER_HOST}/api/admin/blacklist`;

/**
 * [기능 1] 회원 이메일 존재 여부 확인
 * Member 테이블에 해당 이메일이 있는지 조회합니다.
 */
export const checkMemberByEmail = async (email) => {
  // 호출 경로: http://localhost:8080/api/admin/blacklist/check-email?email=...
  const res = await axios.get(`${prefix}/check-email`, {
    params: { email: email },
  });
  return res.data; // 서버에서 true 또는 false를 반환합니다.
};

/**
 * [기능 2] 블랙리스트 목록 조회 (페이징/검색)
 */
export const getList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${prefix}/list`, {
    params: { page: page, size: size },
  });
  return res.data;
};

/**
 * [기능 3] 블랙리스트 신규 등록
 */
export const postAdd = async (blackListObj) => {
  // blackListObj 구조 예시: { email: "...", reason: "...", endDate: "..." }
  const res = await axios.post(`${prefix}/`, blackListObj);
  return res.data;
};

/**
 * [기능 4] 특정 블랙리스트 상세 조회
 */
export const getOne = async (blId) => {
  const res = await axios.get(`${prefix}/${blId}`);
  return res.data;
};

/**
 * [기능 5] 블랙리스트 수정
 */
export const putOne = async (blackListObj) => {
  // URL 예시: PUT http://localhost:8080/api/admin/blacklist/1
  const res = await axios.put(`${prefix}/${blackListObj.blId}`, blackListObj);
  return res.data;
};

/**
 * [기능 6] 블랙리스트 해제 (삭제)
 */
export const deleteOne = async (blId) => {
  // URL 예시: DELETE http://localhost:8080/api/admin/blacklist/1
  const res = await axios.delete(`${prefix}/${blId}`);
  return res.data;
};
