import { useEffect, useState } from "react";
import api from "../api/api";

export default function BookingPage() {
  const [equipment, setEquipment] = useState([]);
  const [unavailableRanges, setUnavailableRanges] = useState([]);
  const [form, setForm] = useState({
    equipment_id: "",
    start_date: "",
    end_date: ""
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const fetchEquipment = async () => {
    try {
      const res = await api.get("/equipment");
      setEquipment(res.data);
    } catch (error) {
      console.log(error);
      setMessage("Failed to load equipment");
    }
  };

  const fetchUnavailableRanges = async (equipmentId) => {
    if (!equipmentId) {
      setUnavailableRanges([]);
      return;
    }

    try {
      const res = await api.get(`/bookings/equipment/${equipmentId}/unavailable`);
      setUnavailableRanges(res.data);
    } catch (error) {
      console.log(error);
      setUnavailableRanges([]);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    fetchUnavailableRanges(form.equipment_id);
  }, [form.equipment_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setMessage("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess("");

    try {
      const res = await api.post("/bookings", form);
      setSuccess(res.data.message);
      setForm({
        equipment_id: "",
        start_date: "",
        end_date: ""
      });
      setUnavailableRanges([]);
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Failed to submit booking request");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const cleanDate = String(dateString).slice(0, 10);
    const [year, month, day] = cleanDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const selectedEquipment = equipment.find(
    (item) => String(item.id) === String(form.equipment_id)
  );

  return (
    <div className="panel">
      <div className="page-header">
        <div>
          <h1 className="page-title">Book Equipment</h1>
          <p className="subtitle">Submit a request to borrow equipment</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <label className="label">Select Equipment</label>
            <select
              className="select"
              name="equipment_id"
              value={form.equipment_id}
              onChange={handleChange}
              required
            >
              <option value="">Choose equipment</option>
              {equipment.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.serial_number})
                </option>
              ))}
            </select>
          </div>

          {selectedEquipment && (
            <div className="card" style={{ background: "#f8fafc" }}>
              <h3 style={{ marginBottom: "10px" }}>{selectedEquipment.name}</h3>
              <p><strong>Serial Number:</strong> {selectedEquipment.serial_number}</p>

              {unavailableRanges.length > 0 ? (
                <>
                  <p style={{ marginTop: "12px", fontWeight: 600 }}>
                    Unavailable dates:
                  </p>
                  {unavailableRanges.map((range) => (
                    <p key={range.id}>
                      {formatDate(range.start_date)} → {formatDate(range.end_date)}
                    </p>
                  ))}
                </>
              ) : (
                <p style={{ marginTop: "12px" }}>No approved bookings for this item yet.</p>
              )}
            </div>
          )}

          <div>
            <label className="label">Start Date</label>
            <input
              className="input"
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">End Date</label>
            <input
              className="input"
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="card-actions">
            <button type="submit" className="btn btn-primary">
              Submit Booking Request
            </button>
          </div>
        </form>

        {message && <p className="message message-error">{message}</p>}
        {success && <p className="message message-success">{success}</p>}
      </div>
    </div>
  );
}