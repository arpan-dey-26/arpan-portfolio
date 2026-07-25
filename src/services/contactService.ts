// EmailJS via its plain REST endpoint (https://api.emailjs.com/api/v1.0/email/send)
// rather than the @emailjs/browser SDK — same reasoning as api/chat.ts:
// this environment can't `npm install` to verify a new dependency
// resolves and behaves as expected, and EmailJS's REST contract is
// simple and stable enough (a JSON POST with service/template/public-key
// identifiers) to implement directly with confidence.
//
// EmailJS's public key is designed to be exposed client-side — it's not
// a secret the way a server API key is; EmailJS enforces sending limits
// and domain restrictions on their end, tied to that key. This is
// exactly why EmailJS (or Formspree, the same shape) was chosen over
// something like Resend for the contact form specifically: Resend's API
// key IS a real secret and would need its own serverless function,
// while this needs no backend at all.

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

/**
 * Reads three values from Vite env vars — all VITE_-prefixed on purpose,
 * since they're meant to be public (see the comment above). Throws with a
 * clear, actionable message if they're not configured yet, rather than
 * silently failing or sending a request that EmailJS will just reject.
 */
export async function sendContactMessage({ name, email, message }: ContactFormValues): Promise<void> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('The contact form is not configured yet. Please email directly using the address above.');
  }

  const response = await fetch(EMAILJS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        from_name: name,
        from_email: email,
        message,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Message could not be sent — please try again or email directly using the address above.');
  }
}
