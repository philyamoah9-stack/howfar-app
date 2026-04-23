import { createServerSupabaseClient } from "../lib/supabase-server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const name = profile?.name || "Friend";
  const initial = name.charAt(0).toUpperCase();
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",display:"grid",gridTemplateColumns:"240px 1fr"}}>

      <aside style={{background:"#141414",borderRight:"1px solid #1e1e1e",padding:"28px 20px",display:"flex",flexDirection:"column"}}>
        <div style={{fontFamily:"Fraunces, serif",fontSize:"20px",color:"#f4ecd8",marginBottom:"28px",padding:"0 10px"}}>
          How <em style={{fontStyle:"italic",color:"#d4a947"}}>Far?</em>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px",borderRadius:"12px",background:"#1a1a1a",border:"1px solid #2a2a2a",marginBottom:"28px"}}>
          <div style={{width:"38px",height:"38px",borderRadius:"50%",background:"linear-gradient(135deg, #d4a947, #8a6f2e)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Fraunces, serif",fontWeight:500,color:"#0a0a0a",fontSize:"15px",flexShrink:0}}>
            {initial}
          </div>
          <div>
            <div style={{fontSize:"13px",color:"#f4ecd8",fontWeight:500}}>{name}</div>
            <div style={{fontSize:"10px",color:"#d4a947",letterSpacing:"0.1em",textTransform:"uppercase",marginTop:"2px"}}>Founding beta</div>
          </div>
        </div>

        <div style={{fontFamily:"JetBrains Mono, monospace",fontSize:"10px",letterSpacing:"0.15em",color:"#7a7468",textTransform:"uppercase",margin:"0 12px 8px"}}>Finance</div>

        <a href="/dashboard" style={{display:"block",padding:"10px 12px",borderRadius:"10px",fontSize:"13px",color:"#d4a947",background:"rgba(212,169,71,0.12)",textDecoration:"none",marginBottom:"2px"}}>Overview</a>
        <a href="/dashboard/budget" style={{display:"block",padding:"10px 12px",borderRadius:"10px",fontSize:"13px",color:"#999080",textDecoration:"none",marginBottom:"2px"}}>Budget</a>
        <a href="/dashboard/goals" style={{display:"block",padding:"10px 12px",borderRadius:"10px",fontSize:"13px",color:"#999080",textDecoration:"none",marginBottom:"2px"}}>Goals</a>
        <a href="/dashboard/networth" style={{display:"block",padding:"10px 12px",borderRadius:"10px",fontSize:"13px",color:"#999080",textDecoration:"none",marginBottom:"2px"}}>Net Worth</a>
        <a href="/dashboard/retirement" style={{display:"block",padding:"10px 12px",borderRadius:"10px",fontSize:"13px",color:"#999080",textDecoration:"none",marginBottom:"2px"}}>Retirement</a>
        <a href="/dashboard/investments" style={{display:"block",padding:"10px 12px",borderRadius:"10px",fontSize:"13px",color:"#999080",textDecoration:"none",marginBottom:"2px"}}>Investments</a>
        <a href="/dashboard/debt" style={{display:"block",padding:"10px 12px",borderRadius:"10px",fontSize:"13px",color:"#999080",textDecoration:"none",marginBottom:"2px"}}>Debt</a>

        <div style={{fontFamily:"JetBrains Mono, monospace",fontSize:"10px",letterSpacing:"0.15em",color:"#7a7468",textTransform:"uppercase",margin:"24px 12px 8px"}}>Coming soon</div>
        <div style={{padding:"10px 12px",fontSize:"13px",color:"#7a7468",opacity:0.5}}>Habits</div>
        <div style={{padding:"10px 12px",fontSize:"13px",color:"#7a7468",opacity:0.5}}>Mind</div>
        <div style={{padding:"10px 12px",fontSize:"13px",color:"#7a7468",opacity:0.5}}>sikareads</div>

        <div style={{marginTop:"auto",paddingTop:"20px",borderTop:"1px solid #1e1e1e"}}>
          <a href="/signout" style={{display:"block",padding:"10px",background:"transparent",border:"1px solid #2a2a2a",color:"#7a7468",borderRadius:"10px",fontSize:"11px",letterSpacing:"0.1em",textTransform:"uppercase",textAlign:"center",textDecoration:"none"}}>
            Sign out
          </a>
        </div>
      </aside>

      <main style={{padding:"40px 48px"}}>
        <div style={{marginBottom:"40px",paddingBottom:"24px",borderBottom:"1px solid #1e1e1e"}}>
          <div style={{fontFamily:"JetBrains Mono, monospace",fontSize:"11px",color:"#d4a947",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:"8px"}}>
            {today} · Accra
          </div>
          <h1 style={{fontFamily:"Fraunces, serif",fontWeight:300,fontSize:"42px",letterSpacing:"-0.02em",color:"#f4ecd8",lineHeight:1.1}}>
            Akwaaba, <em style={{fontStyle:"italic",color:"#d4a947"}}>{name}</em>.
          </h1>
        </div>

        <div style={{padding:"32px",background:"rgba(212,169,71,0.06)",border:"1px solid #8a6f2e",borderRadius:"16px",marginBottom:"32px"}}>
          <div style={{fontFamily:"JetBrains Mono, monospace",fontSize:"10px",color:"#d4a947",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"12px"}}>
            Welcome to How Far?
          </div>
          <div style={{fontFamily:"Fraunces, serif",fontSize:"22px",fontWeight:300,color:"#f4ecd8",marginBottom:"12px",letterSpacing:"-0.01em"}}>
            Your journey starts here.
          </div>
          <p style={{fontSize:"14px",color:"#999080",lineHeight:1.6,marginBottom:"24px"}}>
            The finance pillar is ready. Start by adding your first transaction, setting a goal, or checking your retirement horizon.
          </p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"16px"}}>
          {[
            {label:"How Far? score", value:"—", sub:"Add data to calculate"},
            {label:"Retirement", value:"— years", sub:"Set your horizon"},
            {label:"Net worth", value:"GHS 0", sub:"Add your assets"},
          ].map((card) => (
            <div key={card.label} style={{background:"#141414",border:"1px solid #1e1e1e",borderRadius:"16px",padding:"24px"}}>
              <div style={{fontFamily:"JetBrains Mono, monospace",fontSize:"10px",color:"#7a7468",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"12px"}}>
                {card.label}
              </div>
              <div style={{fontFamily:"Fraunces, serif",fontSize:"36px",fontWeight:300,color:"#d4a947",letterSpacing:"-0.02em",marginBottom:"6px"}}>
                {card.value}
              </div>
              <div style={{fontSize:"12px",color:"#7a7468"}}>{card.sub}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}