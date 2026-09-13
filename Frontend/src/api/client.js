const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const FIELD_NAMES = {
  title: "Título",
  description: "Descripción",
  district: "Distrito",
  address: "Dirección",
  category: "Tipo",
  email: "Correo electrónico",
  password: "Contraseña",
  name: "Nombre",
};

function getErrorMessage(detail) {
  if (typeof detail === "string") return detail;
  if (!Array.isArray(detail)) return "No se pudo completar la acción";

  return detail.map((error) => {
    const field = FIELD_NAMES[error.loc?.at(-1)] || error.loc?.at(-1) || "Dato";
    if (error.type === "missing") return `${field}: campo obligatorio`;
    if (error.type === "string_too_short") {
      return `${field}: mínimo ${error.ctx?.min_length} caracteres`;
    }
    return `${field}: ${error.msg || "valor inválido"}`;
  }).join(". ");
}

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
    throw new Error(getErrorMessage(data.detail));
  }
  return data;
}
