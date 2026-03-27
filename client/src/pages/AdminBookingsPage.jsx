import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
      setMessage("");
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Failed to load booking requests");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const approve = async (id) => {
    try {
      setMessage("");
      await api.post("/bookings/approve", { bookingId: id });
      fetchBookings();
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Failed to approve booking");
    }
  };

  const reject = async (id) => {
    try {
      setMessage("");
      await api.post("/bookings/reject", { bookingId: id });
      fetchBookings();
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Failed to reject booking");
    }
  };

  const markReturned = async (id) => {
    try {
      setMessage("");
      await api.post("/bookings/return", { bookingId: id });
      fetchBookings();
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Failed to mark item as returned");
    }
  };

  const markCleaned = async (equipmentId) => {
    try {
      setMessage("");
      await api.post("/bookings/clean", { equipment_id: equipmentId });
      fetchBookings();
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Failed to mark item as cleaned");
    }
  };

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
          <h1 className="page-title">Booking Requests</h1>
          <p className="subtitle">Approve, reject and manage returns</p>
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
              <p>User: {b.user_name} ({b.email})</p>
              <p>{formatDate(b.start_date)} → {formatDate(b.end_date)}</p>
              <p>
                Reservation Status:{" "}
                <span className={getStatusClass(b.status)}>{b.status}</span>
              </p>

              <div className="card-actions">
                {b.status === "pending" && (
                  <>
                    <button className="btn btn-success" onClick={() => approve(b.id)}>
                      Approve
                    </button>
                    <button className="btn btn-danger" onClick={() => reject(b.id)}>
                      Reject
                    </button>
                  </>
                )}

                {b.status === "approved" && (
                  <button className="btn btn-secondary" onClick={() => markReturned(b.id)}>
                    Mark Returned
                  </button>
                )}

                {b.equipment_status === "disinfecting" && (
                  <button className="btn btn-primary" onClick={() => markCleaned(b.equipment_id)}>
                    Mark Cleaned
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}