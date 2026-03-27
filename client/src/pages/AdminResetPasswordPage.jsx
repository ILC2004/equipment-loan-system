import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminResetPasswordPage() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/admin/reset-password", {
        userId: selectedUserId,
        newPassword
      });

      setMessage(res.data.message);
      setNewPassword("");
      setSelectedUserId("");
      setShowPassword(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="panel">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reset User Password</h1>
          <p className="subtitle">Admin can reset passwords for staff and students</p>
        </div>
      </div>

      {message && <p className="message message-success">{message}</p>}
      {error && <p className="message message-error">{error}</p>}

      <form className="card reset-password-card" onSubmit={handleReset}>
        <div className="form-grid">
          <div>
            <label className="label">Select User</label>
            <select
              className="select"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
            >
              <option value="">Choose a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email}) - {user.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">New Password</label>
            <div className="password-field">
              <input
                className="input password-input"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁‍🗨" : "👁"}
              </button>
            </div>
          </div>
        </div>

        <div className="card-actions">
          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
}