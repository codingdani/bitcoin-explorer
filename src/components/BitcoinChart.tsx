import React, { useEffect, useState } from "react";
import {
  getBitcoinPrice,
  getHistoricalBitcoinPrices,
} from "../utils/api_interaction";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import "../styles/bitcoinchart.css";

// Chart.js registrieren
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export default function BitcoinChart() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBitcoinPrice = async () => {
    const price = await getBitcoinPrice();
    if (price) {
      setBtcPrice(price);
    }
  };

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const prices = await getHistoricalBitcoinPrices(7);
        if (prices) {
          setPriceHistory(prices.map((entry) => entry.price));
          setTimestamps(prices.map((entry) => entry.time));
        } else {
          throw new Error("Keine Preisdaten verfügbar.");
        }
      } catch (err) {
        console.error("API-Fehler:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPriceHistory();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        fetchBitcoinPrice();
      } catch (error) {
        console.log(error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: "Bitcoin Preis (USD)",
        data: priceHistory,
        borderColor: "#ff9900",
        backgroundColor: "rgba(255, 153, 0, 0.2)",
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="bitcoin-chart-container">
      <h2>Bitcoin Preis</h2>
      <p className="bitcoin-price">
        Aktueller BTC-Preis:{" "}
        {btcPrice ? `$${btcPrice.toLocaleString()}` : "Lade Preis..."}
      </p>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
