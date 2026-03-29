import google.generativeai as genai
import json
import os

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
  raise ValueError("Missing GEMINI_API_KEY environment variable")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-flash')

def stitch_articles(articles_text):
    prompt = f"""
    You are an ET News Editor. Stitch these articles into a single 'Intelligence Briefing'.
    
    ARTICLES:
    {articles_text}
    
    OUTPUT JSON FORMAT:
    {{
      "headline": "One catchy title",
      "summary": "Synthesized briefing",
      "timeline": ["Step 1", "Step 2"],
      "impact": "Why this matters"
    }}
    """
    response = model.generate_content(prompt)
    return response.text

# Test it with some text!
test_news = "Article 1: Reliance stocks up. Article 2: Mukesh Ambani announces new AI wing."
print(stitch_articles(test_news))