import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  let utms = {};

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    utms = body.utms || {};
    console.log("UTMS que chegaram", utms);
  } catch (err) {
    console.error('Erro ao fazer parse do body:', err);
    return res.status(400).json({ error: 'Body inválido' });
  }

  // Garante que os metadados sejam strings
  const safeMetadata = {};
for (const key in utms) {
  if (
    Object.prototype.hasOwnProperty.call(utms, key) &&
    utms[key] !== undefined &&
    utms[key] !== null
  ) {
    safeMetadata[key] = String(utms[key]);
  }
}

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1RfQiWJNRVv3P4xY9CunOBGo',
          quantity: 1,
        },
      ],
      success_url: 'https://web.snaphubb.online/obg2/',
      cancel_url: 'https://web.snaphubb.online/fail/',
      subscription_data: {
        metadata: safeMetadata, 
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Erro ao criar sessão do Stripe:', error);
    return res.status(500).json({ error: 'Erro ao criar sessão do Stripe' });
  }
}
