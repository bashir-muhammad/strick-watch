const BASE = "/api/binance";

export async function fetchExchangeInfo(): Promise<unknown> {
  const response = await fetch(`${BASE}/exchange-info`);
  const data = await response.json();

  return data;
}

export async function fetchIndexPrice(underlying: string): Promise<number> {
  const response = await fetch(
    `${BASE}/index?underlying=${encodeURIComponent(underlying)}`,
  );
  const data = await response.json();

  return parseFloat(data.indexPrice);
}
