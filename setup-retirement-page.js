const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'dashboard', 'retirement');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const content = `import { createServerSupabaseClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";
import RetirementClient from "./RetirementClient";

export default async function RetirementPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <RetirementClient userId={user.id} profile={profile} />;
}
`;

fs.writeFileSync(path.join(dir, 'page.tsx'), content, 'utf8');
console.log('Done: retirement page.tsx');