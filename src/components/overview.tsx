"use client";
import { formatStrike, formatDate, formatUSD } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import {
  fetchExchangeInfo,
  fetchIndexPrice,
  selectInstruments,
  type SelectedExpiry,
} from "../lib/binance";
import { getStrikeRows } from "@/lib/utils";
import HighlightCard from "./highlight-card";
import InfoCard from "./info-card";

const BASES = ["BTC", "ETH"] as const;
type Base = (typeof BASES)[number];

export default function Overview() {
  const [base, setBase] = useState<Base>("BTC");
  const [data, setData] = useState<SelectedExpiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [info, idx] = await Promise.all([
        fetchExchangeInfo(),
        fetchIndexPrice(`${base}USDT`),
      ]);
      const result = selectInstruments(
        info.optionSymbols,
        base,
        idx,
        info.serverTime,
      );
      setData(result);
      setLastUpdate(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="bg-background">
      <header className="mb-6 w-full flex items-center justify-between flex-wrap gap-4 ">
        <div>
          <h1 className="text-2xl font-sans font-semibold text-foreground tracking-tight">
            Options Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live instruments · Binance European Options
          </p>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex ring-foreground/50 ring-1 rounded-md overflow-hidden">
            {BASES.map((b) => (
              <button
                key={b}
                onClick={() => setBase(b)}
                className={`px-4 py-1.5 text-sm transition-colors hover:cursor-pointer ${
                  base === b
                    ? "bg-gray-200 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-2.5 text-sm ring-foreground/50 ring-1 rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </header>

      {error && (
        <div className="p-4 rounded-md bg-accent/10 border border-accent text-accent mb-6 text-sm">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="flex items-center justify-center py-20">
          <div className="text-muted-foreground animate-pulse-glow text-sm">
            Loading instruments…
          </div>
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <InfoCard
              label="Index Price"
              value={`$${formatUSD(data.indexPrice)}`}
            />
            <InfoCard label="Expiry" value={formatDate(data.expiryDate)} mono />
            <InfoCard
              label="Target Strike (×1.25)"
              value={`$${formatUSD(data.targetStrike)}`}
              accent
            />
            <InfoCard
              label="Instruments"
              value={`${data.instruments.length}`}
              sub={`${data.instruments.filter((i) => i.side === "CALL").length}C / ${data.instruments.filter((i) => i.side === "PUT").length}P`}
            />
          </div>

          {(data.highlightedCall || data.highlightedPut) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {data.highlightedCall && (
                <HighlightCard instrument={data.highlightedCall} type="CALL" />
              )}
              {data.highlightedPut && (
                <HighlightCard instrument={data.highlightedPut} type="PUT" />
              )}
            </div>
          )}

          <div className="ring-foreground/10 ring-1 rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                      Strike
                    </th>
                    <th className="text-center px-4 py-2.5 text-call font-medium text-xs uppercase tracking-wider">
                      Call
                    </th>
                    <th className="text-center px-4 py-2.5 text-put font-medium text-xs uppercase tracking-wider">
                      Put
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getStrikeRows(data).map((row) => (
                    <tr
                      key={row.strike}
                      className={`border-t border-border transition-colors ${
                        row.isHighlighted
                          ? "bg-highlight border-highlight"
                          : "hover:bg-secondary/30"
                      }`}
                    >
                      <td
                        className={`px-4 py-2 font-mono ${row.isHighlighted ? "text-highlight font-semibold" : "text-foreground"}`}
                      >
                        {formatStrike(row.strike)}
                        {row.isHighlighted && (
                          <span className="ml-2 text-xs text-highlight opacity-70">
                            ★
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {row.call ? (
                          <span
                            className={`font-mono ${row.callHighlighted ? "text-highlight font-bold" : "text-call"}`}
                          >
                            {row.call.symbol.split("-").slice(-1)[0] === "C"
                              ? "●"
                              : ""}
                            {" " + row.call.symbol}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {row.put ? (
                          <span
                            className={`font-mono ${row.putHighlighted ? "text-highlight font-bold" : "text-put"}`}
                          >
                            {row.put.symbol}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Updated{" "}
              {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : "—"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
              Auto-refresh 30s
            </span>
          </div>
        </>
      )}
    </div>
  );
}

