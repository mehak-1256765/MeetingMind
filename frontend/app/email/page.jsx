"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FONTS = [
  { id: "modern",  label: "Modern",    stack: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" },
  { id: "classic", label: "Classic",   stack: "Georgia, 'Times New Roman', serif" },
  { id: "tech",    label: "Technical", stack: "'Courier New', Courier, monospace" },
];

function buildHtml(tplId, { summary, decisions, items, font }) {
  const fontStack = FONTS.find(f => f.id === font)?.stack || FONTS[0].stack;

  const priorityStyle = (p) =>
    p === "HIGH"   ? "background:#fee2e2;color:#dc2626;" :
    p === "MEDIUM" ? "background:#fef3c7;color:#d97706;" :
                     "background:#d1fae5;color:#059669;";

  if (tplId === "professional") {
    const decisionsHtml = decisions.length
      ? decisions.map(d => `<li style="margin:6px 0;color:#374151;font-size:14px;">${d}</li>`).join("")
      : `<li style="color:#9ca3af;font-size:14px;">No key decisions recorded</li>`;

    const itemsHtml = items.map((item, i) => `
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:10px 0;">
        <p style="font-weight:700;font-size:15px;margin:0 0 10px;color:#111827;">${i + 1}. ${item.task}</p>
        <span style="display:inline-block;padding:3px 10px;border-radius:9999px;font-size:11px;font-weight:700;${priorityStyle(item.priority)}">${item.priority}</span>
        &nbsp;
        <span style="font-size:13px;color:#6b7280;">Owner: <strong style="color:#374151;">${item.owner}</strong> &nbsp;·&nbsp; Due: <strong style="color:#374151;">${item.due}</strong></span>
      </div>`).join("");

    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:24px;background:#f3f4f6;font-family:${fontStack};">
<div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">
  <div style="background:linear-gradient(135deg,#4f46e5 0%,#0ea5e9 100%);padding:32px 36px;">
    <h1 style="margin:0;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">Meeting Follow-up</h1>
    <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.80);">Minutes of Meeting (MOM) &amp; Action Items</p>
  </div>
  <div style="padding:28px 36px;border-bottom:1px solid #f3f4f6;">
    <p style="font-size:14px;color:#374151;margin:0 0 6px;">Hi team,</p>
    <p style="font-size:14px;color:#374151;margin:0 0 0;">Thank you for joining today's meeting. Please find the summary, key decisions, and action items from our discussion below.</p>
  </div>
  <div style="padding:28px 36px;border-bottom:1px solid #f3f4f6;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;margin:0 0 14px;">Meeting Summary</p>
    <p style="font-size:14px;line-height:1.75;color:#374151;margin:0;">${summary || "No summary available."}</p>
  </div>
  <div style="padding:28px 36px;border-bottom:1px solid #f3f4f6;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;margin:0 0 14px;">Key Decisions</p>
    <ul style="margin:0;padding-left:20px;">${decisionsHtml}</ul>
  </div>
  <div style="padding:28px 36px;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;margin:0 0 14px;">Action Items</p>
    ${itemsHtml}
  </div>
  <div style="padding:20px 36px;background:#f9fafb;border-top:1px solid #f3f4f6;text-align:center;">
    <p style="font-size:13px;color:#6b7280;margin:0;">Kindly ensure all action items are completed by the stipulated deadlines.</p>
    <p style="font-size:11px;color:#9ca3af;margin:6px 0 0;">Sent via MeetingMind</p>
  </div>
</div>
</body></html>`;
  }

  if (tplId === "minimal") {
    const decisionsHtml = decisions.length
      ? decisions.map(d => `<li style="margin:4px 0;color:#374151;">${d}</li>`).join("")
      : `<li style="color:#9ca3af;">None recorded</li>`;
    const itemsHtml = items.map((item, i) =>
      `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;font-weight:600;">${i + 1}. ${item.task}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;font-size:12px;color:#6b7280;white-space:nowrap;">${item.owner}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;"><span style="padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700;${priorityStyle(item.priority)}">${item.priority}</span></td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#6b7280;">${item.due}</td>
      </tr>`).join("");

    return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#ffffff;font-family:${fontStack};">
<div style="max-width:620px;margin:0 auto;">
  <h2 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 4px;">Meeting Follow-up</h2>
  <p style="font-size:13px;color:#6b7280;margin:0 0 20px;border-bottom:2px solid #111827;padding-bottom:16px;">Action items and key decisions</p>
  <p style="font-size:14px;color:#374151;margin:0 0 4px;">Hi team,</p>
  <p style="font-size:14px;line-height:1.7;color:#374151;margin:0 0 20px;">Thank you for joining today's meeting. Please find the summary, key decisions, and action items from our discussion below.</p>
  <p style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;margin:0 0 6px;">Meeting Summary</p>
  <p style="font-size:14px;line-height:1.7;color:#374151;margin:0 0 24px;">${summary || "No summary available."}</p>
  <h3 style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;margin:0 0 10px;">Key Decisions</h3>
  <ul style="margin:0 0 24px;padding-left:18px;">${decisionsHtml}</ul>
  <h3 style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;margin:0 0 12px;">Action Items</h3>
  <table style="width:100%;border-collapse:collapse;">
    <thead>
      <tr>
        <th style="text-align:left;font-size:11px;color:#9ca3af;padding:0 0 8px;font-weight:600;">Task</th>
        <th style="text-align:left;font-size:11px;color:#9ca3af;padding:0 8px 8px;font-weight:600;">Owner</th>
        <th style="text-align:left;font-size:11px;color:#9ca3af;padding:0 8px 8px;font-weight:600;">Priority</th>
        <th style="text-align:left;font-size:11px;color:#9ca3af;padding:0 0 8px;font-weight:600;">Due</th>
      </tr>
    </thead>
    <tbody>${itemsHtml}</tbody>
  </table>
  <p style="font-size:13px;color:#6b7280;margin:28px 0 0;padding-top:20px;border-top:1px solid #e5e7eb;">Please update your status before our next check-in. — MeetingMind</p>
</div>
</body></html>`;
  }

  if (tplId === "gmail") {
    const dateStr = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    const decisionsHtml = decisions.length
      ? decisions.map(d => `<li style="margin:5px 0;font-size:14px;color:#000000;">${d}</li>`).join("")
      : `<li style="font-size:14px;color:#000000;">None recorded</li>`;

    const itemsHtml = items.map((item, i) =>
      `<li style="margin-bottom:14px;font-size:14px;color:#000000;">
        <strong>${item.task}</strong><br>
        <span style="font-size:13px;color:#000000;">Owner: <strong>${item.owner}</strong>&emsp;Due: <strong>${item.due}</strong>&emsp;Priority: <strong>${item.priority}</strong></span>
      </li>`).join("");

    return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px 20px;background:#ffffff;font-family:${fontStack};font-size:14px;color:#000000;line-height:1.7;">
<div style="max-width:620px;margin:0 auto;color:#000000;">

  <p style="margin:0 0 4px;font-size:13px;color:#000000;">${dateStr}</p>
  <hr style="border:none;border-top:2px solid #000000;margin:0 0 24px;">

  <p style="margin:0 0 6px;color:#000000;">Hi team,</p>
  <p style="margin:0 0 24px;color:#000000;">Please find the Minutes of Meeting (MOM) and confirmed action items from our recent discussion below.</p>

  <p style="margin:0 0 4px;font-size:15px;color:#000000;"><strong>Meeting Summary</strong></p>
  <hr style="border:none;border-top:1px solid #000000;margin:0 0 12px;">
  <p style="margin:0 0 24px;color:#000000;">${summary || "No summary available."}</p>

  <p style="margin:0 0 4px;font-size:15px;color:#000000;"><strong>Key Decisions</strong></p>
  <hr style="border:none;border-top:1px solid #000000;margin:0 0 12px;">
  <ul style="margin:0 0 24px;padding-left:22px;">${decisionsHtml}</ul>

  <p style="margin:0 0 4px;font-size:15px;color:#000000;"><strong>Action Items</strong></p>
  <hr style="border:none;border-top:1px solid #000000;margin:0 0 12px;">
  <ol style="margin:0 0 28px;padding-left:22px;">${itemsHtml}</ol>

  <p style="margin:0 0 20px;color:#000000;">Please ensure all action items are completed by the stipulated deadlines. Do reach out if you have any questions or need support.</p>
  <p style="margin:0 0 4px;color:#000000;">Best regards</p>

  <hr style="border:none;border-top:1px solid #e0e0e0;margin:20px 0 12px;">
  <p style="margin:0;font-size:12px;color:#000000;">Sent via MeetingMind &nbsp;&middot;&nbsp; Automated meeting follow-up</p>
</div>
</body></html>`;
  }

  // plain (striped table)
  const itemsHtml = items.map((item, i) =>
    `<tr>
      <td style="padding:8px 12px;background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"};font-size:14px;color:#000000;">${i + 1}. ${item.task}</td>
      <td style="padding:8px 12px;background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"};font-size:13px;color:#000000;">${item.owner}</td>
      <td style="padding:8px 12px;background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"};"><span style="padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;${priorityStyle(item.priority)}">${item.priority}</span></td>
      <td style="padding:8px 12px;background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"};font-size:13px;color:#000000;">${item.due}</td>
    </tr>`).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#ffffff;font-family:${fontStack};color:#000000;">
<div style="max-width:620px;margin:0 auto;color:#000000;">
  <h2 style="font-size:18px;font-weight:700;color:#000000;margin:0 0 20px;">Meeting Follow-up — Action Items</h2>
  <p style="font-size:14px;color:#000000;margin:0 0 6px;">Hi team,</p>
  <p style="font-size:14px;color:#000000;margin:0 0 24px;">Thank you for joining today's meeting. Please find the confirmed action items from our discussion below. Kindly ensure these are completed by the stipulated deadlines.</p>
  <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
    <thead>
      <tr style="background:#f3f4f6;">
        <th style="text-align:left;padding:10px 12px;font-size:12px;color:#000000;font-weight:700;">Task</th>
        <th style="text-align:left;padding:10px 12px;font-size:12px;color:#000000;font-weight:700;">Owner</th>
        <th style="text-align:left;padding:10px 12px;font-size:12px;color:#000000;font-weight:700;">Priority</th>
        <th style="text-align:left;padding:10px 12px;font-size:12px;color:#000000;font-weight:700;">Due</th>
      </tr>
    </thead>
    <tbody>${itemsHtml}</tbody>
  </table>
  <p style="font-size:13px;color:#000000;margin:20px 0 0;">Please update your progress before the next check-in.<br>Sent via MeetingMind</p>
</div>
</body></html>`;
}

const TEMPLATE_META = [
  { id: "professional", label: "Professional", icon: "💼", desc: "Branded header · Sections · Priority badges" },
  { id: "minimal",     label: "Minimal",      icon: "✦",  desc: "Clean table layout · No clutter" },
  { id: "plain",       label: "Plain",        icon: "📄", desc: "Simple table · Works everywhere" },
  { id: "gmail",       label: "Gmail Style",  icon: "✉️",  desc: "Bold headings · No colors · Just text" },
];

export default function EmailPage() {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [approvedItems, setApprovedItems] = useState([]);
  const [meetingMeta, setMeetingMeta] = useState({ summary: "", decisions: [] });
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [selectedFont, setSelectedFont] = useState("modern");
  const [activeTab, setActiveTab] = useState("preview");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("emailData");
    if (!raw) { router.push("/"); return; }
    const data = JSON.parse(raw);
    setSubject(data.subject || "Meeting Follow-up");
    setApprovedItems(data.approvedItems || []);

    const rawMeeting = sessionStorage.getItem("meetingData");
    let summary = "", decisions = [];
    if (rawMeeting) {
      const m = JSON.parse(rawMeeting);
      summary = m.summary || "";
      decisions = m.decisions || [];
    }
    setMeetingMeta({ summary, decisions });
    setBody(buildHtml("professional", { summary, decisions, items: data.approvedItems || [], font: "modern" }));
  }, []);

  function rebuild(tplId, fontId) {
    setBody(buildHtml(tplId, {
      summary: meetingMeta.summary,
      decisions: meetingMeta.decisions,
      items: approvedItems,
      font: fontId,
    }));
  }

  function applyTemplate(tplId) {
    setSelectedTemplate(tplId);
    rebuild(tplId, selectedFont);
  }

  function applyFont(fontId) {
    setSelectedFont(fontId);
    rebuild(selectedTemplate, fontId);
  }

  async function send() {
    if (!to.trim()) { setError("Please enter at least one recipient email."); return; }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, cc, subject, body, approved_items: approvedItems }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error(`Invalid server response: ${text}`); }
      if (!res.ok || !data.success) throw new Error(data.error || `Server error: ${res.status}`);
      setSent(true);
      setTimeout(() => setMounted(true), 50);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  function copyEmail() {
    const plain = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    navigator.clipboard.writeText(`To: ${to}${cc ? `\nCC: ${cc}` : ""}\nSubject: ${subject}\n\n${plain}`);
  }

  if (sent) return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      <div
        className="relative text-center max-w-md px-5 transition-all duration-700"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "scale(1) translateY(0)" : "scale(0.8) translateY(20px)" }}
      >
        <div className="text-8xl mb-6 animate-bounce">🎉</div>

        <div className="bg-[#13131a] border border-[#2a2a3a] rounded-3xl p-10 mb-6">
          <h2 className="text-3xl font-extrabold font-[Syne] mb-3"
            style={{ background: "linear-gradient(135deg, #818cf8, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Email Sent!
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-2">
            Your follow-up email has been delivered via Gmail.
          </p>
          <p className="text-slate-500 text-xs">
            The human-in-the-loop workflow is complete. ✓
          </p>

          {/* Pulse ring */}
          <div className="flex items-center justify-center mt-6">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <div className="relative w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => { sessionStorage.clear(); router.push("/"); }}
          className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-10 py-3.5 rounded-xl transition-all font-[Syne] shadow-lg shadow-indigo-500/30">
          Start New Meeting
        </button>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <div className="max-w-6xl mx-auto px-5 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push("/review")} className="text-slate-400 hover:text-white text-sm transition-colors">← Back</button>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold tracking-tight font-[Syne]">Send Follow-up Email</h1>
            <p className="text-sm text-slate-400">Choose template &amp; font, preview, then send</p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex bg-[#13131a] border border-[#2a2a3a] rounded-xl overflow-hidden mb-8">
          {["Paste Transcript", "AI Analysis", "Review & Approve", "Send Email"].map((s, i) => (
            <div key={i} className={`flex-1 px-4 py-3 text-xs font-bold flex items-center gap-2 font-[Syne] tracking-wide
              ${i === 3 ? "bg-indigo-500/10 text-indigo-400" : "text-emerald-400"}
              ${i < 3 ? "border-r border-[#2a2a3a]" : ""}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0
                ${i === 3 ? "bg-indigo-500 text-white" : "bg-emerald-500 text-[#0a0a0f]"}`}>
                {i < 3 ? "✓" : 4}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </div>
          ))}
        </div>

        {/* Template selector */}
        <div className="mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-[Syne] mb-3">📐 Template</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TEMPLATE_META.map(tpl => (
              <button key={tpl.id} onClick={() => applyTemplate(tpl.id)}
                className={`flex flex-col items-start gap-1.5 p-4 rounded-xl border text-left transition-all ${
                  selectedTemplate === tpl.id
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-[#2a2a3a] bg-[#13131a] hover:border-indigo-500/40"
                }`}>
                <span className="text-xl">{tpl.icon}</span>
                <span className={`text-sm font-bold font-[Syne] ${selectedTemplate === tpl.id ? "text-indigo-300" : "text-slate-200"}`}>{tpl.label}</span>
                <span className="text-xs text-slate-500">{tpl.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font selector */}
        <div className="mb-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-[Syne] mb-3">🔤 Font</p>
          <div className="flex gap-2">
            {FONTS.map(f => (
              <button key={f.id} onClick={() => applyFont(f.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  selectedFont === f.id
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                    : "border-[#2a2a3a] bg-[#13131a] text-slate-400 hover:border-indigo-500/40"
                }`}
                style={{ fontFamily: f.stack }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Email compose panel */}
        <div className="bg-[#13131a] border border-[#2a2a3a] rounded-2xl overflow-hidden">
          {/* Header fields */}
          <div className="border-b border-[#2a2a3a] divide-y divide-[#2a2a3a]">
            <div className="flex items-start px-5 py-3 gap-3">
              <span className="text-xs text-slate-500 font-semibold w-16 flex-shrink-0 pt-0.5">To</span>
              <div className="flex-1">
                <input value={to} onChange={e => setTo(e.target.value)}
                  placeholder="alice@company.com, bob@company.com"
                  className="w-full bg-transparent text-sm text-[#e8e8f0] outline-none placeholder-slate-600" />
                <p className="text-xs text-slate-600 mt-0.5">Comma-separated for multiple</p>
              </div>
            </div>
            <div className="flex items-start px-5 py-3 gap-3">
              <span className="text-xs text-slate-500 font-semibold w-16 flex-shrink-0 pt-0.5">CC</span>
              <div className="flex-1">
                <input value={cc} onChange={e => setCc(e.target.value)}
                  placeholder="carol@company.com, dave@company.com"
                  className="w-full bg-transparent text-sm text-[#e8e8f0] outline-none placeholder-slate-600" />
                <p className="text-xs text-slate-600 mt-0.5">Comma-separated for multiple</p>
              </div>
            </div>
            <div className="flex items-center px-5 py-3 gap-3">
              <span className="text-xs text-slate-500 font-semibold w-16 flex-shrink-0">Subject</span>
              <input value={subject} onChange={e => setSubject(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#e8e8f0] outline-none" />
            </div>
          </div>

          {/* Preview / Source tabs */}
          <div className="flex border-b border-[#2a2a3a]">
            {["preview", "source"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest font-[Syne] transition-colors ${
                  activeTab === tab
                    ? "bg-indigo-500/10 text-indigo-400 border-b-2 border-indigo-500"
                    : "text-slate-500 hover:text-slate-300"
                }`}>
                {tab === "preview" ? "👁 Preview" : "✏️ Edit HTML"}
              </button>
            ))}
          </div>

          {activeTab === "preview" ? (
            <div className="bg-white rounded-none overflow-auto" style={{ minHeight: 420 }}>
              <div dangerouslySetInnerHTML={{ __html: body }} />
            </div>
          ) : (
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full bg-[#0d0d14] text-xs text-slate-400 leading-relaxed p-5 outline-none resize-none font-mono"
              style={{ minHeight: 420 }}
            />
          )}

          {/* Actions */}
          <div className="border-t border-[#2a2a3a] p-5">
            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3">
                ⚠️ {error}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={copyEmail}
                className="bg-[#1c1c27] border border-[#2a2a3a] hover:border-indigo-500/30 text-slate-300 font-bold text-sm px-5 py-3 rounded-xl transition-all font-[Syne]">
                📋 Copy
              </button>
              <button onClick={send} disabled={sending}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#0a0a0f] font-bold text-sm py-3 rounded-xl transition-all font-[Syne]">
                {sending
                  ? <><span className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />Sending...</>
                  : "📤 Send to Team"}
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-3 text-center">
              Sent as HTML email via your n8n Gmail workflow
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
