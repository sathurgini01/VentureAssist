import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminLegalHelpRequests } from "../../services/legalAdminService";
import "../../styles/AdminLegalCommon.css";

const AdminLegalHelpRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAdminLegalHelpRequests();
        setRequests(Array.isArray(data) ? data : data.requests || []);
      } catch (error) {
        setMessage(error.message || "Failed to load help requests");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="admin-legal-page">
      <button
        className="admin-legal-back-btn"
        onClick={() => navigate("/admin/legal/dashboard")}
      >
        ← Back to Legal Dashboard
      </button>

      <h2 className="admin-legal-page-title">Help Requests</h2>
      <p className="admin-legal-page-subtitle">Track open user requests and legal questions raised to mentors/admin.</p>

      {message ? <div className="admin-legal-alert">{message}</div> : null}

      <div className="admin-legal-list">
        {loading ? (
          <p>Loading help requests...</p>
        ) : requests.length === 0 ? (
          <p>No open help requests found.</p>
        ) : (
          requests.map((r) => (
            <div key={r._id} className="admin-legal-item">
              <p><strong>User:</strong> {r?.userId?.name || r?.userId || "Unknown"}</p>
              <p><strong>Email:</strong> {r?.userId?.email || "N/A"}</p>
              <p><strong>Task:</strong> {r?.taskId?.title || "General"}</p>
              <p><strong>Message:</strong> {r.message}</p>
              <p><strong>Status:</strong> {r.status || "OPEN"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminLegalHelpRequestsPage;