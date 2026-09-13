const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function apiRequest(path, options = {}, token) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "No se pudo completar la acción");
  }
  return data;
}
