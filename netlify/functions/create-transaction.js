// POST { uid, name, email } -> { token, orderId }
// Runs server-side on Netlify. MIDTRANS_SERVER_KEY is only readable here,
// never shipped to the browser.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  const { uid, name, email } = payload;
  if (!uid || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: "uid dan email wajib diisi" }) };
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "MIDTRANS_SERVER_KEY belum diset di environment variables" }) };
  }

  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
  const endpoint = isProduction
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  // uid is embedded in the order_id (single-underscore delimited) so the
  // webhook can recover it without needing a database lookup. Midtrans
  // caps order_id at 50 chars, so keep the prefix minimal.
  const orderId = `p_${uid}_${Date.now()}`;
  const grossAmount = Number(process.env.MIDTRANS_PREMIUM_PRICE || 49000);

  const authHeader = "Basic " + Buffer.from(`${serverKey}:`).toString("base64");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        transaction_details: { order_id: orderId, gross_amount: grossAmount },
        customer_details: { first_name: name || "Trader", email },
        item_details: [
          { id: "premium-level-4", price: grossAmount, quantity: 1, name: "Akses Premium - Level 4 Risk Management" },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error_messages?.join(", ") || "Midtrans menolak permintaan." }),
      };
    }

    return { statusCode: 200, body: JSON.stringify({ token: data.token, orderId }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
