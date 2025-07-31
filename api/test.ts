import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || "";
  
  return res.json({
    status: "API working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    hasApiKey: !!COINGECKO_API_KEY,
    apiKeyLength: COINGECKO_API_KEY.length,
    requestMethod: req.method,
    requestUrl: req.url,
    userAgent: req.headers['user-agent'] || 'unknown'
  });
}