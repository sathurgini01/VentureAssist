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

  const formatDateTime = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleString();
  };

  const resolveMentor = (review) => {
    if (review?.mentorId?.name) return review.mentorId.name;
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

      <h2 className="admin-legal-page-title">Review Queue</h2>
      <p className="admin-legal-page-subtitle">View full submission review history with task, user, mentor, evidence, feedback, and timeline details.</p>

      {message ? <div className="admin-legal-alert">{message}</div> : null}

      <div className="admin-legal-list">
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No review history found.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.key || r._id} className="admin-legal-item">
              <p><strong>Submission ID:</strong> {r.submissionId || r._id || "N/A"}</p>
              <p><strong>Review Round:</strong> {r.round || "N/A"}</p>
              <p><strong>Task:</strong> {r?.taskId?.title || "Submission"}</p>
              <p><strong>Task Category:</strong> {r?.taskId?.category || "N/A"}</p>
              <p><strong>User:</strong> {r?.userId?.name || "Unknown"}</p>
              <p><strong>User Email:</strong> {r?.userId?.email || "N/A"}</p>
              <p><strong>Assigned Mentor:</strong> {resolveMentor(r)}</p>
              <p><strong>Mentor Email:</strong> {r?.mentorId?.email || "N/A"}</p>
              <p>
                <strong>Evidence File:</strong>{" "}
                {r.fileUrl ? (
                  <a href={r.fileUrl} target="_blank" rel="noreferrer">
                    View Uploaded Evidence
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p><strong>Submission Note:</strong> {r.note || "N/A"}</p>
              <p><strong>Submitted At:</strong> {formatDateTime(r.submittedAt)}</p>
              <p><strong>Reviewed At:</strong> {formatDateTime(r.reviewedAt)}</p>
              <p><strong>Last Updated:</strong> {formatDateTime(r.updatedAt)}</p>
              <p><strong>Status:</strong> {r.status || "N/A"}</p>
              <p><strong>Mentor Feedback:</strong> {r.mentorFeedback || "No mentor feedback"}</p>
              <p><strong>Admin Feedback:</strong> {r.adminFeedback || "No admin feedback"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminLegalReviewsPage;