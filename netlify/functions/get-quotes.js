// GET -> { prices: { EURUSD: 1.0851, ..., XAUUSD: 2651.30 }, isLive: true }
// Runs server-side so the browser never hits Yahoo Finance directly (their
// endpoint blocks most direct cross-origin browser requests). Free, no API
// key. If the fetch fails for any reason, returns isLive: false so the
// frontend falls back to each pair's static fallback price.
//
// The symbol list is duplicated here (rather than imported from
// src/data/pairs.js) because this folder is CommonJS while src/ is an ES
// module — keeping this list in sync with src/data/pairs.js's
// `yahooSymbol` values if pairs are ever added or removed there.

const SYMBOL_MAP = {
  EURUSD: "EURUSD=X",
  GBPUSD: "GBPUSD=X",
  USDJPY: "USDJPY=X",
  USDCHF: "USDCHF=X",
  AUDUSD: "AUDUSD=X",
  USDCAD: "USDCAD=X",
  NZDUSD: "NZDUSD=X",
  XAUUSD: "XAUUSD=X",
};

exports.handler = async () => {
  const yahooSymbols = Object.values(SYMBOL_MAP).join(",");

  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(yahooSymbols)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );

    if (!res.ok) throw new Error(`Yahoo Finance returned ${res.status}`);
    const data = await res.json();
    const results = data?.quoteResponse?.result || [];

    const prices = {};
    for (const [ourSymbol, yahooSymbol] of Object.entries(SYMBOL_MAP)) {
      const match = results.find((r) => r.symbol === yahooSymbol);
      if (match?.regularMarketPrice) {
        prices[ourSymbol] = match.regularMarketPrice;
      }
    }

    const gotAny = Object.keys(prices).length > 0;
    return {
      statusCode: 200,
      body: JSON.stringify({ prices, isLive: gotAny }),
    };
  } catch (err) {
    return {
      statusCode: 200, // still 200 so the frontend can gracefully fall back
      body: JSON.stringify({ prices: {}, isLive: false, error: err.message }),
    };
  }
};
