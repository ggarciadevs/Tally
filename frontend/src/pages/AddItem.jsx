import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../api";

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

function AddItem() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit() {
    setError(null);
    try {
      await createItem({
        name,
        quantity: Number(quantity),
        category,
        low_stock_threshold: lowStockThreshold ? Number(lowStockThreshold) : null,
        date: new Date().toISOString().split("T")[0],
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="add-item-page">
      <h1 className="add-item-title">Add to Inventory</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="add-item-form">
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          type="number"
          placeholder="Low stock threshold"
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(e.target.value)}
        />
        <button onClick={handleSubmit}>Add Item</button>
      </div>
    </div>
  );
}

export default AddItem;
