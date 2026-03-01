"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ClientProfile = {
  id: string;
  username: string;
  role: string;
  slug: string | null;
  created_at: string;
};

export default function SuperAdminPage() {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

const [editing, setEditing] = useState<ClientProfile | null>(null);
const [editUsername, setEditUsername] = useState("");
const [editSlug, setEditSlug] = useState("");

  // create form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [slug, setSlug] = useState("");
  const [msg, setMsg] = useState("");

const loadClients = async () => {
  try {
    setLoading(true);
    const res = await fetch("/api/super-admin/list-admins");

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await res.json();
    setClients(data.clients || []);
  } catch (e) {
    console.error("Failed to load clients", e);
    setClients([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/api/super-admin/login";
          return;
        }

        // Check super admin
        const { data: admin, error } = await supabase
          .from("admins")
          .select("id")
          .eq("email", user.email)
          .eq("role", "super")
          .single();

        if (error || !admin) {
          await supabase.auth.signOut();
          window.location.href = "/super-admin/login";
          return;
        }

        await loadClients();
      } catch (e) {
        console.error("Auth init failed", e);
        window.location.href = "/super-admin/login";
      }
    };

    init();
  }, []);

  const createClient = async () => {
    setMsg("");
    const res = await fetch("/api/super-admin/create-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, slug, title: slug }),
    });

    const data = await res.json();
    if (!res.ok) setMsg("❌ " + data.error);
    else {
      setMsg("✅ Client created");
      setEmail("");
      setPassword("");
      setSlug("");
      loadClients();
    }
  };

const saveEdit = async () => {
  if (!editing) return;

  const res = await fetch("/api/super-admin/update-client", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: editing.id,
      username: editUsername,
      slug: editSlug,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert("❌ " + data.error);
    return;
  }

  setEditing(null);
  loadClients();
};

  const deleteClient = async (id: string) => {
    if (!confirm("Delete this client?")) return;

    await fetch("/api/super-admin/delete-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    });

    loadClients();
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛡️ Super Admin Dashboard</h1>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/api/super-admin/login";
          }}
          className="bg-red-500/20 text-red-300 px-4 py-2 rounded hover:bg-red-500/30"
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-white/60 text-sm">Total Clients</div>
          <div className="text-3xl font-bold">{clients.length}</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-white/60 text-sm">Active Clients</div>
          <div className="text-3xl font-bold text-green-400">{clients.length}</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-white/60 text-sm">Super Admins</div>
          <div className="text-3xl font-bold text-purple-400">1</div>
        </div>
      </div>

      {/* CREATE CLIENT */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
        <h2 className="text-xl font-semibold mb-3">Create New Client</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="p-2 text-black"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="p-2 text-black"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="p-2 text-black"
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <button
            onClick={createClient}
            className="bg-green-500 text-black rounded px-4"
          >
            Create
          </button>
        </div>
        {msg && <p className="mt-2">{msg}</p>}
      </div>

      {/* CLIENTS TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <h2 className="text-xl font-semibold mb-4">Clients</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <input
              className="mb-4 bg-black/40 border border-white/10 rounded px-4 py-2 text-sm w-full max-w-sm"
              placeholder="Search by username or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-white/10">
                <tr>
                  <th className="py-2 text-left">Username</th>
                  <th className="text-left">Slug</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients
                  .filter(
                    (c) =>
                      c.username.toLowerCase().includes(search.toLowerCase()) ||
                      (c.slug ?? "")
                        .toLowerCase()
                        .includes(search.toLowerCase())
                  )
                  .map((c) => (
                    <tr key={c.id} className="border-b border-white/5">
                      <td className="py-2">{c.username}</td>
                      <td>{c.slug || "-"}</td>
                      <td>
                        <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs">
                          {c.role}
                        </span>
                      </td>
<td className="text-xs text-white/60">
  {new Date(c.created_at).toLocaleDateString()}
</td>

<td className="text-right flex gap-2 justify-end">
  <button
    onClick={() => {
      setEditing(c);
      setEditUsername(c.username);
      setEditSlug(c.slug || "");
    }}
    className="px-3 py-1 rounded bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 text-xs"
  >
    Edit
  </button>

  <button
    onClick={() => deleteClient(c.id)}
    className="px-3 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs"
  >
    Delete
  </button>
</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </div>
{editing && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-md">
      <h3 className="text-xl font-semibold mb-4">Edit Client</h3>

      <div className="space-y-3">
        <input
          className="w-full p-2 text-black"
          placeholder="Username"
          value={editUsername}
          onChange={(e) => setEditUsername(e.target.value)}
        />

        <input
          className="w-full p-2 text-black"
          placeholder="Slug"
          value={editSlug}
          onChange={(e) => setEditSlug(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setEditing(null)}
          className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20"
        >
          Cancel
        </button>

        <button
          onClick={saveEdit}
          className="px-4 py-2 rounded bg-green-500 text-black hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}