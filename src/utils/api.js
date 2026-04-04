import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8080/api";

/**
 * Helper gọi API kèm Loading state và Toast thông báo.
 *
 * @param {string}   url          - Đường dẫn API (VD: "/benh-nhan")
 * @param {object}   options      - fetch options (method, body, headers...)
 * @param {object}   hooks        - { setLoading } từ component
 * @param {object}   messages     - { success, error } tuỳ chỉnh
 * @returns {Promise<any>}        - Dữ liệu JSON trả về
 */
export async function apiCall(url, options = {}, hooks = {}, messages = {}) {
  const { setLoading } = hooks;

  if (setLoading) setLoading(true);

  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(errBody || `Lỗi ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    const data = contentType && contentType.includes("application/json")
      ? await res.json()
      : null;

    if (messages.success) {
      toast.success(messages.success);
    }

    return data;
  } catch (err) {
    toast.error(messages.error || err.message || "Có lỗi xảy ra, vui lòng thử lại!");
    throw err;
  } finally {
    if (setLoading) setLoading(false);
  }
}

/* ----- Shorthand helpers ----- */

export const apiGet = (url, hooks, messages) =>
  apiCall(url, { method: "GET" }, hooks, messages);

export const apiPost = (url, body, hooks, messages) =>
  apiCall(url, { method: "POST", body: JSON.stringify(body) }, hooks, messages);

export const apiPut = (url, body, hooks, messages) =>
  apiCall(url, { method: "PUT", body: JSON.stringify(body) }, hooks, messages);

export const apiDelete = (url, hooks, messages) =>
  apiCall(url, { method: "DELETE" }, hooks, messages);
