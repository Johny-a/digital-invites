import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId } = await req.json();

  // delete profile
  await supabaseAdmin.from("profiles").delete().eq("id", userId);

  // delete auth user
  await supabaseAdmin.auth.admin.deleteUser(userId);

  return NextResponse.json({ success: true });
}