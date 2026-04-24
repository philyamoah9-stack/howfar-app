import { createServerSupabaseClient } from "../../lib/supabase-server";
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
