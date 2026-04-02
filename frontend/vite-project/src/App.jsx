import { useState, useEffect } from "react";
import "./App.css";
import { PieChart, Pie, Cell } from "recharts";

export default function App() {
  const [token, setToken] = useState(localStorage.token || "");
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const expenseData = data
    .filter((t) => t.type === "expense")
    .map((t) => ({
      name: t.category,
      value: t.amount,
    }));

  // login inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // transaction inputs
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [desc, setDesc] = useState("");

  const fetchData = async () => {
    const res = await fetch("/transactions", {
      headers: { Authorization: token },
    });
    setData(await res.json());

    const s = await fetch("/api/summary", {
      headers: { Authorization: token },
    });
    setSummary(await s.json());
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // ✅ LOGIN
  const login = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.token = data.token;
      setToken(data.token);
    } else {
      alert("Login failed");
    }
  };

  // ✅ SIGNUP
  const signup = async () => {
    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.token = data.token;
      setToken(data.token);
    }
  };

  // ✅ ADD TRANSACTION
  const add = async () => {
    await fetch("http://localhost:5000/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        amount: Number(amount),
        type,
        category,
        description: desc,
      }),
    });

    // Get transactions:
    const fetchData = async () => {
      const res = await fetch("http://localhost:5000/transactions", {
        headers: { Authorization: token },
      });
      setData(await res.json());

      const s = await fetch("http://localhost:5000/summary", {
        headers: { Authorization: token },
      });
      setSummary(await s.json());
    };

    // delete transactions
    const deleteItem = async (id) => {
      await fetch(`http://localhost:5000/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      fetchData();
    };

    fetchData();
  };
  // ✅ LOGIN UI
  if (!token)
    return (
      <div className="center">
        <div className="card">
          <h2>Login / Signup</h2>

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>Login</button>
          <button onClick={signup}>Signup</button>
        </div>
      </div>
    );

  // ✅ MAIN UI
  return (
    <div className="container">
      <h2>💰 SmartSpend</h2>

      {/* Add Transaction */}
      <div className="card">
        <h3>Add Transaction</h3>

        <input
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          placeholder="Category"
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          placeholder="Description"
          onChange={(e) => setDesc(e.target.value)}
        />

        <select onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button onClick={add}>Add</button>
      </div>

      {/* Summary */}
      <div className="card summary">
        <div className="card">
          <h3>Expense Chart</h3>

          {expenseData.length === 0 ? (
            <p>No expense data</p>
          ) : (
            <PieChart width={400} height={300}>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      ["#ff6384", "#36a2eb", "#ffce56", "#4caf50"][index % 4]
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          )}
        </div>
        <h3>Summary</h3>
        <p>Income: {summary.income}</p>
        <p>Expense: {summary.expense}</p>
        <p>Savings: {summary.savings}</p>

        {summary.expense > summary.income * 0.8 && (
          <p style={{ color: "red" }}>⚠️ You are overspending!</p>
        )}
      </div>

      {/* Transactions */}
      <div className="card">
        <h3>Transactions</h3>

        {data.map((t) => (
          <div key={t.id} className="transaction">
            <span>
              {t.category} ({t.type})
            </span>
            <span className={t.type}>₹{t.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
