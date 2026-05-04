import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, ClipboardList } from "lucide-react"; 
import { Bell } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path: string) =>
    `flex items-center gap-3 p-3 rounded-lg transition ${
      location.pathname === path
        ? "bg-white text-blue-600 font-semibold"
        : "text-white hover:bg-blue-500"
    }`;

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-600 to-indigo-700 text-white p-6 flex flex-col">

      {/* LOGO / TITLE */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-wide">
          Admin Panel
        </h1>
        <p className="text-sm text-primary-200">
          FindMyLecturer
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-3">

      <Link to="/dashboard" className={linkClass("/dashboard")}>
  <LayoutDashboard size={20} />
  Dashboard
</Link>

        <Link to="/users" className={linkClass("/users")}>
          <Users size={20} />
          Users
        </Link>

        <Link to="/timeslots" className={linkClass("/timeslots")}>
          <Calendar size={20} />
          Time Slots
        </Link>

        
        <Link to="/bookings" className={linkClass("/bookings")}>
          <ClipboardList size={20} />
          Bookings
        </Link>

        
        <Link to="/notifications" className={linkClass("/notifications")}>
          <Bell size={20} />
          Notifications
        </Link>

        <Link to="/lecturer-status" className={linkClass("/lecturer-status")}>
          <Users size={20} />
          Lecturer Status
        </Link>

      </nav>

      {/* FOOTER */}
      <div className="mt-auto text-xs text-blue-200">
        © 2026 FindMyLecturer
      </div>
    </div>
  );
}