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

    const lecturerList: LecturerStatus[] = usersSnap.docs
      .map((doc) => {
        const data = doc.data() as any;

        return {
          id: doc.id,
          name: data.name,
          photo: data.photoUrl || data.photo || data.profileImage || "",
          status: data.status || "leave",
        };
      })
      .filter((u) => u.status && u.name && u.id)
      .filter((u: any) => {
        const role = usersSnap.docs
          .find((d) => d.id === u.id)
          ?.data().role;
        return role === "lecturer";
      });

    setLecturers(lecturerList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getColor = (status: string) => {
    if (status === "available") return "green";
    if (status === "away") return "orange";
    if (status === "leave") return "danger";
    return "gray";
  };

  return (
    <div className="flex h-screen overflow-hidden">

      
      <div className="w-64 fixed h-full">
        <Sidebar />
      </div>

      
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

                
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                  
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      backgroundColor: getColor(lec.status),
                    }}
                  />

                  
                  <span
                    style={{
                      fontWeight: "semibold",
                      color: getColor(lec.status),
                    }}
                  >
                    {lec.status === "available"
                      ? "Available"
                      : lec.status === "away"
                      ? "Away"
                      : "On Leave"}
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