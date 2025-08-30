import React from "react";
import { useContext } from "react";
import { UserDetailContext } from "../../context/UserDetailContext";

function InfoFooter() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  return (
    <div className="bg-[#18181b] p-5 rounded-lg mt-4">
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <div
            style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#fff" }}
          >
            {userDetail?.name}
          </div>
          <div style={{ fontSize: "0.95rem", color: "#555" }}>
            {userDetail?.email}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoFooter;
