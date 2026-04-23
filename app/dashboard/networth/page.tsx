import { createServerSupabaseClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";
import NetWorthClient from "./NetWorthClient";

export default async function NetWorthPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: assets }, { data: liabilities }] = await Promise.all([
    supabase.from("assets").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("liabilities").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  return <NetWorthClient userId={user.id} initialAssets={assets || []} initialLiabilities={liabilities || []} />;
}
