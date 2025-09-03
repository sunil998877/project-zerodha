import React, { useState, useContext } from "react";
import { Tooltip, Grow } from "@mui/material";
import { watchlist } from "../data/data";
import { BarChartOutlined, KeyboardArrowDown, KeyboardArrowUp, MoreHoriz } from "@mui/icons-material";
import GeneralContext from "./GeneralContext";
import { DoughnoutChart } from "./DoughnoutChart";
const WatchList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStocks, setFilteredStocks] = useState(watchlist);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setFilteredStocks(watchlist);
    } else {
      const filtered = watchlist.filter(stock => 
        stock.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredStocks(filtered);
    }
  };
  // Create doughnut chart data from filtered stocks
  const chartData = filteredStocks.length > 0 ? {
    labels: filteredStocks.map(stock => stock.name),
    datasets: [
      {
        label: 'Stock Prices',
        data: filteredStocks.map(stock => {
          // Extract numeric price value, remove any currency symbols
          const priceStr = stock.price.toString();
          const numericPrice = parseFloat(priceStr.replace(/[^\d.-]/g, ''));
          return isNaN(numericPrice) ? 0 : numericPrice;
        }),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      }
    ]
  } : null;

  // Debug logging
  console.log('Chart data:', chartData);
  console.log('Filtered stocks:', filteredStocks);

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search stocks..."
          className="search"
          value={searchTerm}
          onChange={handleSearch}
        />
        <span className="counts"> {filteredStocks.length} /50</span>
      </div>
      <ul className="list">
        {filteredStocks.map((stock, index) => {
          return <WatchListItem key={index} stock={stock} />;
        })}
      </ul>

      {chartData && (
        <div className="chart-container">
          <h4>Stock Price Distribution</h4>
          <DoughnoutChart data={chartData} />
        </div>
      )}
    </div>
  );
};

export default WatchList;
const WatchListItem = ({ stock }) => {
  const [showWatchlistAction, setShowWatchlistAction] = useState(false);
  const handleMouseEnter = (e) => {
    setShowWatchlistAction(true);
  };
  const handleMouseLeave = (e) => {
    setShowWatchlistAction(false);
  };
  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <span className={stock.isDown ? "down" : "up"}>{stock.name}</span>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className=" down" />
          ) : (
            <KeyboardArrowUp className=" up" />
          )}
          <span className="price">{stock.price}</span>
        </div>
      </div>
      {showWatchlistAction && <WatchListAction uid={stock.name} />}
    </li>
  );
};

const WatchListAction = ({ uid }) => {
  const { openBuyWindow, openSellWindow } = useContext(GeneralContext);

  const handleBuyClick = () => {
    openBuyWindow(uid);
  };

  const handleSellClick = () => {
    openSellWindow(uid);
  };

  return (
    <span className="actions">
     <span>
        <Tooltip 
          title="Buy (B)"
          placement="top"
          TransitionComponent={Grow}
         >
          <button className="buy" onClick={handleBuyClick}>Buy</button>
        </Tooltip>
        <Tooltip 
          title="Sell (S)"
          placement="top"
          TransitionComponent={Grow}
         >
          <button className="sell" onClick={handleSellClick}>Sell</button>
        </Tooltip>
        <Tooltip 
          title="Analytics (A)"
          placement="top"
          TransitionComponent={Grow}
         >
          <button className="action">

          <BarChartOutlined className="icon"/>
          </button>
        </Tooltip>
        <Tooltip 
          title="More (M)"
          placement="top"
          TransitionComponent={Grow}
         >
          <button className="action">
            <MoreHoriz className="icon"/>
          </button>
        </Tooltip>

       
     </span>
     </span>
  );
};
