import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type SelectedExpiry } from "../lib/binance";
interface StrikeRow {
  strike: string;
  call: { symbol: string } | null;
  put: { symbol: string } | null;
  isHighlighted: boolean;
  callHighlighted: boolean;
  putHighlighted: boolean;
}

const formatStrike = (s: string): string => {
  return parseFloat(s).toLocaleString("en-US");
};

const formatDate = (ts: number): string => {
  const d = new Date(ts);
  return d.toUTCString().replace("GMT", "UTC");
};

const formatUSD = (n: number): string => {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getStrikeRows = (data: SelectedExpiry): StrikeRow[] => {
  const strikeMap = new Map<
    string,
    {
      numeric: number;
      call: { symbol: string } | null;
      put: { symbol: string } | null;
    }
  >();

  for (const inst of data.instruments) {
    const key = inst.strikePrice;
    if (!strikeMap.has(key)) {
      strikeMap.set(key, { numeric: parseFloat(key), call: null, put: null });
    }
    const entry = strikeMap.get(key)!;
    if (inst.side === "CALL") entry.call = inst;
    else entry.put = inst;
  }

  const highlightedCallStrike = data.highlightedCall?.strikePrice;
  const highlightedPutStrike = data.highlightedPut?.strikePrice;

  return Array.from(strikeMap.entries())
    .sort(([, a], [, b]) => a.numeric - b.numeric)
    .map(([strike, { call, put }]) => ({
      strike,
      call,
      put,
      isHighlighted:
        strike === highlightedCallStrike || strike === highlightedPutStrike,
      callHighlighted: strike === highlightedCallStrike,
      putHighlighted: strike === highlightedPutStrike,
    }));
};

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export { formatStrike, formatDate, formatUSD, getStrikeRows, cn };
