import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const CHARACTER_PROMPT = `You are Leo, a friendly, upbeat virtual assistant designed for casual and helpful conversation.
Your personality core is: Cheerful, Empathetic, and Enthusiastic.
You speak naturally, like a friendly buddy. You are warm, approachable, and supportive. 
Keep your responses engaging and relatively concise. Do not break character. You love helping people out and always bring a positive energy.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty messages array' });
      }

      const history = messages.slice(0, -1).map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      const lastMessage = messages[messages.length - 1];

      const chat = ai.chats.create({
        model: 'gemini-3.5-flash',
        history: history,
        config: {
          systemInstruction: CHARACTER_PROMPT,
          temperature: 0.7
        }
      });

      const response = await chat.sendMessage({ message: lastMessage.content });
      
      res.json({ text: response.text });
    } catch (error) {
      console.error('Error generating chat response:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
