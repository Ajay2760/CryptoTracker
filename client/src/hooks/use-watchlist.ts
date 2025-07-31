import { useState, useEffect } from "react";

const WATCHLIST_KEY = "crypto-watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse watchlist from localStorage:", error);
        setWatchlist([]);
      }
    }
  }, []);

  const addToWatchlist = (coinId: string) => {
    setWatchlist((prev) => {
      if (prev.includes(coinId)) return prev;
      const updated = [...prev, coinId];
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWatchlist = (coinId: string) => {
    setWatchlist((prev) => {
      const updated = prev.filter((id) => id !== coinId);
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const toggleWatchlist = (coinId: string) => {
    if (watchlist.includes(coinId)) {
      removeFromWatchlist(coinId);
    } else {
      addToWatchlist(coinId);
    }
  };

  const isInWatchlist = (coinId: string) => watchlist.includes(coinId);

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
  };
}
