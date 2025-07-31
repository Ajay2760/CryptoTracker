import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/layout/navigation";
import { CryptocurrencyTable } from "@/components/markets/cryptocurrency-table";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useDebounce } from "@/hooks/use-debounce";
import { CoinMarket } from "@/types/crypto";
import { useLocation } from "wouter";

export default function Watchlist() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { watchlist } = useWatchlist();
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch all coins to get watchlist data
  const { data: allCoinsData, isLoading } = useQuery<CoinMarket[]>({
    queryKey: ["/api/coins/markets", { per_page: 250 }], // Get more coins to cover watchlist
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Filter coins to show only watchlist items
  const watchlistCoins = useMemo(() => {
    if (!allCoinsData || watchlist.length === 0) return [];

    let filtered = allCoinsData.filter((coin) => watchlist.includes(coin.id));

    // Apply search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allCoinsData, watchlist, debouncedSearchQuery]);

  const handleCoinClick = (coinId: string) => {
    setLocation(`/coin/${coinId}`);
  };

  const EmptyState = () => (
    <Card className="p-12">
      <CardContent className="p-0 text-center">
        <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Star className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No cryptocurrencies in your watchlist
        </h3>
        <p className="text-slate-600 mb-6">
          Start building your watchlist by starring coins from the markets page.
        </p>
        <Button onClick={() => setLocation("/")}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Browse Markets
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Watchlist</h1>
            <p className="text-slate-600">Track your favorite cryptocurrencies in one place.</p>
          </div>
          <div className="text-sm text-slate-600">
            <span className="font-medium">{watchlist.length}</span> coins in watchlist
          </div>
        </div>

        {/* Watchlist Content */}
        {watchlist.length === 0 ? (
          <EmptyState />
        ) : watchlistCoins.length === 0 && debouncedSearchQuery ? (
          <Card className="p-12">
            <CardContent className="p-0 text-center">
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No results found
              </h3>
              <p className="text-slate-600">
                No cryptocurrencies in your watchlist match "{debouncedSearchQuery}".
              </p>
            </CardContent>
          </Card>
        ) : (
          <CryptocurrencyTable
            coins={watchlistCoins}
            isLoading={isLoading}
            onCoinClick={handleCoinClick}
          />
        )}
      </main>
    </div>
  );
}
