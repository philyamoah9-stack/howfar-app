const fs = require('fs');
const path = require('path');

const content = `import { createServerSupabaseClient } from "../lib/supabase-server";
import { redirect } from "next/navigation";
import OverviewClient from "./OverviewClient";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = new Date();
  const month = today.toISOString().slice(0, 7);

  const [
    { data: profile },
    { data: transactions },
    { data: goals },
    { data: assets },
    { data: liabilities },
    { data: debts },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("transactions").select("*").eq("user_id", user.id).gte("date", month + "-01").lte("date", month + "-31"),
    supabase.from("goals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("assets").select("*").eq("user_id", user.id),
    supabase.from("liabilities").select("*").eq("user_id", user.id),
    supabase.from("debts").select("*").eq("user_id", user.id),
  ]);

  return (
    <OverviewClient
      profile={profile}
      transactions={transactions || []}
      goals={goals || []}
      assets={assets || []}
      liabilities={liabilities || []}
      debts={debts || []}
      month={month}
    />
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'app', 'dashboard', 'page.tsx'), content, 'utf8');
console.log('Done: page.tsx');