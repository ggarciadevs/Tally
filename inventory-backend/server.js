require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.query(`
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    category TEXT NOT NULL,
    date TEXT,
    low_stock_threshold INTEGER,
    next_delivery TEXT
  )
`).catch((err) => console.error("Table init error:", err.message));

const VALID_CATEGORIES = [
  "Groceries",
  "Hardlines",
  "Fresh",
  "Electronics",
  "Health Beauty and Aid",
  "Beer and Wine",
  "Softlines",
  "Other",
];

function validateItem(body) {
  const { name, quantity, category, low_stock_threshold } = body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return "name is required";
  }
  if (
    quantity === undefined ||
    quantity === null ||
    isNaN(Number(quantity)) ||
    Number(quantity) < 0
  ) {
    return "quantity must be a non-negative number";
  }
  if (!category || !VALID_CATEGORIES.includes(category)) {
    return `category must be one of: ${VALID_CATEGORIES.join(", ")}`;
  }
  if (low_stock_threshold !== undefined && low_stock_threshold !== null) {
    if (
      isNaN(Number(low_stock_threshold)) ||
      Number(low_stock_threshold) < 0
    ) {
      return "low_stock_threshold must be a non-negative number";
    }
  }
  return null;
}

app.get("/items", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM items ORDER BY id");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/items/alerts", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM items WHERE quantity <= low_stock_threshold ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/items/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM items WHERE id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/items", async (req, res) => {
  const validationError = validateItem(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  const { name, quantity, category, date, low_stock_threshold, next_delivery } =
    req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO items (name, quantity, category, date, low_stock_threshold, next_delivery)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name.trim(),
        Number(quantity),
        category,
        date || null,
        low_stock_threshold != null ? Number(low_stock_threshold) : null,
        next_delivery || null,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/items/:id", async (req, res) => {
  const validationError = validateItem(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  const { name, quantity, category, date, low_stock_threshold, next_delivery } =
    req.body;

  try {
    const { rowCount } = await pool.query(
      `UPDATE items
       SET name = $1, quantity = $2, category = $3, date = $4,
           low_stock_threshold = $5, next_delivery = $6
       WHERE id = $7`,
      [
        name.trim(),
        Number(quantity),
        category,
        date || null,
        low_stock_threshold != null ? Number(low_stock_threshold) : null,
        next_delivery || null,
        req.params.id,
      ]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Update successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM items WHERE id = $1",
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
