import { NextResponse } from 'next/server';

async function parseN8nResponse(res) {
  const text = await res.text();
  if (!text) {
    return { success: false, error: 'Empty response from n8n' };
  }

  try {
    return JSON.parse(text);
  } catch {
    return { success: false, error: `Invalid JSON from n8n: ${text}` };
  }
}

export async function POST(req) {
  try {
    const { transcript, provider } = await req.json();

    if (!transcript?.trim()) {
      return NextResponse.json({ success: false, error: 'Transcript is required' }, { status: 400 });
    }

    const n8nUrl = process.env.N8N_URL || 'http://localhost:5678';

    const res = await fetch(`${n8nUrl}/webhook/meeting-analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, provider }),
    });

    const data = await parseN8nResponse(res);
    if (!res.ok || !data.success) {
      const error = data.error || data.message || `n8n returned status ${res.status}`;
      return NextResponse.json({ success: false, error }, { status: res.ok ? 500 : res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error('Analyze error:', e);
    return NextResponse.json(
      { success: false, error: `Could not reach n8n: ${e.message}` },
      { status: 500 }
    );
  }
}
