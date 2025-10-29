"use client";
import { useEffect, useState, useRef } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Pagination,
  Box,
  Paper,
} from "@mui/material";
import SearchBar from "./components/SearchBar";

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

      {/* List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort("name")}>
                  <b>Name</b>
                </TableCell>
                <TableCell onClick={() => handleSort("current_price")}>
                  <b>Price (AUD)</b>
                </TableCell>
                <TableCell onClick={() => handleSort("total_volume")}>
                  <b>24h Volume</b>
                </TableCell>
                <TableCell onClick={() => handleSort("market_cap")}>
                  <b>Market Cap</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coins.map((coin) => (
                <TableRow
                  key={coin.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => router.push(`/coin/${coin.id}`)}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img
                        src={coin.image}
                        alt={coin.name}
                        width={24}
                        height={24}
                      />
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </Box>
                  </TableCell>
                  <TableCell>
                    {coin.current_price != null
                      ? `$${coin.current_price.toLocaleString(undefined, {
                          maximumFractionDigits: 8,
                        })}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {coin.total_volume != null
                      ? `$${coin.total_volume.toLocaleString(undefined, {
                          maximumFractionDigits: 8,
                        })}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {coin.market_cap != null
                      ? `$${coin.market_cap.toLocaleString(undefined, {
                          maximumFractionDigits: 8,
                        })}`
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Page Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => {
            setError(null);
            setPage(value);
          }}
          color="primary"
          variant="outlined"
          shape="rounded"
        />
      </Box>
    </Container>
  );
}
