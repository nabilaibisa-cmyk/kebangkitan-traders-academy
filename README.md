# Kebangkitan Traders Academy — MVP

Platform edukasi forex untuk pemula: roadmap belajar bertahap, quiz, kalkulator
trading, trading journal, 30-day challenge, dan dashboard gamifikasi (XP, level,
streak, badge). Autentikasi dan database memakai **Firebase** (Auth + Firestore).
Frontend dibangun dengan **React + Vite**, siap deploy ke **Netlify**.

> Status: Phase 1 MVP (lihat bagian "Yang sudah jadi" di bawah). Trading
> Simulator, Trading Plan Builder, Community, dan Premium tier belum dibangun —
> itu Phase 2/3 sesuai roadmap pengembangan.

## Struktur folder

```
src/
  components/   UI reusable (Card, Button, Navbar, ProtectedRoute, dst)
  pages/        Satu file per halaman/route
  data/         Konten statis: lessons, levels, badges, challenge days
  services/     Semua akses Firestore (userService.js)
  context/      AuthContext — state login & profil user
  styles/       Warna & CSS global
```

## 1. Setup Firebase (sekali saja)

1. Buka [Firebase Console](https://console.firebase.google.com) → **Add project** → beri nama (mis. `kebangkitan-traders`).
2. Di sidebar, buka **Build → Authentication → Get started** → tab **Sign-in method** → aktifkan **Email/Password**.
3. Buka **Build → Firestore Database → Create database** → pilih mode **production** → pilih region terdekat (mis. `asia-southeast2` untuk Indonesia).
4. Setelah database dibuat, buka tab **Rules**, ganti isinya dengan isi file `firestore.rules` di proyek ini, lalu **Publish**. Ini memastikan satu user hanya bisa membaca/menulis datanya sendiri.
5. Kembali ke **Project settings** (ikon gerigi) → scroll ke **Your apps** → klik ikon **Web (`</>`)** → daftarkan app (nama bebas) → Firebase akan menampilkan objek `firebaseConfig` berisi `apiKey`, `authDomain`, dst. Simpan nilai-nilai ini untuk langkah berikutnya.

## 2. Setup lokal

```bash
npm install
cp .env.example .env
```

Isi `.env` dengan nilai dari `firebaseConfig` (langkah 1.5):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Jalankan:

```bash
npm run dev
```

Buka `http://localhost:5173` — coba **Daftar** akun baru, lalu cek di Firebase Console (**Authentication** dan **Firestore Database → users**) apakah user & profil-nya muncul.

## 3. Deploy ke Netlify

**Opsi A — lewat Git (disarankan):**
1. Push folder ini ke repo GitHub/GitLab.
2. Di [Netlify](https://app.netlify.com) → **Add new site → Import an existing project** → hubungkan repo.
3. Build command: `npm run build`, Publish directory: `dist` (sudah diset otomatis lewat `netlify.toml`).
4. Di **Site settings → Environment variables**, tambahkan 6 variabel `VITE_FIREBASE_*` yang sama seperti di `.env`.
5. Deploy. Netlify akan memberi URL publik (`namamu.netlify.app`) yang bisa diakses siapa saja.

**Opsi B — drag & drop cepat (untuk tes):**
```bash
npm run build
```
Lalu drag folder `dist/` ke halaman [app.netlify.com/drop](https://app.netlify.com/drop). Catatan: cara ini tidak membaca `.env`, jadi hanya cocok untuk build yang sudah menyertakan env var lewat opsi A, atau untuk sekadar cek tampilan tanpa fitur login.

Setelah deploy, tambahkan domain Netlify-mu (mis. `namamu.netlify.app`) ke **Firebase Console → Authentication → Settings → Authorized domains**, supaya login berfungsi dari domain publik tersebut.

## 3.5 Setup Midtrans (untuk fitur premium Level 4)

Level 4 (Risk Management) dikunci di belakang pembayaran satu kali lewat **Midtrans**
(GoPay, OVO, transfer bank, QRIS). Ini pakai 2 Netlify Functions di folder
`netlify/functions/` supaya kunci rahasia Midtrans tidak pernah sampai ke browser.

1. Daftar/login di [dashboard.midtrans.com](https://dashboard.midtrans.com) → gunakan mode **Sandbox** dulu untuk testing (gratis, tidak perlu verifikasi bisnis).
2. Buka **Settings → Access keys** → salin **Client Key** dan **Server Key**.
3. Tambahkan ke `.env` lokal:
   ```
   VITE_MIDTRANS_CLIENT_KEY=<client key sandbox>
   MIDTRANS_SERVER_KEY=<server key sandbox>
   MIDTRANS_IS_PRODUCTION=false
   ```
4. Buka **Firebase Console → Project settings → Service accounts** → klik **Generate new private key** → akan terdownload file JSON. Dari file itu, salin ke `.env`:
   ```
   FIREBASE_PROJECT_ID=<project_id dari file JSON>
   FIREBASE_CLIENT_EMAIL=<client_email dari file JSON>
   FIREBASE_PRIVATE_KEY="<private_key dari file JSON, biarkan tanda \n apa adanya>"
   ```
5. Di **Midtrans Dashboard → Settings → Configuration**, isi **Payment Notification URL** dengan:
   ```
   https://<domain-netlify-mu>/.netlify/functions/midtrans-notification
   ```
   Ini wajib — tanpa URL ini, status pembayaran tidak akan pernah sampai ke server dan premium tidak akan otomatis terbuka.
6. Tambahkan semua variabel di atas (6 baris Firebase + 4 baris Midtrans) ke **Netlify → Site settings → Environment variables** juga, persis seperti `.env`.
7. Redeploy site di Netlify supaya functions & env var baru terbaca.

Untuk go-live pakai uang sungguhan nanti: selesaikan verifikasi bisnis di Midtrans,
ganti ke Production Client/Server Key, set `MIDTRANS_IS_PRODUCTION=true`, dan ganti
URL script di `index.html` dari `app.sandbox.midtrans.com` menjadi `app.midtrans.com`.

**Cara kerja singkatnya:** saat user klik "Buka Akses Premium", frontend memanggil
`create-transaction` (Netlify Function) yang membuat transaksi ke Midtrans pakai Server
Key — lalu Midtrans memanggil balik `midtrans-notification` begitu pembayaran
settlement. Function itu memverifikasi signature-nya, baru menandai `premium: true`
di Firestore lewat Firebase Admin SDK. Firestore Rules sudah diatur supaya user
**tidak bisa** mengubah field `premium` sendiri lewat aplikasi — hanya webhook ini
yang bisa.

## 4. Yang sudah jadi (Phase 1 MVP)

- Register/Login/Logout & reset password sungguhan (Firebase Auth)
- Profil user tersimpan di Firestore: XP, level, streak, badge, progress
- Level 1-6 (Forex Fundamental, Membaca Chart, Analisis Teknikal, Risk Management, Trading Psychology, Simulasi & Praktik): masing-masing 6-7 materi + mini quiz, progress tersimpan per user
- **Level 4 (Risk Management): terkunci di belakang pembayaran Midtrans sekali bayar Rp49.000** — otomatis terbuka begitu pembayaran settlement, tanpa refresh (realtime lewat Firestore)
- **Trading Simulator (Level 7)**: chart candlestick data pasar sungguhan real-time (embed widget resmi TradingView, gratis) untuk latihan membaca arah pasar; akun demo dengan saldo virtual (Rp10.000.000), 8 pair (EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, NZD/USD, XAU/USD); eksekusi BUY/SELL/WAIT memakai mesin harga latihan terpisah yang berbasis referensi pasar sungguhan (Frankfurter/ECB API); position sizing berdasar risk %, riwayat & statistik trade per user (Firestore subcollection) — murni edukasi, tidak terhubung broker/uang nyata
- Trading Calculator: Risk, Risk/Reward, Drawdown, dan Cent Account Calculator
- Trading Journal: catat & lihat riwayat entry per user (Firestore subcollection)
- 30 Day Challenge: tandai hari selesai, tersimpan per user
- Dashboard: XP, level, streak, progress, achievements, status Premium

## 5. Yang belum dibangun (Phase 2/3)

- Trading Plan Builder
- Community/forum, moderasi
- Notifikasi, search, blog/artikel

## Catatan keamanan

- Jangan commit file `.env` (sudah ada di `.gitignore`).
- `firebaseConfig` di frontend memang publik secara desain — yang menjaga keamanan data adalah **Firestore Rules** (`firestore.rules`), bukan menyembunyikan config tersebut.
- Untuk produksi, aktifkan **App Check** di Firebase Console agar hanya app resmi yang bisa memanggil API-mu (opsional, disarankan sebelum trafik besar).
