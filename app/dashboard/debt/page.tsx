import { createServerSupabaseClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";
import DebtClient from "./DebtClient";

export default async function DebtPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: debts }, { data: profile }] = await Promise.all([
    supabase.from("debts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("profiles").select("monthly_income").eq("id", user.id).single(),
  ]);

  return <DebtClient userId={user.id} initialDebts={debts || []} monthlyIncome={profile?.monthly_income || 0} />;
}
