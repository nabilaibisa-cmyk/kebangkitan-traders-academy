// Fetches near-real-time reference prices for the simulator's pairs via the
// get-quotes Netlify Function (which itself calls Yahoo Finance server-side
// to avoid CORS issues). Free, no API key. If the live fetch fails for any
// reason, each pair falls back to a static reference price defined in
// src/data/pairs.js, so the simulator keeps working either way.

import { PAIRS } from "../data/pairs";

export async function fetchReferencePrices() {
  try {
    const res = await fetch("/.netlify/functions/get-quotes");
    const data = await res.json();
    const live = data?.prices || {};

    const prices = {};
    for (const p of PAIRS) {
      const price = live[p.symbol];
      prices[p.symbol] = { price: price ?? p.fallback, isLive: !!price };
    }

    return { prices, date: data?.isLive ? new Date().toISOString().slice(0, 16).replace("T", " ") : null };
  } catch {
    const prices = {};
    for (const p of PAIRS) {
      prices[p.symbol] = { price: p.fallback, isLive: false };
    }
    return { prices, date: null };
  }
}
