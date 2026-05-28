import { useState } from "react";

function AddItem() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  function handleSumbit() {
    const item = {
      id: Date.now(),
      name: name,
      quantity: quantity,
      category: category,
      date: new Date().toISOString().split("T")[0],
    };
    fetch("http://localhost:3000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Added:", data);
        setName("");
        setQuantity("");
        setCategory("");
      });
  }
  return (
    <div className="add-item-page">
      <h1 className="add-item-title">Add to inventory</h1>
      <div className="add-item-form">
        <input
          type="text"
          placeholder="Enter item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Groceries</option>
          <option>Hardlines</option>
          <option>Fresh</option>
          <option>Electronics</option>
          <option>Health Beauty and Aid</option>
          <option>Beer and Wine</option>
          <option>Softlines</option>
          <option>Other</option>
        </select>

        <input type="text" placeholder="SKU" />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button onClick={handleSumbit}>Add Item</button>
      </div>
    </div>
  );
}
export default AddItem;
