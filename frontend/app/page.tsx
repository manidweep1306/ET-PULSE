"use client"; // Must be the very first line

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ArcEvent = {
  timeLabel: string;
  event: string;
  sentiment: "Bearish" | "Neutral" | "Bullish";
};

type StitchResponse = {
  headline: string;
  briefing: string;
  keySignals: string[];
  timeline: ArcEvent[];
  sentimentShift: string;
};

const PERSONAS = ["Student", "Investor", "Founder"] as const;

export default function Home() {
  // 1. State Management
  const [persona, setPersona] = useState<"Student" | "Investor" | "Founder">("Investor");
  const [content, setContent] = useState("Initializing ET Pulse Intelligence...");
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isTelugu, setIsTelugu] = useState(false);
  const [timeline, setTimeline] = useState<ArcEvent[]>([]);
  const [sentimentShift, setSentimentShift] = useState("Analyzing sentiment trajectory...");
  const [engineMode, setEngineMode] = useState<"live" | "demo">("live");
  const requestIdRef = useRef(0);

  // 2. The Logic (The "Brain")
  useEffect(() => {
    let active = true;
    const requestId = ++requestIdRef.current;

    async function updateNews() {
      setLoading(true);
      try {
        const language = isTelugu ? "Telugu" : "English";
        const response = await fetch("/api/stitch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ persona, language }),
        });

        if (!response.ok) {
          throw new Error("ET Pulse engine request failed");
        }

        const payload = (await response.json()) as StitchResponse;
        if (active && requestId === requestIdRef.current) {
          setEngineMode(response.headers.get("x-et-mode") === "demo-no-key" ? "demo" : "live");
          setContent(payload.briefing || "No briefing returned by ET Pulse engine.");
          setTimeline(payload.timeline || []);
          setSentimentShift(payload.sentimentShift || "No sentiment shift available yet.");
        }
      } catch {
        if (active && requestId === requestIdRef.current) {
          setEngineMode("demo");
          setContent("Error connecting to ET Pulse Engine. Check your server API key.");
          setTimeline([
            {
              timeLabel: "Latest",
              event: "Unable to compute story arc due to API error.",
              sentiment: "Neutral",
            },
          ]);
          setSentimentShift("Sentiment unavailable.");
        }
      } finally {
        if (active && requestId === requestIdRef.current) {
          setLoading(false);
          setFirstLoad(false);
        }
      }
    }

    updateNews();

    return () => {
      active = false;
    };
  }, [persona, isTelugu]);

  // 3. The UI (The "Body")
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white p-8 font-sans">
      
      {/* Header with Persona Switcher */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b pb-6 border-zinc-200 dark:border-zinc-800 gap-4">
        <h1 className="text-4xl font-black tracking-tighter italic text-red-600">ET PULSE</h1>
        
        <div className="flex gap-2 bg-zinc-200 dark:bg-zinc-900 p-1 rounded-full shadow-inner">
          {PERSONAS.map((p) => (
            <button
              key={p}
              onClick={() => setPersona(p)}
              disabled={loading}
              aria-label={`Switch to ${p} persona`}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                persona === p 
                ? "bg-white dark:bg-zinc-700 shadow-lg scale-105 text-black dark:text-white" 
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
              } ${loading ? "opacity-80 cursor-wait" : ""}`}
            >
              {p}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* Main Briefing Card */}
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 block">
              {persona} Mode • AI Synthesized Briefing
            </span>
            {engineMode === "demo" ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                Demo Engine
              </span>
            ) : null}
          </div>
          
          <h2 className="text-3xl font-bold mb-6 leading-tight">
            {persona === "Student" 
              ? "How the New Budget Impacts Your Future Career" 
              : persona === "Investor"
              ? "Market Pulse: 5 Indicators Every Investor Must Watch"
              : "Strategic Intelligence: Founder's Guide to 2026 Expansion"}
          </h2>

          {firstLoad ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700 w-11/12"></div>
              <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700 w-10/12"></div>
              <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700 w-9/12"></div>
              <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700 w-8/12"></div>
            </div>
          ) : (
            <div className={`transition-all duration-500 ${loading ? "opacity-60" : "opacity-100"}`}>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed border-l-4 border-red-600 pl-4">
                &ldquo;{content}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Story Arc Tracker Card */}
        <div className="bg-zinc-900 text-white p-8 rounded-3xl shadow-xl border border-zinc-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">Story Arc Tracker</h3>
            <ul className="space-y-6">
              {(timeline.length > 0
                ? timeline
                : [
                    {
                      timeLabel: "Latest",
                      event: "Waiting for timeline events from ET Pulse engine...",
                      sentiment: "Neutral" as const,
                    },
                  ]
              ).map((item, index) => {
                const dotColor =
                  item.sentiment === "Bullish"
                    ? "bg-emerald-500"
                    : item.sentiment === "Bearish"
                      ? "bg-rose-500"
                      : "bg-zinc-500";

                return (
                  <li key={`${item.timeLabel}-${index}`} className="flex gap-4 items-start">
                    <div className={`w-2 h-2 rounded-full ${dotColor} mt-2 shrink-0`}></div>
                    <div>
                      <p className="text-sm font-bold">{item.timeLabel}</p>
                      <p className="text-zinc-400 text-sm">{item.event}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="text-zinc-400 text-sm mt-6">{sentimentShift}</p>
          </div>
          <Link
            href="/timeline"
            className="w-full py-4 bg-white text-black font-bold rounded-2xl text-center block"
          >
            View Full Timeline
          </Link>
        </div>

        {/* Vernacular Engine Card */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <p className="font-bold">Vernacular Engine: Telugu (తెలుగు)</p>
            <button 
              onClick={() => setIsTelugu(!isTelugu)}
              disabled={loading}
              aria-label="Toggle Telugu language"
              className={`w-14 h-8 rounded-full transition-colors relative ${isTelugu ? "bg-red-600" : "bg-zinc-300 dark:bg-zinc-700"}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isTelugu ? "left-7" : "left-1"}`}></div>
            </button>
        </div>

      </main>
    </div>
  );
}