"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";

export default function CoinDetail({ params }) {
  const { id } = use(params);
  const [coin, setCoin] = useState(null);

  useEffect(() => {
    async function fetchCoinData() {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false`
      );
      const data = await res.json();
      setCoin(data);
    }
    fetchCoinData();
  }, [id]);

  if (!coin) return null;

  return (
    <div>
      <Link href="/">back</Link>
      <p>
        {coin.name} {coin.symbol}
      </p>
      <p>{coin.description.en}</p>
    </div>
  );
}
