"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GiGoldBar } from "react-icons/gi";
import { MdChangeCircle, MdOutlinePriceChange } from "react-icons/md";
import { RiExchangeDollarFill, RiForbidFill } from "react-icons/ri";
import { PiMaskHappyBold } from "react-icons/pi";
import { LuArrowUpDown } from "react-icons/lu";
import { BsCurrencyExchange } from "react-icons/bs";

export default function GoldHome() {
  //  State variable for gold data, loading status, and error handling
  const [goldList, setGoldList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gold data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api?action=metals");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setGoldList(data);
      } catch (err) {
        console.error("Error fetching gold: ", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>
              <BsCurrencyExchange color="#add8e6" /> Gold Price Tracker
            </h1>
            <p>Real-time gold prices and market data</p>
          </div>

          <div className="view-toggle ">
            <Link
              href="/"
              className="back-button"
            >
              Go Back
            </Link>
          </div>
        </div>
      </header>
      {isLoading ? (
        <div className="loading">
          <div className="spinner" />
          <p>Loading gold data...</p>
        </div>
      ) : error ? (
        <div className="error">
          <p>Error: {error}</p>
        </div>
      ) : goldList ? (
        <div className="gold-container list">
          {/* Render the single gold data object as a card/item */}
          <div className="gold-card">
            <div className="gold-header">
              <div className="gold-info">
                <GiGoldBar
                  color="#c3bb21ff"
                  size={50}
                />
                <h2>
                  {goldList.metal.toUpperCase()} &quot;{goldList.currency}&quot;
                </h2>
              </div>
            </div>
            <div className="gold-details">
              <p className="crypto-price">
                <strong className="price">Current Price: </strong> $
                {goldList.rate.price.toFixed(0)} {goldList.currency}
              </p>
              <p>
                <PiMaskHappyBold
                  size={25}
                  color="#1f943aff"
                />
                <strong>Ask:</strong> ${goldList.rate.ask.toFixed(0)}
              </p>
              <p>
                <RiForbidFill
                  size={25}
                  color="#1f5f94ff"
                />
                <strong>Bid:</strong> ${goldList.rate.bid.toFixed(0)}
              </p>
              <p>
                <MdChangeCircle size={25} />
                <strong>Change:</strong> ${goldList.rate.change.toFixed(0)} (
                {goldList.rate.change_percent}
                %)
              </p>
              <p>
                <LuArrowUpDown size={25} />
                <strong>High/Low:</strong> ${goldList.rate.high.toFixed(0)} / $
                {goldList.rate.low.toFixed(0)}
              </p>
              <p>
                <MdOutlinePriceChange
                  size={25}
                  color="#1f943aff"
                />
                <strong>Open Price:</strong> ${goldList.rate.price.toFixed(0)}
              </p>

              <p>
                <RiExchangeDollarFill
                  size={25}
                  color="#1f5f94ff"
                />
                <strong>Last Updated:</strong>{" "}
                {goldList.timestamp.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-data">
          <p>No gold data available.</p>
        </div>
      )}
    </div>
  );
}
