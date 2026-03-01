"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // After login, just go to /admin (it will redirect properly)
    router.push("/admin");
  };

 return (
  <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-4 px-6">
    <h1 className="text-2xl font-bold mb-4">Admin Login</h1>

    <input
      className="w-full max-w-sm px-4 py-3 rounded bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-white/50"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      className="w-full max-w-sm px-4 py-3 rounded bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-white/50"
      placeholder="Password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      onClick={handleLogin}
      disabled={loading}
      className="w-full max-w-sm bg-white text-black px-6 py-3 rounded font-semibold disabled:opacity-50"
    >
      {loading ? "Logging in..." : "Login"}
    </button>

    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
  </div>
);

}
