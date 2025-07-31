import { TrendingUp, ArrowUpDown, Bitcoin, Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercentage, getPercentageColor } from "@/lib/coingecko";
import { GlobalData } from "@/types/crypto";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketStatsProps {
  globalData?: GlobalData;
  isLoading: boolean;
}

export function MarketStats({ globalData, isLoading }: MarketStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="w-12 h-12 rounded-lg" />
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!globalData) return null;

  const { data } = globalData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Market Cap</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(data.total_market_cap.usd)}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-primary w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${getPercentageColor(data.market_cap_change_percentage_24h_usd)}`}>
              {formatPercentage(data.market_cap_change_percentage_24h_usd)}
            </span>
            <span className="text-sm text-slate-500 ml-2">24h</span>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">24h Volume</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(data.total_volume.usd)}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <ArrowUpDown className="text-indigo-600 w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-slate-600">Global volume</span>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">BTC Dominance</p>
              <p className="text-2xl font-bold text-slate-900">
                {data.market_cap_percentage.btc.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <Bitcoin className="text-amber-600 w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-slate-600">Market share</span>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Cryptos</p>
              <p className="text-2xl font-bold text-slate-900">
                {data.active_cryptocurrencies.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Coins className="text-green-600 w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-slate-600">Markets</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
