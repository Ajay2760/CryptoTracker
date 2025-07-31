import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation } from "@/components/layout/navigation";
import { CoinChart } from "@/components/coin/coin-chart";
import { useWatchlist } from "@/hooks/use-watchlist";
import { CoinDetail, ChartData, ChartPeriod } from "@/types/crypto";
import { formatCurrency, formatPercentage, getPercentageColor, formatNumber } from "@/lib/coingecko";
import { Link } from "wouter";

export default function CoinDetailPage() {
  const [, params] = useRoute("/coin/:id");
  const [searchQuery, setSearchQuery] = useState("");
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("1");
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  
  const coinId = params?.id;

  // Fetch coin details
  const { data: coinData, isLoading: coinLoading } = useQuery<CoinDetail>({
    queryKey: ["/api/coins", coinId],
    enabled: !!coinId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch chart data
  const { data: chartData, isLoading: chartLoading } = useQuery<ChartData>({
    queryKey: ["/api/coins", coinId, "market_chart", { days: chartPeriod }],
    enabled: !!coinId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  if (!coinId) {
    return <div>Invalid coin ID</div>;
  }

  if (coinLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            <Skeleton className="h-10 w-32" />
            <div className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-6">
                  <CardContent className="p-0 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Coin not found</h2>
            <p className="text-slate-600 mb-6">The requested cryptocurrency could not be found.</p>
            <Link href="/">
              <Button>Back to Markets</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const {
    name,
    symbol,
    image,
    market_cap_rank,
    market_data: {
      current_price,
      market_cap,
      total_volume,
      price_change_percentage_24h,
      price_change_percentage_7d,
      price_change_percentage_30d,
      circulating_supply,
      total_supply,
      max_supply,
      ath,
      atl,
    },
  } = coinData;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Markets
          </Button>
        </Link>

        {/* Coin Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <img
              src={image.large}
              alt={`${name} logo`}
              className="w-16 h-16 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/64x64/64748b/ffffff?text=" + symbol.charAt(0);
              }}
            />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
              <span className="text-xl text-slate-500 uppercase">{symbol}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`${
                isInWatchlist(coinId) 
                  ? "text-yellow-500 hover:text-yellow-600" 
                  : "text-slate-400 hover:text-yellow-500"
              }`}
              onClick={() => toggleWatchlist(coinId)}
            >
              <Star className="w-5 h-5" fill={isInWatchlist(coinId) ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>

        {/* Price and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <CardContent className="p-0">
              <p className="text-sm text-slate-600 mb-1">Current Price</p>
              <p className="text-3xl font-bold text-slate-900">
                {formatCurrency(current_price.usd)}
              </p>
              <div className="flex items-center mt-2">
                <span className={`font-medium ${getPercentageColor(price_change_percentage_24h)}`}>
                  {formatPercentage(price_change_percentage_24h)}
                </span>
                <span className="text-slate-500 text-sm ml-2">(24h)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <p className="text-sm text-slate-600 mb-1">Market Cap</p>
              <p className="text-xl font-semibold text-slate-900">
                {formatCurrency(market_cap.usd)}
              </p>
              <p className="text-sm text-slate-500">Rank #{market_cap_rank}</p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <p className="text-sm text-slate-600 mb-1">24h Volume</p>
              <p className="text-xl font-semibold text-slate-900">
                {formatCurrency(total_volume.usd)}
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <p className="text-sm text-slate-600 mb-1">Circulating Supply</p>
              <p className="text-xl font-semibold text-slate-900">
                {formatNumber(circulating_supply)} {symbol.toUpperCase()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <div className="mb-8">
          <CoinChart
            chartData={chartData}
            isLoading={chartLoading}
            period={chartPeriod}
            onPeriodChange={setChartPeriod}
          />
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="font-semibold text-slate-900 mb-4">Market Data</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">All-Time High</span>
                  <span className="font-medium">{formatCurrency(ath.usd)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">All-Time Low</span>
                  <span className="font-medium">{formatCurrency(atl.usd)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Supply</span>
                  <span className="font-medium">
                    {total_supply ? `${formatNumber(total_supply)} ${symbol.toUpperCase()}` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Max Supply</span>
                  <span className="font-medium">
                    {max_supply ? `${formatNumber(max_supply)} ${symbol.toUpperCase()}` : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <h3 className="font-semibold text-slate-900 mb-4">Price Changes</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">24 Hours</span>
                  <span className={`font-medium ${getPercentageColor(price_change_percentage_24h)}`}>
                    {formatPercentage(price_change_percentage_24h)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">7 Days</span>
                  <span className={`font-medium ${getPercentageColor(price_change_percentage_7d)}`}>
                    {formatPercentage(price_change_percentage_7d)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">30 Days</span>
                  <span className={`font-medium ${getPercentageColor(price_change_percentage_30d)}`}>
                    {formatPercentage(price_change_percentage_30d)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
