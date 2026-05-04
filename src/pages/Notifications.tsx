import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../components/Sidebar";

interface Notification {
  id: string;
  title?: string;
  message?: string;
  targetRole?: "all" | "student" | "lecturer";
  receiverId?: string;
  createdAt?: any;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "student" | "lecturer">("all");

  
  const fetchNotifications = async () => {
    const snap = await getDocs(collection(db, "notifications"));

    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    setNotifications(list.reverse());
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  
  const sendNotification = async () => {
    if (!title || !message) {
      alert("Please fill all fields");
      return;
    }

    await addDoc(collection(db, "notifications"), {
      title,
      message,
      receiverId: "ALL",
      targetRole: target || "all",
      createdAt: serverTimestamp(),
      read: false,
    });

    setTitle("");
    setMessage("");
    setTarget("all");
    setShowModal(false);

    fetchNotifications();
  };

  
  const deleteNotification = async (id: string) => {
    if (!window.confirm("Delete this notification?")) return;

    await deleteDoc(doc(db, "notifications", id));
    fetchNotifications();
  };

  
  const adminNotifications = notifications.filter(
    (n) => n.receiverId === "ALL"
  );

  const otherNotifications = notifications.filter(
    (n) => n.receiverId !== "ALL"
  );

  return (
    <div className="flex h-screen overflow-hidden">

      
      <div className="w-64 h-screen fixed left-0 top-0">
        <Sidebar />
      </div>

      
      <div className="flex-1 ml-64 overflow-y-auto p-6 bg-gray-100">

        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Notifications</h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            + Send Notification
          </button>
        </div>

        {/* LIST */}
        <div className="bg-white rounded-xl shadow p-4">

          {/* 🔥 ADMIN */}
          {adminNotifications.length > 0 && (
            <>
              <h2 className="font-semibold mb-3 text-blue-600">
                📢 Admin Announcements
              </h2>

              {adminNotifications.map((n) => {
                const role = (n.targetRole ?? "unknown").toUpperCase();
                const time =
                  n.createdAt?.toDate?.().toLocaleString() || "No time";

                return (
                  <div
                    key={n.id}
                    className="flex justify-between items-center border-b py-3"
                  >
                    <div>
                      <p className="font-medium">{n.title || "No Title"}</p>
                      <p className="text-sm text-gray-600">
                        {n.message || "No message"}
                      </p>

                      <p className="text-xs text-primary mt-1">
                        {role} • {time}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="text-danger hover:text-dangerLight"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </>
          )}

          {/* 🔥 OTHER */}
          {otherNotifications.length > 0 && (
            <>
              <h2 className="font-semibold mt-6 mb-3 text-gray-700">
                Other Notifications
              </h2>

              {otherNotifications.map((n) => {
                const role = (n.targetRole ?? "unknown").toUpperCase();
                const time =
                  n.createdAt?.toDate?.().toLocaleString() || "No time";

                return (
                  <div
                    key={n.id}
                    className="flex justify-between items-center border-b py-3"
                  >
                    <div>
                      <p className="font-medium">{n.title || "No Title"}</p>
                      <p className="text-sm text-gray-600">
                        {n.message || "No message"}
                      </p>

                      <p className="text-xs text-textLight mt-1">
                        {role} • {time}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="text-danger hover:text-dangerLight"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </>
          )}

          
          {notifications.length === 0 && (
            <p className="text-gray-500">No notifications yet</p>
          )}
        </div>
      </div>

      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-96 shadow">

            <h2 className="text-lg font-semibold mb-4">
              Send Notification
            </h2>

            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <select
              value={target}
              onChange={(e) =>
                setTarget(e.target.value as "all" | "student" | "lecturer")
              }
              className="w-full border p-2 rounded mb-4"
            >
              <option value="all">All Users</option>
              <option value="student">Students</option>
              <option value="lecturer">Lecturers</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={sendNotification}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Send
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}