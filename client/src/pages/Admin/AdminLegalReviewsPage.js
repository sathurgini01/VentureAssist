import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminLegalReviews } from "../../services/legalAdminService";
import "../../styles/AdminLegalCommon.css";

const AdminLegalReviewsPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdminLegalReviews();
        setReviews(Array.isArray(data) ? data : data.submissions || []);
      } catch (error) {
        setMessage(error.message || "Failed to load reviews");
      }
    };
    load();
  }, []);

  return (
    <div>
      <button
        className="admin-legal-back-btn"
        onClick={() => navigate("/admin/legal/dashboard")}
      >
        ← Back to Legal Dashboard
      </button>

      <h2>Review Queue</h2>

      {message ? <p>{message}</p> : null}

      {reviews.map((r) => (
        <div key={r._id}>
          <p>{r?.taskId?.title || r.title || "Submission"}</p>
          <p>Status: {r.status}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminLegalReviewsPage;