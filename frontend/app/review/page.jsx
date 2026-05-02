'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function PriorityBadge({ priority }) {
  const map = {
    HIGH: 'bg-red-500/10 text-red-400 border-red-500/20',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[priority] || map.MEDIUM}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {priority}
    </span>
  );
}

export default function ReviewPage() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState('');
  const [decisions, setDecisions] = useState([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [score, setScore] = useState(0);
  const [grade, setGrade] = useState('');
  const [scoreLabel, setScoreLabel] = useState('');
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem('meetingData');
    if (!raw) { router.push('/'); return; }
    const data = JSON.parse(raw);
    setSummary(data.summary);
    setDecisions(data.decisions || []);
    setEmailSubject(data.email_subject);
    setEmailBody(data.email_body);
    setItems(data.action_items.map(i => ({ ...i, approved: false, removed: false })));
    if (data.score) {
      setScore(data.score);
      setGrade(data.grade);
      setScoreLabel(data.score_label);
    }
  }, []);

  function toggle(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, approved: !i.approved, removed: false } : i));
  }
  function remove(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, removed: !i.removed, approved: false } : i));
  }
  function updateField(id, field, val) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i));
  }
  function approveAll() {
    setItems(prev => prev.map(i => i.removed ? i : { ...i, approved: true }));
  }

  function proceed() {
    const approved = items.filter(i => i.approved);
    if (!approved.length) { alert('Approve at least one action item.'); return; }

    const divider = '─'.repeat(44);

    const decisionsBlock = decisions.length
      ? decisions.map(d => `  • ${d}`).join('\n')
      : '  • (none recorded)';

    const itemLines = approved
      .map((item, idx) => `  ${idx + 1}. [${item.priority}] ${item.owner} → ${item.task}\n     Due: ${item.due}`)
      .join('\n');

    const newBody = [
      'Hi team,',
      '',
      'Please find the Minutes of Meeting (MOM) below.',
      '',
      `── MEETING SUMMARY ${divider.slice(18)}`,
      summary,
      '',
      `── KEY DECISIONS ${divider.slice(16)}`,
      decisionsBlock,
      '',
      `── ACTION ITEMS ${divider.slice(15)}`,
      itemLines,
      '',
      divider,
      'Please update your progress before the next check-in.',
      '',
      'Best regards',
    ].join('\n');

    sessionStorage.setItem('emailData', JSON.stringify({
      subject: emailSubject,
      body: newBody,
      approvedItems: approved,
    }));
    router.push('/email');
  }

  const active = items.filter(i => !i.removed);
  const approved = active.filter(i => i.approved);
  const highPrio = active.filter(i => i.priority === 'HIGH');
  const owners = [...new Set(active.map(i => i.owner))];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <div className="max-w-6xl mx-auto px-5 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/')} className="text-slate-400 hover:text-white text-sm transition-colors">← Back</button>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold tracking-tight font-[Syne]">Review & Approve</h1>
            <p className="text-sm text-slate-400">Check each action item before sending</p>
          </div>
          <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full">
            HUMAN IN THE LOOP
          </span>
        </div>

        {/* Steps */}
        <div className="flex bg-[#13131a] border border-[#2a2a3a] rounded-xl overflow-hidden mb-8">
          {['Paste Transcript', 'AI Analysis', 'Review & Approve', 'Send Email'].map((s, i) => (
            <div key={i} className={`flex-1 px-4 py-3 text-xs font-bold flex items-center gap-2 font-[Syne] tracking-wide
              ${i === 2 ? 'bg-indigo-500/10 text-indigo-400' : i < 2 ? 'text-emerald-400' : 'text-slate-500'}
              ${i < 3 ? 'border-r border-[#2a2a3a]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0
                ${i === 2 ? 'bg-indigo-500 text-white' : i < 2 ? 'bg-emerald-500 text-[#0a0a0f]' : 'bg-[#2a2a3a]'}`}>
                {i < 2 ? '✓' : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          {[
            { num: active.length, label: 'Total Items', color: 'text-indigo-400' },
            { num: highPrio.length, label: 'High Priority', color: 'text-red-400' },
            { num: approved.length, label: 'Approved', color: 'text-emerald-400' },
            { num: owners.length, label: 'People', color: 'text-cyan-400' },
          ].map((s, i) => (
            <div key={i} className="bg-[#13131a] border border-[#2a2a3a] rounded-xl p-4">
              <div className={`text-3xl font-extrabold font-[Syne] ${s.color}`}>{s.num}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Meeting Score Bar */}
        {score > 0 && (() => {
          const gradeColor =
            grade === 'A' ? { text: 'text-emerald-400', bar: 'bg-emerald-500', ring: 'border-emerald-500 bg-emerald-500/10' } :
            grade === 'B' ? { text: 'text-indigo-400',  bar: 'bg-indigo-500',  ring: 'border-indigo-500 bg-indigo-500/10' } :
            grade === 'C' ? { text: 'text-amber-400',   bar: 'bg-amber-500',   ring: 'border-amber-500 bg-amber-500/10' } :
                            { text: 'text-red-400',     bar: 'bg-red-500',     ring: 'border-red-500 bg-red-500/10' };
          return (
            <div className="bg-[#13131a] border border-[#2a2a3a] rounded-xl px-5 py-4 mb-6 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-extrabold text-sm font-[Syne] flex-shrink-0 ${gradeColor.ring} ${gradeColor.text}`}>
                {grade}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-[Syne]">Meeting Quality Score</span>
                  <span className={`text-sm font-extrabold font-[Syne] ${gradeColor.text}`}>{score}/100 · {scoreLabel}</span>
                </div>
                <div className="h-1.5 bg-[#2a2a3a] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${gradeColor.bar}`} style={{ width: `${score}%` }} />
                </div>
              </div>
            </div>
          );
        })()}

        {/* AI Summary */}
        <div className="bg-[#13131a] border border-[#2a2a3a] rounded-2xl p-6 mb-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-[Syne] mb-3">💡 AI Summary</p>
          <div className="bg-gradient-to-br from-indigo-500/8 to-cyan-500/5 border border-indigo-500/15 rounded-xl p-4 text-sm text-slate-300 leading-relaxed mb-4">
            {summary}
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-[Syne] mb-2">Key Decisions</p>
          <div className="space-y-1.5">
            {decisions.map((d, i) => (
              <div key={i} className="flex gap-2 text-sm text-slate-400">
                <span className="text-cyan-400 mt-0.5 flex-shrink-0">›</span>{d}
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-[#13131a] border border-[#2a2a3a] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-[Syne]">✅ Action Items</p>
            <button onClick={approveAll}
              className="text-xs bg-[#1c1c27] border border-[#2a2a3a] hover:border-indigo-500/40 text-slate-300 px-3 py-1.5 rounded-lg transition-colors font-semibold">
              ✓ Approve All
            </button>
          </div>

          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id}
                className={`border rounded-xl p-4 transition-all ${
                  item.removed ? 'border-dashed border-[#2a2a3a] opacity-40' :
                  item.approved ? 'border-emerald-500/30 bg-emerald-500/4' :
                  'border-[#2a2a3a] bg-[#1c1c27]'
                }`}>
                <div className="flex gap-3 items-start">
                  {/* Checkbox */}
                  <button onClick={() => toggle(item.id)}
                    className={`w-6 h-6 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                      item.approved ? 'bg-emerald-500 border-emerald-500' : 'border-[#3a3a4a] hover:border-indigo-400'
                    }`}>
                    {item.approved && (
                      <svg width="12" height="12" viewBox="0 0 12 12">
                        <path d="M2 6l3 3 5-5" stroke="#0a0a0f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-2 leading-snug">{item.task}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        👤 {item.owner}
                      </span>
                      <PriorityBadge priority={item.priority} />
                      {item.due !== 'Not specified' && (
                        <span className="text-xs text-slate-500">📅 {item.due}</span>
                      )}
                    </div>

                    {/* Edit row */}
                    <div className="flex gap-2 flex-wrap">
                      <input
                        defaultValue={item.owner}
                        onChange={e => updateField(item.id, 'owner', e.target.value)}
                        placeholder="Owner name"
                        className="bg-[#13131a] border border-[#2a2a3a] focus:border-indigo-500 rounded-lg text-xs text-[#e8e8f0] px-3 py-1.5 outline-none w-32 transition-colors"
                      />
                      <select
                        defaultValue={item.priority}
                        onChange={e => updateField(item.id, 'priority', e.target.value)}
                        className="bg-[#13131a] border border-[#2a2a3a] text-xs text-[#e8e8f0] rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                        <option>HIGH</option>
                        <option>MEDIUM</option>
                        <option>LOW</option>
                      </select>
                      <button onClick={() => remove(item.id)}
                        className="text-xs bg-red-500/8 hover:bg-red-500/15 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors font-semibold">
                        {item.removed ? 'Restore' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6 pt-5 border-t border-[#2a2a3a]">
            <button onClick={() => router.push('/')}
              className="flex-1 bg-[#1c1c27] border border-[#2a2a3a] hover:border-indigo-500/30 text-slate-300 font-bold text-sm py-3 rounded-xl transition-all font-[Syne]">
              ← Start Over
            </button>
            <button onClick={proceed}
              className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm py-3 rounded-xl transition-all font-[Syne]">
              Continue to Email →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
