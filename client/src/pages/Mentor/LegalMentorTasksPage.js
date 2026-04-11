import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from '../../components/Card'
import { getLegalTasks } from '../../services/legalSupportService'
import '../../styles/LegalMentor.css'

const LegalMentorTasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setMessage("");
        const data = await getLegalTasks();
        setTasks(Array.isArray(data) ? data : data?.tasks || []);
      } catch (error) {
        setMessage(error.message || "Failed to load legal tasks.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  return (
    <div className="mentor-legal-container">
      <div className="mentor-inline-actions">
        <button className="mentor-btn secondary" onClick={() => navigate('/mentor/legal/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="mentor-task-list-header">
        <h2>Legal Task Library</h2>
        <p>Browse full tasks created by the admin and open any task for complete details.</p>
      </div>

      {message && <div className="mentor-alert">{message}</div>}

      {loading ? (
        <p className="mentor-muted">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="mentor-muted">No legal tasks are currently available.</p>
      ) : (
        <div className="mentor-task-list-grid">
          {tasks.map((task) => (
            <div key={task._id} className="mentor-task-card">
              <div className="mentor-request-header">
                <div>
                  <h3>{task.title}</h3>
                  <p className="task-category">{task.category || 'General'}</p>
                </div>
              </div>
              <p className="task-description">{task.description || 'No description provided.'}</p>
              <div className="mentor-card-footer">
                <Link to={`/mentor/legal/tasks/${task._id}`} className="mentor-btn secondary mentor-task-link">
                  View Full Task Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LegalMentorTasksPage;
