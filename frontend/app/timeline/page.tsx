"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ArcEvent } from "@/app/lib/gemini";

type TimelineResponse = {
  headline: string;
  sentimentShift: string;
  timeline: ArcEvent[];
};

export default function TimelinePage() {
  const [timelineData, setTimelineData] = useState<TimelineResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const response = await fetch("/api/stitch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ persona: "Investor", language: "English" }),
        });
        if (!response.ok) throw new Error("API Connection Failed");
        const data = await response.json();
        setTimelineData(data);
      } catch (err) {
        setError("Failed to stream ET Pulse intelligence.");
      } finally {
        setLoading(false);
      }
    }
    fetchTimeline();
  }, []);

  const getSentimentStyling = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish":
        return { dot: "bg-emerald-500 shadow-emerald-500/50", border: "border-emerald-500/30", text: "text-emerald-500" };
      case "Bearish":
        return { dot: "bg-rose-500 shadow-rose-500/50", border: "border-rose-500/30", text: "text-rose-500" };
      default:
        return { dot: "bg-blue-500 shadow-blue-500/50", border: "border-blue-500/30", text: "text-blue-500" };
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white pb-24 font-sans selection:bg-red-500/30">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-all">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <span className="text-xl font-black tracking-tighter italic text-red-600 group-hover:text-red-500 transition-colors">
              ET PULSE
            </span>
            <span className="text-sm border-l border-zinc-300 dark:border-zinc-700 pl-3 text-zinc-500 font-medium hidden sm:inline-block">
              Event Intelligence Timeline
            </span>
          </Link>
          <Link
            href="/"
            className="px-5 py-2 text-sm font-bold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-full hover:scale-105 transition-transform"
          >
            Terminal View
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="space-y-12 animate-pulse mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-6">
                <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0 mt-2"></div>
                <div className="space-y-3 w-full">
                  <div className="h-6 rounded-md bg-zinc-200 dark:bg-zinc-800 w-1/4"></div>
                  <div className="h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-900 w-full border border-zinc-200 dark:border-zinc-800"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-20 text-center text-red-500 font-medium bg-red-50 dark:bg-red-950/20 p-8 rounded-3xl border border-red-200 dark:border-red-900/30">
            {error}
          </div>
        ) : (
          <div className="py-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <div className="mb-16">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">
                {timelineData?.headline || "Intelligence Briefing"}
              </h1>
              <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium">
                {timelineData?.sentimentShift}
              </p>
            </div>

            <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-3 md:ml-6 space-y-12">
              {timelineData?.timeline?.map((event: ArcEvent, index: number) => {
                const styles = getSentimentStyling(event.sentiment);
                return (
                  <div key={index} className="relative pl-10 md:pl-16 group">
                    {/* Animated Timeline Node */}
                    <div className="absolute -left-[9px] top-2 flex items-center justify-center">
                      <div className={`w-4 h-4 rounded-full shadow-lg ${styles.dot}`}></div>
                      <div className={`absolute w-8 h-8 rounded-full opacity-0 group-hover:opacity-20 animate-ping ${styles.dot}`}></div>
                    </div>

                    {/* Drill-down Card */}
                    <div className={`bg-white dark:bg-zinc-900/60 p-6 md:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl group-hover:${styles.border}`}>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-black px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full tracking-widest text-zinc-500 dark:text-zinc-400">
                          {event.timeLabel}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-widest ${styles.text}`}>
                          {event.sentiment}
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug mb-4">
                        {event.event}
                      </h3>

                      {event.detailedImpact && (
                        <div className="mb-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-900">
                          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">Impact Analysis</p>
                          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                            {event.detailedImpact}
                          </p>
                        </div>
                      )}

                      {event.sourceUrl && (
                        <a
                          href={event.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          Trace Key Signal
                          <svg className="w-4 h-4 -mt-0.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}

              {(!timelineData?.timeline || timelineData.timeline.length === 0) && (
                <div className="pl-16 text-zinc-500 italic">No temporal events extracted for this cycle.</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
