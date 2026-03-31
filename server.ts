import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const BREVO_API_KEY = process.env.BREVO_API_KEY || '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';

  // Partner API Routes
  app.post("/api/partner/submissions/create", (req, res) => {
    const { title, type, partner_id } = req.body;
    console.log(`New submission: ${title} by ${partner_id}`);
    // Here you would typically send an email via Brevo and a Firebase notification
    res.status(201).json({ success: true, message: "Submission received" });
  });

  app.post("/api/partner/payout/request", (req, res) => {
    const { partner_id, amount } = req.body;
    console.log(`Payout request: ${amount}€ from ${partner_id}`);
    // Send email to admin
    res.json({ success: true, message: "Payout request sent to admin" });
  });

  app.post("/api/partner/upload", (req, res) => {
    // In a real app, this would handle multipart form data
    res.json({ url: "https://picsum.photos/seed/afrikher/800/600" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
