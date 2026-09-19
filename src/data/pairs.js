// Pairs available in the Trading Simulator.
// - digits: how many decimals to display
// - tickSize: price value of "1 point" for this pair (what SL/TP/pip inputs
//   are measured in) — e.g. EURUSD's pip is 0.0001, USDJPY's is 0.01
// - chartVol: how many points the internal practice-price engine moves per
//   tick, tuned per pair so entry/exit math "feels" like that instrument
// - yahooSymbol: ticker used to fetch a near-real-time reference price
//   (via the get-quotes Netlify Function, sourced from Yahoo Finance —
//   free, no API key, delayed by roughly a minute, but MUCH closer to the
//   live chart than a once-a-day rate)
// - tvSymbol: TradingView's symbol code, used to embed a REAL live
//   candlestick chart for that instrument (free official TradingView widget)
// - fallback: used only if the live quote fetch fails

export const PAIRS = [
  { symbol: "EURUSD", label: "EUR/USD", digits: 4, tickSize: 0.0001, chartVol: 8, yahooSymbol: "EURUSD=X", fallback: 1.085, tvSymbol: "FX:EURUSD" },
  { symbol: "GBPUSD", label: "GBP/USD", digits: 4, tickSize: 0.0001, chartVol: 10, yahooSymbol: "GBPUSD=X", fallback: 1.27, tvSymbol: "FX:GBPUSD" },
  { symbol: "USDJPY", label: "USD/JPY", digits: 2, tickSize: 0.01, chartVol: 8, yahooSymbol: "USDJPY=X", fallback: 149.5, tvSymbol: "FX:USDJPY" },
  { symbol: "USDCHF", label: "USD/CHF", digits: 4, tickSize: 0.0001, chartVol: 8, yahooSymbol: "USDCHF=X", fallback: 0.88, tvSymbol: "FX:USDCHF" },
  { symbol: "AUDUSD", label: "AUD/USD", digits: 4, tickSize: 0.0001, chartVol: 9, yahooSymbol: "AUDUSD=X", fallback: 0.66, tvSymbol: "FX:AUDUSD" },
  { symbol: "USDCAD", label: "USD/CAD", digits: 4, tickSize: 0.0001, chartVol: 8, yahooSymbol: "USDCAD=X", fallback: 1.36, tvSymbol: "FX:USDCAD" },
  { symbol: "NZDUSD", label: "NZD/USD", digits: 4, tickSize: 0.0001, chartVol: 9, yahooSymbol: "NZDUSD=X", fallback: 0.61, tvSymbol: "FX:NZDUSD" },
  { symbol: "XAUUSD", label: "XAU/USD (Emas)", digits: 2, tickSize: 0.1, chartVol: 15, yahooSymbol: "XAUUSD=X", fallback: 2650, tvSymbol: "OANDA:XAUUSD" },
];

export function findPair(symbol) {
  return PAIRS.find((p) => p.symbol === symbol) || PAIRS[0];
}
