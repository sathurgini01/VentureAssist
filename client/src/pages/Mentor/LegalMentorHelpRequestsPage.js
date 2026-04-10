import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMentorHelpRequests, replyToHelpRequest } from "../../services/legalMentorService";
import "../../styles/LegalMentor.css";

const LegalMentorHelpRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [replyText, setReplyText] = useState({});
  const [editingReply, setEditingReply] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

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

  const handleReply = async (requestId) => {
    const reply = (replyText[requestId] || "").trim();
    if (!reply) {
      setMessage("Enter a reply before submitting.");
      return;
    }

    try {
      setSubmittingId(requestId);
      setMessage("");
      await replyToHelpRequest(requestId, { mentorReply: reply, status: "CLOSED" });
      await load();
      setReplyText((current) => ({ ...current, [requestId]: "" }));
      setEditingReply((current) => ({ ...current, [requestId]: false }));
    } catch (error) {
      setMessage(error.message || "Failed to submit reply.");
    } finally {
      setSubmittingId(null);
    }
  };

  const startEditReply = (requestId, currentReply) => {
    setEditingReply((current) => ({ ...current, [requestId]: true }));
    setReplyText((current) => ({ ...current, [requestId]: currentReply }));
    setMessage("");
  };

  const cancelEditReply = (requestId) => {
    setEditingReply((current) => ({ ...current, [requestId]: false }));
    setReplyText((current) => ({ ...current, [requestId]: "" }));
  };

  return (
    <div className="mentor-legal-container">
      <div className="mentor-inline-actions">
        <button className="mentor-btn secondary" onClick={() => navigate('/mentor/legal/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

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
              <div className="mentor-request-header">
                <div>
                  <h3>{r.taskId?.title || "General Legal Question"}</h3>
                  {r.taskId?.category && <span className="task-category">{r.taskId.category}</span>}
                </div>
                {r.taskId?._id && (
                  <Link to={`/mentor/legal/tasks/${r.taskId._id}`} className="mentor-btn secondary mentor-task-link">
                    View Task Details
                  </Link>
                )}
              </div>
              {r.taskId?.description && (
                <div className="task-description-section">
                  <p><strong>Task Description:</strong></p>
                  <p className="task-description">{r.taskId.description}</p>
                </div>
              )}
              <div className="user-section">
                <p><strong>User:</strong> {r.userId?.name || "Unknown"}</p>
                <p><strong>Email:</strong> {r.userId?.email || "N/A"}</p>
              </div>
              <div className="user-question-section">
                <p><strong>User's Question:</strong></p>
                <p className="user-message">{r.message}</p>
              </div>
              {r.mentorReply ? (
                editingReply[r._id] ? (
                  <div className="mentor-reply-form">
                    <textarea
                      rows="4"
                      placeholder="Edit your reply here"
                      value={replyText[r._id] || ""}
                      onChange={(event) => setReplyText((current) => ({ ...current, [r._id]: event.target.value }))}
                    />
                    <div className="mentor-edit-actions">
                      <button
                        type="button"
                        className="mentor-reply-button"
                        onClick={() => handleReply(r._id)}
                        disabled={submittingId === r._id}
                      >
                        {submittingId === r._id ? "Saving…" : "Save Reply"}
                      </button>
                      <button
                        type="button"
                        className="mentor-btn secondary"
                        onClick={() => cancelEditReply(r._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mentor-reply-block">
                    <p><strong>Your Reply:</strong></p>
                    <p className="mentor-reply-text">{r.mentorReply}</p>
                    <div className="mentor-inline-actions">
                      <button
                        type="button"
                        className="mentor-btn secondary"
                        onClick={() => startEditReply(r._id, r.mentorReply)}
                      >
                        Edit
                      </button>
                    </div>
                    <p className="reply-status">(Status: Closed)</p>
                  </div>
                )
              ) : (
                <div className="mentor-reply-form">
                  <textarea
                    rows="4"
                    placeholder="Write your reply here"
                    value={replyText[r._id] || ""}
                    onChange={(event) => setReplyText((current) => ({ ...current, [r._id]: event.target.value }))}
                  />
                  <button
                    type="button"
                    className="mentor-reply-button"
                    onClick={() => handleReply(r._id)}
                    disabled={submittingId === r._id}
                  >
                    {submittingId === r._id ? "Sending…" : "Send Reply"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LegalMentorHelpRequestsPage;