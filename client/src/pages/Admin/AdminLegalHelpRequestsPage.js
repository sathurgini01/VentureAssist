import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminLegalHelpRequests } from "../../services/legalAdminService";
import "../../styles/AdminLegalCommon.css";

const AdminLegalHelpRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdminLegalHelpRequests();
        setRequests(Array.isArray(data) ? data : data.requests || []);
      } catch (error) {
        setMessage(error.message || "Failed to load help requests");
      }
    };
    load();
  }, []);

  return (
    <div>
      <button
        className="admin-legal-back-btn"
        onClick={() => navigate("/admin/legal/dashboard")}
      >
        ← Back to Legal Dashboard
      </button>

      <h2>Help Requests</h2>

      {message ? <p>{message}</p> : null}

      {requests.map((r) => (
        <div key={r._id}>
          <p>{r.message}</p>
          <p>User: {r?.userId?.name || r?.userId || "Unknown"}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminLegalHelpRequestsPage;