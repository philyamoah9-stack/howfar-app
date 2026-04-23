import { createServerSupabaseClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";
import BudgetClient from "./BudgetClient";

export default async function BudgetPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = new Date();
  const month = today.toISOString().slice(0, 7);

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", `${month}-01`)
    .lte("date", `${month}-31`)
    .order("date", { ascending: false });

  return (
    <BudgetClient
      userId={user.id}
      initialTransactions={transactions || []}
      month={month}
    />
  );
}