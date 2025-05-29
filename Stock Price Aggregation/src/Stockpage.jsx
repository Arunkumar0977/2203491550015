
import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const API_KEY = "EXHTXNO7DIR3F77O"; 
const SYMBOL = "AAPL"; 

const StockPage = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockPrices = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${SYMBOL}&interval=1min&apikey=${API_KEY}`
        );
        const data = await response.json();
        const timeSeries = data["Time Series (1min)"];
        
        if (!timeSeries) {
          throw new Error("Invalid API response or limit reached.");
        }

        const formattedData = Object.entries(timeSeries).slice(0, 30).map(([time, value]) => ({
          time,
          price: parseFloat(value["1. open"]),
        })).reverse();

        setStockData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setStockData([]);
        setLoading(false);
      }
    };

    fetchStockPrices();
  }, []);

  const averagePrice =
    stockData.length > 0
      ? stockData.reduce((sum, d) => sum + d.price, 0) / stockData.length
      : 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-black transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-center mb-4">📈 Live Stock Price Chart: {SYMBOL}</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading data...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
            <Line
              type="monotone"
              dataKey={() => averagePrice}
              stroke="#ff7300"
              strokeDasharray="5 5"
              name="Average"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StockPage;
