# ET Pulse: AI-Synthesized Intelligence Briefing

**ET Pulse** is an advanced, AI-powered intelligence platform built to eliminate news noise and synthesize critical signals tailored exactly to the reader's persona. Built with Next.js and powered by Google's `gemini-2.5-flash`, the application tracks evolving story arcs and dynamically reconstructs complex economic news into actionable insights.

---

## 🚀 How It Works

ET Pulse operates as an intelligent middle-layer between raw news articles and the end user. Here is the operational workflow:

### 1. Data Aggregation & Stitching
The backend engine ingests multiple distinct articles covering the same macroeconomic event (e.g., a massive Union Budget announcement). Utilizing Google's Generative AI schema extraction, ET Pulse aggregates these sources, removes conflicting or redundant claims, and synthesizes one coherent "Story Arc."

### 2. The Interactive Timeline Engine
Once the events are stitched together, the frontend parses the data into an **Interactive Event Timeline**. 
- The chronological sequence is color-coded using AI-derived **Sentiment Analysis** (Bullish, Bearish, or Neutral). 
- Every event card acts as a drill-down dashboard that exposes a **Detailed Impact Analysis** explaining exactly *why* the update matters.
- Users can click **Trace Key Signal** to open the raw source article directly.

### 3. Graceful Rate-Limit Handling
To ensure a continuous user experience, the system's external requests are safely guarded by robust error boundaries. If the AI model hits an exhaustion or rate-limit threshold via the API, the backend seamlessly routes the user to an intelligent, rich fallback cache corresponding exactly to their active parameters.

---

## 🎯 Key Use Cases & Capabilities 

The platform is designed to be highly dynamic, reacting to specific user constraints via prompt-engineering pipelines. 

### Persona-Driven Context
The exact same data payload is structurally rewritten depending on *who* is reading it:
- **Student Mode:** Explains complex financial jargon and highlights how macroeconomic shifts impact AI skilling, internship demand, and the future job market.
- **Investor Mode:** Eliminates narrative fluff and delivers a highly-dense, signal-heavy output focusing strictly on medium-term earnings, market rotation, risk visibility, and portfolio bias. 
- **Founder Mode:** Reframes compliance adjustments and policy updates into actionable GTM (Go-To-Market) validation metrics and funding climates.

### Native Vernacular Synthesis
Rather than performing a basic, literal dictionary translation, the **Vernacular Engine** prompts the Generative AI to apply *Cultural Adaptation*. For example, when switching the engine to **Telugu**, the application instantly re-stitches the briefing to use familiar analogies aimed at Indian audiences while keeping the tone informative and concise.

---

## 🛠 Tech Stack
- **Frontend Layer:** Built using Next.js (React), powered by beautiful TailwindCSS designs (Glassmorphism, dark-modes, and CSS micro-animations). 
- **AI Brain:** Hooked directly to `@google/generative-ai` leveraging structured JSON extraction via `gemini-2.5-flash`.
