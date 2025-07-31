import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MarketCapFilter, ChangeFilter } from "@/types/crypto";

interface FiltersSectionProps {
  marketCapFilter: MarketCapFilter;
  changeFilter: ChangeFilter;
  perPage: number;
  onMarketCapFilterChange: (filter: MarketCapFilter) => void;
  onChangeFilterChange: (filter: ChangeFilter) => void;
  onPerPageChange: (perPage: number) => void;
}

export function FiltersSection({
  marketCapFilter,
  changeFilter,
  perPage,
  onMarketCapFilterChange,
  onChangeFilterChange,
  onPerPageChange,
}: FiltersSectionProps) {
  return (
    <Card className="p-6 mb-6">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-700">Market Cap:</label>
              <Select value={marketCapFilter} onValueChange={onMarketCapFilterChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="large">Large Cap ({'>'}$10B)</SelectItem>
                  <SelectItem value="mid">Mid Cap ($1B-$10B)</SelectItem>
                  <SelectItem value="small">Small Cap ({'<'}$1B)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-700">24h Change:</label>
              <Select value={changeFilter} onValueChange={onChangeFilterChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="gainers">Gainers Only</SelectItem>
                  <SelectItem value="losers">Losers Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">Show:</span>
            <div className="flex border border-slate-300 rounded-lg">
              <Button
                variant={perPage === 50 ? "default" : "ghost"}
                size="sm"
                className="rounded-r-none"
                onClick={() => onPerPageChange(50)}
              >
                50
              </Button>
              <Button
                variant={perPage === 100 ? "default" : "ghost"}
                size="sm"
                className="rounded-none border-x"
                onClick={() => onPerPageChange(100)}
              >
                100
              </Button>
              <Button
                variant={perPage === 250 ? "default" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => onPerPageChange(250)}
              >
                250
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
