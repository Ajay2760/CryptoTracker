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
    const { vs_currency = "usd", order = "market_cap_desc", per_page = 50, page = 1, sparkline = false } = req.query;
    
    const apiUrl = new URL(`${BASE_URL}/coins/markets`);
    apiUrl.searchParams.set("vs_currency", vs_currency as string);
    apiUrl.searchParams.set("order", order as string);
    apiUrl.searchParams.set("per_page", per_page as string);
    apiUrl.searchParams.set("page", page as string);
    apiUrl.searchParams.set("sparkline", sparkline as string);
    
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    
    if (COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = COINGECKO_API_KEY;
    }

    const response = await fetch(apiUrl.toString(), { headers });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    return res.json(data);
    
  } catch (error) {
    console.error("Markets API Error:", error);
    return res.status(500).json({ 
      message: "Failed to fetch cryptocurrency market data",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}