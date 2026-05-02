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
    const { to, cc, subject, body, approved_items } = await req.json();

    if (!to || !subject) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const n8nUrl = process.env.N8N_URL || 'http://localhost:5678';

    const res = await fetch(`${n8nUrl}/webhook/meeting-send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, cc: cc || '', subject, body, approved_items }),
    });

    const data = await parseN8nResponse(res);
    if (!res.ok) {
      const error = data.error || data.message || `n8n returned status ${res.status}`;
      return NextResponse.json({ success: false, error }, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error('Send email error:', e);
    return NextResponse.json(
      { success: false, error: `Could not reach n8n: ${e.message}` },
      { status: 500 }
    );
  }
}
