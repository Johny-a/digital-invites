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
const [publicLink, setPublicLink] = useState("");


  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError("");
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  router.push("/admin/login");
  return;
}

console.log("LOGGED USER:", user.id, user.email);
console.log("URL SLUG:", slug);

const { data: eventData, error: eventError } = await supabase
  .from("events")
  .select("*")
  .eq("slug", slug)
  .single();


console.log("EVENT QUERY RESULT:", eventData, eventError);


      if (eventError || !eventData) {
        setError("You do not have access to this event");
        setLoading(false);
        return;
      }

      setEvent(eventData);
setPublicLink(`${window.location.origin}/${eventData.slug}`);



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

  const attendingPeople = rsvps
  .filter((r) => r.attending === true)
  .reduce((sum, r) => sum + (Number(r.guest_count) || 0), 0);

  const notAttending = rsvps
  .filter((r) => r.attending === false)
  .reduce((sum, r) => sum + 1, 0);

  return { total, attending: attendingPeople, notAttending };
}, [rsvps]);



const deleteRSVP = async (id: string) => {
  if (!confirm("Delete this RSVP?")) return;

  const { error } = await supabase.from("rsvps").delete().eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    alert("Failed to delete RSVP: " + error.message);
  } else {
    setRsvps((prev) => prev.filter((r) => r.id !== id));
  }
};

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicLink);
    alert("Link copied!");
  };

const exportCSV = () => {
  if (!rsvps.length) return alert("No RSVPs to export");

  const headers = [
    "Inviter Name",
    "Attending",
    "People Coming",
    "Note",
    "Submitted At",
  ];

  const rows = rsvps.map((r) => {
    const peopleComing = Number(r.guest_count) || 0;

    return [
      r.main_name || "",
      r.attending ? "Yes" : "No",
      peopleComing,
      r.note || "",
      new Date(r.created_at).toLocaleString(),
    ];
  });

  const totalPeople = rsvps.reduce((sum, r) => {
    return sum + (r.attending ? 1 + (Number(r.guest_count) || 0) : 0);
  }, 0);

  rows.push([]);
  rows.push(["TOTAL", "", totalPeople, "", ""]);

  const csvContent = [
    [`RSVP List – ${event.slug}`],
    [`Exported at: ${new Date().toLocaleString()}`],
    [],
    headers,
    ...rows,
  ]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `RSVPs-${event.slug}-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  a.click();

  URL.revokeObjectURL(url);
};

const exportExcel = () => {
  if (!rsvps.length) return alert("No RSVPs to export");

  const data = rsvps.map((r) => {
    const peopleComing = r.attending ? 1 + (Number(r.guest_count) || 0) : 0;

    return {
      "Inviter Name": r.main_name || "",
      Attending: r.attending ? "Yes" : "No",
      "People Coming": peopleComing,
      Note: r.note || "",
      "Submitted At": new Date(r.created_at).toLocaleString(),
    };
  });

  // Build base sheet with title + subtitle + header
  const worksheet = XLSX.utils.aoa_to_sheet([
    [`RSVP List – ${event.slug}`],
    [`Exported at: ${new Date().toLocaleString()}`],
    [],
    ["Inviter Name", "Attending", "People Coming", "Note", "Submitted At"],
  ]);

  // Add data starting row 5
  XLSX.utils.sheet_add_json(worksheet, data, {
    origin: "A5",
    skipHeader: true,
  });

  // Totals
  const totalPeople = rsvps.reduce((sum, r) => {
    return sum + (r.attending ? 1 + (Number(r.guest_count) || 0) : 0);
  }, 0);

  const endRow = data.length + 6;
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [["TOTAL", "", totalPeople, "", ""]],
    { origin: `A${endRow}` }
  );

  // Column widths
  worksheet["!cols"] = [
    { wch: 25 },
    { wch: 12 },
    { wch: 18 },
    { wch: 30 },
    { wch: 22 },
  ];

  // Merge title + subtitle
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
  ];

  // Style header row (row 4, 0-based index = 3)
  const headerRowIndex = 3;
  const headerCells = ["A", "B", "C", "D", "E"];

  headerCells.forEach((col) => {
    const cellRef = `${col}${headerRowIndex + 1}`;
    if (!worksheet[cellRef]) return;

    worksheet[cellRef].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F46E5" } }, // Indigo
      alignment: { horizontal: "center", vertical: "center" },
    };
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "RSVPs");

  XLSX.writeFile(
    workbook,
    `RSVPs-${event.slug}-${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};
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
  <th>People Coming</th>
  <th>Note</th>
  <th>Date</th>
  <th>Action</th>
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
<td className="font-semibold">
  {r.attending ? (
    Number(r.guest_count) > 0
      ? <td className="font-semibold">
  {r.attending ? (Number(r.guest_count) || "") : ""}
</td>
      : r.main_name
  ) : (
    Number(r.guest_count) > 0
      ? `${r.main_name} + ${r.guest_count} (Not attending)`
      : `${r.main_name} (Not attending)`
  )}
</td>

                    <td className="max-w-[200px] truncate">{r.note || "-"}</td>
                    <td className="text-xs text-white/60">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
<td>
  <button
    onClick={() => deleteRSVP(r.id)}
    className="text-red-400 hover:text-red-600 font-bold"
    title="Delete RSVP"
  >
    ✕
  </button>
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
