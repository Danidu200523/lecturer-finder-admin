import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  faculty?: string;
  department?: string;
  university?: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newUser, setNewUser] = useState<any>({
    name: "",
    email: "",
    password: "",
    role: "student",
    faculty: "",
    department: "",
    university: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];

    setUsers(list);
  };

  const deleteUser = async () => {
    if (!selectedUser) return;

    await deleteDoc(doc(db, "users", selectedUser.id));
    setSelectedUser(null);
    fetchUsers();
  };

  const createUser = async () => {
    try {
      await addDoc(collection(db, "users"), newUser);
      setShowAddModal(false);
      fetchUsers();
    } catch (e) {
      alert("Error creating user");
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-semibold">Users</h1>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            + Add User
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                  <td className="p-2 flex gap-2">
                    
                    {/* VIEW */}
                    <button
                      onClick={() => setViewUser(user)}
                      className="bg-primary text-white px-3 py-1 rounded"
                    >
                      View
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="bg-danger text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔥 ADD USER MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">

              <h2 className="text-lg font-semibold mb-4">Add User</h2>

              <div className="space-y-3">

                <input
                  placeholder="Name"
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />

                <input
                  placeholder="Email"
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />

                <select
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="admin">Admin</option>
                </select>

                <input
                  placeholder="Faculty"
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) =>
                    setNewUser({ ...newUser, faculty: e.target.value })
                  }
                />

                <input
                  placeholder="Department"
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) =>
                    setNewUser({ ...newUser, department: e.target.value })
                  }
                />

                <input
                  placeholder="University"
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) =>
                    setNewUser({ ...newUser, university: e.target.value })
                  }
                />

              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={createUser}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Add
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 🔥 VIEW USER MODAL */}
        {viewUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

              <h2 className="text-lg font-semibold mb-4">
                User Details
              </h2>

              <div className="space-y-2 text-sm">

                <p><b>Name:</b> {viewUser.name}</p>
                <p><b>Email:</b> {viewUser.email}</p>
                <p><b>Role:</b> {viewUser.role}</p>
                <p><b>Faculty:</b> {viewUser.faculty || "-"}</p>
                <p><b>Department:</b> {viewUser.department || "-"}</p>
                <p><b>University:</b> {viewUser.university || "-"}</p>

              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setViewUser(null)}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-xl shadow w-80">
              <h2 className="text-lg font-semibold mb-3">
                Confirm Delete
              </h2>

              <p className="text-sm mb-5">
                Delete {selectedUser.name}?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={deleteUser}
                  className="px-4 py-2 bg-danger text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}