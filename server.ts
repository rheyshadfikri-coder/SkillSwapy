/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with custom user agent and correct environment variable
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API endpoint for analyzing a user's portfolio and suggesting skill areas
app.post("/api/analyze-portfolio", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { projects, userSkills, userInterests } = req.body;

    if (!projects || !Array.isArray(projects)) {
      return res.status(400).json({ error: "Projects array is required" });
    }

    const projectsDesc = projects
      .map((p: any, idx: number) => {
        return `Project #${idx + 1}:
Title: ${p.title}
Category: ${p.category}
Description: ${p.description}
Tags: ${p.tags ? p.tags.join(", ") : "None"}
Certificate: ${p.certificate || "None"}`;
      })
      .join("\n\n");

    const userSkillsText = userSkills && Array.isArray(userSkills) 
      ? userSkills.map((s: any) => `${s.name} (${s.level || "expert"})`).join(", ") 
      : "None provided";
      
    const userInterestsText = userInterests && Array.isArray(userInterests)
      ? userInterests.join(", ")
      : "None provided";

    const prompt = `Analyze this user's current project portfolio and their listed interests and skills to identify what they should learn next through peer-to-peer SkillSwap. Align suggestions with actual high-growth industry trends and emerging paradigms (e.g., AI/ML, serverless, web3, advanced design systems, edge computing, modern content/marketing, product localization).

User Background Context:
- Current Registered Skills: ${userSkillsText}
- Interests: ${userInterestsText}

Portfolio Case Studies / Projects:
${projectsDesc || "(No project nodes uploaded yet. Give them constructive suggestions for general project paths alignment.)"}

Based on this, suggest exactly 3 high-impact, custom-tailored skill areas they should seek to trade/learn. For each skill area, provide:
1. "name": Solid, actionable topic/technology (e.g. "Interactive Data Vis with D3.js", "Prompt Engineering & RAG Systems", "UX Writing & Microcopy").
2. "reason": Why this skill is highly valued right now and how it supplements or bridges gaps in their current portfolio.
3. "projectIdea": A concrete, exciting peer-to-peer collaboration project they can build with another student on SkillSwap to master this skill.
4. "difficulty": Learning level ("Beginner Friendly", "Moderate", "Advanced").

Provide a highly professional and insightful analysis. Avoid generic buzzwords or AI fluff.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: {
              type: Type.STRING,
              description: "A professional and supportive 2-3 sentence strategic overview analyzing their current strength vector and identifying skill gaps.",
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  projectIdea: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                },
                required: ["name", "reason", "projectIdea", "difficulty"],
              },
            },
          },
          required: ["overview", "suggestions"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini API");
    }

    const data = JSON.parse(text.trim());
    return res.json(data);
  } catch (err: any) {
    console.error("Gemini portfolio analysis failed:", err);
    return res.status(500).json({ error: err?.message || "Internal server error occurred while calling Gemini" });
  }
});

// Setup Vite Dev server middleware or serve production assets
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SkillSwap server] listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
