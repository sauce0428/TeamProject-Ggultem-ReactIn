import React from "react";
import { useParams } from "react-router-dom";
import ReadComponent from "../../../components/admin/ReadComponent";

const ReadPage = () => {
  const { blId } = useParams();

  return (
    <div className="p-4 w-full bg-white">
      <div className="text-2xl font-bold mb-4">제재 상세 정보 확인</div>
      <ReadComponent blId={blId} />
    </div>
  );
};

export default ReadPage;
