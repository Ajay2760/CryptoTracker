import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/layout/navigation";
import { MarketStats } from "@/components/markets/market-stats";
import { FiltersSection } from "@/components/markets/filters-section";
import { CryptocurrencyTable } from "@/components/markets/cryptocurrency-table";
import { Pagination } from "@/components/markets/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { CoinMarket, GlobalData, MarketCapFilter, ChangeFilter } from "@/types/crypto";
import { useLocation } from "wouter";

export default function Markets() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [marketCapFilter, setMarketCapFilter] = useState<MarketCapFilter>("all");
  const [changeFilter, setChangeFilter] = useState<ChangeFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch global market data
  const { data: globalData, isLoading: globalLoading } = useQuery<GlobalData>({
    queryKey: ["/api/global"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch coins market data
  const { data: coinsData, isLoading: coinsLoading } = useQuery<CoinMarket[]>({
    queryKey: [`/api/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${currentPage}&sparkline=false`],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Filter coins based on search and filters
  const filteredCoins = useMemo(() => {
    if (!coinsData) return [];

    let filtered = coinsData;

    // Apply search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
      );
    }

    // Apply market cap filter
    if (marketCapFilter !== "all") {
      filtered = filtered.filter((coin) => {
        const marketCap = coin.market_cap;
        switch (marketCapFilter) {
          case "large":
            return marketCap > 10_000_000_000; // > $10B
          case "mid":
            return marketCap >= 1_000_000_000 && marketCap <= 10_000_000_000; // $1B - $10B
          case "small":
            return marketCap < 1_000_000_000; // < $1B
          default:
            return true;
        }
      });
    }

    // Apply change filter
    if (changeFilter !== "all") {
      filtered = filtered.filter((coin) => {
        switch (changeFilter) {
          case "gainers":
            return coin.price_change_percentage_24h > 0;
          case "losers":
            return coin.price_change_percentage_24h < 0;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [coinsData, debouncedSearchQuery, marketCapFilter, changeFilter]);

  const handleCoinClick = (coinId: string) => {
    setLocation(`/coin/${coinId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(13456 / perPage); // Approximate total cryptocurrencies
  const totalItems = 13456;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Cryptocurrency Markets</h1>
          <p className="text-slate-600">
            Track live prices, market caps, and trading volumes for the top cryptocurrencies.
          </p>
        </div>

        {/* Market Stats */}
        <MarketStats globalData={globalData} isLoading={globalLoading} />

        {/* Filters */}
        <FiltersSection
          marketCapFilter={marketCapFilter}
          changeFilter={changeFilter}
          perPage={perPage}
          onMarketCapFilterChange={setMarketCapFilter}
          onChangeFilterChange={setChangeFilter}
          onPerPageChange={handlePerPageChange}
        />

        {/* Cryptocurrency Table */}
        <CryptocurrencyTable
          coins={filteredCoins}
          isLoading={coinsLoading}
          onCoinClick={handleCoinClick}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={perPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}
