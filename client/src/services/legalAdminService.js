const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const buildUrl = (path) => `${API_BASE}${path}`;

const parseResponse = async (res) => {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let data = null;

  if (isJson) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    const text = await res.text();
    if (!res.ok) {
      throw new Error(text || "Request failed");
    }
    throw new Error("Expected JSON response but received non-JSON content");
  }

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};

function getAuthHeaders() {
  const token =
    sessionStorage.getItem("auth_token") ||
    sessionStorage.getItem("token") ||
    "";

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export const getAdminLegalTasks = async () => {
  const res = await fetch(buildUrl(`/api/legal/admin/tasks`), {
    headers: getAuthHeaders(),
  });
  return parseResponse(res);
};

export const createAdminLegalTask = async (data) => {
  const res = await fetch(buildUrl(`/api/legal/admin/tasks`), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return parseResponse(res);
};

export const updateAdminLegalTask = async (taskId, data) => {
  const res = await fetch(buildUrl(`/api/legal/admin/tasks/${taskId}`), {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return parseResponse(res);
};

export const deleteAdminLegalTask = async (taskId) => {
  const res = await fetch(buildUrl(`/api/legal/admin/tasks/${taskId}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return parseResponse(res);
};
export const getAdminLegalToolkits = async () => {
  const res = await fetch(buildUrl(`/api/legal/toolkits`), {
    headers: getAuthHeaders(),
  });
  return parseResponse(res);
};

export const createToolkit = async (data) => {
  const res = await fetch(buildUrl(`/api/legal/toolkits`), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return parseResponse(res);
};

export const updateToolkit = async (id, data) => {
  const res = await fetch(buildUrl(`/api/legal/toolkits/${id}`), {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return parseResponse(res);
};

export const deleteToolkit = async (id) => {
  const res = await fetch(buildUrl(`/api/legal/toolkits/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return parseResponse(res);
};

export const getAdminLegalReviews = async () => {
  const res = await fetch(buildUrl(`/api/legal/mentor/submissions/history`), {
    headers: getAuthHeaders(),
  });
  return parseResponse(res);
};

export const getAdminLegalHelpRequests = async () => {
  const res = await fetch(buildUrl(`/api/legal/mentor/help-requests`), {
    headers: getAuthHeaders(),
  });
  return parseResponse(res);
};