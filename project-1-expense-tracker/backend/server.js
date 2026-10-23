
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Temporary expense data (no database)
let expenses = [];
let nextId = 1;

// Home route
app.get("/", (req, res) => {
  res.send("Expense Tracker Backend is running!");
});

// Get all expenses
app.get("/api/expenses", (req, res) => {
  res.json(expenses);
});

// Add a new expense
app.post("/api/expenses", (req, res) => {
  const { title, amount, category } = req.body;

  if (!title || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || !category) {
    return res.status(400).json({ message: "Please provide valid expense details." });
  }

  const newExpense = {
    id: nextId++,
    title: title.trim(),
    amount: Number(amount),
    category,
  };

  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// Delete an expense
app.delete("/api/expenses/:id", (req, res) => {
  const id = Number(req.params.id);
  const existingExpense = expenses.find((expense) => expense.id === id);

  if (!existingExpense) {
    return res.status(404).json({ message: "Expense not found." });
  }

  expenses = expenses.filter((expense) => expense.id !== id);
  res.json({ message: "Expense deleted successfully." });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
