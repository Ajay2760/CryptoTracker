import { z } from "zod";

// CoinGecko API response schemas
export const coinMarketSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string(),
  current_price: z.number(),
  market_cap: z.number(),
  market_cap_rank: z.number(),
  fully_diluted_valuation: z.number().nullable(),
  total_volume: z.number(),
  high_24h: z.number(),
  low_24h: z.number(),
  price_change_24h: z.number(),
  price_change_percentage_24h: z.number(),
  market_cap_change_24h: z.number(),
  market_cap_change_percentage_24h: z.number(),
  circulating_supply: z.number(),
  total_supply: z.number().nullable(),
  max_supply: z.number().nullable(),
  ath: z.number(),
  ath_change_percentage: z.number(),
  ath_date: z.string(),
  atl: z.number(),
  atl_change_percentage: z.number(),
  atl_date: z.string(),
  roi: z.any().nullable(),
  last_updated: z.string(),
});

export const coinDetailSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  description: z.object({
    en: z.string(),
  }),
  image: z.object({
    thumb: z.string(),
    small: z.string(),
    large: z.string(),
  }),
  market_cap_rank: z.number(),
  market_data: z.object({
    current_price: z.object({
      usd: z.number(),
    }),
    market_cap: z.object({
      usd: z.number(),
    }),
    total_volume: z.object({
      usd: z.number(),
    }),
    price_change_percentage_24h: z.number(),
    price_change_percentage_7d: z.number(),
    price_change_percentage_30d: z.number(),
    circulating_supply: z.number(),
    total_supply: z.number().nullable(),
    max_supply: z.number().nullable(),
    ath: z.object({
      usd: z.number(),
    }),
    atl: z.object({
      usd: z.number(),
    }),
  }),
});

export const chartDataSchema = z.object({
  prices: z.array(z.array(z.number())),
  market_caps: z.array(z.array(z.number())),
  total_volumes: z.array(z.array(z.number())),
});

export const globalDataSchema = z.object({
  data: z.object({
    active_cryptocurrencies: z.number(),
    upcoming_icos: z.number(),
    ongoing_icos: z.number(),
    ended_icos: z.number(),
    markets: z.number(),
    total_market_cap: z.object({
      usd: z.number(),
    }),
    total_volume: z.object({
      usd: z.number(),
    }),
    market_cap_percentage: z.object({
      btc: z.number(),
    }),
    market_cap_change_percentage_24h_usd: z.number(),
  }),
});

export type CoinMarket = z.infer<typeof coinMarketSchema>;
export type CoinDetail = z.infer<typeof coinDetailSchema>;
export type ChartData = z.infer<typeof chartDataSchema>;
export type GlobalData = z.infer<typeof globalDataSchema>;
