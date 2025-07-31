import { Link, useLocation } from "wouter";
import { Search, Coins } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navigation({ searchQuery, onSearchChange }: NavigationProps) {
  const [location] = useLocation();

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <Coins className="text-white w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-slate-900">CryptoTracker</span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/">
                  <a className={`font-medium pb-4 transition-all ${
                    location === "/" 
                      ? "text-primary border-b-2 border-primary" 
                      : "text-slate-600 hover:text-slate-900 hover:border-b-2 hover:border-slate-300"
                  }`}>
                    Markets
                  </a>
                </Link>
                <Link href="/watchlist">
                  <a className={`font-medium pb-4 transition-all ${
                    location === "/watchlist" 
                      ? "text-primary border-b-2 border-primary" 
                      : "text-slate-600 hover:text-slate-900 hover:border-b-2 hover:border-slate-300"
                  }`}>
                    Watchlist
                  </a>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <Input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  className="w-64 pl-10 pr-4 py-2"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              </div>
              <button className="sm:hidden p-2 text-slate-600 hover:text-slate-900">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Search */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search cryptocurrencies..."
            className="w-full pl-10 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        </div>
      </div>
    </>
  );
}
