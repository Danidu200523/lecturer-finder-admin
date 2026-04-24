import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(u);

      try {
        const snap = await getDoc(doc(db, "users", u.uid));

        if (snap.exists() && snap.data().role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🔥 WAIT UNTIL AUTH CHECK FINISHES
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // ❌ NOT LOGGED IN
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ❌ NOT ADMIN
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  // ✅ ALLOWED
  return children;
}