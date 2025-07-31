import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatPercentage, getPercentageColor } from "@/lib/coingecko";
import { CoinMarket } from "@/types/crypto";
import { useWatchlist } from "@/hooks/use-watchlist";

interface CryptocurrencyTableProps {
  coins: CoinMarket[];
  isLoading: boolean;
  onCoinClick: (coinId: string) => void;
}

export function CryptocurrencyTable({ coins, isLoading, onCoinClick }: CryptocurrencyTableProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  
  // Debug log to see what data we have
  console.log("CryptocurrencyTable - coins:", coins, "isLoading:", isLoading);

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">24h %</TableHead>
                <TableHead className="text-right">Market Cap</TableHead>
                <TableHead className="text-right">Volume (24h)</TableHead>
                <TableHead className="text-right w-20">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-10" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-14 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-6 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h %</TableHead>
              <TableHead className="text-right">Market Cap</TableHead>
              <TableHead className="text-right">Volume (24h)</TableHead>
              <TableHead className="text-right w-20">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coins.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  No cryptocurrencies found
                </TableCell>
              </TableRow>
            )}
            {coins.map((coin) => (
              <TableRow
                key={coin.id}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => onCoinClick(coin.id)}
              >
                <TableCell className="text-sm text-slate-600">
                  {coin.market_cap_rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <img
                      src={coin.image}
                      alt={`${coin.name} logo`}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/32x32/64748b/ffffff?text=" + coin.symbol.charAt(0);
                      }}
                    />
                    <div>
                      <div className="font-medium text-slate-900">{coin.name}</div>
                      <div className="text-sm text-slate-500 uppercase">{coin.symbol}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-slate-900">
                  {formatCurrency(coin.current_price)}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-medium ${getPercentageColor(coin.price_change_percentage_24h)}`}>
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </span>
                </TableCell>
                <TableCell className="text-right text-slate-900">
                  {formatCurrency(coin.market_cap)}
                </TableCell>
                <TableCell className="text-right text-slate-600">
                  {formatCurrency(coin.total_volume)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-1 ${
                      isInWatchlist(coin.id) 
                        ? "text-yellow-500 hover:text-yellow-600" 
                        : "text-slate-400 hover:text-yellow-500"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(coin.id);
                    }}
                  >
                    <Star className="w-4 h-4" fill={isInWatchlist(coin.id) ? "currentColor" : "none"} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
