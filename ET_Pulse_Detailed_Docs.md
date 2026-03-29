# ET Pulse: Complete System Documentation

## 1. System Overview
**ET Pulse** is an AI-powered intelligence briefing and news aggregation platform. It automatically processes multiple sprawling news articles and "stitches" them into a single, cohesive, non-redundant macroeconomic framework. At its core, it removes noise and focuses entirely on generating targeted, actionable insights tailored specifically to the user's demographic.

---

## 2. Core Working Mechanism
The system utilizes a dual-layer architecture built on Next.js communicating directly with the **Google Gemini 2.5 Flash** model.

### Data Ingestion and Normalization
1. **Raw Articles**: The backend maintains an array of macroeconomic articles (e.g., Union Budget announcements, EdTech stocks, and startup compliance changes).
2. **Generative Synthesis**: The raw text is passed to the `/api/stitch` route. Gemini is instructed via prompt-engineering to analyze the articles, remove contradictory data points, calculate overall market sentiment, and generate a structured JSON object containing:
   - A unifying headline.
   - A briefing summary.
   - Extracted Key Signals.
   - An event-based timeline.
3. **Resiliency Engine**: If the Gemini API experiences rate limits or exhaustion, the backend catches the resulting internal errors. Instead of crashing, it seamlessly reroutes to a locally cached `demoPayload`, maintaining a 100% stable user experience.

---

## 3. Application Routes

The platform relies on two primary frontend routes and one vital backend route to function.

### A. `/` (Terminal View - Home Page)
The primary landing dashboard displaying the highest-level synthesized statistics. 
- **Display Areas**: Features the main synthesized Briefing panel and a summarized "Story Arc Tracker" sidebar displaying snapshot updates of the timeline.
- **Functionality**: Re-fetches its data entirely from scratch every time an interactive setting is triggered, enabling real-time generation.

### B. `/timeline` (Interactive Drill-Down Timeline)
A focused, detailed historical mapping layout that prioritizes deep event analysis.
- **Display Areas**: Renders the complete chronological sequence of stitched events via an aesthetic vertical axis.
- **Functionality**: Extracts and displays `Impact Analysis` explaining systemic consequences of an event, and provides direct `Trace Key Signal` citation links directing the user to the original source.

### C. `/api/stitch` (Backend AI API)
A stateless Node.js server route that brokers the conversation between the client frontend and the Google Gemini API.
- **Functionality**: Dynamically constructs specific structural constraints (JSON schema) and ensures the output conforms perfectly to the React rendering expectations.

---

## 4. UI Actions, Buttons, and Sections

ET Pulse is completely interactive, and every active element triggers a unique response from the AI.

### A. Persona Switchers
Located in the top right navigation bar of the Terminal View. These buttons fundamentally alter the AI's internal instruction sets:
1. **Student Mode Button**: Prompts the AI to act as a mentor. It breaks down complex financial jargon and emphasizes how the news impacts hiring trends, internships, and educational subsidies.
2. **Investor Mode Button**: Transforms the AI into a quantitative analyst. It strips away narrative padding and explicitly highlights actionable themes like sector rotation, quality equity bias, execution risk, and macroeconomic momentum.
3. **Founder Mode Button**: Recalibrates the AI model to prioritize startup ecosystems. It identifies regulatory compliance shifts, early-stage investor activity, and B2B monetization discipline.

### B. The Vernacular Engine Toggle
Located on the bottom left of the Home Page. 
When activated to **Telugu**, it forces the Generative AI to apply *Cultural Adaptation Synthesis*. Rather than generating a robotic 1:1 translation pattern, it reconstructs the entire briefing context using localized phrasing naturally targeted to Indian users. Flipping the toggle instantly transforms the output language.

### C. Story Arc Drill-Down Cards
Located throughout the `/timeline` page. 
Each chronological event is embedded in an interactive React card. 
- **Sentiment Indicators**: Visual badges identifying whether the event was inherently `Bullish` (Emerald Green border), `Bearish` (Rose border), or `Neutral` (Blue border). The active timeline dot pulsates rhythmically.
- **Trace Source Button**: An anchor element redirecting the user out of the platform directly to the macroeconomic news wire (e.g., Economic Times pathfinder) for validation.
