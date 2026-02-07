"use client";
import { useEffect } from "react";
import { fetchExchangeInfo, fetchIndexPrice } from "../lib/binance";

export default function Overview() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const exchangeInfo = await fetchExchangeInfo();
        const indexPrice = await fetchIndexPrice("BTCUSDT");
        console.log("Exchange Info:", exchangeInfo);
        console.log("Index Price:", indexPrice);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h2>Overview</h2>
      </main>
    </div>
  );
}
