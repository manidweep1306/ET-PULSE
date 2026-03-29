import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  buildStitchPrompt,
  getMockArticles,
  normalizePayload,
  type Language,
  type Persona,
} from "@/app/lib/gemini";
import { NextResponse } from "next/server";

type StitchRequest = {
  persona?: string;
  language?: string;
};

function getDemoPayload(persona: Persona, language: Language) {
  const english = {
    Student: {
      headline: "Budget 2026: What It Means For Your Career",
      briefing:
        "Budget 2026 increases AI education funding, boosts digital infrastructure, and simplifies startup norms. For students, this means better access to AI courses, more internship demand in tech, and stronger hiring in product and data roles. Risk remains execution speed across states, so outcomes may vary by region.",
      keySignals: [
        "AI education capex trending up",
        "Tech hiring demand likely positive",
        "Execution risk remains medium",
      ],
      timeline: [
        { timeLabel: "09:00", event: "Budget announcement highlights AI skilling", sentiment: "Bullish", sourceUrl: "https://economictimes.indiatimes.com/tech/budget-2026/ai-skilling", detailedImpact: "Massive capex expected in educational tech platforms." },
        { timeLabel: "11:30", event: "Markets re-rate education-tech plays", sentiment: "Bullish", sourceUrl: "https://economictimes.indiatimes.com/markets/stocks/ed-tech", detailedImpact: "EdTech stocks see a 5% surge in morning trade." },
        { timeLabel: "14:00", event: "Analysts flag implementation bottlenecks", sentiment: "Neutral", sourceUrl: "https://economictimes.indiatimes.com/opinion/budget-analysis", detailedImpact: "Experts question the rollout speed limit in tier 3 cities." },
      ],
      sentimentShift: "Net sentiment: Positive with medium execution risk.",
    },
    Investor: {
      headline: "Policy Tailwind With Selective Execution Risk",
      briefing:
        "The stitched signal is constructive: AI/infra spending and compliance simplification support medium-term earnings for quality tech and platform names. Near term, valuation dispersion may widen as execution clarity differs by sector. Watch budget allocation follow-through, capex conversion, and margin resilience before increasing exposure.",
      keySignals: [
        "Policy direction: Risk-on for digital themes",
        "Follow-through risk: Medium",
        "Portfolio bias: Quality over speculative beta",
      ],
      timeline: [
        { timeLabel: "09:00", event: "Pro-growth policy package announced", sentiment: "Bullish", sourceUrl: "https://economictimes.indiatimes.com/news/economy/policy", detailedImpact: "Broad market rally initiated." },
        { timeLabel: "12:00", event: "Sector rotation into core tech leaders", sentiment: "Bullish", sourceUrl: "https://economictimes.indiatimes.com/markets/sector-rotation", detailedImpact: "Large cap IT sees significant accumulation." },
        { timeLabel: "15:15", event: "Mid-cap caution on execution visibility", sentiment: "Neutral", sourceUrl: "https://economictimes.indiatimes.com/markets/midcaps", detailedImpact: "Midcaps trade sideways pending clarity." },
      ],
      sentimentShift: "Sentiment shifted from cautious to constructive.",
    },
    Founder: {
      headline: "Founder View: Window Open, Discipline Required",
      briefing:
        "Funding and policy signals have improved, especially for AI-native products and infrastructure-led startups. Compliance simplification can reduce early legal overhead, but founders still need strong unit economics and clear distribution moats. Best move: accelerate pilot-to-revenue conversion while policy momentum is favorable.",
      keySignals: [
        "Funding climate: Improving",
        "Regulatory friction: Lower than last cycle",
        "Priority action: Faster GTM validation",
      ],
      timeline: [
        { timeLabel: "10:00", event: "Startup compliance reforms confirmed", sentiment: "Bullish", sourceUrl: "https://economictimes.indiatimes.com/small-biz/startups/reforms", detailedImpact: "Reduced incorporation and compliance costs." },
        { timeLabel: "13:00", event: "Early-stage investors reopen selective pipelines", sentiment: "Bullish", sourceUrl: "https://economictimes.indiatimes.com/small-biz/startups/funding", detailedImpact: "Angels and Seed funds increasing deployment." },
        { timeLabel: "16:00", event: "Founders focus on monetization discipline", sentiment: "Neutral", sourceUrl: "https://economictimes.indiatimes.com/small-biz/startups/profitability", detailedImpact: "Profitability remains key for Series A+." },
      ],
      sentimentShift: "From wait-and-watch to selective expansion.",
    },
  } as const;

  const telugu = {
    Student: {
      ...english.Student,
      headline: "బడ్జెట్ 2026: మీ కెరీర్‌పై ప్రభావం",
      briefing:
        "బడ్జెట్ 2026లో AI విద్యకు ఎక్కువ నిధులు, డిజిటల్ మౌలిక వసతులకు ప్రాధాన్యం, స్టార్టప్ నిబంధనల సులభీకరణ కనిపిస్తోంది. ఇది విద్యార్థులకు కొత్త కోర్సులు, ఇంటర్న్‌షిప్ అవకాశాలు, టెక్ ఉద్యోగాల డిమాండ్ పెరగడాన్ని సూచిస్తుంది. ఊరి రోడ్డు వేసినా పూర్తి కావడానికి టైమ్ పడినట్టే, అమలు వేగం ప్రాంతానుసారం మారొచ్చు.",
      sentimentShift: "మొత్తం భావోద్వేగం: పాజిటివ్, కానీ అమలు రిస్క్ మోస్తరు.",
    },
    Investor: {
      ...english.Investor,
      headline: "ఇన్వెస్టర్ పల్స్: పాలసీ బూస్ట్, ఎంపికలో జాగ్రత్త",
      briefing:
        "మొత్తం సంకేతాలు డిజిటల్ థీమ్స్‌కు అనుకూలంగా ఉన్నాయి: AI/ఇన్ఫ్రా ఖర్చులు, సరళమైన నిబంధనలు మధ్యకాలంలో మంచి కంపెనీలకు మద్దతు ఇవ్వొచ్చు. అయితే అన్ని స్టాక్స్ ఒకేలా పరిగెత్తవు; అమలు స్పష్టత ఉన్నవే నిలబడతాయి. పంటకు నీరు ఉన్నా గడ్డి కూడా పెరుగుతుందన్నట్టు, క్వాలిటీ ఎంపిక కీలకం.",
      sentimentShift: "భావోద్వేగం జాగ్రత్త స్థితి నుంచి నిర్మాణాత్మక పాజిటివ్‌కి మారింది.",
    },
    Founder: {
      ...english.Founder,
      headline: "ఫౌండర్ దృష్టి: అవకాశం ఉంది, క్రమశిక్షణ ముఖ్యం",
      briefing:
        "ఫండింగ్ వాతావరణం మెరుగైందనే సంకేతాలు ఉన్నాయి, ముఖ్యంగా AI ఆధారిత ఉత్పత్తులకు. నిబంధనల సులభీకరణ ప్రారంభ అడ్డంకులను తగ్గించొచ్చు. అయినా రెవెన్యూ స్పష్టత, యూనిట్ ఎకనామిక్స్, డిస్ట్రిబ్యూషన్ బలం లేకపోతే వేగం నిలవదు. కాబట్టి పైలట్ నుంచి చెల్లించే కస్టమర్‌కి మార్పు వేగవంతం చేయడం ఉత్తమ చర్య.",
      sentimentShift: "వేచి చూడటం నుంచి ఎంపిక చేసిన విస్తరణ వైపు మార్పు.",
    },
  } as const;

  return language === "Telugu" ? telugu[persona] : english[persona];
}

function extractJsonBlock(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in model response");
  }
  return text.slice(start, end + 1);
}

export async function POST(request: Request) {
  let persona: string = "Investor";
  let language: Language = "English";

  try {
    const body = (await request.json()) as StitchRequest;
    persona =
      body.persona === "Student" || body.persona === "Investor" || body.persona === "Founder"
        ? body.persona
        : "Investor";

    language = body.language === "Telugu" ? "Telugu" : "English";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const demoPayload = getDemoPayload(persona as Persona, language);
      return NextResponse.json(demoPayload, {
        status: 200,
        headers: { "x-et-mode": "demo-no-key" },
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const articles = getMockArticles();
    const prompt = buildStitchPrompt(persona as Persona, language, articles);
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    let parsed: unknown;
    try {
      parsed = JSON.parse(extractJsonBlock(rawText));
    } catch {
      parsed = {
        briefing: rawText,
        timeline: [],
      };
    }

    const payload = normalizePayload(parsed);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to demo mode if API is rate limited or fails
    const demoPayload = getDemoPayload(persona as Persona, language);
    return NextResponse.json(demoPayload, {
      status: 200,
      headers: { "x-et-mode": "demo-rate-limit" },
    });
  }
}
