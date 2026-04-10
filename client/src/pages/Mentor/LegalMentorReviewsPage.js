import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMentorReviews, getMentorSubmissionHistory } from "../../services/legalMentorService";
import "../../styles/LegalMentor.css";

const LegalMentorReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      setMessage("");
      const [reviewsData, historyData] = await Promise.all([
        getMentorReviews(),
        getMentorSubmissionHistory(),
      ]);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch (error) {
      setMessage(error.message || "Failed to load mentor reviews");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mentor-legal-container">
      <div className="mentor-inline-actions">
        <button className="mentor-btn secondary" onClick={() => navigate('/mentor/legal/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <h2>Review Queue</h2>
      <p>Review legal submissions and approve or request changes.</p>

      {message ? <div className="mentor-alert">{message}</div> : null}

      <div className="mentor-list-grid">
        {loading ? (
          <p className="mentor-muted">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="mentor-muted">No submissions are waiting for review right now.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="mentor-card">
              <h3>{r.taskId?.title || "Untitled Task"}</h3>
              <p>
                {r.userId?.name || "Unknown User"} ({r.userId?.email || "No email"})
              </p>
              {r.mentorId ? <p>Assigned Mentor: {r.mentorId?.name || 'Mentor'}</p> : null}
              <p>Status: {r.status}</p>

              <button className="mentor-btn" onClick={() => navigate(`/mentor/legal/reviews/${r._id}`, { state: r })}>
                Review
              </button>
            </div>
          ))
        )}
      </div>

      <section className="mentor-submission-history">
        <h3>Recent Submission History</h3>
        {loading ? (
          <p className="mentor-muted">Loading submission history...</p>
        ) : history.length === 0 ? (
          <p className="mentor-muted">No submission history found yet.</p>
        ) : (
          history.slice(0, 12).map((item) => (
            <div key={item.key || item._id} className="mentor-history-item">
              <div className="mentor-history-meta">
                <strong>{item.taskId?.title || "Untitled Task"}</strong>
                <span>{item.status}</span>
              </div>
              <p className="card-muted">User: {item.userId?.name || "Unknown User"}</p>
              {item.round ? <p className="card-muted">Submission round: #{item.round}</p> : null}
              <p className="card-muted">Updated: {new Date(item.updatedAt).toLocaleString()}</p>
              {item.fileUrl ? (
                <p className="card-muted">
                  Evidence: <a href={item.fileUrl} target="_blank" rel="noreferrer">Open file</a>
                  {item.note ? ` — ${item.note}` : ''}
                </p>
              ) : null}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default LegalMentorReviewsPage;