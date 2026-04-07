import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMentorReviews, getMentorHelpRequests } from "../../services/legalMentorService";
import "../../styles/LegalMentor.css";

const LegalMentorDashboardPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setMessage("");
      const [reviewData, requestData] = await Promise.all([
        getMentorReviews(),
        getMentorHelpRequests(),
      ]);

      setReviews(Array.isArray(reviewData) ? reviewData : []);
      setRequests(Array.isArray(requestData) ? requestData : []);
    } catch (error) {
      setMessage(error.message || "Failed to load mentor legal dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mentor-legal-container">

      <h2>Legal Mentor Dashboard</h2>
      <p>Review submissions and support users with legal guidance.</p>
      {message ? <div className="mentor-alert">{message}</div> : null}

      {/* STATS */}
      <div className="mentor-stats">
        <div className="stat-card">
          <h3>{loading ? "..." : reviews.length}</h3>
          <p>Pending Reviews</p>
        </div>

        <div className="stat-card">
          <h3>{loading ? "..." : requests.length}</h3>
          <p>Help Requests</p>
        </div>
      </div>

      {/* ACTION CARDS */}
      <div className="mentor-actions">
        <div onClick={() => navigate("/mentor/legal/reviews")} className="action-card">
          <h3>Review Submissions</h3>
          <p>Approve or request changes for user submissions.</p>
        </div>

        <div onClick={() => navigate("/mentor/legal/help-requests")} className="action-card">
          <h3>Help Requests</h3>
          <p>Assist users with legal issues.</p>
        </div>
      </div>

    </div>
  );
};

export default LegalMentorDashboardPage;