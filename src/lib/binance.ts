const BASE = "/api/binance";

export interface ExchangeInfoResponse {
  optionSymbols: OptionSymbol[];
  serverTime: number;
}

export async function fetchExchangeInfo(): Promise<ExchangeInfoResponse> {
  const response = await fetch(`${BASE}/exchange-info`);
  if (!response.ok) {
    throw new Error(`Failed to fetch exchange info: ${response.status}`);
  }
  const data = await response.json();

  return data as ExchangeInfoResponse;
}

export async function fetchIndexPrice(underlying: string): Promise<number> {
  const response = await fetch(
    `${BASE}/index?underlying=${encodeURIComponent(underlying)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch index price: ${response.status}`);
  }
  
  const data = await response.json();

  return parseFloat(data.indexPrice);
}

export interface OptionSymbol {
  symbol: string;
  underlying: string;
  baseAsset: string;
  quoteAsset: string;
  unit: number;
  expiryDate: number;
  strikePrice: string;
  side: "CALL" | "PUT";
  tradable: boolean;
}

export interface SelectedExpiry {
  expiryDate: number;
  instruments: OptionSymbol[];
  highlightedCall: OptionSymbol | null;
  highlightedPut: OptionSymbol | null;
  targetStrike: number;
  indexPrice: number;
}

function getNextFridayUTC(now: number): Date {
  const d = new Date(now);
  const day = d.getUTCDay(); // 0=Sun, 5=Fri
  let daysUntilFri = (5 - day + 7) % 7;
  if (daysUntilFri === 0) {
    // If today is Friday, check if expiry already passed (08:00 UTC)
    const expiry = new Date(d);
    expiry.setUTCHours(8, 0, 0, 0);
    if (now >= expiry.getTime()) daysUntilFri = 7;
  }
  const fri = new Date(d);
  fri.setUTCDate(fri.getUTCDate() + daysUntilFri);
  fri.setUTCHours(8, 0, 0, 0);
  return fri;
}

export function selectInstruments(
  symbols: OptionSymbol[],
  baseAsset: string,
  indexPrice: number,
  serverTime: number,
): SelectedExpiry {
  const filtered = symbols.filter((s) => {
    const symbolBase = s.symbol.split("-")[0];
    return symbolBase === baseAsset;
  });

  if (filtered.length === 0) {
    const nextFri = getNextFridayUTC(serverTime).getTime();
    return {
      expiryDate: nextFri,
      instruments: [],
      highlightedCall: null,
      highlightedPut: null,
      targetStrike: indexPrice * 1.25,
      indexPrice,
    };
  }

  // Get unique expiries
  const expiries = [...new Set(filtered.map((s) => s.expiryDate))].sort(
    (a, b) => a - b,
  );

  // Find closest to next Friday
  const nextFri = getNextFridayUTC(serverTime).getTime();
  let bestExpiry = expiries[0];
  let bestDist = Math.abs(expiries[0] - nextFri);
  for (const exp of expiries) {
    const dist = Math.abs(exp - nextFri);
    if (dist < bestDist) {
      bestDist = dist;
      bestExpiry = exp;
    }
  }

  // Get all instruments for this expiry
  const instruments = filtered
    .filter((s) => s.expiryDate === bestExpiry)
    .sort((a, b) => parseFloat(a.strikePrice) - parseFloat(b.strikePrice));

  // Target strike = index * 1.25
  const targetStrike = indexPrice * 1.25;

  // Find closest CALL and PUT to target strike
  const calls = instruments.filter((s) => s.side === "CALL");
  const puts = instruments.filter((s) => s.side === "PUT");

  const findClosest = (list: OptionSymbol[]) => {
    if (list.length === 0) return null;
    let best = list[0];
    let bestD = Math.abs(parseFloat(list[0].strikePrice) - targetStrike);
    for (const s of list) {
      const d = Math.abs(parseFloat(s.strikePrice) - targetStrike);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    return best;
  };

  return {
    expiryDate: bestExpiry,
    instruments,
    highlightedCall: findClosest(calls),
    highlightedPut: findClosest(puts),
    targetStrike,
    indexPrice,
  };
}
