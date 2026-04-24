const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'dashboard', 'sikareads');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const content = `import { createServerSupabaseClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";
import SikareadsClient from "./SikareadsClient";

export default async function SikareadsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: books }, { data: progress }] = await Promise.all([
    supabase.from("books").select("*").order("created_at", { ascending: false }),
    supabase.from("reading_progress").select("*, books(*)").eq("user_id", user.id),
  ]);

  return (
    <SikareadsClient
      userId={user.id}
      books={books || []}
      progress={progress || []}
    />
  );
}
`;

fs.writeFileSync(path.join(dir, 'page.tsx'), content, 'utf8');
console.log('Done: sikareads/page.tsx');