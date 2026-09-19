// Lesson content grouped by roadmap level key (see levels.js).
// Level 4 ("risk") is the premium-gated module.

const fundamental = [
  {
    id: "apa-itu-forex",
    title: "Apa itu Forex?",
    body:
      "Forex (foreign exchange) adalah pasar tempat mata uang satu negara ditukar dengan mata uang negara lain. Setiap hari, jutaan orang menukar Rupiah ke Dolar, Euro ke Yen, dan pasangan mata uang lainnya — baik untuk kebutuhan bisnis, wisata, maupun belajar mengamati pergerakan nilai tukar.\n\nDi platform ini, forex dipelajari sebagai objek belajar: bagaimana harga bergerak, apa yang memengaruhinya, dan bagaimana mengambil keputusan dengan risiko yang terukur — bukan sebagai jalan pintas menghasilkan uang.",
    quiz: {
      q: "Forex adalah pasar untuk...",
      options: ["Menukar saham perusahaan", "Menukar mata uang antarnegara", "Membeli properti", "Menjual emas fisik"],
      correct: 1,
      explain: "Forex singkatan dari foreign exchange — pasar pertukaran mata uang antarnegara.",
    },
  },
  {
    id: "currency-pair",
    title: "Currency Pair",
    body:
      "Di forex, harga selalu ditampilkan berpasangan, misalnya EUR/USD. Ini disebut currency pair. Mata uang pertama (EUR) disebut base currency, dan mata uang kedua (USD) disebut quote currency. Angka yang tertera menunjukkan berapa banyak quote currency dibutuhkan untuk membeli satu unit base currency.",
    quiz: {
      q: "Pada EUR/USD, EUR disebut sebagai...",
      options: ["Quote currency", "Base currency", "Cross currency", "Minor currency"],
      correct: 1,
      explain: "Mata uang pertama dalam sebuah pair selalu disebut base currency.",
    },
  },
  {
    id: "pip",
    title: "Pip & Point",
    body:
      "Pip (percentage in point) adalah satuan terkecil yang umum digunakan untuk mengukur perubahan harga di forex — biasanya pada digit keempat setelah koma, misalnya dari 1.1050 ke 1.1051 berarti naik 1 pip. Sedangkan point mengacu pada digit terakhir (kelima) pada broker dengan penulisan harga 5 digit.",
    quiz: {
      q: "Harga EUR/USD bergerak dari 1.1050 menjadi 1.1060. Berapa pip pergerakannya?",
      options: ["1 pip", "10 pip", "100 pip", "0.1 pip"],
      correct: 1,
      explain: "Selisih 0.0010 pada pasangan 4 digit setara dengan 10 pip.",
    },
  },
  {
    id: "lot",
    title: "Lot",
    body:
      "Lot adalah satuan ukuran volume transaksi di forex. Satu standard lot setara 100.000 unit mata uang dasar. Ada juga mini lot (10.000 unit) dan micro lot (1.000 unit) yang cocok untuk latihan dengan risiko lebih kecil.",
    quiz: {
      q: "Satu micro lot setara dengan berapa unit mata uang dasar?",
      options: ["100.000", "10.000", "1.000", "100"],
      correct: 2,
      explain: "Micro lot = 1.000 unit, mini lot = 10.000 unit, standard lot = 100.000 unit.",
    },
  },
  {
    id: "spread",
    title: "Spread",
    body:
      "Spread adalah selisih antara harga beli (ask) dan harga jual (bid) yang ditetapkan broker. Spread merupakan salah satu bentuk biaya transaksi — semakin kecil spread, semakin kecil biaya yang perlu 'ditutup' sebelum posisi mulai menghasilkan keuntungan (dalam simulasi).",
    quiz: {
      q: "Spread yang lebih besar berarti...",
      options: ["Biaya transaksi lebih kecil", "Biaya transaksi lebih besar", "Keuntungan otomatis lebih besar", "Tidak berpengaruh apa pun"],
      correct: 1,
      explain: "Spread adalah biaya implisit — makin lebar, makin besar jarak yang perlu dilalui harga sebelum posisi impas.",
    },
  },
  {
    id: "leverage",
    title: "Leverage & Margin",
    body:
      "Leverage memungkinkan trader mengendalikan posisi bernilai lebih besar dari modal yang disetor, misalnya leverage 1:100. Margin adalah sejumlah dana yang 'ditahan' sebagai jaminan untuk membuka posisi tersebut. Leverage memperbesar potensi hasil — baik untung maupun rugi.",
    quiz: {
      q: "Fungsi utama leverage adalah...",
      options: [
        "Menjamin profit lebih besar",
        "Menghilangkan risiko kerugian",
        "Memungkinkan kontrol posisi lebih besar dari modal, sekaligus memperbesar risiko",
        "Mengurangi spread broker",
      ],
      correct: 2,
      explain: "Leverage memperbesar eksposur — dan risiko — bukan menjamin hasil.",
    },
  },
];

const chart = [
  {
    id: "apa-itu-chart",
    title: "Apa itu Chart?",
    body:
      "Chart adalah gambaran visual pergerakan harga sepanjang waktu. Sumbu horizontal menunjukkan waktu, sumbu vertikal menunjukkan harga. Trader membaca chart untuk memahami pola pergerakan harga masa lalu — bukan untuk memastikan arah masa depan.",
    quiz: {
      q: "Fungsi utama membaca chart adalah...",
      options: ["Memastikan harga akan naik", "Memahami pola pergerakan harga masa lalu", "Mengetahui berita ekonomi", "Menghitung pajak trading"],
      correct: 1,
      explain: "Chart menunjukkan histori harga — alat bantu analisis, bukan alat prediksi pasti.",
    },
  },
  {
    id: "candlestick",
    title: "Candlestick",
    body:
      "Candlestick adalah cara umum menampilkan harga dalam satu periode waktu tertentu. Satu candle punya 4 titik data: open (harga pembuka), high (tertinggi), low (terendah), dan close (harga penutup). Bentuk badan dan sumbu (wick) candle menceritakan bagaimana pertarungan harga terjadi dalam periode itu.",
    quiz: {
      q: "Satu candlestick menunjukkan 4 titik data, yaitu...",
      options: ["Open, High, Low, Close", "Buy, Sell, Wait, Hold", "Trend, Pip, Lot, Spread", "Support, Resistance, Entry, Exit"],
      correct: 0,
      explain: "OHLC (Open, High, Low, Close) adalah 4 data inti tiap candlestick.",
    },
  },
  {
    id: "bullish-bearish",
    title: "Bullish & Bearish Candle",
    body:
      "Candle bullish (biasanya hijau/putih) terbentuk saat harga close lebih tinggi dari open — menandakan tekanan beli lebih kuat pada periode itu. Candle bearish (biasanya merah/hitam) terbentuk saat close lebih rendah dari open — tekanan jual lebih kuat. Satu candle saja tidak cukup untuk menyimpulkan arah tren.",
    quiz: {
      q: "Candle bullish terbentuk ketika...",
      options: ["Close lebih tinggi dari open", "Close lebih rendah dari open", "High sama dengan low", "Volume nol"],
      correct: 0,
      explain: "Bullish = harga ditutup lebih tinggi dari pembukaannya pada periode tersebut.",
    },
  },
  {
    id: "timeframe",
    title: "Timeframe",
    body:
      "Timeframe adalah periode waktu yang diwakili satu candle — misalnya M15 (15 menit), H1 (1 jam), D1 (1 hari). Timeframe kecil menunjukkan detail pergerakan jangka pendek dengan lebih banyak noise; timeframe besar menunjukkan gambaran tren yang lebih luas tapi kurang detail.",
    quiz: {
      q: "Dibanding timeframe H1, chart timeframe M15 pada umumnya...",
      options: ["Menunjukkan periode lebih panjang per candle", "Menunjukkan detail jangka pendek dengan lebih banyak noise", "Selalu lebih akurat", "Tidak bisa dipakai untuk analisis"],
      correct: 1,
      explain: "Timeframe kecil = detail lebih halus tapi pergerakan lebih 'berisik' (noise).",
    },
  },
  {
    id: "trend",
    title: "Trend: Uptrend, Downtrend, Sideways",
    body:
      "Uptrend terlihat dari titik tertinggi dan terendah yang terus naik (higher highs, higher lows). Downtrend sebaliknya — titik tertinggi dan terendah terus turun. Sideways terjadi ketika harga bergerak dalam rentang tanpa arah jelas.",
    quiz: {
      q: "Ciri khas uptrend adalah...",
      options: ["Higher highs dan higher lows", "Lower highs dan lower lows", "Harga diam total", "Candle selalu bearish"],
      correct: 0,
      explain: "Uptrend ditandai puncak dan lembah yang terus bergerak naik.",
    },
  },
  {
    id: "support-resistance",
    title: "Support & Resistance",
    body:
      "Support adalah area harga di mana tekanan beli cenderung muncul, menahan harga agar tidak turun lebih jauh. Resistance adalah area di mana tekanan jual cenderung muncul, menahan harga agar tidak naik lebih jauh. Area ini bukan garis pasti, melainkan zona perkiraan.",
    quiz: {
      q: "Resistance adalah area di mana...",
      options: ["Harga cenderung tertahan naik karena tekanan jual", "Harga pasti akan breakout", "Volume selalu nol", "Spread otomatis mengecil"],
      correct: 0,
      explain: "Resistance = zona di mana tekanan jual historis cenderung menahan kenaikan harga.",
    },
  },
];

const technical = [
  {
    id: "moving-average",
    title: "Moving Average",
    body:
      "Moving Average (MA) meratakan data harga selama periode tertentu untuk menghaluskan noise dan membantu melihat arah tren secara lebih jelas. MA bergerak mengikuti harga dengan jeda (lagging) — berguna untuk konteks, bukan untuk sinyal instan.",
    quiz: {
      q: "Fungsi utama Moving Average adalah...",
      options: ["Memprediksi berita ekonomi", "Menghaluskan data harga untuk melihat arah tren", "Menghitung spread broker", "Mengganti kebutuhan Stop Loss"],
      correct: 1,
      explain: "MA meratakan fluktuasi harga jangka pendek agar arah tren lebih mudah dibaca.",
    },
  },
  {
    id: "rsi",
    title: "RSI (Relative Strength Index)",
    body:
      "RSI mengukur kecepatan dan besaran perubahan harga pada skala 0-100. Nilai di atas 70 sering disebut 'overbought' (jenuh beli), di bawah 30 disebut 'oversold' (jenuh jual). Ini indikasi kondisi, bukan sinyal otomatis untuk entry.",
    quiz: {
      q: "RSI di atas 70 umumnya menunjukkan kondisi...",
      options: ["Oversold", "Overbought", "Spread melebar", "Leverage tinggi"],
      correct: 1,
      explain: "RSI tinggi (>70) menandakan kondisi jenuh beli (overbought).",
    },
  },
  {
    id: "trendline",
    title: "Trendline",
    body:
      "Trendline adalah garis yang ditarik menghubungkan titik-titik harga (biasanya swing high atau swing low) untuk memvisualisasikan arah tren. Semakin banyak titik yang tersentuh garis tersebut, semakin sering trendline itu 'teruji' — meski tetap bisa ditembus (break).",
    quiz: {
      q: "Trendline paling umum digambar dengan menghubungkan...",
      options: ["Harga penutupan pasar minggu lalu", "Titik-titik swing high atau swing low", "Berita ekonomi terbaru", "Nilai leverage broker"],
      correct: 1,
      explain: "Trendline ditarik dari rangkaian titik tertinggi atau terendah yang berurutan.",
    },
  },
  {
    id: "breakout-retest",
    title: "Breakout & Retest",
    body:
      "Breakout terjadi ketika harga menembus level support/resistance atau trendline. Retest terjadi ketika harga kembali menguji level yang baru ditembus tersebut sebelum melanjutkan arah breakout. Tidak semua breakout valid — ada yang disebut 'false breakout'.",
    quiz: {
      q: "Retest terjadi ketika...",
      options: [
        "Harga menembus level baru untuk pertama kali",
        "Harga kembali menguji level yang baru ditembus",
        "Spread tiba-tiba melebar",
        "Leverage berubah otomatis",
      ],
      correct: 1,
      explain: "Retest = harga 'kembali dulu' menguji area yang baru saja ditembus (breakout).",
    },
  },
  {
    id: "fibonacci",
    title: "Fibonacci Retracement",
    body:
      "Fibonacci retracement menandai level-level persentase (23.6%, 38.2%, 50%, 61.8%, dst) dari suatu pergerakan harga, dipakai untuk memperkirakan area potensi koreksi sebelum tren berlanjut. Ini alat bantu perkiraan, bukan kepastian matematis.",
    quiz: {
      q: "Fibonacci retracement biasanya dipakai untuk...",
      options: ["Menghitung pajak transaksi", "Memperkirakan area potensi koreksi harga", "Mengukur spread broker", "Menentukan jam buka pasar"],
      correct: 1,
      explain: "Fibonacci retracement membantu memperkirakan di mana koreksi harga mungkin berhenti.",
    },
  },
  {
    id: "confluence",
    title: "Confluence & Entry",
    body:
      "Confluence adalah ketika beberapa sinyal analisis (misalnya support + RSI oversold + trendline) muncul bersamaan di area harga yang sama, memperkuat dasar sebuah keputusan. Entry yang baik biasanya mempertimbangkan confluence, bukan satu indikator saja.",
    quiz: {
      q: "Confluence dalam analisis teknikal berarti...",
      options: [
        "Menggunakan satu indikator saja",
        "Beberapa sinyal analisis muncul bersamaan di area yang sama",
        "Mengabaikan risk management",
        "Selalu entry saat market baru buka",
      ],
      correct: 1,
      explain: "Confluence = beberapa faktor analisis saling mendukung di titik yang sama.",
    },
  },
];

const risk = [
  {
    id: "apa-itu-risk-management",
    title: "Apa itu Risk Management?",
    body:
      "Risk management adalah cara mengelola seberapa besar kerugian yang siap kamu terima dalam setiap keputusan trading — sebelum memikirkan potensi keuntungan. Trader yang bertahan lama umumnya bukan yang paling sering menang, tapi yang paling disiplin membatasi kerugian per transaksi.",
    quiz: {
      q: "Fokus utama risk management adalah...",
      options: ["Memaksimalkan profit di setiap transaksi", "Membatasi kerugian sebelum memikirkan keuntungan", "Menghindari trading sama sekali", "Menambah leverage setinggi mungkin"],
      correct: 1,
      explain: "Risk management dimulai dari pertanyaan 'berapa yang siap saya rugi', bukan 'berapa untung yang saya kejar'.",
    },
  },
  {
    id: "risk-per-trade-position-sizing",
    title: "Risk per Trade & Position Sizing",
    body:
      "Risk per trade adalah persentase modal yang siap dipertaruhkan dalam satu transaksi (umumnya trader edukasi memakai 1-2%). Position sizing adalah proses menghitung besar lot berdasarkan risk per trade dan jarak Stop Loss, bukan berdasarkan perasaan atau modal maksimal yang tersedia.",
    quiz: {
      q: "Position sizing yang sehat dihitung berdasarkan...",
      options: ["Perasaan yakin trader", "Risk per trade dan jarak Stop Loss", "Jumlah leverage maksimal broker", "Berita yang baru dibaca"],
      correct: 1,
      explain: "Lot yang dipakai seharusnya hasil perhitungan dari risk % dan jarak SL, bukan tebakan.",
    },
  },
  {
    id: "stop-loss-risk-reward",
    title: "Stop Loss & Risk/Reward",
    body:
      "Stop Loss adalah batas otomatis yang menutup posisi saat kerugian mencapai level tertentu — alat utama membatasi risiko. Risk/Reward Ratio membandingkan potensi rugi terhadap potensi untung; rasio 1:2 misalnya berarti berani rugi 1 untuk potensi untung 2.",
    quiz: {
      q: "Stop Loss berfungsi untuk...",
      options: ["Menjamin profit otomatis", "Membatasi kerugian pada level yang sudah ditentukan", "Menambah lot secara otomatis", "Menghilangkan spread"],
      correct: 1,
      explain: "Stop Loss adalah batas kerugian yang ditentukan di awal, bukan alat mencari profit.",
    },
  },
  {
    id: "drawdown-leverage-risiko",
    title: "Drawdown & Risiko Leverage",
    body:
      "Drawdown adalah penurunan saldo dari titik tertinggi sebelumnya, biasanya diukur dalam persentase. Leverage yang tinggi mempercepat baik pertumbuhan maupun penurunan saldo — semakin tinggi leverage yang dipakai tanpa risk management, semakin cepat drawdown bisa membesar.",
    quiz: {
      q: "Leverage tinggi tanpa risk management yang baik akan...",
      options: ["Menjamin profit lebih cepat", "Mempercepat potensi drawdown", "Menghilangkan risiko kerugian", "Mengurangi spread broker"],
      correct: 1,
      explain: "Leverage memperbesar dampak — termasuk mempercepat penurunan saldo kalau risiko tidak dikendalikan.",
    },
  },
  {
    id: "overtrading-revenge-fomo",
    title: "Overtrading, Revenge Trading & FOMO",
    body:
      "Overtrading adalah membuka posisi terlalu sering tanpa alasan analisis yang jelas. Revenge trading adalah usaha 'membalas' kerugian dengan segera membuka posisi baru secara impulsif. FOMO (fear of missing out) mendorong entry karena takut ketinggalan momentum. Ketiganya biasanya memperbesar risiko, bukan memperbaiki hasil.",
    quiz: {
      q: "Revenge trading paling tepat digambarkan sebagai...",
      options: [
        "Strategi entry berdasarkan analisis mendalam",
        "Usaha impulsif membalas kerugian dengan segera membuka posisi baru",
        "Teknik position sizing yang disiplin",
        "Jenis order Take Profit otomatis",
      ],
      correct: 1,
      explain: "Revenge trading didorong emosi setelah rugi, bukan berdasarkan analisis — cenderung memperbesar risiko.",
    },
  },
  {
    id: "trading-tanpa-rencana",
    title: "Trading Tanpa Rencana & Disiplin",
    body:
      "Trading tanpa rencana berarti masuk posisi tanpa kriteria entry, Stop Loss, atau target yang jelas ditentukan sebelumnya. Disiplin berarti konsisten mengikuti rencana yang sudah dibuat, termasuk saat emosi sedang tinggi.",
    quiz: {
      q: "Ciri utama 'trading tanpa rencana' adalah...",
      options: [
        "Entry, Stop Loss, dan target ditentukan sebelum membuka posisi",
        "Tidak ada kriteria entry/SL/target yang ditentukan sebelumnya",
        "Selalu memakai risk 1% per transaksi",
        "Mencatat semua transaksi di journal",
      ],
      correct: 1,
      explain: "Trading tanpa rencana = tidak ada kriteria yang disiapkan sebelum membuka posisi.",
    },
  },
];

const psychology = [
  {
    id: "disiplin-trading",
    title: "Disiplin dalam Trading",
    body:
      "Disiplin berarti konsisten mengikuti rencana yang sudah dibuat — kriteria entry, Stop Loss, dan target — meskipun sedang merasa sangat yakin atau sangat takut. Trader dengan sistem bagus sekalipun bisa gagal kalau tidak disiplin menjalankannya. Disiplin dibangun lewat kebiasaan kecil yang diulang, bukan sekali niat besar.",
    quiz: {
      q: "Disiplin dalam trading paling tepat digambarkan sebagai...",
      options: [
        "Selalu menang di setiap transaksi",
        "Konsisten mengikuti rencana yang sudah dibuat, walau sedang emosional",
        "Menambah lot saat merasa yakin",
        "Mengabaikan Stop Loss demi profit lebih besar",
      ],
      correct: 1,
      explain: "Disiplin diuji justru saat emosi tinggi — tetap mengikuti rencana, bukan menurutinya.",
    },
  },
  {
    id: "fomo",
    title: "FOMO (Fear of Missing Out)",
    body:
      "FOMO adalah dorongan untuk buru-buru masuk posisi karena takut ketinggalan momentum harga yang sedang bergerak cepat. Keputusan yang diambil karena FOMO biasanya tidak melalui analisis yang semestinya, dan sering kali entry di momen yang sudah terlambat.",
    quiz: {
      q: "Ciri khas keputusan yang didorong FOMO adalah...",
      options: [
        "Sudah direncanakan jauh-jauh hari",
        "Diambil buru-buru karena takut ketinggalan momentum, tanpa analisis penuh",
        "Selalu memakai Stop Loss yang ketat",
        "Hasil dari trading plan yang matang",
      ],
      correct: 1,
      explain: "FOMO mendorong entry terburu-buru, biasanya melewatkan proses analisis yang biasa dilakukan.",
    },
  },
  {
    id: "revenge-overconfidence",
    title: "Revenge Trading & Overconfidence",
    body:
      "Setelah mengalami kerugian, kamu merasa ingin segera membuka posisi baru untuk 'membalas' kerugian tadi. Apa tindakan yang lebih sehat?",
    quiz: {
      q: "Setelah mengalami kerugian, kamu merasa ingin segera membuka posisi baru untuk membalas kerugian. Apa tindakan yang lebih sehat?",
      options: [
        "Langsung membuka posisi baru dengan lot lebih besar untuk mempercepat balik modal",
        "Berhenti sejenak, evaluasi apakah keputusan sebelumnya sesuai rencana, baru lanjut kalau kepala sudah tenang",
        "Menambah leverage supaya potensi profit lebih besar",
        "Menghapus Stop Loss supaya posisi tidak keburu tertutup rugi",
      ],
      correct: 1,
      explain: "Jeda dan evaluasi memutus siklus revenge trading. Overconfidence setelah menang beruntun punya risiko serupa — sama-sama mendorong keputusan di luar rencana.",
    },
  },
  {
    id: "fear-greed",
    title: "Fear & Greed",
    body:
      "Fear (takut) bisa membuat trader menutup posisi profit terlalu cepat atau ragu mengeksekusi rencana yang sudah matang. Greed (serakah) bisa membuat trader menahan posisi profit terlalu lama berharap untung lebih besar, atau mengabaikan sinyal risiko yang sudah jelas. Keduanya sama-sama mengaburkan rencana yang sudah dibuat.",
    quiz: {
      q: "Greed dalam trading biasanya mendorong seseorang untuk...",
      options: [
        "Menutup profit sesuai target yang direncanakan",
        "Menahan posisi terlalu lama demi untung lebih besar, mengabaikan rencana awal",
        "Selalu memakai risk 1% per transaksi",
        "Mencatat semua transaksi di journal",
      ],
      correct: 1,
      explain: "Greed condong membuat trader keluar dari rencana yang sudah dibuat demi 'lebih banyak lagi'.",
    },
  },
  {
    id: "accepting-loss-trading-plan",
    title: "Accepting Loss & Trading Plan",
    body:
      "Menerima kerugian sebagai bagian normal dari trading (bukan kegagalan pribadi) adalah kunci supaya keputusan berikutnya tetap rasional. Trading plan yang ditulis saat kepala dingin — bukan di tengah posisi terbuka — membantu kamu tahu persis apa yang harus dilakukan sebelum emosi ambil alih.",
    quiz: {
      q: "Menerima kerugian sebagai bagian normal dari trading membantu...",
      options: [
        "Menjamin tidak akan rugi lagi",
        "Menjaga keputusan berikutnya tetap rasional, bukan reaksi emosional",
        "Menghilangkan kebutuhan Stop Loss",
        "Membuat trader boleh mengabaikan trading plan",
      ],
      correct: 1,
      explain: "Menerima loss sebagai bagian dari proses mencegah reaksi emosional berlebihan setelahnya.",
    },
  },
  {
    id: "konsistensi-evaluasi",
    title: "Konsistensi & Evaluasi",
    body:
      "Konsistensi berarti menjalankan proses yang sama setiap kali — bukan hasil yang selalu sama. Evaluasi rutin (misalnya lewat trading journal) membantu melihat pola: kapan biasanya melanggar rencana, emosi apa yang paling sering muncul, dan bagian mana dari proses yang perlu diperbaiki.",
    quiz: {
      q: "Konsistensi dalam trading lebih tepat diartikan sebagai...",
      options: [
        "Selalu mendapat hasil profit yang sama tiap bulan",
        "Menjalankan proses/rencana yang sama secara berulang, apa pun hasilnya",
        "Tidak pernah mengubah trading plan sama sekali selamanya",
        "Menghindari evaluasi supaya tidak stres",
      ],
      correct: 1,
      explain: "Konsistensi soal proses yang diulang dengan disiplin — hasil tiap transaksi wajar berbeda-beda.",
    },
  },
];

const simulation = [
  {
    id: "kenapa-simulasi-penting",
    title: "Kenapa Simulasi Penting Sebelum Live?",
    body:
      "Simulasi (latihan dengan uang virtual) memberi ruang untuk mencoba menerapkan analisis, risk management, dan trading plan tanpa risiko finansial nyata. Tujuannya bukan mengejar 'profit virtual' setinggi mungkin, tapi melatih proses pengambilan keputusan supaya lebih siap sebelum memakai dana sungguhan.",
    quiz: {
      q: "Tujuan utama simulasi/latihan trading adalah...",
      options: [
        "Mengejar profit virtual setinggi-tingginya",
        "Melatih proses analisis dan pengambilan keputusan tanpa risiko finansial nyata",
        "Mengganti kebutuhan belajar dasar forex",
        "Menjamin hasil yang sama saat pakai dana nyata",
      ],
      correct: 1,
      explain: "Simulasi soal melatih proses dan disiplin, bukan soal angka profit virtualnya sendiri.",
    },
  },
  {
    id: "wait-adalah-keputusan",
    title: "\"WAIT\" Juga Sebuah Keputusan",
    body:
      "Ketika kondisi chart tidak jelas atau tidak sesuai kriteria trading plan, memilih untuk tidak membuka posisi (WAIT) adalah keputusan yang sama validnya dengan BUY atau SELL. Keputusan untuk tidak bertransaksi juga merupakan bagian dari disiplin trading — tidak setiap kondisi pasar harus menghasilkan sebuah transaksi.",
    quiz: {
      q: "Memilih WAIT saat kondisi chart tidak jelas menunjukkan...",
      options: [
        "Trader tidak mampu membaca chart",
        "Bagian dari disiplin — tidak setiap kondisi pasar harus menghasilkan transaksi",
        "Kesempatan yang selalu terlewat sia-sia",
        "Tanda harus segera ganti strategi"
      ],
      correct: 1,
      explain: "WAIT adalah keputusan sah ketika kriteria entry di trading plan belum terpenuhi.",
    },
  },
  {
    id: "latihan-analisis-chart",
    title: "Latihan: Menyusun Analisis Chart",
    body:
      "Sebelum entry, coba susun analisis singkat: apa arah tren di timeframe utama? Di mana area support/resistance terdekat? Apakah ada confluence (beberapa sinyal yang sejalan)? Menuliskan alasan analisis ini — bukan cuma 'merasa yakin' — membuat evaluasi setelahnya jauh lebih mudah.",
    quiz: {
      q: "Analisis chart yang baik sebaiknya...",
      options: [
        "Cukup berdasarkan perasaan yakin saat itu",
        "Dituliskan alasannya secara eksplisit (tren, S/R, confluence) sebelum entry",
        "Dilakukan setelah posisi dibuka",
        "Diabaikan kalau sudah pakai indikator",
      ],
      correct: 1,
      explain: "Menuliskan alasan analisis membuatnya bisa dievaluasi — beda dengan sekadar 'merasa yakin'.",
    },
  },
  {
    id: "latihan-risk-management",
    title: "Latihan: Menerapkan Risk Management",
    body:
      "Coba terapkan pada satu skenario: modal virtual Rp5.000.000, risiko 1% per transaksi, Stop Loss 25 pip. Sebelum entry, hitung dulu: berapa batas risiko dalam Rupiah? (gunakan Risk Calculator di menu Calculator). Latihan ini membiasakan diri menghitung risiko dulu sebelum menentukan besar posisi — bukan sebaliknya.",
    quiz: {
      q: "Urutan yang benar dalam menerapkan risk management sebelum entry adalah...",
      options: [
        "Tentukan lot besar dulu, baru hitung risikonya belakangan",
        "Tentukan risiko (%) dan Stop Loss dulu, baru hitung besar posisi yang sesuai",
        "Abaikan perhitungan, ikuti perasaan saja",
        "Hitung risiko setelah posisi ditutup",
      ],
      correct: 1,
      explain: "Risk management yang sehat dimulai dari batas risiko dan SL, baru menurunkan besar posisi yang sesuai — bukan sebaliknya.",
    },
  },
  {
    id: "menyusun-trading-plan-sederhana",
    title: "Menyusun Trading Plan Sederhana",
    body:
      "Trading plan sederhana menjawab beberapa pertanyaan kunci: instrumen apa yang dipelajari, timeframe apa yang dipakai, kriteria entry seperti apa, di mana Stop Loss dan Take Profit ditempatkan, berapa risiko maksimal per transaksi, dan apa yang dilakukan saat emosi sedang tinggi. Trading plan ditulis di luar posisi terbuka, saat kepala masih dingin.",
    quiz: {
      q: "Trading plan idealnya disusun...",
      options: [
        "Di tengah-tengah posisi terbuka, saat harga bergerak cepat",
        "Sebelum trading, saat kepala masih dingin dan tidak sedang emosional",
        "Setelah mengalami kerugian besar",
        "Tidak perlu ditulis, cukup diingat-ingat saja",
      ],
      correct: 1,
      explain: "Trading plan paling efektif dibuat di luar tekanan posisi terbuka, dengan pikiran jernih.",
    },
  },
  {
    id: "evaluasi-learning-score",
    title: "Evaluasi & Learning Score",
    body:
      "Setelah latihan/simulasi, yang paling berguna dievaluasi bukan cuma untung-rugi virtualnya, tapi apakah proses yang dijalani sudah sesuai trading plan: apakah entry sesuai kriteria, apakah risk management diterapkan, apakah emosi memengaruhi keputusan. 'Learning Score' menilai konsistensi proses ini — bukan jaminan atau prediksi keberhasilan trading sungguhan di masa depan.",
    quiz: {
      q: "Learning Score pada platform ini menilai...",
      options: [
        "Jaminan keberhasilan trading di masa depan",
        "Konsistensi proses belajar dan penerapan risk management/trading plan",
        "Besarnya profit virtual yang didapat",
        "Kecepatan mengambil keputusan entry",
      ],
      correct: 1,
      explain: "Learning Score fokus pada proses dan konsistensi belajar, bukan prediksi atau jaminan hasil trading nyata.",
    },
  },
];

export const LESSON_LEVELS = { fundamental, chart, technical, risk, psychology, simulation };

// Flat lookup used by the Lesson page: id -> lesson (with its levelKey attached)
export const ALL_LESSONS = Object.entries(LESSON_LEVELS).flatMap(([levelKey, lessons]) =>
  lessons.map((lesson) => ({ ...lesson, levelKey }))
);

export function findLesson(id) {
  return ALL_LESSONS.find((l) => l.id === id) || null;
}

// Backward-compatible export (Level 1 only) for any code not yet migrated.
export const LESSONS = fundamental;
