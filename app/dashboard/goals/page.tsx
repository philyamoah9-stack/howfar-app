import { createServerSupabaseClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";
import GoalsClient from "./GoalsClient";

export default async function GoalsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <GoalsClient userId={user.id} initialGoals={goals || []} />;
}
