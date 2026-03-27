import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EquipmentList from "./pages/EquipmentList";
import BookingPage from "./pages/BookingPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminResetPasswordPage from "./pages/AdminResetPasswordPage";
import AdminEquipmentPage from "./pages/AdminEquipmentPage";
import MyAccountPage from "./pages/MyAccountPage";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user && user.role === "admin" ? children : <Navigate to="/dashboard" />;
}

function UserOnlyRoute({ children }) {
  const { user } = useAuth();
  return user && user.role !== "admin" ? children : <Navigate to="/dashboard" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/equipment"
        element={
          <ProtectedRoute>
            <EquipmentList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking"
        element={
          <UserOnlyRoute>
            <BookingPage />
          </UserOnlyRoute>
        }
      />

      <Route
        path="/my-bookings"
        element={
          <UserOnlyRoute>
            <MyBookingsPage />
          </UserOnlyRoute>
        }
      />

      <Route
        path="/my-account"
        element={
          <UserOnlyRoute>
            <MyAccountPage />
          </UserOnlyRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <AdminRoute>
            <AdminBookingsPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/equipment"
        element={
          <AdminRoute>
            <AdminEquipmentPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/reset-password"
        element={
          <AdminRoute>
            <AdminResetPasswordPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

function AppLayout() {
  const { user } = useAuth();

  if (!user) {
    return <AppRoutes />;
  }

  return (
    <div className="app-shell">
      <div className="page">
        <Navbar />
        <AppRoutes />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}