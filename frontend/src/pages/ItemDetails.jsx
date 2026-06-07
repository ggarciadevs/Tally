import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getItem, updateItem, deleteItem } from "../api";

const CATEGORIES = [
  "Groceries",
  "Hardlines",
  "Fresh",
  "Electronics",
  "Health Beauty and Aid",
  "Beer and Wine",
  "Softlines",
  "Other",
];

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    getItem(id)
      .then((data) => {
        setItem(data);
        setForm({
          name: data.name,
          quantity: data.quantity,
          category: data.category,
          low_stock_threshold: data.low_stock_threshold ?? "",
          next_delivery: data.next_delivery ?? "",
        });
      })
      .catch(() => setError("Item not found"));
  }, [id]);

  async function handleSave() {
    setError(null);
    try {
      await updateItem(id, {
        ...form,
        quantity: Number(form.quantity),
        low_stock_threshold: form.low_stock_threshold !== "" ? Number(form.low_stock_threshold) : null,
      });
      const updated = await getItem(id);
      setItem(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    try {
      await deleteItem(id);
      navigate("/");
    } catch {
      setError("Failed to delete item");
    }
  }

  if (error) return <p className="error-message">{error}</p>;
  if (!item) return <h1>Loading...</h1>;

  return (
    <div className="add-item-page">
      <Link to="/" className="back-link">← Back</Link>
      <h1 className="add-item-title">{item.name}</h1>

      {isEditing ? (
        <div className="add-item-form">
          <input
            type="text"
            placeholder="Item name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <input
            type="number"
            placeholder="Low stock threshold"
            value={form.low_stock_threshold}
            onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })}
          />
          <input
            type="date"
            placeholder="Next delivery"
            value={form.next_delivery}
            onChange={(e) => setForm({ ...form, next_delivery: e.target.value })}
          />
          {error && <p className="error-message">{error}</p>}
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <section className="card">
              <h2>Quantity</h2>
              <p>{item.quantity}</p>
            </section>
            <section className="card">
              <h2>Category</h2>
              <p>{item.category}</p>
            </section>
            <section className="card">
              <h2>Low Stock Threshold</h2>
              <p>{item.low_stock_threshold ?? "--"}</p>
            </section>
            <section className="card">
              <h2>Last Received</h2>
              <p>{item.date ?? "--"}</p>
            </section>
            <section className="card">
              <h2>Next Delivery</h2>
              <p>{item.next_delivery ?? "--"}</p>
            </section>
          </div>
          <div className="item-actions">
            <button className="btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

export default ItemDetails;
