const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'dashboard', 'habits');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const content = `import { createServerSupabaseClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";
import HabitsClient from "./HabitsClient";

export default async function HabitsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = new Date().toISOString().slice(0, 10);
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [{ data: habits }, { data: logs }] = await Promise.all([
    supabase.from("habits").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
    supabase.from("habit_logs").select("*").eq("user_id", user.id).gte("date", twoWeeksAgo).lte("date", today),
  ]);

  return (
    <HabitsClient
      userId={user.id}
      initialHabits={habits || []}
      initialLogs={logs || []}
      today={today}
    />
  );
}
`;

fs.writeFileSync(path.join(dir, 'page.tsx'), content, 'utf8');
console.log('Done: habits/page.tsx');