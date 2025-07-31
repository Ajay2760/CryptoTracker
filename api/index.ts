import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || "";
  const BASE_URL = "https://api.coingecko.com/api/v3";
  
  try {
    const { url } = req;
    
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    // Handle different API routes
    if (url.includes('/api/global')) {
      const apiUrl = `${BASE_URL}/global`;
      const headers: Record<string, string> = { 'Accept': 'application/json' };
      
      if (COINGECKO_API_KEY) {
        headers['x-cg-demo-api-key'] = COINGECKO_API_KEY;
      }

      const response = await fetch(apiUrl, { headers });
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      return res.json(data);
    }
    
    if (url.includes('/api/coins/markets')) {
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
    }
    
    // Handle coin detail routes
    const coinDetailMatch = url.match(/\/api\/coins\/([^\/]+)$/);
    if (coinDetailMatch) {
      const coinId = coinDetailMatch[1];
      const { localization = false, tickers = false, market_data = true, community_data = false, developer_data = false, sparkline = false } = req.query;
      
      const apiUrl = new URL(`${BASE_URL}/coins/${coinId}`);
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
    }
    
    // Handle chart data routes
    const chartMatch = url.match(/\/api\/coins\/([^\/]+)\/market_chart/);
    if (chartMatch) {
      const coinId = chartMatch[1];
      const { vs_currency = "usd", days = "1", interval } = req.query;
      
      const apiUrl = new URL(`${BASE_URL}/coins/${coinId}/market_chart`);
      apiUrl.searchParams.set("vs_currency", vs_currency as string);
      apiUrl.searchParams.set("days", days as string);
      if (interval) {
        apiUrl.searchParams.set("interval", interval as string);
      }
      
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
    }
    
    // Default response for unmatched routes
    return res.status(404).json({ message: "API route not found" });
    
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}