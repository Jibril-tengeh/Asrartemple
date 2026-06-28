import express from "express";
import path from "path";
import cors from "cors";
import Stripe from "stripe";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

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

  // Webhook endpoint needs raw body for Stripe
  app.post(
    "/api/webhooks/stripe",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error("Missing STRIPE_WEBHOOK_SECRET");
        return res.status(400).send("Webhook Secret not configured");
      }

      let stripe: Stripe;
      try {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
          apiVersion: "2023-10-16" as any,
        });
      } catch (err) {
        return res.status(500).send("Stripe not configured");
      }

      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
      } catch (err: any) {
        console.error("Webhook Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle the checkout.session.completed event
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;

        if (userId) {
          try {
            const db = getDb();
            // Grant 3 months of premium
            await db.collection("users").doc(userId).update({
              subscriptionTier: "premium",
              premiumUntil: Timestamp.fromDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000))
            });
            console.log(`Successfully upgraded user ${userId} to premium via Stripe`);
          } catch (error) {
            console.error("Error updating user in Firestore:", error);
          }
        }
      }

      res.json({ received: true });
    }
  );

  // General body parsing for other endpoints
  app.use(express.json());
  app.use(cors());

  // Stripe Checkout Session Creation
  app.post("/api/create-stripe-session", async (req, res) => {
    try {
      const { userId, email } = req.body;
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) throw new Error("Stripe secret key not configured");

      const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" as any });
      const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        client_reference_id: userId,
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Premium Subscription (3 Months)",
                description: "Unlock advanced features and remove ads.",
              },
              unit_amount: 1000, // 10 USD
              recurring: {
                interval: "month",
                interval_count: 3,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/store?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/store?canceled=true`,
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Error creating Stripe session:", error);
      res.status(500).json({ error: error.message });
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
