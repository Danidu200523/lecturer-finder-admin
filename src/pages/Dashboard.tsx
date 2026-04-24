import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Users,
  UserCheck,
  GraduationCap,
  Calendar,
  BookOpen,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    lecturers: 0,
    students: 0,
    slots: 0,
    bookings: 0,
  });

  const [bookingStats, setBookingStats] = useState({
    available: 0,
    booked: 0,
    cancelled: 0,
  });

  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userSnap = await getDocs(collection(db, "users"));
    const userMap: any = {};

    let lecturers = 0;
    let students = 0;

    userSnap.docs.forEach((doc) => {
      const data: any = doc.data();
      userMap[doc.id] = { name: data.name };

      if (data.role === "lecturer") lecturers++;
      if (data.role === "student") students++;
    });

    const slotSnap = await getDocs(collection(db, "time_slots"));

    let available = 0;
    let booked = 0;
    let cancelled = 0;

    const dateMap: any = {};
    const bookedList: any[] = [];

    slotSnap.docs.forEach((doc) => {
      const data: any = doc.data();

      // STATUS COUNT
      if (data.status === "available") available++;
      if (data.status === "booked") booked++;
      if (data.status === "cancelled") cancelled++;

      // 🔥 NEW: COUNT ALL CREATED SLOTS PER DAY
      if (data.date) {
        if (!dateMap[data.date]) dateMap[data.date] = 0;
        dateMap[data.date]++;
      }

      // RECENT BOOKINGS
      if (data.status === "booked") {
        bookedList.push({
          id: doc.id,
          date: data.date,
          lecturerName: userMap[data.lecturerId]?.name || "Unknown",
          studentName: userMap[data.bookedBy]?.name || "Unknown",
          status: data.status,
        });
      }
    });

    const chartArr = Object.keys(dateMap).map((date) => ({
      date,
      slots: dateMap[date],
    }));

    bookedList.sort((a, b) => b.date.localeCompare(a.date));

    setStats({
      users: userSnap.size,
      lecturers,
      students,
      slots: slotSnap.size,
      bookings: booked,
    });

    setBookingStats({ available, booked, cancelled });
    setChartData(chartArr);
    setRecentBookings(bookedList.slice(0, 5));
  };

  // 🎨 NEW COLOR CARDS
  const cards = [
    {
      title: "Users",
      value: stats.users,
      icon: <Users />,
      color: "bg-blue-600",
    },
    {
      title: "Lecturers",
      value: stats.lecturers,
      icon: <UserCheck />,
      color: "bg-indigo-600",
    },
    {
      title: "Students",
      value: stats.students,
      icon: <GraduationCap />,
      color: "bg-orange-500",
    },
    {
      title: "Slots",
      value: stats.slots,
      icon: <Calendar />,
      color: "bg-green-600",
    },
    {
      title: "Bookings",
      value: stats.bookings,
      icon: <BookOpen />,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 min-h-screen">

        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Dashboard Overview 🚀
        </h1>

        {/* STATS */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {cards.map((c, i) => (
            <div
              key={i}
              className={`${c.color} text-white p-4 rounded-xl shadow flex items-center justify-between`}
            >
              <div>
                <p className="text-sm opacity-80">{c.title}</p>
                <h2 className="text-2xl font-bold">{c.value}</h2>
              </div>
              {c.icon}
            </div>
          ))}
        </div>

        {/* CHART + STATUS */}
        <div className="grid grid-cols-2 gap-6 mb-6">

          {/* CHART */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4 text-gray-700">
              📊 Time Slots Created per Day
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="slots"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* STATUS */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4 text-gray-700">
              📌 Booking Status
            </h2>

            <div className="space-y-4 text-gray-700">

              <div className="flex justify-between">
                <span>Available</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                  {bookingStats.available}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Booked</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                  {bookingStats.booked}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Cancelled</span>
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
                  {bookingStats.cancelled}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* RECENT BOOKINGS */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4 text-gray-700">
            🕒 Recent Bookings
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="p-2 text-left">Student</th>
                <th className="p-2 text-left">Lecturer</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((b, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{b.studentName}</td>
                  <td className="p-2">{b.lecturerName}</td>
                  <td className="p-2">{b.date}</td>
                  <td className="p-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}