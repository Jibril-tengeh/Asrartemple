export class StripeService {
  static async createCheckoutSession(userId: string, email: string): Promise<string> {
    const response = await fetch('/api/create-stripe-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create Stripe session');
    }

    const session = await response.json();
    return session.url;
  }
}
