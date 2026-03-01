"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminEventPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [event, setEvent] = useState<any>(null);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/admin/login");
        return;
      }

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .eq("owner_user_id", user.id)
        .single();

      if (eventError || !eventData) {
        setError("You do not have access to this event");
        setLoading(false);
        return;
      }

      setEvent(eventData);

      const { data: rsvpData } = await supabase
        .from("rsvps")
        .select("*")
        .eq("event_id", eventData.id)
        .order("created_at", { ascending: false });

      setRsvps(rsvpData || []);
      setLoading(false);
    };

    if (slug) init();
  }, [slug, router]);

  const stats = useMemo(() => {
    const total = rsvps.length;
    const attending = rsvps.filter((r) => r.attending).length;
    const notAttending = rsvps.filter((r) => !r.attending).length;
    return { total, attending, notAttending };
  }, [rsvps]);

  const publicLink = event ? `${window.location.origin}/${event.slug}` : "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicLink);
    alert("Link copied!");
  };

  const exportCSV = () => {
    if (!rsvps.length) return alert("No RSVPs to export");

    const headers = ["Name", "Attending", "Guests", "Note", "Date"];
    const rows = rsvps.map((r) => [
      r.main_name,
      r.attending ? "Yes" : "No",
      Array.isArray(r.guests) ? r.guests.join(" | ") : "",
      r.note || "",
      new Date(r.created_at).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvps-${slug}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    if (!rsvps.length) return alert("No RSVPs to export");

    const data = rsvps.map((r) => ({
      Name: r.main_name,
      Attending: r.attending ? "Yes" : "No",
      Guests: Array.isArray(r.guests) ? r.guests.join(", ") : "",
      Note: r.note || "",
      Date: new Date(r.created_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RSVPs");

    XLSX.writeFile(workbook, `rsvps-${slug}.xlsx`);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Event not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">Event: {event.slug}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => router.push(`/admin/${event.slug}/builder`)}
              className="px-4 py-2 bg-blue-500 text-black rounded"
            >
              Edit Invitation
            </button>
            <button
              onClick={copyLink}
              className="px-4 py-2 bg-white text-black rounded"
            >
              Copy Link
            </button>
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-green-500 text-black rounded"
            >
              Export CSV
            </button>
            <button
              onClick={exportExcel}
              className="px-4 py-2 bg-emerald-500 text-black rounded"
            >
              Export Excel
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/admin/login");
              }}
              className="px-4 py-2 bg-red-500 text-black rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-gray-400 text-sm">Total RSVPs</div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-gray-400 text-sm">Attending</div>
            <div className="text-3xl font-bold text-green-400">
              {stats.attending}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-gray-400 text-sm">Not Attending</div>
            <div className="text-3xl font-bold text-red-400">
              {stats.notAttending}
            </div>
          </div>
        </div>

        {/* RSVP Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">📩 RSVP Responses</h2>

          {rsvps.length === 0 ? (
            <p className="text-gray-400">No RSVPs yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left border-b border-white/10 text-gray-400">
                <tr>
                  <th className="py-2">Name</th>
                  <th>Attending</th>
                  <th>Guests</th>
                  <th>Note</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((r) => (
                  <tr key={r.id} className="border-b border-white/5">
                    <td className="py-2 font-medium">{r.main_name}</td>
                    <td>
                      {r.attending ? (
                        <span className="text-green-400">Yes</span>
                      ) : (
                        <span className="text-red-400">No</span>
                      )}
                    </td>
                    <td>
                      {Array.isArray(r.guests) ? r.guests.join(", ") : ""}
                    </td>
                    <td className="max-w-[200px] truncate">{r.note || "-"}</td>
                    <td className="text-xs text-white/60">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
