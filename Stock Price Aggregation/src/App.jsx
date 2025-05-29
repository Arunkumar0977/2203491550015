import React from "react";
import StockPage from "./StockPage";
import CorrelationHeatmap from "./CorrelationHeatmap";

const App = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6 animate-bounce">📈 Stock Price Aggregator</h1>
      <StockPage />
      <CorrelationHeatmap />
    </div>
  );
};

export default App;
