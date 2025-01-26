import Cookies from "js-cookie";

export const csrfFetch = async (url, options = {}) => {
  options.headers = options.headers ?? {};
  options.method = options.method?.toUpperCase() ?? "GET";
  if (options.method !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
    options.headers["XSRF-TOKEN"] = Cookies.get("XSRF-TOKEN");
  }
  const response = await window.fetch(url, {
    ...options,
    credentials: "include",
  });
  if (400 <= response.status) throw response;
  return response;
};

// call this to get the "XSRF-TOKEN" cookie, should only be used in
//   development
export function restoreCSRF() {
  return csrfFetch("/api/csrf/restore");
}
