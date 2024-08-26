import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe'; // Assume stripe is initialized in lib/stripe

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session_id } = req.query;

  if (!session_id || typeof session_id !== 'string') {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    return res.status(200).json({
      amount: session.amount_total,
      currency: session.currency,
      payment_method: session.payment_method_types[0], // You can adjust this based on your session data
      created: session.created,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
