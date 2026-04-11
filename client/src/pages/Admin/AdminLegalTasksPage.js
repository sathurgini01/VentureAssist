import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminLegalTasks,
  createAdminLegalTask,
  updateAdminLegalTask,
  deleteAdminLegalTask,
} from "../../services/legalAdminService";
import { defaultLegalCategories, normalizeLegalCategory } from "../Legal/legalHelpers";
import "../../styles/AdminLegalTasks.css";
import "../../styles/AdminLegalCommon.css";

const initialForm = {
  title: "",
  category: defaultLegalCategories[0],
  description: "",
  steps: "",
  requiredDocuments: "",
  order: 1,
  active: true,
};

const AdminLegalTasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState(defaultLegalCategories);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadTasks = async () => {
    try {
      setPageLoading(true);
      const data = await getAdminLegalTasks();
      const loadedTasks = Array.isArray(data) ? data : data.tasks || data.data || [];
      const normalizedTasks = loadedTasks.map((task) => ({
        ...task,
        category: normalizeLegalCategory(task.category),
      }));
      setTasks(normalizedTasks);
      const taskCategories = Array.from(
        new Set(normalizedTasks.map((task) => task.category).filter(Boolean)),
      );
      setCategories((current) => {
        const merged = [...defaultLegalCategories];
        taskCategories.forEach((category) => {
          if (!merged.includes(category)) merged.push(category);
        });
        return merged;
      });
    } catch (error) {
      setMessage("Failed to load legal tasks");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      ...form,
      order: Number(form.order),
      steps: form.steps
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      requiredDocuments: form.requiredDocuments
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await updateAdminLegalTask(editingId, payload);
        setMessage("Task updated successfully");
      } else {
        await createAdminLegalTask(payload);
        setMessage("Task created successfully");
      }

      resetForm();
      loadTasks();
    } catch (error) {
      setMessage(error.message || "Task save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id || task.id);
    setForm({
      title: task.title || "",
      category: normalizeLegalCategory(task.category) || defaultLegalCategories[0],
      description: task.description || "",
      steps: Array.isArray(task.steps) ? task.steps.join(", ") : "",
      requiredDocuments: Array.isArray(task.requiredDocuments)
        ? task.requiredDocuments.join(", ")
        : "",
      order: task.order || 1,
      active: task.active !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm("Are you sure you want to delete this legal task?");
    if (!confirmed) return;

    try {
      await deleteAdminLegalTask(taskId);
      setMessage("Task deleted successfully");
      loadTasks();
    } catch (error) {
      setMessage(error.message || "Delete failed");
    }
  };

  return (
    <div className="admin-legal-tasks-page">
      <button
        className="admin-legal-back-btn"
        onClick={() => navigate("/admin/legal/dashboard")}
      >
        ← Back to Legal Dashboard
      </button>

      <div className="admin-legal-tasks-header">
        <h2>Legal Task Management</h2>
        <p>Create, update, and manage legal workflow tasks for users.</p>
      </div>

      {message ? <div className="admin-legal-task-alert">{message}</div> : null}

      <div className="admin-legal-task-form-card">
        <h3>{editingId ? "Edit Legal Task" : "Create Legal Task"}</h3>

        <form onSubmit={handleSubmit} className="admin-legal-task-form">
          <div className="form-grid">
            <div>
              <label>Task Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter legal task title"
                required
              />
            </div>

            <div>
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="category-add-row">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowCategoryInput((prev) => !prev)}
                >
                  + Add category
                </button>
              </div>
              {showCategoryInput ? (
                <div className="category-add-field">
                  <input
                    type="text"
                    placeholder="New category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => {
                      const trimmed = newCategory.trim()
                      if (!trimmed) {
                        setMessage("Category name cannot be empty")
                        return
                      }
                      if (categories.includes(trimmed)) {
                        setMessage("Category already exists")
                        return
                      }
                      setCategories((prev) => [...prev, trimmed])
                      setForm((prev) => ({ ...prev, category: trimmed }))
                      setNewCategory("")
                      setShowCategoryInput(false)
                      setMessage(`Category "${trimmed}" added`)
                    }}
                  >
                    Save category
                  </button>
                </div>
              ) : null}
            </div>

            <div>
              <label>Display Order</label>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
                min="0.1"
                step="0.1"
              />
            </div>

            <div className="checkbox-field">
              <label>Active Status</label>
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe what the user should do for this legal task"
              required
            />
          </div>

          <div>
            <label>Steps (comma separated)</label>
            <input
              type="text"
              name="steps"
              value={form.steps}
              onChange={handleChange}
              placeholder="Check name availability, Fill form, Submit application"
            />
          </div>

          <div>
            <label>Required Documents (comma separated)</label>
            <input
              type="text"
              name="requiredDocuments"
              value={form.requiredDocuments}
              onChange={handleChange}
              placeholder="Business Registration, Tax Certificate, Agreement"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : editingId ? "Update Task" : "Create Task"}
            </button>

            {editingId ? (
              <button type="button" className="secondary-btn" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-legal-task-list-card">
        <h3>All Legal Tasks</h3>

        {pageLoading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No legal tasks found.</p>
        ) : (
          <div className="task-table-wrapper">
            <table className="task-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Documents</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const taskId = task._id || task.id;
                  return (
                    <tr key={taskId}>
                      <td>{task.title}</td>
                      <td>{task.category}</td>
                      <td>{task.order || "-"}</td>
                      <td>{task.active === false ? "Inactive" : "Active"}</td>
                      <td>
                        {Array.isArray(task.requiredDocuments)
                          ? task.requiredDocuments.join(", ")
                          : "-"}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button onClick={() => handleEdit(task)}>Edit</button>
                          <button
                            className="danger-btn"
                            onClick={() => handleDelete(taskId)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLegalTasksPage;