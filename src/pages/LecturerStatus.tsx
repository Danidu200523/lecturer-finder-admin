import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../components/Sidebar";

interface LecturerStatus {
  id: string;
  name: string;
  photo?: string;
  status: "available" | "away" | "leave";
}

export default function LecturerStatusPage() {
  const [lecturers, setLecturers] = useState<LecturerStatus[]>([]);

  const fetchData = async () => {
    const usersSnap = await getDocs(collection(db, "users"));
    const statusSnap = await getDocs(collection(db, "lecturer_status"));

    const statusMap: any = {};
    statusSnap.docs.forEach((doc) => {
      statusMap[doc.data().lecturerId] = doc.data().status;
    });

    const lecturerList: LecturerStatus[] = usersSnap.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }))
      .filter((u: any) => u.role === "lecturer")
      .map((lecturer: any) => ({
        id: lecturer.id,
        name: lecturer.name,
        photo: lecturer.photo || lecturer.profileImage || "",
        status: statusMap[lecturer.id] || "leave",
      }));

    setLecturers(lecturerList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "away":
        return "bg-yellow-400";
      case "leave":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "away":
        return "Away";
      case "leave":
        return "On Leave";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-64 fixed h-full">
        <Sidebar />
      </div>

      {/* CONTENT */}
      <div className="flex-1 ml-64 p-6 overflow-y-auto bg-gray-100">

        <h1 className="text-2xl font-semibold mb-6">
          Lecturer Status
        </h1>

        <div className="bg-white rounded-xl shadow p-4">

          {lecturers.length === 0 ? (
            <p className="text-gray-500">No lecturers found</p>
          ) : (
            lecturers.map((lec) => (
              <div
                key={lec.id}
                className="flex justify-between items-center border-b py-3"
              >
                {/* 🔥 LEFT SIDE (PHOTO + NAME) */}
                <div className="flex items-center gap-3">

                  <img
                    src={
                      lec.photo && lec.photo !== ""
                        ? lec.photo
                        : "https://via.placeholder.com/40"
                    }
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e: any) =>
                      (e.target.src = "https://via.placeholder.com/40")
                    }
                  />

                  <p className="font-medium">{lec.name}</p>
                </div>

                {/* 🔥 STATUS */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(
                      lec.status
                    )}`}
                  />
                  <span className="text-sm">
                    {getStatusText(lec.status)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}