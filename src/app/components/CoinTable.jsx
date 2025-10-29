"use client";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function CoinTable({ coins, handleSort }) {
  const router = useRouter();

  return (
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
  );
}
