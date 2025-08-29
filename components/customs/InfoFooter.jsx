import React from "react";

function InfoFooter() {
  return (
    <div className="bg-[#18181b] p-5 rounded-lg mt-4">
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/pfp.jpg"
          alt="User Avatar"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            marginRight: "16px",
            objectFit: "cover",
            background: "#e1e1e1",
          }}
        />
        <div>
          <div
            style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#fff" }}
          >
            John Doe
          </div>
          <div style={{ fontSize: "0.95rem", color: "#555" }}>
            john.doe@email.com
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoFooter;
