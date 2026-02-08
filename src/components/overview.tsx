"use client";
import { useEffect, useState } from "react";
import {
  fetchExchangeInfo,
  fetchIndexPrice,
  selectInstruments,
  type SelectedExpiry,
} from "../lib/binance";

function formatUSD(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatStrike(s: string): string {
  return parseFloat(s).toLocaleString("en-US");
}

export default function Overview() {
  const [exchangeInfo, setExchangeInfo] = useState<SelectedExpiry | null>(null);
  const [indexPrice, setIndexPrice] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [exchangeInfo, indexPrice] = await Promise.all([
          fetchExchangeInfo(),
          fetchIndexPrice("BTCUSDT"),
        ]);

        setIndexPrice(indexPrice);

        const result = selectInstruments(
          exchangeInfo.optionSymbols,
          "BTC",
          indexPrice,
          exchangeInfo.serverTime,
        );

        setExchangeInfo(result);
        console.log("Selected Instruments:", result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="">
      <h2>Overview</h2>
      <div>
        <p>Exchange instruments: {JSON.stringify(exchangeInfo?.instruments)}</p>
        <div>
          <p>expiryDate: {exchangeInfo?.expiryDate ?? "N/A"}</p>
          <p>indexPrice: ${formatUSD(exchangeInfo?.indexPrice ?? 0)}</p>
          <p>instruments: {JSON.stringify(exchangeInfo?.instruments)}</p>
          <p>Target Strike: {formatUSD(exchangeInfo?.targetStrike ?? 0)}</p>
          <p>
            Highlighted Call:{" "}
            {exchangeInfo?.highlightedCall
              ? formatStrike(exchangeInfo.highlightedCall)
              : "N/A"}
          </p>
          <p>
            Highlighted Put:{" "}
            {exchangeInfo?.highlightedPut
              ? formatStrike(exchangeInfo.highlightedPut)
              : "N/A"}
          </p>
        </div>
        <p>Index Price: {indexPrice}</p>
      </div>
    </div>
  );
}
