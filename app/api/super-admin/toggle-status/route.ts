const toggleStatus = async (id: string, current: "active" | "inactive") => {
  await fetch("/api/super-admin/toggle-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      status: current === "active" ? "inactive" : "active",
    }),
  });

  loadAdmins();
};