import React from "react";
import BlackListDashboard from "../../../components/admin//BlackList/BlackListDashboard";

const IndexPage = () => {
  return (
    <div className="p-4 w-full bg-white">
      <div className="text-3xl font-extrabold mb-6">블랙리스트 관리 시스템</div>
      <BlackListDashboard />
    </div>
  );
};

export default IndexPage;
