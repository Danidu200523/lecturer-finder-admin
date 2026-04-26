import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface Slot {
  id: string;
  lecturerId: string;
  lecturerName?: string;
  lecturerPhoto?: string;
  studentName?: string;
  studentPhoto?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  bookedBy?: string;
}

export default function Bookings() {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    
    const userSnap = await getDocs(collection(db, "users"));
    const userMap: any = {};

    userSnap.docs.forEach((doc) => {
      const data: any = doc.data();

      
      const uid = doc.id || data.uid;

      userMap[uid] = {
        name: data.name,
        photo: data.photoUrl,
      };

      
      if (data.uid) {
        userMap[data.uid] = {
          name: data.name,
          photo: data.photoUrl,
        };
      }
    });

    
    const slotSnap = await getDocs(collection(db, "time_slots"));

    const list = slotSnap.docs.map((doc) => {
      const data: any = doc.data();

      const lecturer = userMap[data.lecturerId];
      const student = userMap[data.bookedBy];

      return {
        id: doc.id,
        ...data,

        
        lecturerName: lecturer?.name || "Unknown",
        lecturerPhoto:
          lecturer?.photo || "https://via.placeholder.com/40",

        
        studentName: data.bookedBy
          ? student?.name || "Unknown"
          : "-",

        studentPhoto:
          student?.photo || "https://via.placeholder.com/40",
      };
    });

    setSlots(list as Slot[]);
  };

  const getStatusColor = (status: string) => {
    if (status === "available")
      return "bg-green/10 text-green";

    if (status === "booked")
      return "bg-primaryLight text-primary";

    if (status === "cancelled")
      return "bg-dangerLight/20 text-danger";

    return "bg-gray-100 text-textLight";
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-background min-h-screen">
        <h1 className="text-2xl font-semibold mb-6 text-textDark">
          Booking Overview
        </h1>

        <div className="bg-card border border-border rounded-xl shadow p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-textLight text-sm">
                <th className="p-2">Lecturer</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Student</th>
              </tr>
            </thead>

            <tbody>
              {slots.map((slot) => (
                <tr key={slot.id} className="border-b hover:bg-gray-50">

                  
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={slot.lecturerPhoto}
                        className="w-9 h-9 rounded-full object-cover"
                        onError={(e: any) =>
                          (e.target.src =
                            "https://via.placeholder.com/40")
                        }
                      />
                      <span className="font-medium">
                        {slot.lecturerName}
                      </span>
                    </div>
                  </td>

                  
                  <td className="p-2">{slot.date}</td>

                  
                  <td className="p-2">
                    {slot.startTime && slot.endTime
                      ? `${slot.startTime} - ${slot.endTime}`
                      : "-"}
                  </td>

                  
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${getStatusColor(
                        slot.status
                      )}`}
                    >
                      {slot.status}
                    </span>
                  </td>

                  
                  <td className="p-2">
                    {slot.bookedBy ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={slot.studentPhoto}
                          className="w-9 h-9 rounded-full object-cover"
                          onError={(e: any) =>
                            (e.target.src =
                              "https://via.placeholder.com/40")
                          }
                        />
                        <span className="font-medium">
                          {slot.studentName}
                        </span>
                      </div>
                    ) : (
                      "-"
                    )}
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