import { useEffect, useState } from "react";
import api from "../api/api";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data);
      setMessage("");
    } catch (error) {
      console.log(error);
      setMessage("Failed to load your booking requests");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const cleanDate = String(dateString).slice(0, 10);
    const [year, month, day] = cleanDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const getStatusClass = (status) => {
    if (status === "approved") return "status status-approved";
    if (status === "pending") return "status status-pending";
    if (status === "rejected") return "status status-rejected";
    if (status === "returned") return "status status-returned";
    return "status";
  };

  return (
    <div className="panel">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Booking Requests</h1>
          <p className="subtitle">Track your request history and statuses</p>
        </div>
      </div>

      {message && <p className="message message-error">{message}</p>}

      <div className="cards-grid">
        {bookings.length === 0 ? (
          <div className="card">
            <p>No booking requests found.</p>
          </div>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="card">
              <h3>{b.equipment_name}</h3>
              <p>{formatDate(b.start_date)} → {formatDate(b.end_date)}</p>
              <p>
                Reservation Status: <span className={getStatusClass(b.status)}>{b.status}</span>
              </p>
              <p>Current Equipment Status: {b.equipment_status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}