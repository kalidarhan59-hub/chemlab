import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize Gemini API client on server side
const apiKey = process.env.GEMINI_API_KEY?.trim() || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'chemlab-education-portal',
        },
      },
    })
  : null;

const DEFAULT_SYSTEM_PROMPT = `
You are the ChemLab AI Assistant (КемЛаб ИИ-көмекшісі / ИИ-ассистент ChemLab), a smart, friendly, and helpful AI tutor created for the "ChemLab" chemistry portal by Akbobek School.

ROLES & CAPABILITIES:
1. You are an expert chemistry tutor for 7-11th grade students, university applicants (ҰБТ/ЕНТ), and curious learners.
2. You explain complex chemical concepts simply using real-life examples, balanced equations, and step-by-step solutions.
3. You know all sections of the ChemLab website and recommend users visit them when relevant:
   - "Тренажёр" / "Exam Trainer" (/trainer) for UNT test practice and quizzes.
   - "Конструктор молекул" / "3D Molecule Builder" (/molecules) for viewing 3D molecular structures.
   - "Таблица Менделеева" / "Periodic Table" (/periodic) for element properties, electron configurations, and facts.
   - "Балансировщик" / "Equation Balancer" (/balancer) for balancing chemical reactions.
   - "Химия вокруг нас" / "Chemistry Around Us" (/articles) for real-life chemistry articles and safe experiments.
4. You answer ANY question the user asks (general science, math, coding, literature, life advice, history, everyday questions) like a full-featured AI assistant (ChatGPT/Claude style), without artificial topic restrictions.
5. LANGUAGE SUPPORT: You MUST reply in the language the user addresses you in (Kazakh, Russian, or English). If the user writes in Kazakh, answer in natural, grammatically correct school-curriculum Kazakh (Қазақша). If in Russian, answer in clear Russian. If in English, answer in fluent English.

FORMATTING:
- Use clear markdown lists, bold text, and chemical formulas (e.g. H2SO4, CaCO3, or LaTeX $...$ for formulas).
- Keep explanations clear, structured, and encouraging.
`;

// AI Assistant Chat Proxy Route
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemContext } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Combine system prompt with current page context if provided
    let fullSystemPrompt = DEFAULT_SYSTEM_PROMPT;
    if (systemContext) {
      fullSystemPrompt += `\n\nCURRENT PAGE CONTEXT:\nThe user is currently viewing the following page/topic on ChemLab:\n"${systemContext}"\nTailor your response to be directly relevant to this topic if appropriate.`;
    }

    // Format chat history for Gemini generateContent call
    const recentMessages = messages.slice(-20);
    
    // Construct prompt history
    const contents = recentMessages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    if (!apiKey || !ai) {
      return res.status(200).json({
        reply: "⚠️ AI is not configured. Add GEMINI_API_KEY to the server environment and restart the app.",
      });
    }

    // Try stable Flash models in sequence so the assistant remains resilient to model availability changes.
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];
    let responseText: string | null = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const result = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: fullSystemPrompt,
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        });
        if (result && result.text) {
          responseText = result.text;
          break; // Successfully generated!
        }
      } catch (err: any) {
        console.warn(`Model [${modelName}] failed:`, err?.message || err);
        lastError = err;
      }
    }

    if (!responseText) {
      const errStr = String(lastError?.message || lastError || '');
      const isQuota = errStr.includes('Quota exceeded') || errStr.includes('429') || lastError?.status === 'RESOURCE_EXHAUSTED';
      const fallbackMsg = isQuota
        ? '⏳ Сұраныстар лимитіне жеттіңіз (Quota limit reached). Өтініш, 1 минуттан кейін қайтадан көріңіз. / Пожалуйста, повторите попытку через 1 минуту.'
        : '⚠️ Кешіріңіз, жауап дайындау мүмкін болмады. Өтініш, қайталап көріңіз. / Извините, не удалось сформировать ответ. Пожалуйста, повторите попытку.';
      
      return res.status(200).json({ reply: fallbackMsg });
    }

    return res.status(200).json({ reply: responseText });
  } catch (error: any) {
    console.error('Error in /api/chat backend route:', error);
    return res.status(200).json({
      reply: '⚠️ Серверде уақытша қате орын алды. Өтініш, қайталап көріңіз. / Временная ошибка сервера. Пожалуйста, повторите попытку.',
    });
  }
});

// Dev vs Production server setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // In production serve dist
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ChemLab server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
