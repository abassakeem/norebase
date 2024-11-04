import React from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CryptoModal = ({ isOpen, onClose, coin }) => {
  if (!isOpen || !coin) return null;

  // Generate mock historical data for the chart
  const historicalData = Array.from({ length: 7 }, (_, i) => ({
    day: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
    price: parseFloat(coin.price_usd) * (1 + (Math.random() * 0.1 - 0.05))
  }));

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-gray-800 rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-4  border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-gray-300">{coin.symbol.slice(0, 3)}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-300">{coin.name}</h3>
              <span className="text-gray-400">{coin.symbol}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-2">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-gray-300">${formatNumber(coin.price_usd)}</span>
              <div className="flex items-center gap-1">
                {parseFloat(coin.percent_change_24h) > 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
                <span
                  className={`text-lg ${
                    parseFloat(coin.percent_change_24h) > 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {formatNumber(coin.percent_change_24h)}%
                </span>
              </div>
            </div>

            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <XAxis dataKey="day" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 mb-1">Market Cap</div>
                <div className="text-md font-bold text-gray-300">
                  {formatMarketCap(coin.market_cap_usd)}
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 mb-1">24h Volume</div>
                <div className="text-md font-bold text-gray-300">
                  ${formatNumber(coin.volume24)}
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 mb-1">Available Supply</div>
                <div className="text-md font-bold text-gray-300">
                  {formatNumber(coin.csupply)} {coin.symbol}
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 mb-1">Total Supply</div>
                <div className="text-md font-bold text-gray-300">
                  {formatNumber(coin.tsupply)} {coin.symbol}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoModal;