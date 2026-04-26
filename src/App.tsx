
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import TimeSlots from "./pages/TimeSlots";
import Bookings from "./pages/Bookings";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import LecturerStatusPage from "./pages/LecturerStatus";

import ProtectedRoute from "./ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lecturer-status" element={<LecturerStatusPage />} />
        <Route path="/notifications" element={<Notifications />} />
        

        
        <Route path="/" element={<Navigate to="/login" />} />

       
        <Route path="/login" element={<Login />} />

        
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