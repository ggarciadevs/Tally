const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getItems() {
  const res = await fetch(`${BASE_URL}/items`);
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}

export async function getLowStockItems() {
  const res = await fetch(`${BASE_URL}/items/alerts`);
  if (!res.ok) throw new Error("Failed to fetch low stock alerts");
  return res.json();
}

export async function getItem(id) {
  const res = await fetch(`${BASE_URL}/items/${id}`);
  if (!res.ok) throw new Error("Item not found");
  return res.json();
}

export async function createItem(data) {
  const res = await fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to create item");
  return json;
}

export async function updateItem(id, data) {
  const res = await fetch(`${BASE_URL}/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to update item");
  return json;
}

export async function deleteItem(id) {
  const res = await fetch(`${BASE_URL}/items/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete item");
}
