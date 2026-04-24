import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

interface Slot {
  id: string;
  lecturerId: string;
  lecturerName?: string;
  lecturerPhoto?: string;
  department?: string;
  email?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export default function TimeSlots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [viewLecturer, setViewLecturer] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchSlots();
  }, []);

  useEffect(() => {
    filterSlots();
  }, [search, statusFilter, slots]);

  const fetchSlots = async () => {
    // 🔹 USERS MAP
    const userSnap = await getDocs(collection(db, "users"));
    const userMap: any = {};

    userSnap.docs.forEach((d) => {
      userMap[d.id] = d.data(); // store full user object
    });

    // 🔹 TIME SLOTS
    const slotSnap = await getDocs(collection(db, "time_slots"));

    const list = slotSnap.docs.map((d) => {
      const data: any = d.data();
      const lecturer = userMap[data.lecturerId];

      return {
        id: d.id,
        ...data,
        lecturerName: lecturer?.name || "Unknown",
        lecturerPhoto:
          lecturer?.photoUrl || "https://via.placeholder.com/40",
        department: lecturer?.department || "N/A",
        email: lecturer?.email || "",
      };
    }) as Slot[];

    setSlots(list);
    setFilteredSlots(list);
  };

  const filterSlots = () => {
    let data = [...slots];

    if (search) {
      data = data.filter((s) =>
        s.lecturerName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((s) => s.status === statusFilter);
    }

    setFilteredSlots(data);
  };

  const deleteSlot = async () => {
    if (!selectedSlot) return;
    await deleteDoc(doc(db, "time_slots", selectedSlot.id));
    setSelectedSlot(null);
    fetchSlots();
  };

  const disableSlot = async (id: string) => {
    await updateDoc(doc(db, "time_slots", id), {
      status: "disabled",
    });
    fetchSlots();
  };

  const getStatusColor = (status: string) => {
    if (status === "available") return "bg-green-100 text-green";
    if (status === "booked") return "bg-blue-100 text-primary";
    if (status === "disabled") return "bg-red-100 text-danger";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-semibold mb-6">
          Time Slots Management
        </h1>

        {/* FILTER */}
        <div className="flex gap-4 mb-4 ">
          <input
            placeholder="Search Lecturer"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-card rounded-xl shadow p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2">Lecturer</th>
                <th className="p-2">Department</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredSlots.map((slot) => (
                <tr key={slot.id} className="border-b">
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={slot.lecturerPhoto}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p>{slot.lecturerName}</p>
                        <p className="text-xs text-textLight">
                          {slot.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-2">{slot.department}</td>
                  <td className="p-2">{slot.date}</td>

                  {/* ✅ FIXED TIME */}
                  <td className="p-2">
                    {slot.startTime} - {slot.endTime}
                  </td>

                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded ${getStatusColor(
                        slot.status
                      )}`}
                    >
                      {slot.status}
                    </span>
                  </td>

                  <td className="p-2 flex gap-2">
                    

                    <button
                      onClick={() => setSelectedSlot(slot)}
                      className="bg-danger hover:bg-dangerLight text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>

                    {/* ✅ VIEW BUTTON FIXED */}
                    <button
                      onClick={() => setViewLecturer(slot)}
                      className="bg-primary hover:bg-primaryHover text-white px-2 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DELETE MODAL */}
        {selectedSlot && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="bg-white p-6 rounded">
              <p>Delete this slot?</p>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setSelectedSlot(null)} className="bg-background  text-textLight px-3 py-1 rounded">
                  Cancel
                </button>
                <button onClick={deleteSlot} className="bg-danger hover:bg-dangerLight text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ VIEW LECTURER MODAL */}
        {viewLecturer && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="bg-white p-6 rounded w-80">
              <img
                src={viewLecturer.lecturerPhoto}
                className="w-20 h-20 rounded-full mx-auto mb-3"
              />

              <h2 className="text-center font-semibold">
                {viewLecturer.lecturerName}
              </h2>

              <p className="text-center text-sm text-textLight">
                {viewLecturer.department}
              </p>

              <p className="text-center text-sm mt-2">
                {viewLecturer.email}
              </p>

              <button
                onClick={() => setViewLecturer(null)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}