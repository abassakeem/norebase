

import React, { useState, useEffect } from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import CryptoModal from "./components/modal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import img from "./assets/Logo.svg";
import "./App.css";

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  //data for the graph
  const generateMockHistoricalData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => {
      return {
        day,
        BTC: Math.random() * 2000 + 40000,
        ETH: Math.random() * 200 + 2000,
        BNB: Math.random() * 50 + 300,
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://api.coinlore.net/api/tickers/");
        const data = await response.json();
        setCryptoData(data.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch cryptocurrency data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const startIndex = currentPage * itemsPerPage;
  const displayedData = cryptoData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(cryptoData.length / itemsPerPage);
  const top3Coins = cryptoData.slice(0, 3);

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${formatNumber(marketCap)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto p-6 bg-transparent rounded-lg ">
        <div className="text-center text-gray-300">CryptoBoard Loading cryptocurrency data...</div>
      </div>
    </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <nav className="bg-transparent shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <img className="h-8 w-auto" src={img} alt="Company Logo" />
            </div>
          </div>
        </div>
      </nav>
      <div className="w-full nb-wrapper max-w-5xl mx-auto space-y-6">
        <div className="rounded-lg p-6">
          <h2 className="text-xl font-bold top-text mb-4 card-header">TOP</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {top3Coins.map((coin) => (
              <div key={coin.id} className="p-4 rounded-lg top-cards">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-xs font-medium">
                    {coin.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <h3 className="coin-name">{coin.name}</h3>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="coin-price font-bold">
                    ${formatNumber(coin.price_usd)}
                  </p>
                  <div className="flex items-center gap-1">
                    {parseFloat(coin.percent_change_24h) > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={
                        parseFloat(coin.percent_change_24h) > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {formatNumber(coin.percent_change_24h)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-ctn p-6">
          <h2 className="text-xl font-bold mb-6">All Cryptocurrencies</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-3 text-left t-head">Rank</th>
                  <th className="p-3 text-left t-head">Name</th>
                  <th className="p-3 text-right t-head">Price</th>
                  <th className="p-3 text-right t-head">24h Change</th>
                  <th className="p-3 text-right t-head">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.map((coin) => (
                  <tr
                    key={coin.id}
                    className="cursor-pointer t-row"
                    onClick={() => {
                      setSelectedCoin(coin);
                      setIsModalOpen(true);
                    }}
                  >
                    <td className="p-3">{coin.rank}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                          <span className="font-bold text-white">
                            {coin.name}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {coin.symbol}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      ${formatNumber(coin.price_usd)}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {parseFloat(coin.percent_change_24h) > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span
                          className={
                            parseFloat(coin.percent_change_24h) > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {formatNumber(coin.percent_change_24h)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      {formatMarketCap(coin.market_cap_usd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Page {currentPage + 1} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                }
                disabled={currentPage === totalPages - 1}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <CryptoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        coin={selectedCoin}
      />
    </>
  );
}


export default App;


// design inspiration from Wahib iravan https://www.figma.com/community/file/988993272421138911/cryptoboard-cryptocurrency-dashboard