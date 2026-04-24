import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCred.user.uid;

      const userSnap = await getDoc(doc(db, "users", uid));
      const data = userSnap.data();

      // 🔥 ADMIN CHECK
      if (data?.role !== "admin") {
        alert("Access denied. You are not an admin.");
        return;
      }

      // ✅ SUCCESS → GO DASHBOARD
      navigate("/dashboard");

    } catch (e: any) {
      // 🔥 BETTER ERROR HANDLING
      if (e.code === "auth/user-not-found") {
        alert("User not found");
      } else if (e.code === "auth/wrong-password") {
        alert("Wrong password");
      } else if (e.code === "auth/invalid-email") {
        alert("Invalid email format");
      } else {
        alert("Login failed. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white w-96 p-8 rounded-2xl shadow-xl">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Admin Panel
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Sign in to continue
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}