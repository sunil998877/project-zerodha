
import { useState, useEffect } from "react";
import axios from "axios";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:5000/allPositions")
      .then((res) => {
        setAllPositions(res.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Positions:", err);
        setAllPositions([]);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <h3 className="title">Positions</h3>
        <p>Loading positions data...</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>
      
      {allPositions.length === 0 ? (
        <div className="no-data">
          <p>No positions data available</p>
        </div>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>product</th>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Avg.</th>
                <th>PTP</th>
                <th>P&L</th>
                <th>Chg.</th>
              </tr>
            </thead>
            <tbody>
              {allPositions.map((stock, index) => {
                const price = typeof stock.price === "number" ? stock.price : 0;
                const qty = typeof stock.qty === "number" ? stock.qty : 0;
                const avg = typeof stock.avg === "number" ? stock.avg : 0;
                const curValue = price * qty;
                const isProfit = curValue - avg * qty >= 0.0;
                const profClass = isProfit ? "profit" : "loss";
                const dayClass = stock.isLoss ? "loss" : "profit";

                return (
                  <tr key={index}>
                    <td>{stock.product || stock.Product || "-"}</td>
                    <td>{stock.name}</td>
                    <td>{qty}</td>
                    <td>{avg.toFixed(2)}</td>
                    <td>{price.toFixed(2)}</td>
                    
                    <td className={profClass}>
                      {(curValue - avg * qty).toFixed(2)}
                    </td>
                   
                    <td className={dayClass}>{stock.day}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Positions;
