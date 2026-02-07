import { NextResponse } from "next/server";

const BASE = "https://eapi.binance.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const underlying = searchParams.get("underlying");
  const query = underlying
    ? `?underlying=${encodeURIComponent(underlying)}`
    : "";

  const response = await fetch(`${BASE}/eapi/v1/index${query}`, {
    cache: "no-store",
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
