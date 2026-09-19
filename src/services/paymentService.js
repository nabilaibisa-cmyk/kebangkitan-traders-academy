// Talks to the Netlify Function that creates a Midtrans Snap transaction.
// The actual Midtrans server key never touches the browser — it lives only
// in the Netlify Function's environment variables.

export async function createPremiumTransaction({ uid, name, email }) {
  const res = await fetch("/.netlify/functions/create-transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, name, email }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || "Gagal membuat transaksi pembayaran.");
  }
  return data.token;
}

// Opens the Midtrans Snap popup. Requires the Snap script (loaded in
// index.html) to have finished loading window.snap.
export function payWithSnap(token, { onSuccess, onPending, onError, onClose } = {}) {
  if (!window.snap) {
    onError?.(new Error("Payment widget belum siap dimuat. Coba refresh halaman."));
    return;
  }
  window.snap.pay(token, {
    onSuccess: (result) => onSuccess?.(result),
    onPending: (result) => onPending?.(result),
    onError: (result) => onError?.(result),
    onClose: () => onClose?.(),
  });
}
