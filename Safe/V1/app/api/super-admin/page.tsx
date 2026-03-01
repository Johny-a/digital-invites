"use client";

import { useState } from "react";

export default function SuperAdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [slug, setSlug] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const createClient = async () => {
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/super-admin/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          slug,
          title: slug,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg("❌ " + data.error);
      } else {
        setMsg("✅ Admin + Event created successfully");
        setEmail("");
        setPassword("");
        setSlug("");
      }
    } catch (err: any) {
      setMsg("❌ Network error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center text-white gap-4">
      <h1 className="text-3xl font-bold">Super Admin</h1>

      <input
        className="text-black p-2"
        placeholder="Client email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="text-black p-2"
        placeholder="Client password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />

      <input
        className="text-black p-2"
        placeholder="Event slug (joe-and-dayane)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      <button
        onClick={createClient}
        disabled={loading}
        className="bg-white text-black px-6 py-2"
      >
        {loading ? "Creating..." : "Create Client"}
      </button>

      {msg && <p>{msg}</p>}
    </div>
  );
}
