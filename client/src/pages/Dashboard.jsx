import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="panel">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="subtitle">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </p>
        </div>
      </div>

      {user?.role !== "admin" && user?.password_changed === 1 && (
        <div className="message-warning" style={{ marginBottom: "20px" }}>
          Your password has been reset by an admin. Please go to My Account to change it.
        </div>
      )}
    </div>
  );
}