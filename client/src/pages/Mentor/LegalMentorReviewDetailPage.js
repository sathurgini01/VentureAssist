import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateSubmission } from "../../services/legalMentorService";
import "../../styles/LegalMentor.css";

const LegalMentorReviewDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!state) return <p>No data</p>;

  const handleApprove = async () => {
    try {
      setLoading(true);
      setMessage("");
      await updateSubmission(state._id, { status: "APPROVED" });
      navigate("/mentor/legal/reviews");
    } catch (error) {
      setMessage(error.message || "Failed to approve submission");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      setMessage("");
      await updateSubmission(state._id, {
        status: "CHANGES_REQUESTED",
        mentorFeedback: feedback,
      });
      navigate("/mentor/legal/reviews");
    } catch (error) {
      setMessage(error.message || "Failed to request changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mentor-legal-container">
      <h2>{state.taskId?.title}</h2>
      <p>User: {state.userId?.name}</p>
      <p>Email: {state.userId?.email}</p>

      {message ? <div className="mentor-alert">{message}</div> : null}

      <textarea
        className="mentor-textarea"
        placeholder="Write feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      <div className="mentor-inline-actions">
        <button className="mentor-btn" onClick={handleApprove} disabled={loading}>
          {loading ? "Saving..." : "Approve"}
        </button>
        <button className="mentor-btn secondary" onClick={handleReject} disabled={loading || !feedback.trim()}>
          {loading ? "Saving..." : "Request Changes"}
        </button>
      </div>
    </div>
  );
};

export default LegalMentorReviewDetailPage;