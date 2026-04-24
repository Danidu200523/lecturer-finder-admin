
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import TimeSlots from "./pages/TimeSlots";
import Bookings from "./pages/Bookings";
import Login from "./pages/Login";

import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 DEFAULT → LOGIN */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/timeslots"
          element={
            <ProtectedRoute>
              <TimeSlots />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;