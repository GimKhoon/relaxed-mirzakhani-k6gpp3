import React, { useState, useEffect } from "react";
import { CalendarDays, BarChart3, PlusCircle, Trash2 } from "lucide-react";

const App = () => {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("profit-tracker-records");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    item: "",
    quantity: 1,
    originalPrice: "",
    sellingPrice: "",
    buyer: "",
    method: "COD",
    shippingCost: "",
    remark: "",
    date: new Date().toISOString().substr(0, 10),
    image: null,
  });

  const [page, setPage] = useState("add");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const today = new Date().toISOString().substr(0, 10);

  useEffect(() => {
    localStorage.setItem("profit-tracker-records", JSON.stringify(records));
  }, [records]);

  const totalProfit = (data) =>
    data.reduce((sum, r) => sum + parseFloat(r.profit), 0).toFixed(2);

  const addRecord = () => {
    const profit =
      (parseFloat(form.sellingPrice || 0) -
        parseFloat(form.originalPrice || 0) -
        (form.method === "Ship" ? parseFloat(form.shippingCost || 0) : 0)) *
      parseInt(form.quantity || 1);

    const newRecord = {
      ...form,
      id: Date.now(),
      profit: profit.toFixed(2),
      imageURL: form.image ? URL.createObjectURL(form.image) : null,
    };
    setRecords([newRecord, ...records]);
    resetForm();
  };

  const deleteRecord = (id) => {
    if (window.confirm("Delete this record?")) {
      setRecords(records.filter((r) => r.id !== id));
    }
  };

  const resetForm = () =>
    setForm({
      item: "",
      quantity: 1,
      originalPrice: "",
      sellingPrice: "",
      buyer: "",
      method: "COD",
      shippingCost: "",
      remark: "",
      date: new Date().toISOString().substr(0, 10),
      image: null,
    });

  const filteredRecords =
    page === "daily"
      ? records.filter((r) => r.date === today)
      : page === "monthly"
      ? records.filter((r) => r.date.slice(0, 7) === selectedMonth)
      : records;

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: "#f0f2f8",
        minHeight: "100vh",
        color: "#333",
        padding: "1rem",
      }}
    >
      <nav
        style={{
          background: "linear-gradient(to right, #1f3f87, #4b79a1)",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          flexWrap: "wrap",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ margin: 0, fontWeight: "700", fontSize: "1.5rem" }}>
          <span style={{ fontSize: "1.4rem", marginRight: "0.5rem" }}>📊</span>{" "}
          Profitool
        </h2>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginTop: "0.75rem",
          }}
        >
          <button onClick={() => setPage("add")} style={navBtn(page === "add")}>
            <PlusCircle size={18} /> Add
          </button>
          <button
            onClick={() => setPage("daily")}
            style={navBtn(page === "daily")}
          >
            <CalendarDays size={18} /> Daily
          </button>
          <button
            onClick={() => setPage("monthly")}
            style={navBtn(page === "monthly")}
          >
            <BarChart3 size={18} /> Monthly
          </button>
        </div>
      </nav>

      {page === "add" && (
        <div style={card}>
          <h3 style={heading}>Add New Record</h3>
          <div
            style={{
              ...formGrid,
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            <input
              placeholder="Item Name"
              value={form.item}
              onChange={(e) => setForm({ ...form, item: e.target.value })}
            />
            <input
              type="number"
              min="1"
              placeholder="Qty"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
            <input
              type="number"
              placeholder="Original Price"
              value={form.originalPrice}
              onChange={(e) =>
                setForm({ ...form, originalPrice: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Selling Price"
              value={form.sellingPrice}
              onChange={(e) =>
                setForm({ ...form, sellingPrice: e.target.value })
              }
            />
            <input
              placeholder="Buyer Name"
              value={form.buyer}
              onChange={(e) => setForm({ ...form, buyer: e.target.value })}
            />
            <select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
            >
              <option value="COD">COD</option>
              <option value="Ship">Ship</option>
            </select>
            {form.method === "Ship" && (
              <input
                type="number"
                placeholder="Shipping Cost"
                value={form.shippingCost}
                onChange={(e) =>
                  setForm({ ...form, shippingCost: e.target.value })
                }
              />
            )}
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <input
              placeholder="Remark"
              value={form.remark}
              onChange={(e) => setForm({ ...form, remark: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            />
          </div>
          <button onClick={addRecord} style={submitBtn}>
            Add Record
          </button>
        </div>
      )}

      {page === "monthly" && (
        <div style={{ margin: "1rem 0.5rem" }}>
          <label style={{ fontWeight: "600" }}>
            Select Month:&nbsp;
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {[...Array(12)].map((_, i) => {
                const d = new Date();
                d.setMonth(i);
                const value = `${d.getFullYear()}-${String(i + 1).padStart(
                  2,
                  "0"
                )}`;
                return (
                  <option key={i} value={value}>
                    {d.toLocaleString("default", { month: "long" })}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      )}

      <div style={card}>
        <h3 style={heading}>
          {page === "add"
            ? "All Records"
            : page === "daily"
            ? "Today's Records"
            : `Monthly Records (${selectedMonth})`}
        </h3>
        {filteredRecords.length === 0 ? (
          <p>No records found.</p>
        ) : (
          filteredRecords.map((r) => (
            <div key={r.id} style={recordCard}>
              <div>
                <strong>{r.item}</strong> × {r.quantity} — {r.date}
              </div>
              {r.imageURL && (
                <div style={{ margin: "0.5rem 0" }}>
                  <img
                    src={r.imageURL}
                    alt="item"
                    style={{
                      maxWidth: "100%",
                      borderRadius: "8px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              )}
              <div>
                Buyer: {r.buyer} ({r.method})
              </div>
              {r.method === "Ship" && <div>Shipping: RM{r.shippingCost}</div>}
              {r.remark && <div>Note: {r.remark}</div>}
              <div style={{ fontWeight: "600", color: "#2e7d32" }}>
                Profit: RM{r.profit}
              </div>
              <button onClick={() => deleteRecord(r.id)} style={deleteBtn}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div style={card}>
        <h3 style={heading}>
          Total Profit (
          {page === "daily"
            ? "Today"
            : page === "monthly"
            ? "This Month"
            : "All Time"}
          ): RM{totalProfit(filteredRecords)}
        </h3>
      </div>
    </div>
  );
};

const card = {
  background: "#fff",
  padding: "1.5rem",
  margin: "1rem 0",
  borderRadius: "12px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
};

const heading = {
  marginBottom: "1rem",
  fontWeight: "600",
  fontSize: "1.25rem",
  color: "#1f3f87",
};

const formGrid = {
  display: "grid",
  gap: "1rem",
  marginBottom: "1.5rem",
};

const navBtn = (active) => ({
  padding: "0.5rem 1rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  border: "none",
  background: active ? "#ff9800" : "#ffffff22",
  color: "#fff",
  borderRadius: "6px",
  fontWeight: "500",
  cursor: "pointer",
});

const submitBtn = {
  background: "#1f3f87",
  color: "#fff",
  padding: "0.75rem 2rem",
  border: "none",
  borderRadius: "6px",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "1rem",
};

const deleteBtn = {
  marginTop: "0.75rem",
  background: "#e53935",
  color: "#fff",
  padding: "0.4rem 1rem",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const recordCard = {
  background: "#fafafa",
  padding: "1rem",
  marginBottom: "1rem",
  borderRadius: "10px",
  borderLeft: "4px solid #1f3f87",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};

export default App;
