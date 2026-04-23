"use client";

import { useEffect } from "react";
import { createClient } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    };
    signOut();
  }, [supabase, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Fraunces, serif",
        fontSize: "22px",
        color: "#7a7468",
        fontStyle: "italic",
      }}
    >
      Signing out...
    </div>
  );
}