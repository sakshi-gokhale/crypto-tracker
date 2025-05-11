import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './CoinDetails.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CoinDetails = () => {
  const { coinId } = useParams();
  const [coinDetails, setCoinDetails] = useState(null);
  const [priceHistory, setPriceHistory] = useState(null);
  const [currency, setCurrency] = useState('usd');
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getCurrencySymbol = (curr) => (curr === 'inr' ? '₹' : '$');

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const data = await response.json();
        setCoinDetails(data);
      } catch (error) {
        console.error('Failed to fetch coin details:', error);
      }
    };

    fetchCoinDetails();
  }, [coinId]);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=30&interval=daily`
        );
        const data = await response.json();
        setPriceHistory(data.prices);
      } catch (error) {
        console.error('Failed to fetch price history:', error);
      }
    };

    if (coinId) fetchPriceHistory();
  }, [coinId, currency]);

  if (!coinDetails || !priceHistory) return <div>Loading...</div>;

  const chartData = {
    labels: priceHistory.map(([timestamp]) => new Date(timestamp).toLocaleDateString()),
    datasets: [
      {
        label: `Price in ${currency.toUpperCase()}`,
        data: priceHistory.map(([, price]) => price),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Strip HTML tags from description and truncate
  const plainDescription = coinDetails.description.en?.replace(/<[^>]+>/g, '') || 'No description available.';
  const shortDescription = plainDescription.slice(0, 300) + (plainDescription.length > 300 ? '...' : '');

  return (
    <div className="coin-details-container">
      <div className="coin-header">
        <img src={coinDetails.image.large} alt={coinDetails.name} className="coin-logo" />
        <div className="coin-header-info">
          <h1>{coinDetails.name} ({coinDetails.symbol.toUpperCase()})</h1>

          <div>
            <label>Currency: </label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="usd">USD</option>
              <option value="inr">INR</option>
            </select>
          </div>

          <div className="coin-price">
            <p><strong>Current Price:</strong> {getCurrencySymbol(currency)}{coinDetails.market_data.current_price[currency].toLocaleString()}</p>
            <p><strong>Market Cap:</strong> {getCurrencySymbol(currency)}{coinDetails.market_data.market_cap[currency].toLocaleString()}</p>
            <p><strong>All Time High:</strong> {getCurrencySymbol(currency)}{coinDetails.market_data.ath[currency].toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="coin-description">
        <h2>About {coinDetails.name}</h2>
        <p>{showFullDescription ? plainDescription : shortDescription}</p>
        {plainDescription.length > 300 && (
          <button onClick={() => setShowFullDescription(!showFullDescription)} className="toggle-button">
            {showFullDescription ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>

      <div className="coin-stats">
        <h3>Additional Information</h3>
        <ul>
          <li>Rank: #{coinDetails.market_data.market_cap_rank.toLocaleString()}</li>
          <li>Circulating Supply: {coinDetails.market_data.circulating_supply.toLocaleString()}</li>
          <li>Max Supply: {coinDetails.market_data.max_supply ? coinDetails.market_data.max_supply.toLocaleString() : 'N/A'}</li>
          <li>Price Change (24h): {coinDetails.market_data.price_change_percentage_24h.toFixed(2)}%</li>
        </ul>
      </div>

      <div className="coin-chart">
        <h2>Price History (Last 30 Days)</h2>
        <div className="chart">
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;
