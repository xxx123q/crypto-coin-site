"use client";
import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import SearchBar from "./components/SearchBar";
import CoinTable from "./components/CoinTable";
import PaginationBar from "./components/Pagination";

export default function Homepage() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState({ key: "market_cap", direction: "desc" });
  const [searchItem, setSearchItem] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);
  const perPage = 50;
  const [lastValidPage, setLastValidPage] = useState(0);

  // Fetch total number of coins
  useEffect(() => {
    async function fetchTotalCoins() {
      setError(null);
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/coins/list");
        if (!res.ok) throw new Error("Failed to fetch coins list.");
        const data = await res.json();
        setTotalPages(Math.ceil(data.length / perPage));
      } catch (err) {
        setError(err.message);
      }
    }
    fetchTotalCoins();
  }, []);

  // Fetch coin data per page
  useEffect(() => {
    async function loadCoinData() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&order=market_cap_desc&per_page=${perPage}&page=${page}`
        );
        if (!res.ok) throw new Error("Failed to load coin data.");
        const data = await res.json();
        setCoins(data);
        setLastValidPage(page);
      } catch (err) {
        setError(err.message);
        setPage(lastValidPage);
      } finally {
        setLoading(false);
      }
    }
    if (page !== lastValidPage) {
      loadCoinData();
    }
  }, [lastValidPage, page]);

  // Search with debounce
  useEffect(() => {
    if (!searchItem.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${searchItem}`
        );
        if (!res.ok) throw new Error("Search failed.");
        const data = await res.json();
        setSearchResults(data.coins || []);
        setShowDropdown(true);
      } catch (err) {
        setSearchResults([]);
        setError(err.message);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchItem]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sort.key === key && sort.direction === "asc") direction = "desc";
    setSort({ key, direction });
    setCoins((prevCoins) =>
      [...prevCoins].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const handleSearch = () => {
    if (searchResults.length > 0) {
      const coin = searchResults[0];
      router.push(`/coin/${coin.id}`);
      setShowDropdown(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
      <Typography variant="h3" align="center" gutterBottom fontWeight={700}>
        Coin List
      </Typography>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
      )}

      <SearchBar
        searchItem={searchItem}
        setSearchItem={setSearchItem}
        searchResults={searchResults}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        handleSearch={handleSearch}
      />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <CoinTable coins={coins} handleSort={handleSort} />
      )}

      <PaginationBar
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        setError={setError}
      />
    </Container>
  );
}
