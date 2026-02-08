import { NextResponse } from "next/server";

const BASE = process.env.BINANCE_API_URL || "https://eapi.binance.com";

export async function GET() {
  const response = await fetch(`${BASE}/eapi/v1/exchangeInfo`, {
    cache: "no-store",
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
