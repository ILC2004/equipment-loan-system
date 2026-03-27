import { useEffect, useState } from "react";
import api from "../api/api";

const CATEGORY_OPTIONS = [
  "Laptop",
  "IoT Device",
  "Hardware",
  "Projector",
  "Peripheral",
  "Networking"
];

const STATUS_OPTIONS = [
  "available",
  "pending",
  "borrowed",
  "disinfecting"
];

const emptyForm = {
  name: "",
  category: "Laptop",
  serial_number: "",
  status: "available"
};

export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const fetchEquipment = async (searchValue = "") => {
    try {
      const res = await api.get("/equipment", {
        params: { search: searchValue }
      });
      setEquipment(res.data);
    } catch (error) {
      console.log(error);
      setMessage("Failed to load equipment");
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess("");

    try {
      if (editingId) {
        await api.put(`/equipment/${editingId}`, form);
        setSuccess("Equipment updated successfully");
      } else {
        await api.post("/equipment", form);
        setSuccess("Equipment added successfully");
      }

      resetForm();
      fetchEquipment(search);
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Failed to save equipment");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      category: item.category || "Laptop",
      serial_number: item.serial_number || "",
      status: item.status || "available"
    });
    setMessage("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEquipment(search);
  };

  return (
    <div className="panel">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Equipment</h1>
          <p className="subtitle">Add new stock and update existing equipment</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "16px" }}>
          {editingId ? "Update Equipment" : "Add Equipment"}
        </h3>

        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <label className="label">Equipment Name</label>
            <input
              className="input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Dell Latitude 5420"
              required
            />
          </div>

          <div>
            <label className="label">Category</label>
            <select
              className="select"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Serial Number</label>
            <input
              className="input"
              type="text"
              name="serial_number"
              value={form.serial_number}
              onChange={handleChange}
              placeholder="Optional but recommended"
            />
          </div>

          <div>
            <label className="label">Status</label>
            <select
              className="select"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="card-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Equipment" : "Add Equipment"}
            </button>

            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {message && <p className="message message-error">{message}</p>}
        {success && <p className="message message-success">{success}</p>}
      </div>

      <form onSubmit={handleSearch} className="toolbar">
        <input
          className="input"
          type="text"
          placeholder="Search by name or serial number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "320px" }}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setSearch("");
            fetchEquipment("");
          }}
        >
          Clear
        </button>
      </form>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Serial Number</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {equipment.length > 0 ? (
              equipment.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.serial_number || "-"}</td>
                  <td>
                    <span className="badge">{item.status}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No equipment found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}