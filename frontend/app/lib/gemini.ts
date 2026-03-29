export type Persona = "Student" | "Investor" | "Founder";
export type Language = "English" | "Telugu";

export type ArcEvent = {
  timeLabel: string;
  event: string;
  sentiment: "Bearish" | "Neutral" | "Bullish";
  sourceUrl?: string;
  detailedImpact?: string;
};

export type StitchPayload = {
  headline: string;
  briefing: string;
  keySignals: string[];
  timeline: ArcEvent[];
  sentimentShift: string;
};

function toSentiment(value: unknown): ArcEvent["sentiment"] {
  if (value === "Bullish" || value === "Bearish" || value === "Neutral") {
    return value;
  }
  return "Neutral";
}

export function getMockArticles(): string[] {
  return [
    "Government announces new 2026 Budget with focus on AI education and startup credit expansion.",
    "Markets respond positively to increased digital infrastructure and semiconductor incentives.",
    "Policy update simplifies startup compliance and changes capital-gains treatment for early investors.",
    "Analysts note mixed sentiment in mid-cap tech due to execution risk despite policy tailwinds.",
  ];
}

function personaGuidance(persona: Persona): string {
  if (persona === "Student") {
    return [
      "Persona = Student.",
      "Explainer-first output.",
      "Define jargon in simple terms.",
      "Explain why this matters for learning and future jobs.",
    ].join(" ");
  }

  if (persona === "Investor") {
    return [
      "Persona = Investor.",
      "Signal-heavy output.",
      "Call out directionality, risk, and confidence for each key signal.",
      "Prioritize actionable portfolio implications over narrative style.",
    ].join(" ");
  }

  return [
    "Persona = Founder.",
    "Focus on execution implications.",
    "Prioritize funding climate, regulation, go-to-market, and strategic actions.",
  ].join(" ");
}

function languageGuidance(language: Language): string {
  if (language === "Telugu") {
    return [
      "Output language must be Telugu.",
      "Cultural adaptation required: do not perform literal translation.",
      "Use local analogies familiar to Indian audiences where helpful.",
      "Tone should be clear, concise, and informative.",
    ].join(" ");
  }

  return "Output language must be English.";
}

export function buildStitchPrompt(persona: Persona, language: Language, articles: string[]): string {
  return [
    "You are ET News Navigator.",
    "Task: Synthesize all articles into one non-redundant intelligence briefing.",
    "Hard constraints:",
    "1) Remove duplication and repeated claims.",
    "2) Resolve conflicting claims by noting uncertainty.",
    "3) Produce an event timeline and net sentiment shift.",
    personaGuidance(persona),
    languageGuidance(language),
    "Return JSON only. No markdown.",
    "JSON schema:",
    '{"headline":"string","briefing":"string","keySignals":["string"],"timeline":[{"timeLabel":"string","event":"string","sentiment":"Bearish|Neutral|Bullish","sourceUrl":"string","detailedImpact":"string"}],"sentimentShift":"string"}',
    "Articles:",
    articles.map((article, index) => `Article ${index + 1}: ${article}`).join("\n"),
  ].join("\n");
}

export function normalizePayload(input: unknown): StitchPayload {
  const fallback: StitchPayload = {
    headline: "ET Pulse Briefing",
    briefing: "ET Pulse could not generate a complete stitched briefing right now.",
    keySignals: ["Signal extraction unavailable"],
    timeline: [
      {
        timeLabel: "Latest",
        event: "Timeline unavailable due to parsing error.",
        sentiment: "Neutral",
      },
    ],
    sentimentShift: "Sentiment could not be computed.",
  };

  if (!input || typeof input !== "object") {
    return fallback;
  }

  const obj = input as Record<string, unknown>;
  const timeline: ArcEvent[] = Array.isArray(obj.timeline)
    ? obj.timeline
        .filter((item) => item && typeof item === "object")
        .map((item): ArcEvent => {
          const eventObj = item as Record<string, unknown>;
          return {
            timeLabel: String(eventObj.timeLabel ?? "Update"),
            event: String(eventObj.event ?? "No event details"),
            sentiment: toSentiment(eventObj.sentiment),
            sourceUrl: eventObj.sourceUrl ? String(eventObj.sourceUrl) : undefined,
            detailedImpact: eventObj.detailedImpact ? String(eventObj.detailedImpact) : undefined,
          };
        })
    : fallback.timeline;

  return {
    headline: String(obj.headline ?? fallback.headline),
    briefing: String(obj.briefing ?? fallback.briefing),
    keySignals: Array.isArray(obj.keySignals)
      ? obj.keySignals.map((signal) => String(signal)).slice(0, 5)
      : fallback.keySignals,
    timeline: timeline.length > 0 ? timeline.slice(0, 6) : fallback.timeline,
    sentimentShift: String(obj.sentimentShift ?? fallback.sentimentShift),
  };
}