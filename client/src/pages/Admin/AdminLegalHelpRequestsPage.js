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

  const formatDateTime = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleString();
  };

  const getMentorName = (request) => {
    if (request?.mentorId?.name) return request.mentorId.name;
    if (request?.mentorName) return request.mentorName;
    return "Not assigned";
  };

  return (
    <div className="admin-legal-page">
      <button
        className="admin-legal-back-btn"
        onClick={() => navigate("/admin/legal/dashboard")}
      >
        ← Back to Legal Dashboard
      </button>

      <h2 className="admin-legal-page-title">Help Requests</h2>
      <p className="admin-legal-page-subtitle">Track complete legal help request history with user questions, mentor answers, and timeline details.</p>

      {message ? <div className="admin-legal-alert">{message}</div> : null}

      <div className="admin-legal-list">
        {loading ? (
          <p>Loading help requests...</p>
        ) : requests.length === 0 ? (
          <p>No help request history found.</p>
        ) : (
          requests.map((r) => (
            <div key={r._id} className="admin-legal-item">
              <p><strong>Request ID:</strong> {r._id}</p>
              <p><strong>User:</strong> {r?.userId?.name || r?.userId || "Unknown"}</p>
              <p><strong>Email:</strong> {r?.userId?.email || "N/A"}</p>
              <p><strong>Task:</strong> {r?.taskId?.title || "General"}</p>
              <p><strong>Task Category:</strong> {r?.taskId?.category || "N/A"}</p>
              <p><strong>Task Description:</strong> {r?.taskId?.description || "N/A"}</p>
              <p><strong>Assigned Mentor:</strong> {getMentorName(r)}</p>
              <p><strong>Mentor Email:</strong> {r?.mentorId?.email || "N/A"}</p>
              <p><strong>Asked On:</strong> {formatDateTime(r?.createdAt)}</p>
              <p><strong>Last Updated:</strong> {formatDateTime(r?.updatedAt)}</p>
              <p><strong>Question:</strong> {r.message || "N/A"}</p>
              <p>
                <strong>Answer:</strong>{" "}
                {r.mentorReply ? r.mentorReply : "No mentor answer yet"}
              </p>
              <p><strong>Status:</strong> {r.status || "OPEN"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminLegalHelpRequestsPage;