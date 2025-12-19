import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.coingecko.com/api/v3";
const METALS_API_KEY = process.env.NEXT_PUBLIC_METALS_API_KEY;

// GET handler for the API route
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const id = searchParams.get("id");

  try {
    switch (action) {
      case "cryptos":
        return await handleFetchCryptos();

      case "coin":
        if (!id) {
          return NextResponse.json(
            { error: "Coin ID is required" },
            { status: 400 }
          );
        }
        return await handleFetchCoinsData(id);

      case "chart":
        if (!id) {
          return NextResponse.json(
            { error: "Coin ID is required" },
            { status: 400 }
          );
        }
        return await handleFetchChartData(id);

      case "metals":
        return await handleFetchMetalRates();

      default:
        return NextResponse.json(
          { error: "Invalid action parameter" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

// Fetch list of cryptocurrencies with market data
async function handleFetchCryptos() {
  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100`,
    { next: { revalidate: 60 } } // Cache for 60 seconds
  );

  if (!response.ok) {
    throw new Error("Failed to fetch coin data");
  }

  const data = await response.json();
  return NextResponse.json(data);
}

// Fetch detailed data for a specific cryptocurrency by ID
async function handleFetchCoinsData(id: string) {
  const response = await fetch(
    `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch coin data");
  }

  const data = await response.json();
  return NextResponse.json(data);
}

// Fetch market chart data for a specific cryptocurrency by ID
async function handleFetchChartData(id: string) {
  const response = await fetch(
    `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=7`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chart data");
  }

  const data = await response.json();
  return NextResponse.json(data);
}

// Fetch current metal rates (gold)
async function handleFetchMetalRates() {
  const url = `https://api.metals.dev/v1/metal/spot?api_key=${METALS_API_KEY}&metal=gold&currency=USD`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error("Failed to fetch metal rates");
  }

  const result = await response.json();
  return NextResponse.json(result);
}
