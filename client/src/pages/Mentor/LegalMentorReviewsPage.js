import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMentorReviews } from "../../services/legalMentorService";
import "../../styles/LegalMentor.css";

const LegalMentorReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
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
      const data = await getMentorReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message || "Failed to load mentor reviews");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mentor-legal-container">
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
              <p>Status: {r.status}</p>

              <button className="mentor-btn" onClick={() => navigate(`/mentor/legal/reviews/${r._id}`, { state: r })}>
                Review
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LegalMentorReviewsPage;