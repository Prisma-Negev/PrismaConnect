/**
 * Prisma Negev CRM — AI Service
 *
 * Provides AI-powered features:
 * 1. Contact analysis (CRIS profile, research fit scoring)
 * 2. Bulk text import (Excel/TSV → contact objects)
 * 3. CRM chatbot (questions about your contacts)
 *
 * Supports Gemini (default) and Groq (fallback / fast JSON).
 * Configure keys in .env.local:
 *   VITE_GEMINI_API_KEY=...
 *   VITE_GROQ_API_KEY=...   (optional)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContactAnalysis {
  cris_score: number;          // 1-10: fit for Prisma Negev ecosystem
  summary: string;             // 2-3 sentence analysis (Hebrew)
  keywords: string[];          // 3-5 research/industry keywords
  recommended_action: string;  // Next step (Hebrew)
  collaboration_potential: 'high' | 'medium' | 'low';
}

export interface ParsedContact {
  first_name: string;
  last_name: string;
  title?: string;
  department?: string;
  email?: string;
  phone?: string;
  research_focus?: string;
  organization?: string;
  notes?: string;
}

// ─── Gemini helper ────────────────────────────────────────────────────────────

const getGeminiKey = (): string =>
  (localStorage.getItem('prisma_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '');

const GEMINI_URL = (model = 'gemini-2.0-flash') =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${getGeminiKey()}`;

async function callGemini(prompt: string, jsonMode = false): Promise<string | null> {
  const key = getGeminiKey();
  if (!key) {
    console.warn('[AI] No Gemini API key found. Set VITE_GEMINI_API_KEY or prisma_gemini_key in localStorage.');
    return null;
  }

  try {
    const body: Record<string, unknown> = {
      contents: [{ parts: [{ text: prompt }] }],
    };
    if (jsonMode) {
      body.generationConfig = { responseMimeType: 'application/json' };
    }

    const res = await fetch(GEMINI_URL(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[AI] Gemini error:', err);
      return null;
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (e) {
    console.error('[AI] Gemini fetch error:', e);
    return null;
  }
}

// ─── Groq helper (optional fast JSON) ────────────────────────────────────────

const getGroqKey = (): string =>
  (localStorage.getItem('prisma_groq_key') || import.meta.env.VITE_GROQ_API_KEY || '');

async function callGroq(prompt: string, jsonMode = false): Promise<string | null> {
  const key = getGroqKey();
  if (!key) return null;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2048,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      }),
    });

    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch (e) {
    console.error('[AI] Groq error:', e);
    return null;
  }
}

/** Tries Gemini first, falls back to Groq */
async function callAI(prompt: string, jsonMode = false): Promise<string | null> {
  const result = await callGemini(prompt, jsonMode);
  if (result) return result;
  return callGroq(prompt, jsonMode);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Analyzes a contact's profile for fit with the Prisma Negev ecosystem.
 * Returns a structured analysis with score, summary, keywords, and next action.
 */
export async function analyzeContact(contact: {
  first_name: string;
  last_name: string;
  title?: string;
  department?: string;
  research_focus?: string;
  background?: string;
  company_name?: string;
  cris_profile?: string;
  academic_title?: string;
  sector?: string;
}): Promise<ContactAnalysis | null> {
  const prompt = `אתה אנליסט של מרכז פריזמה נגב — גוף שמחבר בין האקדמיה לתעשייה בנגב.
  
נתח את איש הקשר הבא והחזר JSON בלבד:

שם: ${contact.first_name} ${contact.last_name}
תפקיד: ${contact.title || 'לא ידוע'}
מחלקה/פקולטה: ${contact.department || 'לא ידוע'}
מוסד: ${contact.company_name || 'לא ידוע'}
תחום מחקר: ${contact.research_focus || 'לא ידוע'}
רקע: ${contact.background || 'לא ידוע'}
פרופיל CRIS: ${contact.cris_profile || 'לא ידוע'}

החזר JSON עם המבנה הבא בלבד (ללא הסברים):
{
  "cris_score": <1-10>,
  "summary": "<2-3 משפטים בעברית על התאמה לפריזמה נגב>",
  "keywords": ["<מילת מפתח 1>", "<מילת מפתח 2>", "<מילת מפתח 3>"],
  "recommended_action": "<הפעולה הבאה המומלצת בעברית>",
  "collaboration_potential": "<high|medium|low>"
}`;

  const raw = await callAI(prompt, true);
  if (!raw) return null;

  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned) as ContactAnalysis;
  } catch {
    console.error('[AI] Failed to parse contact analysis:', raw);
    return null;
  }
}

/**
 * Parses bulk text (pasted from Excel / Word / email) into an array of contact objects.
 * Useful for batch importing from conference lists, academic directories, etc.
 */
export async function parseBulkContactsFromText(rawText: string): Promise<ParsedContact[]> {
  const prompt = `אתה עוזר ייבוא נתונים. קלט הטקסט הבא הוא רשימת אנשי קשר שהודבקה מאקסל, מייל, או מסמך.
חלץ את כל אנשי הקשר והחזר JSON array בלבד.

טקסט:
"""
${rawText.slice(0, 8000)}
"""

Format JSON:
[
  {
    "first_name": "",
    "last_name": "",
    "title": "",
    "department": "",
    "email": "",
    "phone": "",
    "research_focus": "",
    "organization": "",
    "notes": ""
  }
]

כללים:
- אם שם מלא הוא שדה אחד, פצל ל-first_name ו-last_name
- השאר שדות ריקים אם לא ניתן לזהותם
- החזר JSON תקין בלבד, ללא הסברים`;

  const raw = await callAI(prompt, true);
  if (!raw) return [];

  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleaned);
    return Array.isArray(result) ? result : [];
  } catch {
    console.error('[AI] Failed to parse bulk import:', raw);
    return [];
  }
}

/**
 * Answers questions about your CRM data using the provided context.
 * @param question - User's question in Hebrew or English
 * @param contextSummary - A summary of relevant CRM data (contacts, stats, etc.)
 */
export async function chatWithCRMData(
  question: string,
  contextSummary: string
): Promise<string | null> {
  const prompt = `אתה עוזר CRM חכם של מרכז פריזמה נגב.
  
נתוני המערכת (סיכום):
${contextSummary.slice(0, 6000)}

שאלת המשתמש: ${question}

ענה בעברית, בצורה תמציתית ומועילה. אם אין מספיק מידע, אמור זאת בכנות.`;

  return callAI(prompt, false);
}

/**
 * Checks if any AI provider is configured.
 */
export function hasAIProvider(): boolean {
  return !!(getGeminiKey() || getGroqKey());
}

/**
 * Returns the name of the active AI provider.
 */
export function getActiveProvider(): string {
  if (getGeminiKey()) return 'Gemini';
  if (getGroqKey()) return 'Groq';
  return 'לא מוגדר';
}
