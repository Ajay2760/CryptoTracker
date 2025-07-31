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
  const BASE_URL = "https://api.coingecko.com/api/v3";
  
  try {
    console.log('Global API called');
    console.log('API Key present:', !!COINGECKO_API_KEY);
    
    const apiUrl = `${BASE_URL}/global`;
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    
    if (COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = COINGECKO_API_KEY;
    }

    console.log('Requesting URL:', apiUrl);
    const response = await fetch(apiUrl, { headers });
    
    console.log('CoinGecko response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('CoinGecko API error:', response.status, errorText);
      throw new Error(`CoinGecko API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Global data received');
    return res.json(data);
    
  } catch (error) {
    console.error("Global API Error:", error);
    return res.status(500).json({ 
      message: "Failed to fetch global market data",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}