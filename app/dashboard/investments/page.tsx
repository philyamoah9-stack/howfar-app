import { createServerSupabaseClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";
import InvestmentsClient from "./InvestmentsClient";

export default async function InvestmentsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: investments } = await supabase
    .from("investments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <InvestmentsClient userId={user.id} initialInvestments={investments || []} />;
}
