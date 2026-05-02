'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SAMPLE = `[10:02 AM] Alex (PM): Good morning everyone. Let's kick off. We have 45 minutes.

[10:03 AM] Priya (Engineering Lead): Quick update — the backend API is 90% done. We need frontend integration by end of next week.

[10:05 AM] Jordan (Frontend Dev): I can handle that. I'll need the API docs updated first. Can Priya send those today?

[10:06 AM] Priya: Yes, I'll send updated docs by 3 PM today.

[10:08 AM] Alex: Great. What about the QA testing plan?

[10:09 AM] Sam (QA Lead): I'll create a full test plan document by Wednesday. We'll need at least 3 days for testing before launch.

[10:12 AM] Alex: That works. Launch is still Nov 1st. Sam, please coordinate with Jordan on testing environments.

[10:13 AM] Sam: Will do. Also — we have a critical bug in the payment flow from last sprint. Someone needs to fix that before we go live.

[10:15 AM] Jordan: I'll take that bug. Should be fixed by tomorrow EOD.

[10:17 AM] Priya: We also need to update the privacy policy before launch. Legal said it's mandatory.

[10:18 AM] Alex: Right. I'll handle that with Legal team. I'll have it done by Monday.

[10:20 AM] Alex: Let's wrap up. Next check-in Thursday same time.`;

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiProvider, setAiProvider] = useState('gemini');
  const router = useRouter();

  async function analyze() {
    if (!transcript.trim()) { setError('Please paste a transcript first.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, provider: aiProvider }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      sessionStorage.setItem('meetingData', JSON.stringify(data.data));
      router.push('/review');
    } catch (e) {
      setError(e.message || 'Analysis failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0] font-sans">
      <div className="max-w-6xl mx-auto px-5 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🧠</div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight font-[Syne]">MeetingMind</h1>
            <p className="text-sm text-slate-400 mt-0.5">AI analysis · Human approval · One-click email</p>
          </div>
          <span className="ml-auto bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full tracking-wide">
            HUMAN IN THE LOOP
          </span>
        </div>

        {/* Steps */}
        <div className="flex bg-[#13131a] border border-[#2a2a3a] rounded-xl overflow-hidden mb-8">
          {['Paste Transcript', 'AI Analysis', 'Review & Approve', 'Send Email'].map((s, i) => (
            <div key={i} className={`flex-1 px-4 py-3 text-xs font-bold flex items-center gap-2 font-[Syne] tracking-wide
              ${i === 0 ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500'}
              ${i < 3 ? 'border-r border-[#2a2a3a]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0
                ${i === 0 ? 'bg-indigo-500 text-white' : 'bg-[#2a2a3a]'}`}>{i + 1}</span>
              <span className="hidden sm:inline">{s}</span>
            </div>
          ))}
        </div>

        {/* Input Panel */}
        <div className="bg-[#13131a] border border-[#2a2a3a] rounded-2xl p-7">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-[Syne]">📋 Meeting Transcript</p>
            <button onClick={() => setTranscript(SAMPLE)}
              className="text-xs text-indigo-400 underline hover:text-indigo-300 transition-colors">
              Load sample →
            </button>
          </div>

          <textarea
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here..."
            className="w-full bg-[#1c1c27] border border-[#2a2a3a] rounded-xl text-sm text-[#e8e8f0] p-4 min-h-[220px] resize-y leading-relaxed outline-none focus:border-indigo-500 transition-colors placeholder-slate-600"
          />

          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <span className="text-xs text-slate-500">{transcript.length} characters</span>
            <div className="ml-auto flex items-center gap-3">
              <label className="text-xs text-slate-400 font-semibold">AI Provider:</label>
              <select
                value={aiProvider}
                onChange={e => setAiProvider(e.target.value)}
                className="bg-[#1c1c27] border border-[#2a2a3a] text-sm text-[#e8e8f0] rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                <option value="gemini">Gemini (Free)</option>
                <option value="mistral">Mistral (Free)</option>
              </select>
              <button
                onClick={analyze}
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all font-[Syne]">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</>
                ) : (
                  <><span>✨</span> Analyze Meeting</>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { icon: '🤖', title: 'AI Extracts', desc: 'Action items, owners, priorities' },
            { icon: '👤', title: 'You Approve', desc: 'Edit, reassign or remove items' },
            { icon: '📧', title: 'Auto Email', desc: 'One-click follow-up to team' },
          ].map((c, i) => (
            <div key={i} className="bg-[#13131a] border border-[#2a2a3a] rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="text-xs font-bold text-slate-300 font-[Syne] mb-1">{c.title}</div>
              <div className="text-xs text-slate-500">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
