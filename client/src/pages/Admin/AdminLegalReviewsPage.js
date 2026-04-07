import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminLegalReviews } from "../../services/legalAdminService";
import "../../styles/AdminLegalCommon.css";

const AdminLegalReviewsPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAdminLegalReviews();
        setReviews(Array.isArray(data) ? data : data.submissions || []);
      } catch (error) {
        setMessage(error.message || "Failed to load reviews");
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

      <h2 className="admin-legal-page-title">Review Queue</h2>
      <p className="admin-legal-page-subtitle">Monitor legal submissions currently waiting for mentor/admin actions.</p>

      {message ? <div className="admin-legal-alert">{message}</div> : null}

      <div className="admin-legal-list">
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No submissions are under review at the moment.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="admin-legal-item">
              <p><strong>Task:</strong> {r?.taskId?.title || r.title || "Submission"}</p>
              <p><strong>User:</strong> {r?.userId?.name || "Unknown"} ({r?.userId?.email || "N/A"})</p>
              <p><strong>Status:</strong> {r.status}</p>
              {r?.mentorFeedback ? <p><strong>Mentor Feedback:</strong> {r.mentorFeedback}</p> : null}
              {r?.adminFeedback ? <p><strong>Admin Feedback:</strong> {r.adminFeedback}</p> : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminLegalReviewsPage;