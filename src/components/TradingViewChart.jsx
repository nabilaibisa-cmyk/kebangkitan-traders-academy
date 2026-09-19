import React, { useEffect, useRef } from "react";

// Embeds TradingView's free, official "Advanced Chart" widget — this shows
// REAL live candlestick market data (no API key, no cost). We only use it
// for visual chart-reading practice; we cannot read exact prices out of it
// (that requires TradingView's paid Datafeed API), so trade execution in
// the simulator uses a separate internal price engine.
export default function TradingViewChart({ symbol, height = 360 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.height = "100%";
    widgetDiv.style.width = "100%";
    container.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "15",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "id",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      support_host: "https://www.tradingview.com",
    });
    container.appendChild(script);
  }, [symbol]);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ height, width: "100%", borderRadius: 10, overflow: "hidden" }}
    />
  );
}
