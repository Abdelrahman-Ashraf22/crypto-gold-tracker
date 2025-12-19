"use client";

import { useEffect, useState } from "react";
import { formatMarketCap, formatPrice } from "../../utils/formatter.js";
import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  Tooltip,
} from "recharts";
import Image from "next/image";
import Link from "next/link.js";
import { use } from "react";
import { BsCurrencyExchange } from "react-icons/bs";

function CoinDetail({ params }) {
  const { id } = use(params);
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(false);

      try {
        // Fetch both coin data and chart data in parallel
        await Promise.all([loadCoinData(), loadChartData()]);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Function to fetch coins data
  const loadCoinData = async () => {
    try {
      const response = await fetch(`/api?action=coin&id=${id}`);
      // const response = await handleFetchCoinsData(id);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCoin(data);
    } catch (err) {
      console.error("Error fetching coin data: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch chart data
  const loadChartData = async () => {
    try {
      const response = await fetch(`/api?action=chart&id=${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const formattedData = data.prices.map((price) => ({
        time: new Date(price[0]).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: price[1].toFixed(2),
      }));

      setChartData(formattedData);
    } catch (err) {
      console.error("Error fetching crypto: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading coin data...</p>
        </div>
      </div>
    );
  }

  // If coin not found
  if (error || !coin) {
    return (
      <div className="app">
        <div className="no-results">
          <p>Coin not found.</p>
          <Link
            className="back-button"
            href="/cryptohome"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }
  const priceChange = coin.market_data.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>
              <BsCurrencyExchange color="#add8e6" /> Crypto Tracker
            </h1>
            <p>Real-time cryptocurrency prices and market data</p>
          </div>

          <Link
            href="/cryptohome"
            className="back-button"
          >
            ← Back to List
          </Link>
        </div>
      </header>

      <div className="coin-detail">
        <div className="coin-header">
          <div className="coin-title">
            <Image
              src={coin.image.large}
              alt={coin.name}
              width={100}
              height={100}
            />
            <div>
              <h1>{coin.name}</h1>
              <p className="symbol">{coin.symbol.toUpperCase()}</p>
            </div>
          </div>
          <span className="rank">Rank #{coin.market_data.market_cap_rank}</span>
        </div>

        <div className="coin-price-section">
          <div className="current-price">
            <h2>{formatPrice(coin.market_data.current_price.usd)}</h2>
            <span
              className={`change-badge ${isPositive ? "positive" : "negative"}`}
            >
              {isPositive ? "↑" : "↓"} {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>

          <div className="price-ranges">
            <div className="price-range">
              <span className="range-label">24h High</span>
              <span className="range-value">
                {formatPrice(coin.market_data.high_24h.usd)}
              </span>
            </div>
            <div className="price-range">
              <span className="range-label">24h Low</span>
              <span className="range-value">
                {formatPrice(coin.market_data.low_24h.usd)}
              </span>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3>Price Chart (7 Days)</h3>
          <ResponsiveContainer
            width="100%"
            height={400}
          >
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.1)"
              />

              <XAxis
                dataKey="time"
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(20, 20, 40, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#e0e0e0",
                }}
              />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#ADD8E6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">
              ${formatMarketCap(coin.market_data.market_cap.usd)}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Volume (24)</span>
            <span className="stat-value">
              ${formatMarketCap(coin.market_data.total_volume.usd)}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Circulating Supply</span>
            <span className="stat-value">
              {coin.market_data.circulating_supply?.toLocaleString() || "N/A"}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Total Supply</span>
            <span className="stat-value">
              {coin.market_data.total_supply?.toLocaleString() || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoinDetail;
