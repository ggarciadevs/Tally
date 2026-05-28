import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/items/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data));
  }, [id]);

  if (!item) {
    return <h1>Loading...</h1>;
  }

  return (
    <div add-item-page>
      <h1 className="card">{item.name}</h1>
      <div className="stats-grid">
        <section className="card">
          <h2>Quantity</h2>
          <p>{item.quantity}</p>
        </section>

        <section className="card">
          <h2>Low Stock Threshold</h2>
          <p>--</p>
        </section>

        <section className="card">
          <h2>Last Recieved</h2>
          <p>--</p>
        </section>

        <section className="card">
          <h2>Next Delivery</h2>
          <p>--</p>
        </section>
      </div>
    </div>
  );
}
export default ItemDetails;
