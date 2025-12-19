"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import CryptoCard from "./cryptocard/page.jsx";
import { BsCurrencyExchange } from "react-icons/bs";

export default function Page() {
  const [cryptoList, setCryptoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("market_cap_rank");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch crypto data every 2 seconds
  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 2000);

    return () => clearInterval(interval);
  }, []);

  // Filter and sort whenever sortBy, cryptoList, or searchQuery changes
  useEffect(() => {
    filterAndSort();
  }, [sortBy, cryptoList, searchQuery]);

  // Function to fetch crypto data
  const fetchCryptoData = async () => {
    try {
      const response = await fetch("/api?action=cryptos");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Ensure data is an array
      if (Array.isArray(data)) {
        setCryptoList(data);
      } else {
        console.error("Expected array but got:", typeof data, data);
        setCryptoList([]);
      }
    } catch (err) {
      console.error("Error fetching crypto: ", err);
      setCryptoList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to filter and sort the crypto list
  const filterAndSort = () => {
    // Guard against non-array cryptoList
    if (!Array.isArray(cryptoList)) {
      setFilteredList([]);
      return;
    }

    let filtered = cryptoList.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.current_price - b.current_price;
        case "price_desc":
          return b.current_price - a.current_price;
        case "change":
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
        case "market_cap":
          return a.market_cap - b.market_cap;
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });

    setFilteredList(filtered);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>
              <BsCurrencyExchange color="#add8e6" /> Crypto Price Tracker
            </h1>
            <p>Real-time crypto currency prices and market data</p>
          </div>
          <div className="search-section">
            <input
              type="text"
              placeholder="Search cryptos..."
              className="search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>
      </header>
      <div className="controls">
        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="market_cap_rank">Rank</option>
            <option value="name">Name</option>
            <option value="price">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="change">24h Change</option>
            <option
              value="market_cap"
              className="opt"
            >
              Market Cap
            </option>
          </select>
        </div>

        <div className="view-toggle">
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
          <Link
            href="/"
            className="back-button"
          >
            Go Back
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner" />
          <p>Loading crypto data...</p>
        </div>
      ) : (
        <div className={`crypto-container ${viewMode}`}>
          {filteredList.map((crypto) => (
            <CryptoCard
              key={crypto.id}
              crypto={crypto}
            />
          ))}
        </div>
      )}
    </div>
  );
}
