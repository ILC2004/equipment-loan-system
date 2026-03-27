import { useEffect, useState } from "react";
import api from "../api/api";

export default function BookingPage() {
  const [equipment, setEquipment] = useState([]);
  const [unavailableRanges, setUnavailableRanges] = useState([]);
  const [form, setForm] = useState({
    equipmentId: "",
    startDate: "",
    endDate: ""
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
    fetchUnavailableRanges(form.equipmentId);
  }, [form.equipmentId]);

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

    console.log("Booking form being sent:", form);

    try {
      const res = await api.post("/bookings", form);
      setSuccess(res.data.message);
      setForm({
        equipmentId: "",
        startDate: "",
        endDate: ""
      });
      setUnavailableRanges([]);
    } catch (error) {
      console.log(error.response?.data || error);
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
    (item) => String(item.id) === String(form.equipmentId)
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
              name="equipmentId"
              value={form.equipmentId}
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

          {selectedEquipment && unavailableRanges.length > 0 && (
  <div className="card" style={{ background: "#f8fafc" }}>
    <p><strong>Unavailable dates:</strong></p>
    {unavailableRanges.map((range) => (
      <p key={range.id}>
        {formatDate(range.start_date)} → {formatDate(range.end_date)}
      </p>
    ))}
  </div>
)}

          <div>
            <label className="label">Start Date</label>
            <input
              className="input"
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">End Date</label>
            <input
              className="input"
              type="date"
              name="endDate"
              value={form.endDate}
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