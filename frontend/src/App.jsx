import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ItemDetails from "./pages/ItemDetails";
import priorityIcon from "./assets/high-priority.svg";
import AddItem from "./pages/AddItem";

function App() {
  const [inventory, setInventory] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [search, setSearch] = useState("");

  const searchResults = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  function loadInventory() {
    fetch("http://localhost:3000/items")
      .then((res) => res.json())
      .then((data) => setInventory(data));
  }

  useEffect(() => {
    loadInventory();
  }, []);
  function addItem() {
    const item = {
      id: Date.now(),
      name: name,
      quantity: Number(quantity),
      category: category,
      date: date,
    };
    console.log(item);
    fetch("http://localhost:3000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }).then(() => {
      loadInventory();
    });
  }
  function deleteItem(id) {
    fetch(`http://localhost:3000/items/${id}`, {
      method: "DELETE",
    }).then(() => {
      loadInventory();
    });
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="home-page">
            <div className="top-actions">
              <Link to="/add-item">
                <button className="add-item-button">Add to Inventory</button>
              </Link>
            </div>
            <div className="hero-section">
              <h1 className="hero-title">StockPilot</h1>

              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search your inventory..."
                  className="search-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {search && (
                  <ul className="search-dropdown">
                    {searchResults.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={`/items/${item.id}`}
                          className="search-result"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <section className="lowstock-section">
              <div className="section-header">
                <div className="lowstock-heading">
                  <h2>Low Stock</h2>
                  <img
                    src={priorityIcon}
                    alt="Priority Icon"
                    className="priority-icon"
                  />
                </div>
              </div>

              <div className="lowstock-grid">
                {inventory.map((item) => (
                  <div key={item.id} className="lowstock-card">
                    <div className="lowstock-top">
                      <span className="lowstock-name">{item.name}</span>

                      <span className="lowstock-qty">{item.quantity}</span>
                    </div>

                    <span className="lowstock-category">{item.category}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        }
      />

      <Route path="/items/:id" element={<ItemDetails />} />
      <Route path="/add-item" element={<AddItem />} />
    </Routes>
  );
}

export default App;
