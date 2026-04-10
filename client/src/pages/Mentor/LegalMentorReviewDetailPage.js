import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateSubmission, getMentorSubmissionsForUser } from "../../services/legalMentorService";
import "../../styles/LegalMentor.css";

const LegalMentorReviewDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(state);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const currentStatus = submission?.status || state?.status || "UNDER_REVIEW";

  const userId = state?.userId?._id || state?.userId;

  const loadSubmissionHistory = async () => {
    if (!userId) return;

    try {
      const data = await getMentorSubmissionsForUser(userId);
      setSubmissionHistory(data.submissions || []);
    } catch (error) {
      setMessage(error.message || "Unable to load submission history.");
    }
  };

  useEffect(() => {
    loadSubmissionHistory();
  }, [userId]);

  const handleApprove = async () => {
    try {
      setLoading(true);
      setMessage("");
      const result = await updateSubmission(submission?._id || state._id, { status: "APPROVED" });
      setSubmission(result.submission || submission);
      await loadSubmissionHistory();
      setMessage("Submission approved. History updated below.");
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
      const result = await updateSubmission(submission?._id || state._id, {
        status: "CHANGES_REQUESTED",
        mentorFeedback: feedback,
      });
      setSubmission(result.submission || submission);
      await loadSubmissionHistory();
      setMessage("Change request saved. History updated below.");
    } catch (error) {
      setMessage(error.message || "Failed to request changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mentor-legal-container">
      <div className="mentor-inline-actions">
        <button className="mentor-btn secondary" onClick={() => navigate('/mentor/legal/reviews')}>
          ← Back to Review Queue
        </button>
      </div>

      <h2>{state.taskId?.title}</h2>
      <p>User: {state.userId?.name}</p>
      <p>Email: {state.userId?.email}</p>
      {state.mentorId ? <p>Assigned Mentor: {state.mentorId?.name || 'Mentor'}</p> : null}
      <p>Status: {currentStatus}</p>

      {message ? <div className="mentor-alert">{message}</div> : null}

      {submission?.evidence && submission.evidence.length > 0 ? (
        <div className="mentor-evidence-section">
          <h3>Submitted Evidence</h3>
          {submission.evidence.map((item, index) => (
            <div key={`${item.fileUrl}-${index}`} className="mentor-evidence-item">
              <a href={item.fileUrl} target="_blank" rel="noreferrer">
                Evidence {index + 1}
              </a>
              <p className="card-muted">{item.note || 'No note provided'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="card-muted">No evidence attachments were provided for this submission.</p>
      )}

      {currentStatus === "UNDER_REVIEW" ? (
        <>
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
        </>
      ) : (
        <p className="card-muted">This submission is already reviewed. Approval/Reject actions are disabled.</p>
      )}

      <section className="mentor-submission-history">
        <h3>User Submission History</h3>
        {submissionHistory.length > 0 ? (
          submissionHistory.map((item) => (
            <div key={item.key || item._id} className="mentor-history-item">
              <div className="mentor-history-meta">
                <strong>{item.taskId?.title || 'Unknown Task'}</strong>
                <span>{item.status}</span>
              </div>
              {item.round ? <p className="card-muted">Submission round: #{item.round}</p> : null}
              <p className="card-muted">Updated: {new Date(item.updatedAt).toLocaleString()}</p>
              {item.mentorFeedback ? <p><strong>Mentor feedback:</strong> {item.mentorFeedback}</p> : null}
              {item.fileUrl ? (
                <div className="mentor-history-evidence">
                  <strong>Evidence:</strong>
                  <ul>
                    <li>
                      <a href={item.fileUrl} target="_blank" rel="noreferrer">
                        Open evidence file
                      </a>
                      {item.note ? ` — ${item.note}` : ''}
                    </li>
                  </ul>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <p className="card-muted">No previous submissions were found for this user.</p>
        )}
      </section>
    </div>
  );
};

export default LegalMentorReviewDetailPage;