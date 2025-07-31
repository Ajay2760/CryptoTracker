import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || process.env.VITE_COINGECKO_API_KEY || "";
  const BASE_URL = "https://api.coingecko.com/api/v3";

  // Proxy routes to CoinGecko API to avoid CORS issues
  app.get("/api/coins/markets", async (req, res) => {
    try {
      const { vs_currency = "usd", order = "market_cap_desc", per_page = 50, page = 1, sparkline = false } = req.query;
      
      const url = new URL(`${BASE_URL}/coins/markets`);
      url.searchParams.set("vs_currency", vs_currency as string);
      url.searchParams.set("order", order as string);
      url.searchParams.set("per_page", per_page as string);
      url.searchParams.set("page", page as string);
      url.searchParams.set("sparkline", sparkline as string);
      
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      
      if (COINGECKO_API_KEY) {
        headers['x-cg-demo-api-key'] = COINGECKO_API_KEY;
      }

      const response = await fetch(url.toString(), { headers });
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching coins markets:", error);
      res.status(500).json({ message: "Failed to fetch cryptocurrency data" });
    }
  });

  app.get("/api/coins/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { localization = false, tickers = false, market_data = true, community_data = false, developer_data = false, sparkline = false } = req.query;
      
      const url = new URL(`${BASE_URL}/coins/${id}`);
      url.searchParams.set("localization", localization as string);
      url.searchParams.set("tickers", tickers as string);
      url.searchParams.set("market_data", market_data as string);
      url.searchParams.set("community_data", community_data as string);
      url.searchParams.set("developer_data", developer_data as string);
      url.searchParams.set("sparkline", sparkline as string);
      
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      
      if (COINGECKO_API_KEY) {
        headers['x-cg-demo-api-key'] = COINGECKO_API_KEY;
      }

      const response = await fetch(url.toString(), { headers });
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error(`Error fetching coin ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch coin data" });
    }
  });

  app.get("/api/coins/:id/market_chart", async (req, res) => {
    try {
      const { id } = req.params;
      const { vs_currency = "usd", days = "1", interval } = req.query;
      
      const url = new URL(`${BASE_URL}/coins/${id}/market_chart`);
      url.searchParams.set("vs_currency", vs_currency as string);
      url.searchParams.set("days", days as string);
      if (interval) {
        url.searchParams.set("interval", interval as string);
      }
      
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      
      if (COINGECKO_API_KEY) {
        headers['x-cg-demo-api-key'] = COINGECKO_API_KEY;
      }

      const response = await fetch(url.toString(), { headers });
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error(`Error fetching chart data for ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch chart data" });
    }
  });

  app.get("/api/global", async (req, res) => {
    try {
      const url = `${BASE_URL}/global`;
      
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      
      if (COINGECKO_API_KEY) {
        headers['x-cg-demo-api-key'] = COINGECKO_API_KEY;
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching global data:", error);
      res.status(500).json({ message: "Failed to fetch global market data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
