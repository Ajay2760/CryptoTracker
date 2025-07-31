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
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: "Coin ID is required" });
    }

    const { localization = false, tickers = false, market_data = true, community_data = false, developer_data = false, sparkline = false } = req.query;
    
    const apiUrl = new URL(`${BASE_URL}/coins/${id}`);
    apiUrl.searchParams.set("localization", localization as string);
    apiUrl.searchParams.set("tickers", tickers as string);
    apiUrl.searchParams.set("market_data", market_data as string);
    apiUrl.searchParams.set("community_data", community_data as string);
    apiUrl.searchParams.set("developer_data", developer_data as string);
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
    console.error(`Coin Detail API Error:`, error);
    return res.status(500).json({ 
      message: "Failed to fetch coin data",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}