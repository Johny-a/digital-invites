import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server only
);

export async function POST(req: Request) {
  const { email, password, slug, title } = await req.json();

  // 1. Create auth user
  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 400 });
  }

  const userId = userData.user.id;

  // 2. Insert profile
  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: userId,
    username: email,
    role: "admin",
    slug: slug,
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  // 3. Insert into ADMINS table  ✅ THIS IS THE IMPORTANT PART
  const { error: adminError } = await supabaseAdmin.from("admins").insert({
    id: userId,
    email: email,
    role: "admin",
    event_slug: slug,
  });

  if (adminError) {
    return NextResponse.json({ error: adminError.message }, { status: 400 });
  }

  // 4. Create event
  const { error: eventError } = await supabaseAdmin.from("events").insert({
    slug,
    title,
    owner_user_id: userId,
  });

  if (eventError) {
    return NextResponse.json({ error: eventError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}