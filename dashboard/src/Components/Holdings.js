import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
// import { holdings } from "../data/data";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:5000/allHoldings")
      .then((res) => {
        setAllHoldings(res.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching holdings:", err);
        setAllHoldings([]);
        setIsLoading(false);
      });
  }, []);

  // Only create chart data if we have holdings
  const chartData = allHoldings.length > 0 ? {
    labels: allHoldings.map((stock) => stock.name),
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(53, 162, 235, 0.6)",
      },
    ],
  } : null;

  

  if (isLoading) {
    return (
      <div className="loading-container">
        <h3 className="title">Holdings</h3>
        <p>Loading holdings data...</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      {allHoldings.length === 0 ? (
        <div className="no-data">
          <p>No holdings data available</p>
        </div>
      ) : (
        <>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. cost</th>
                  <th>LTP</th>
                  <th>Cur. val</th>
                  <th>P&L</th>
                  <th>Net chg.</th>
                  <th>Day chg.</th>
                </tr>
              </thead>
              <tbody>
                {allHoldings.map((stock, index) => {
                  const curValue = stock.price * stock.qty;
                  const isProfit = curValue - stock.avg * stock.qty >= 0.0;
                  const profClass = isProfit ? "profit" : "loss";
                  const dayClass = stock.isLoss ? "loss" : "profit";

                  return (
                    <tr key={index}>
                      <td>{stock.name}</td>
                      <td>{stock.qty}</td>
                      <td>{stock.avg.toFixed(2)}</td>
                      <td>{stock.price.toFixed(2)}</td>
                      <td>{curValue.toFixed(2)}</td>
                      <td className={profClass}>
                        {(curValue - stock.avg * stock.qty).toFixed(2)}
                      </td>
                      <td className={profClass}>{stock.net}</td>
                      <td className={dayClass}>{stock.day}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>

      {chartData && <VerticalGraph data={chartData}/>}
     
    </>
  );
};

export default Holdings;
