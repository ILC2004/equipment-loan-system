import { useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function MyAccountPage() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const res = await api.post("/auth/change-password", form);

      updateUser({
        ...user,
        password_changed: 0
      });

      setSuccess(res.data.message);
      setForm({
        currentPassword: "",
        newPassword: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="panel">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Account</h1>
          <p className="subtitle">
            View your details and manage your password
          </p>
        </div>
      </div>

      {user?.password_changed === 1 && (
        <div className="message-warning" style={{ marginBottom: "20px" }}>
          Your password was reset by an admin. Please change it now.
        </div>
      )}

      {/* Account Details */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "12px" }}>Account Details</h3>
        <p><strong>Name:</strong> {user?.name || "-"}</p>
        <p><strong>Email:</strong> {user?.email || "-"}</p>
      </div>

      {/* Messages */}
      {success && <p className="message message-success">{success}</p>}
      {error && <p className="message message-error">{error}</p>}

      {/* Change Password */}
      <form className="card change-password-card" onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: "16px" }}>Change Password</h3>

        <div className="form-grid">
          <div>
            <label className="label">Current Password</label>
            <div className="password-field">
              <input
                className="input password-input"
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
              >
                {showCurrentPassword ? "👁‍🗨" : "👁"}
              </button>
            </div>
          </div>

          <div>
            <label className="label">New Password</label>
            <div className="password-field">
              <input
                className="input password-input"
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>
        </div>

        <div className="card-actions">
          <button type="submit" className="btn btn-primary">
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
}