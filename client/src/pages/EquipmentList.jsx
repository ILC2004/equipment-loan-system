import { useEffect, useState } from "react";
import api from "../api/api";

export default function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const fetchEquipment = async (searchValue = "", categoryValue = "") => {
    try {
      const res = await api.get("/equipment", {
        params: {
          search: searchValue,
          category: categoryValue
        }
      });

      setEquipment(res.data);
      setMessage("");
    } catch (error) {
      console.log("Equipment fetch error:", error);
      setMessage("Failed to load equipment");
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEquipment(search, category);
  };

  return (
    <div className="panel">
      <div className="page-header">
        <div>
          <h1 className="page-title">Equipment List</h1>
          <p className="subtitle">Search and browse available stock</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="toolbar">
        <input
          className="input"
          type="text"
          placeholder="Search by equipment name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "280px" }}
        />

        <select
          className="select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ maxWidth: "220px" }}
        >
          <option value="">All Categories</option>
          <option value="Laptop">Laptop</option>
          <option value="IoT Device">IoT Device</option>
          <option value="Hardware">Hardware</option>
          <option value="Projector">Projector</option>
          <option value="Peripheral">Peripheral</option>
          <option value="Networking">Networking</option>
        </select>

        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {message && <p className="message message-error">{message}</p>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Serial Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {equipment.length > 0 ? (
              equipment.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.serial_number}</td>
                  <td><span className="badge">{item.status}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
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