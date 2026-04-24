const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'dashboard', 'mind');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const content = `import { createServerSupabaseClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";
import MindClient from "./MindClient";

export default async function MindPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [{ data: profile }, { data: entries }] = await Promise.all([
    supabase.from("profiles").select("faith_mode, name").eq("id", user.id).single(),
    supabase.from("journal_entries").select("*").eq("user_id", user.id).gte("date", thirtyDaysAgo).order("date", { ascending: false }),
  ]);

  return (
    <MindClient
      userId={user.id}
      faithMode={profile?.faith_mode || false}
      initialEntries={entries || []}
      today={today}
    />
  );
}
`;

fs.writeFileSync(path.join(dir, 'page.tsx'), content, 'utf8');
console.log('Done: mind/page.tsx');