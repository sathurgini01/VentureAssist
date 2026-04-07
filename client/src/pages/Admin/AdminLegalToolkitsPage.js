import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminLegalToolkits,
  createToolkit,
  updateToolkit,
  deleteToolkit,
} from "../../services/legalAdminService";
import "../../styles/AdminLegalToolkits.css";
import "../../styles/AdminLegalCommon.css";

const initialForm = {
  title: "",
  category: "Registration & Structure",
  description: "",
  url: "",
  tags: "",
  active: true,
};

const AdminLegalToolkitsPage = () => {
  const navigate = useNavigate();
  const [toolkits, setToolkits] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadToolkits = async () => {
    try {
      const data = await getAdminLegalToolkits();
      setToolkits(Array.isArray(data) ? data : data.toolkits || []);
    } catch (error) {
      setMessage(error.message || "Failed to load toolkits");
    }
  };

  useEffect(() => {
    loadToolkits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      url: form.url.trim(),
      tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      active: Boolean(form.active),
    };

    try {
      if (editingId) {
        await updateToolkit(editingId, payload);
        setMessage("Toolkit updated");
      } else {
        await createToolkit(payload);
        setMessage("Toolkit created");
      }

      setForm(initialForm);
      setEditingId(null);
      loadToolkits();
    } catch (error) {
      setMessage(error.message || "Failed to save toolkit");
    }
  };

  const handleEdit = (tk) => {
    setEditingId(tk._id);
    setForm({
      title: tk.title || "",
      category: tk.category || "Registration & Structure",
      description: tk.description || "",
      url: tk.url || "",
      tags: Array.isArray(tk.tags) ? tk.tags.join(", ") : "",
      active: tk.active !== false,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteToolkit(id);
      setMessage("Toolkit deleted");
      loadToolkits();
    } catch (error) {
      setMessage(error.message || "Failed to delete toolkit");
    }
  };

  return (
    <div className="admin-toolkit">
      <button
        className="admin-legal-back-btn"
        onClick={() => navigate("/admin/legal/dashboard")}
      >
        ← Back to Legal Dashboard
      </button>

      <h2>Legal Toolkit Management</h2>

      <form onSubmit={handleSubmit} className="toolkit-form">
        <input
          placeholder="Toolkit Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="url"
          placeholder="Toolkit URL"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />

        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />

        <label>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />{" "}
          Active
        </label>

        <button type="submit">
          {editingId ? "Update Toolkit" : "Create Toolkit"}
        </button>
      </form>

      <div className="toolkit-list">
        {toolkits.map((tk) => (
          <div key={tk._id} className="toolkit-card">
            <h3>{tk.title}</h3>
            <p><strong>Category:</strong> {tk.category}</p>
            <p>{tk.description}</p>
            <p><strong>URL:</strong> {tk.url}</p>
            <p><strong>Tags:</strong> {Array.isArray(tk.tags) ? tk.tags.join(", ") : "-"}</p>
            <p><strong>Status:</strong> {tk.active === false ? "Inactive" : "Active"}</p>

            <button onClick={() => handleEdit(tk)}>Edit</button>
            <button onClick={() => handleDelete(tk._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLegalToolkitsPage;