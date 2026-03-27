import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="logo" onClick={() => navigate("/dashboard")}>
          NCG Equipment
        </div>

        <div className="nav-right">
          <button className="nav-btn" onClick={() => navigate("/equipment")}>
            Equipment
          </button>

          {user.role !== "admin" && (
            <>
              <button className="nav-btn" onClick={() => navigate("/booking")}>
                Book
              </button>

              <button className="nav-btn" onClick={() => navigate("/my-bookings")}>
                My Requests
              </button>

              <button className="nav-btn" onClick={() => navigate("/my-account")}>
                My Account
              </button>
            </>
          )}

          {user.role === "admin" && (
            <>
              <button
                className="nav-btn"
                onClick={() => navigate("/admin/equipment")}
              >
                Manage Equipment
              </button>

              <button
                className="nav-btn"
                onClick={() => navigate("/admin/bookings")}
              >
                Booking Requests
              </button>

              <button
                className="nav-btn"
                onClick={() => navigate("/admin/reset-password")}
              >
                Reset Passwords
              </button>
            </>
          )}

          <button className="nav-btn logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}