import React, { useEffect, useState } from "react";
import { getMentorHelpRequests } from "../../services/legalMentorService";
import "../../styles/LegalMentor.css";

const LegalMentorHelpRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      setMessage("");
      const data = await getMentorHelpRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message || "Failed to load help requests");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mentor-legal-container">
      <h2>Help Requests</h2>
      <p>Support users with task-specific legal questions.</p>

      {message ? <div className="mentor-alert">{message}</div> : null}

      <div className="mentor-list-grid">
        {loading ? (
          <p className="mentor-muted">Loading help requests...</p>
        ) : requests.length === 0 ? (
          <p className="mentor-muted">No open help requests at the moment.</p>
        ) : (
          requests.map((r) => (
            <div key={r._id} className="mentor-card">
              <h3>{r.taskId?.title || "General Legal Task"}</h3>
              <p><strong>User:</strong> {r.userId?.name || "Unknown"}</p>
              <p><strong>Email:</strong> {r.userId?.email || "N/A"}</p>
              <p><strong>Message:</strong> {r.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LegalMentorHelpRequestsPage;