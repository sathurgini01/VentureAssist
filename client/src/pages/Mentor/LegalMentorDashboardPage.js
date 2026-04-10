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
      <div className="mentor-inline-actions">
        <button className="mentor-btn secondary" onClick={() => navigate('/mentor-hub/law')}>
          ← Back to Mentor Hub
        </button>
      </div>

      <section className="mentor-dashboard-hero">
        <div>
          <p className="mentor-hero-kicker">Mentor Workspace</p>
          <h2>Legal Mentor Dashboard</h2>
          <p>Review submissions, answer help requests, and guide founders with confident legal support.</p>
        </div>
        <div className="mentor-hero-pill">Live overview</div>
      </section>

      {message ? <div className="mentor-alert">{message}</div> : null}

      <section className="mentor-section-block">
        <div className="mentor-section-heading">
          <h3>Quick Stats</h3>
          <span>At a glance</span>
        </div>

        <div className="mentor-stats">
          <div className="stat-card">
            <p className="stat-label">Pending Reviews</p>
            <h3>{loading ? "..." : reviews.length}</h3>
          </div>

          <div className="stat-card">
            <p className="stat-label">Help Requests</p>
            <h3>{loading ? "..." : requests.length}</h3>
          </div>

          <div className="stat-card stat-card-highlight">
            <p className="stat-label">Total Actions</p>
            <h3>{loading ? "..." : reviews.length + requests.length}</h3>
          </div>
        </div>
      </section>

      <section className="mentor-section-block">
        <div className="mentor-section-heading">
          <h3>Action Center</h3>
          <span>Choose a workflow</span>
        </div>

        <div className="mentor-actions">
          <div onClick={() => navigate("/mentor/legal/reviews")} className="action-card action-card-primary" role="button" tabIndex={0}>
            <h3>Review Submissions</h3>
            <p>Approve or request changes for user submissions.</p>
          </div>

          <div onClick={() => navigate("/mentor/legal/help-requests")} className="action-card" role="button" tabIndex={0}>
            <h3>Help Requests</h3>
            <p>Assist users with legal issues.</p>
          </div>

          <div onClick={() => navigate("/mentor/legal/tasks")} className="action-card" role="button" tabIndex={0}>
            <h3>Full Task Details</h3>
            <p>View the full legal tasks added by the admin.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LegalMentorDashboardPage;