import express from "express";
import path from "path";
import cors from "cors";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Firebase Admin safely
  if (!getApps().length) {
    try {
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (serviceAccountJson) {
        const serviceAccount = JSON.parse(serviceAccountJson);
        initializeApp({
          credential: cert(serviceAccount)
        });
      } else {
        console.warn("FIREBASE_SERVICE_ACCOUNT env var is missing. Webhooks won't be able to update Firestore.");
      }
    } catch (error) {
      console.error("Error initializing Firebase Admin:", error);
    }
  }

  const getDb = () => {
    if (!getApps().length) throw new Error("Firebase Admin not initialized");
    return getFirestore();
  };

  // General body parsing for other endpoints
  app.use(express.json());
  app.use(cors());

  // Dream Interpretation via Gemini
  app.post("/api/dreams/interpret", async (req, res) => {
    try {
      const { title, content, type, wirdDone } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Vous êtes un expert en interprétation islamique des rêves, suivant la méthodologie d'Ibn Sirin et des savants spirituels.
L'utilisateur partage le rêve suivant :
Titre : ${title}
Contenu du rêve : ${content}
Type perçu : ${type}
Wird/Zikr effectué avant de dormir : ${wirdDone || "Aucun"}

Règles d'éthique spirituelle :
- Ne jamais prédire l'avenir de façon absolue (seul Allah sait).
- Toujours utiliser "Allahou A'lam" (Dieu sait mieux).
- Si le rêve semble 'shaytani' (cauchemar), conseiller fermement de chercher refuge auprès d'Allah (A'oudhou billah) et de ne pas le raconter.
- Fournir une interprétation concise, apaisante et ancrée dans le symbolisme classique islamique (Ibn Sirin).
- Répondre en français avec douceur et sagesse spirituelle.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
      });

      res.json({ interpretation: response.text });
    } catch (error: any) {
      console.error("Dream interpretation error:", error);
      res.status(500).json({ error: "Failed to generate interpretation" });
    }
  });

  // Paystack verification
  app.post("/api/verify-paystack", async (req, res) => {
    try {
      const { reference, userId } = req.body;
      const paystackKey = process.env.PAYSTACK_SECRET_KEY;
      
      if (!paystackKey) {
        throw new Error("Paystack secret key not configured");
      }

      // Verify transaction with Paystack
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${paystackKey}`
        }
      });
      const data = await response.json();

      if (data.status && data.data.status === 'success') {
        const db = getDb();
        // Update user to premium
        await db.collection("users").doc(userId).update({
          subscriptionTier: "premium",
          premiumUntil: Timestamp.fromDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000))
        });
        res.json({ success: true, message: "Payment verified and user upgraded" });
      } else {
        res.status(400).json({ success: false, message: "Payment verification failed" });
      }
    } catch (error: any) {
      console.error("Paystack verification error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
