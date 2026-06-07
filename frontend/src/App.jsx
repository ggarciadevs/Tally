import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import ItemDetails from "./pages/ItemDetails";
import priorityIcon from "./assets/high-priority.svg";
import AddItem from "./pages/AddItem";
import { getItems, getLowStockItems } from "./api";

function App() {
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const location = useLocation();

  const searchResults = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    getItems()
      .then(setInventory)
      .catch(() => setError("Failed to load inventory"));

    getLowStockItems()
      .then(setLowStockItems)
      .catch(() => setError("Failed to load low stock alerts"));
  }, [location]);

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
              <h1 className="hero-title">Tally</h1>

              {error && <p className="error-message">{error}</p>}

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
                {lowStockItems.length === 0 ? (
                  <p>No low stock items.</p>
                ) : (
                  lowStockItems.map((item) => (
                    <Link key={item.id} to={`/items/${item.id}`} className="lowstock-card">
                      <div className="lowstock-top">
                        <span className="lowstock-name">{item.name}</span>
                        <span className="lowstock-qty">{item.quantity}</span>
                      </div>
                      <span className="lowstock-category">{item.category}</span>
                    </Link>
                  ))
                )}
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
