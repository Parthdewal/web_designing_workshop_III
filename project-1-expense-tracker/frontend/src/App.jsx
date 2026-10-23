
import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:3000/api/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load expenses from the backend
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Could not load expenses.");
        }

        const data = await response.json();
        setExpenses(data);
      } catch (err) {
        setError("Could not connect to the backend. Is the server running?");
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, []);

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  // Add an expense through the backend API
  async function addExpense(event) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a title and a valid amount.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          amount: Number(amount),
          category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add expense.");
      }

      setExpenses((currentExpenses) => [...currentExpenses, data]);
      setTitle("");
      setAmount("");
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    }
  }

  // Delete an expense through the backend API
  async function deleteExpense(id) {
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete expense.");
      }

      setExpenses((currentExpenses) =>
        currentExpenses.filter((expense) => expense.id !== id)
      );
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    }
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <p className="eyebrow">PERSONAL FINANCE</p>
          <h1>Expense Tracker</h1>
          <p className="subtitle">Manage your daily spending easily.</p>
        </div>

        <div className="date">
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </header>

      <section className="summary">
        <div className="summary-card">
          <p>Total Expenses</p>
          <h2>₹{total.toLocaleString("en-IN")}</h2>
          <span>All recorded expenses</span>
        </div>

        <div className="summary-card">
          <p>Total Transactions</p>
          <h2>{expenses.length}</h2>
          <span>Expenses added so far</span>
        </div>
      </section>

      <section className="content">
        <form className="expense-form" onSubmit={addExpense}>
          <h2>Add New Expense</h2>

          <label htmlFor="title">Expense Name</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Lunch"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="e.g. 250"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />

          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Education</option>
            <option>Other</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "+ Add Expense"}
          </button>
        </form>

        <section className="expense-list">
          <h2>Recent Expenses</h2>

          {error && <p role="alert" className="error-message">{error}</p>}

          {loading ? (
            <p className="empty">Loading expenses...</p>
          ) : expenses.length === 0 ? (
            <p className="empty">No expenses yet. Add your first expense!</p>
          ) : (
            expenses.map((expense) => (
              <article className="expense-item" key={expense.id}>
                <div>
                  <h3>{expense.title}</h3>
                  <p>{expense.category}</p>
                </div>

                <div className="expense-actions">
                  <strong>
                    ₹{Number(expense.amount).toLocaleString("en-IN")}
                  </strong>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteExpense(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </section>

      <footer>Expense Tracker · College Full-Stack Project</footer>
    </main>
  );
}

export default App;
