import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { createUserProfile, subscribeToProfile } from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const unsubProfileRef = useRef(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      // Tear down any previous profile subscription before starting a new one.
      if (unsubProfileRef.current) {
        unsubProfileRef.current();
        unsubProfileRef.current = null;
      }

      if (firebaseUser) {
        // Realtime subscription: this is what lets `premium` flip to true
        // automatically once the Midtrans webhook updates Firestore, with
        // no page refresh needed.
        unsubProfileRef.current = subscribeToProfile(firebaseUser.uid, (p) => {
          setProfile(p);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubProfileRef.current) unsubProfileRef.current();
    };
  }, []);

  async function register(name, email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await createUserProfile(cred.user.uid, name);
    // Profile state will populate via the onSnapshot subscription above.
    return cred.user;
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  async function logout() {
    await signOut(auth);
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  // Kept for local optimistic updates (XP, lessons, challenge days) that
  // services/userService.js functions return after writing to Firestore.
  // The realtime subscription will also reconcile shortly after.
  function refreshProfile(next) {
    setProfile(next);
  }

  const value = { user, profile, loading, register, login, logout, resetPassword, refreshProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
