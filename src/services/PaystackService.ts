export class PaystackService {
  static loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).PaystackPop) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Paystack SDK failed to load'));
      document.body.appendChild(script);
    });
  }

  static async initializePaystackPayment(
    email: string,
    amount: number,
    currency: string,
    userId: string,
    onSuccess: (reference: string) => void,
    onClose: () => void,
    planCode?: string
  ) {
    await this.loadScript();
    
    const handler = (window as any).PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '', // Replace with your public key
      email: email,
      amount: Math.round(amount * 100), // amount in lowest denomination (e.g., pesewas, kobo)
      currency: currency,
      plan: planCode,
      ref: 'PS_' + Math.floor((Math.random() * 1000000000) + 1),
      metadata: {
        custom_fields: [
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: userId
          }
        ]
      },
      callback: async (response: any) => {
        // verify with backend
        try {
          const res = await fetch('/api/verify-paystack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: response.reference, userId }),
          });
          if (res.ok) {
            onSuccess(response.reference);
          } else {
            console.error("Paystack verification failed on backend");
          }
        } catch (error) {
          console.error("Paystack verification error", error);
        }
      },
      onClose: () => {
        onClose();
      }
    });

    handler.openIframe();
  }
}
