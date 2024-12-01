export const POST = { method: "POST" };
export const PUT = { method: "PUT" };
export const headers = {
  headers: { "Content-Type": "application/json" },
};
export const body = (data) => ({ body: JSON.stringify(data) });

// "delete" is a keyword
export const DELETE = { method: "DELETE" };
