# 🧠 MeetingMind — AI Meeting Summarizer with Human Approval

> AI does the heavy lifting. You make the final call. That's human-in-the-loop done right.

## What it does

1. **Paste** your meeting transcript
2. **AI analyzes** → extracts action items, owners, priorities, summary
3. **You review** → approve, edit, remove items (human in the loop)
4. **One click** → sends follow-up email to the team

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│  /          → Paste transcript, choose AI provider       │
│  /review    → Approve/edit action items (HUMAN STEP)     │
│  /email     → Edit & send follow-up email                │
└──────────────┬──────────────────────────────────────────┘
               │ POST /api/analyze
               ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js API Routes                          │
│  /api/analyze → calls Gemini or Mistral                 │
│  /api/send    → sends email via Resend or mailto         │
└──────────────┬──────────────────────────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
  Gemini API       Mistral API
  (Free tier)      (Free tier)

── OR use n8n instead of API routes ──────────────────────

  n8n Webhook → AI Node → Parse JSON → Respond
  n8n Webhook → Build Email → Send Email → Respond
```

## Quick Start (Next.js)

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Get free key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_key_here

# Get free key at: https://console.mistral.ai/
MISTRAL_API_KEY=your_key_here

# Optional email sending (free at resend.com)
RESEND_API_KEY=your_key_here
FROM_EMAIL=meetings@yourdomain.com
```

### 3. Run the app

```bash
npm run dev
# Open http://localhost:3000
```

---

## n8n Setup

### Import the workflow

1. Open your n8n instance
2. Go to **Workflows → Import from file**
3. Select `n8n/meetingmind-workflow.json`
4. Click **Import**

### Configure credentials in n8n

#### Gemini (Google AI)
1. Go to **Credentials → New**
2. Search for **Google Gemini (PaLm) API**
3. Paste your API key from [aistudio.google.com](https://aistudio.google.com/app/apikey)

#### Mistral
1. Go to **Credentials → New**
2. Search for **Mistral Cloud API**
3. Paste your API key from [console.mistral.ai](https://console.mistral.ai/)

#### Email (SMTP)
1. Go to **Credentials → New**
2. Search for **SMTP**
3. Use Gmail SMTP or any provider:
   - Gmail: `smtp.gmail.com`, port `587`, use App Password

### Webhook URLs (after activating workflow)

```
Analyze: https://your-n8n.com/webhook/meeting-analyze
Decision: https://your-n8n.com/webhook/meeting-decision
```

Update `frontend/app/api/analyze/route.js` to point to n8n instead of direct AI calls if you want to route through n8n.

---

## How to use n8n as the backend instead

Change the fetch URL in `app/page.jsx`:

```js
// Instead of '/api/analyze'
const res = await fetch('https://your-n8n.com/webhook/meeting-analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ transcript, provider: aiProvider }),
});
```

---

## Free API Keys

| Service | Free Tier | Link |
|---------|-----------|------|
| Gemini | 15 req/min, free forever | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| Mistral | Free tier available | [console.mistral.ai](https://console.mistral.ai/) |
| Resend (email) | 100 emails/day | [resend.com](https://resend.com) |

---

## LinkedIn Post Template

> I built an AI meeting summarizer in 4 hours.  
> Claude reads the transcript. I approve every action item.  
> One click → follow-up email sent.  
> That's human-in-the-loop done right. 🧠  
> #FrAIday #buildinpublic #AIworkflows

---

## Folder Structure

```
meetingmind/
├── frontend/
│   ├── app/
│   │   ├── page.jsx              ← Step 1: Paste transcript
│   │   ├── review/page.jsx       ← Step 3: Human approval
│   │   ├── email/page.jsx        ← Step 4: Send email
│   │   ├── api/
│   │   │   ├── analyze/route.js  ← Calls Gemini or Mistral
│   │   │   └── send/route.js     ← Sends email
│   │   ├── layout.jsx
│   │   └── globals.css
│   ├── .env.local.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── n8n/
    └── meetingmind-workflow.json ← Import this into n8n
```
