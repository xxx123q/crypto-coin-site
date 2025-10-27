"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Homepage() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const currency = "usd";
      const order = "market_cap_desc";
      const pageNumber = 1;
      const perPage = 50;
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${order}&per_page=${perPage}&page=${pageNumber}`
      );
      const data = await res.json();
      setCoins(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Cryto List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>24h volume</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id}>
              <td>
                <Link href={`/coin/${coin.id}`}>{coin.name}</Link>
              </td>
              <td>{coin.symbol}</td>
              <td>${coin.current_price}</td>
              <td>${coin.total_volume}</td>
              <td>${coin.market_cap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
