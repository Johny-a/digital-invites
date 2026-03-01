"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Check if user is SUPER admin
    const { data: admin } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .eq("role", "super")
      .single();

    if (!admin) {
      setError("Not authorized");
      await supabase.auth.signOut();
      return;
    }

    // OK → go to dashboard
    window.location.href = "/api/super-admin";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">🛡️ Super Admin Login</h1>

        <input
          className="w-full mb-3 p-2 text-black rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-3 p-2 text-black rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <button
          onClick={login}
          className="w-full bg-green-500 text-black py-2 rounded font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}