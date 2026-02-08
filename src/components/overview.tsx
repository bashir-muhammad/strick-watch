"use client";
import { formatStrike, formatDate, formatUSD } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";
import {
  fetchExchangeInfo,
  fetchIndexPrice,
  selectInstruments,
  type SelectedExpiry,
} from "../lib/binance";
import { getStrikeRows } from "@/lib/utils";
import HighlightCard from "./highlight-card";
import InfoCard from "./info-card";
import StrikeRow from "./strike-row";
import { HeaderControls, type Base } from "./header-control";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";

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
    <div className="bg-background mx-auto w-full">
      <HeaderControls
        base={base}
        loading={loading}
        onBaseChange={setBase}
        onRefresh={loadData}
      />

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

          <Card className="overflow-hidden">
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
                    <StrikeRow key={row.strike} {...row} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

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
