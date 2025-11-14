// simple fetch wrappers that include credentials (cookie)
const BASE = import.meta.env.VITE_API_URL || "";

async function handleJSONResponse(resp) {
  const text = await resp.text();
  try {
    return JSON.parse(text || "{}");
  } catch {
    return { success: false, message: text };
  }
}

export async function login({ email, employeeId, password }) {
  const form = new URLSearchParams();
  form.append("email", email);
  form.append("employeeId", employeeId);
  form.append("password", password);

  const resp = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    body: form,
    credentials: "include",
  });

  if (!resp.ok) throw await handleJSONResponse(resp);
  return handleJSONResponse(resp);
}

export async function register(formData) {
  // formData is a FormData instance (multipart)
  const resp = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!resp.ok) throw await handleJSONResponse(resp);
  return handleJSONResponse(resp);
}

export async function logout() {
  const resp = await fetch(`${BASE}/auth/logout`, {
    method: "GET",
    credentials: "include",
  });
  if (!resp.ok) throw await handleJSONResponse(resp);
  return handleJSONResponse(resp);
}

export async function getCurrentUser() {
  const resp = await fetch(`${BASE}/auth/me`, {
    method: "GET",
    credentials: "include",
  });
  if (!resp.ok) throw await handleJSONResponse(resp);
  return handleJSONResponse(resp);
}
