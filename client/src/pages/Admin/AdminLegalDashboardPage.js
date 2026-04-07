import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminLegalDashboard.css";
import "../../styles/AdminLegalCommon.css";

const AdminLegalDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-legal-container">
      <button
        className="admin-legal-back-btn"
        onClick={() => navigate("/admin/dashboard")}
      >
        ← Back to Admin Dashboard
      </button>

      {/* HEADER */}
      <div className="admin-legal-header">
        <h2>Legal Management</h2>
        <p>Manage legal workflows, compliance tasks, and system legal operations.</p>
      </div>

      {/* MODULE OVERVIEW */}
      <div className="admin-legal-overview">
        <div className="overview-card">
          <h3>Legal Tasks</h3>
          <p>Manage all legal workflow tasks and requirements.</p>
          <button onClick={() => navigate("/admin/legal/tasks")}>
            Open Tasks
          </button>
        </div>

        <div className="overview-card">
          <h3>Legal Toolkits</h3>
          <p>Control legal toolkits created for users.</p>
          <button onClick={() => navigate("/admin/legal/toolkits")}>
            Open Toolkits
          </button>
        </div>

        <div className="overview-card">
          <h3>Review Queue</h3>
          <p>Monitor submissions pending approval.</p>
          <button onClick={() => navigate("/admin/legal/reviews")}>
            Open Reviews
          </button>
        </div>

        <div className="overview-card">
          <h3>Help Requests</h3>
          <p>Respond to user legal help requests.</p>
          <button onClick={() => navigate("/admin/legal/help-requests")}>
            Open Requests
          </button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="admin-legal-stats">
        <div className="stat-box">
          <h2>12</h2>
          <p>Total Tasks</p>
        </div>
        <div className="stat-box">
          <h2>5</h2>
          <p>Active Toolkits</p>
        </div>
        <div className="stat-box">
          <h2>3</h2>
          <p>Under Review</p>
        </div>
        <div className="stat-box">
          <h2>2</h2>
          <p>Help Requests</p>
        </div>
      </div>

    </div>
  );
};

export default AdminLegalDashboardPage;