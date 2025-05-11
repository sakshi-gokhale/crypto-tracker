import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState('usd');
  const [search, setSearch] = useState('');
  const [searchedCoin, setSearchedCoin] = useState(null);

  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1&sparkline=false`)
      .then(res => res.json())
      .then(data => setCoins(data));
  }, [currency]);

  const handleSearch = () => {
    if (!search.trim()) return;
    fetch(`https://api.coingecko.com/api/v3/coins/${search.toLowerCase()}`)
      .then(res => {
        if (!res.ok) throw new Error('Coin not found');
        return res.json();
      })
      .then(data => setSearchedCoin(data))
      .catch(() => setSearchedCoin(null));
  };

  const getCurrencySymbol = (curr) => {
    switch (curr) {
      case 'usd': return '$';
      case 'inr': return '₹';
      default: return '';
    }
  };

  return (
    <div className="App">
      <h1>Crypto Tracker</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search coin by name (e.g., bitcoin)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        <select onChange={(e) => setCurrency(e.target.value)} value={currency}>
          <option value="usd">USD</option>
          <option value="inr">INR</option>
        </select>
      </div>

      <table className="coins-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Logo</th>
            <th>Coin</th>
            <th>Market Price ({currency.toUpperCase()})</th>
            <th>24h Change</th>
          </tr>
        </thead>
        <tbody>
          {searchedCoin ? (
            <tr key={searchedCoin.id}>
              <td>{searchedCoin.market_cap_rank}</td>
              <td>
                <img src={searchedCoin.image.small} alt={searchedCoin.name} width="25" height="25" />
              </td>
              <td>
                <Link to={`/coin/${searchedCoin.id}`}>
                  {searchedCoin.name} ({searchedCoin.symbol.toUpperCase()})
                </Link>
              </td>
              <td>{getCurrencySymbol(currency)}{searchedCoin.market_data.current_price[currency].toLocaleString()}</td>
              <td className={searchedCoin.market_data.price_change_percentage_24h >= 0 ? 'positive-change' : 'negative-change'}>
                {searchedCoin.market_data.price_change_percentage_24h?.toFixed(2)}%
              </td>
            </tr>
          ) : (
            coins.map((coin) => (
              <tr key={coin.id}>
                <td>{coin.market_cap_rank}</td>
                <td>
                  <img src={coin.image} alt={coin.name} width="25" height="25" />
                </td>
                <td>
                  <Link to={`/coin/${coin.id}`}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </Link>
                </td>
                <td>{getCurrencySymbol(currency)}{coin.current_price.toLocaleString()}</td>
                <td className={coin.price_change_percentage_24h >= 0 ? 'positive-change' : 'negative-change'}>
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;