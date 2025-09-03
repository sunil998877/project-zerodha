import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleSellClick = () => {
    if (stockPrice <= 0 || stockQuantity <= 0) {
      return; // Don't proceed if invalid values
    }
    
    setIsPlacingOrder(true);
    
    // Place order
    axios.post("http://localhost:5000/newOrder", {
      name: uid,
      qty: stockQuantity,
      price: stockPrice,
      mode: "SELL",
    })
    .then(response => {
      console.log("Sell order placed successfully:", response.data);
      setIsPlacingOrder(false);
      GeneralContext.closeSellWindow();
    })
    .catch(error => {
      console.error("Error placing sell order:", error);
      setIsPlacingOrder(false);
      // Silently handle error without showing alert to user
    });
  };

  const handleCancelClick = () => {
    GeneralContext.closeSellWindow();
  };

  return (
    <div className="container" id="sell-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(parseInt(e.target.value) || 1)}
              value={stockQuantity}
              style={{ borderColor: stockQuantity <= 0 ? '#ff4444' : '#ddd' }}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="0.01"
              onChange={(e) => setStockPrice(parseFloat(e.target.value) || 0)}
              value={stockPrice}
              style={{ borderColor: stockPrice <= 0 ? '#ff4444' : '#ddd' }}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link className="btn btn-red" onClick={handleSellClick} style={{ opacity: isPlacingOrder ? 0.7 : 1 }}>
            {isPlacingOrder ? "Placing..." : "Sell"}
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
