import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

// Sample stock time series (m-minute sampled)
const mockPrices = {
  AAPL: [120, 122, 121, 119, 120, 118],
  MSFT: [240, 242, 241, 243, 239, 238],
  GOOG: [1340, 1335, 1342, 1338, 1341, 1340],
  AMZN: [3120, 3122, 3121, 3123, 3120, 3118],
};

// Utility to calculate average
const calcAverage = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

// Utility to calculate standard deviation
const calcStdDev = (arr) => {
  const mean = calcAverage(arr);
  const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
};

// Utility to calculate correlation
const calcCorrelation = (x, y) => {
  const avgX = calcAverage(x);
  const avgY = calcAverage(y);
  const numerator = x.reduce((sum, xi, i) => sum + (xi - avgX) * (y[i] - avgY), 0);
  const denominator = Math.sqrt(
    x.reduce((sum, xi) => sum + Math.pow(xi - avgX, 2), 0) *
    y.reduce((sum, yi) => sum + Math.pow(yi - avgY, 2), 0)
  );
  return (numerator / denominator).toFixed(2);
};

const CorrelationHeatmap = () => {
  const [correlationMatrix, setCorrelationMatrix] = useState([]);
  const [selectedStats, setSelectedStats] = useState(null);

  const stockNames = Object.keys(mockPrices);

  useEffect(() => {
    const matrix = stockNames.map((stock1) =>
      stockNames.map((stock2) => calcCorrelation(mockPrices[stock1], mockPrices[stock2]))
    );
    setCorrelationMatrix(matrix);
  }, []);

  const handleHover = ({ points }) => {
    if (points.length > 0) {
      const { x, y } = points[0];
      const stock = typeof x === "string" ? x : y;
      const prices = mockPrices[stock];
      setSelectedStats({
        stock,
        avg: calcAverage(prices).toFixed(2),
        stdDev: calcStdDev(prices).toFixed(2),
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl mt-10 text-black transition-all duration-500 hover:scale-105">
      <h2 className="text-2xl font-semibold text-center mb-4">🧮 Stock Correlation Heatmap</h2>
      <Plot
        data={[
          {
            z: correlationMatrix,
            x: stockNames,
            y: stockNames,
            type: "heatmap",
            colorscale: "Viridis",
            hoverongaps: false,
            showscale: true,
          },
        ]}
        layout={{
          width: "100%",
          autosize: true,
          margin: { t: 30 },
          hovermode: "closest",
        }}
        onHover={handleHover}
        className="w-full"
      />
      {selectedStats && (
        <div className="mt-4 p-4 bg-purple-100 rounded-md text-black">
          <h3 className="font-semibold text-xl text-purple-700">📌 {selectedStats.stock} Stats</h3>
          <p>Average Price: <strong>${selectedStats.avg}</strong></p>
          <p>Standard Deviation: <strong>{selectedStats.stdDev}</strong></p>
        </div>
      )}
    </div>
  );
};

export default CorrelationHeatmap;
