const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/+$/, "");

async function request(method, path, body) {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const options = {
    method,
    headers: {
      Accept: "application/json",
    },
  };

  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("Unable to reach the ClinicFlow backend at http://localhost:8080. Make sure Spring Boot is running.");
  }

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const err = new Error(data?.message || data?.error || `Request failed (${response.status})`);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

const api = {
  baseURL: BASE_URL,
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  patch: (path, body) => request("PATCH", path, body),
  del: (path) => request("DELETE", path),
};

export default api;
