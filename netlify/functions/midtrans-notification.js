// Midtrans calls this URL directly (server-to-server) after a payment's
// status changes. We verify the signature, then — only for a genuinely
// settled/captured payment — flip `premium: true` on the user's Firestore
// document using the Firebase Admin SDK (which bypasses client security
// rules; this is the ONLY legitimate way premium gets set to true).

const crypto = require("crypto");
const admin = require("firebase-admin");

function getAdmin() {
  if (admin.apps.length) return admin;
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    }),
  });
  return admin;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let notif;
  try {
    notif = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = notif;
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  if (!order_id || !status_code || !gross_amount || !signature_key || !serverKey) {
    return { statusCode: 400, body: "Missing required fields" };
  }

  const expectedSignature = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + serverKey)
    .digest("hex");

  if (expectedSignature !== signature_key) {
    return { statusCode: 403, body: "Invalid signature" };
  }

  const isSettled = transaction_status === "capture" || transaction_status === "settlement";
  const isFraudOk = !fraud_status || fraud_status === "accept";

  if (isSettled && isFraudOk) {
    // order_id format: p_<uid>_<timestamp>
    const parts = order_id.split("_");
    const uid = parts.length >= 3 ? parts[1] : null;

    if (uid) {
      const fbAdmin = getAdmin();
      await fbAdmin
        .firestore()
        .collection("users")
        .doc(uid)
        .set(
          {
            premium: true,
            premiumSince: fbAdmin.firestore.FieldValue.serverTimestamp(),
            lastOrderId: order_id,
          },
          { merge: true }
        );
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
