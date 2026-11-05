/**
 * Sindh Districts Dataset (STREAM 2026-27)
 * Contains all 30 districts of Sindh with coordinates, English/Urdu/Sindhi names,
 * administrative division, and geographic vulnerability tags.
 */

const SINDH_DISTRICTS = [
  // --- Karachi Division ---
  {
    id: "karachi-central",
    name: { en: "Karachi Central", ur: "کراچی وسطی", sd: "ڪراچي سينٽرل" },
    division: "Karachi",
    lat: 24.9317,
    lon: 67.0374,
    isCoastal: false,
    isRiverine: false,
    drainageType: "Urban / Stormwater nullahs (Gujjar Nullah)"
  },
  {
    id: "karachi-east",
    name: { en: "Karachi East", ur: "کراچی شرقی", sd: "ڪراچي اوڀر" },
    division: "Karachi",
    lat: 24.8844,
    lon: 67.0782,
    isCoastal: false,
    isRiverine: false,
    drainageType: "Urban / Stormwater drains"
  },
  {
    id: "karachi-south",
    name: { en: "Karachi South", ur: "کراچی جنوبی", sd: "ڪراچي ڏکڻ" },
    division: "Karachi",
    lat: 24.8607,
    lon: 67.0011,
    isCoastal: true,
    isRiverine: false,
    drainageType: "Coastal / Urban drainage"
  },
  {
    id: "karachi-west",
    name: { en: "Karachi West", ur: "کراچی غربی", sd: "ڪراچي اولهه" },
    division: "Karachi",
    lat: 24.9011,
    lon: 66.9806,
    isCoastal: true,
    isRiverine: false,
    drainageType: "Orangi & Hub River basin / Urban"
  },
  {
    id: "korangi",
    name: { en: "Korangi", ur: "کورنگی", sd: "ڪورنگي" },
    division: "Karachi",
    lat: 24.8278,
    lon: 67.1428,
    isCoastal: true,
    isRiverine: false,
    drainageType: "Malir River & Korangi Creek"
  },
  {
    id: "malir",
    name: { en: "Malir", ur: "ملیر", sd: "ملير" },
    division: "Karachi",
    lat: 24.8934,
    lon: 67.1990,
    isCoastal: true,
    isRiverine: false,
    drainageType: "Malir River flood plain / Agricultural"
  },
  {
    id: "keamari",
    name: { en: "Keamari", ur: "کیماڑی", sd: "ڪياماڙي" },
    division: "Karachi",
    lat: 24.8138,
    lon: 66.9716,
    isCoastal: true,
    isRiverine: false,
    drainageType: "Coastal port / Arabian Sea shoreline"
  },

  // --- Hyderabad Division ---
  {
    id: "hyderabad",
    name: { en: "Hyderabad", ur: "حیدرآباد", sd: "حيدرآباد" },
    division: "Hyderabad",
    lat: 25.3960,
    lon: 68.3578,
    isCoastal: false,
    isRiverine: true,
    drainageType: "Indus River downstream / Kotri Barrage"
  },
  {
    id: "dadu",
    name: { en: "Dadu", ur: "دادو", sd: "دادو" },
    division: "Hyderabad",
    lat: 26.7329,
    lon: 67.7769,
    isCoastal: false,
    isRiverine: true,
    drainageType: "Indus River Right Bank / Manchar Lake floodway"
  },
  {
    id: "jamshoro",
    name: { en: "Jamshoro", ur: "جامشورو", sd: "ڄامشورو" },
    division: "Hyderabad",
    lat: 25.4361,
    lon: 68.2811,
    isCoastal: false,
    isRiverine: true,
    drainageType: "Indus River Kotri Barrage reservoir & Kohistan hill torrents"
  },
  {
    id: "matiari",
    name: { en: "Matiari", ur: "مٹیاری", sd: "مٽياري" },
    division: "Hyderabad",
    lat: 25.5971,
    lon: 68.4467,
    isCoastal: false,
    isRiverine: true,
    drainageType: "Indus River Left Bank"
  },
  {
    id: "tando-allahyar",
    name: { en: "Tando Allahyar", ur: "ٹنڈو الہ یار", sd: "ٽنڊو الهيار" },
    division: "Hyderabad",
    lat: 25.4605,
    lon: 68.7176,
    isCoastal: false,
    isRiverine: false,
    drainageType: "Naseer Canal & Rohri Canal system"
  },
  {
    id: "tando-muhammad-khan",
    name: { en: "Tando Muhammad Khan", ur: "ٹنڈو محمد خان", sd: "ٽنڊو محمد خان" },
    division: "Hyderabad",
    lat: 25.1278,
    lon: 68.5361,
    isCoastal: false,
    isRiverine: true,
    drainageType: "Indus River Left Bank / Fuleli Canal"
  },
  {
    id: "badin",
    name: { en: "Badin", ur: "بدین", sd: "بدين" },
    division: "Hyderabad",
    lat: 24.6560,
    lon: 68.8378,
    isCoastal: true,
    isRiverine: false,
    drainageType: "Left Bank Outfall Drain (LBOD) & Coastal tidal surge"
  },
  {
    id: "sujawal",
    name: { en: "Sujawal", ur: "سجاول", sd: "سجاول" },
    division: "Banbhore",
    lat: 24.6061,
    lon: 68.0778,
    isCoastal: true,
    isRiverine: true,
    drainageType: "Lower Indus Delta & Coastal creeks"
  },
  {
    id: "thatta",
    name: { en: "Thatta", ur: "ٹھٹہ", sd: "ٺٽو" },
    division: "Banbhore",
    lat: 24.7475,
    lon: 67.9236,
    isCoastal: true,
    isRiverine: true,
    drainageType: "Indus River Delta / Keenjhar Lake overflow"
  },

  // --- Sukkur Division ---
  {
    id: "sukkur",
    name: { en: "Sukkur", ur: "سکھر", sd: "سکر" },
    division: "Sukkur",
    lat: 27.7052,
    lon: 68.8574,
    isCoastal: false,
    isRiverine: true,
    drainageType: "Indus River main stem / Historic Sukkur Barrage"
  },
  {
    id: "ghotki",
    name: { en: "Ghotki", ur: "گھوٹکی", sd: "گهوٽڪي" },
    division: "Sukkur",
    lat: 28.0060,
    lon: 69.3161,
    isCoastal: false,
    isRiverine: true,
    drainageType: "Indus River Left Bank / Guddu Barrage pond area"
  },
  {
    id: "khairpur",
    name: { en: "Khairpur", ur: "خیرپور", sd: "خيرپور" },
    division: "Sukkur",
    lat: 27.5295,
    lon: 68.7592,
    isCoastal: false,
    isRiverine: true,
    drainageType: "Indus River Left Bank / Rohri & Mirwah Canals"
  },

  // --- Larkana Division ---
  {
    id: "larkana",
    name: { en: "Larkana", ur: "لاڑکانہ", sd: "لاڙڪاڻو" },
    division: "Larkana",
    lat: 27.5590,
    lon: 68.2120,
    isCoastal: false,
    isRiverine: true,
    drainageType: "Indus River Right Bank / Rice Canal network"
  },
  {
    id: "kambar-shahdadkot",
    name: { en: "Kambar Shahdadkot", ur: "قمبر شہداد کوٹ", sd: "قمبر شهدادڪوٽ" },
    division: "Larkana",
    lat: 27.5878,
    lon: 67.9944,
    isCoastal: false,
    isRiverine: false,
    drainageType: "Kirthar Range hill torrents (Nai Gaj) & Hamal Lake"
  },
  {
    id: "shikarpur",
    name: { en: "Shikarpur", ur: "شکارپور", sd: "شڪارپور" },
    division: "Larkana",
    lat: 27.9570,
    lon: 68.6378,
    isCoastal: false,
    isRiverine: true,
    drainageType: "Indus basin canal floodways"
  },
  {
    id: "jacobabad",
    name: { en: "Jacobabad", ur: "یعقوب آباد / جیکب آباد", sd: "جئڪب آباد" },
    division: "Larkana",
    lat: 28.2835,
    lon: 68.4385,
    isCoastal: false,
    isRiverine: false,
    drainageType: "Balochistan flash flood runoff & Sindh-Balochistan border"
  },
  {
    id: "kashmore",
    name: { en: "Kashmore", ur: "کشمور", sd: "ڪشمور" },
    division: "Larkana",
    lat: 28.4333,
    lon: 69.5833,
    isCoastal: false,
    isRiverine: true,
    drainageType: "Indus River entry into Sindh / Guddu Barrage upstream"
  },

  // --- Mirpur Khas Division ---
  {
    id: "mirpur-khas",
    name: { en: "Mirpur Khas", ur: "میرپور خاص", sd: "ميرپور خاص" },
    division: "Mirpur Khas",
    lat: 25.5251,
    lon: 69.0159,
    isCoastal: false,
    isRiverine: false,
    drainageType: "Jamrao Canal & Mithrao Canal drainage"
  },
  {
    id: "umerkot",
    name: { en: "Umerkot", ur: "عمرکوٹ", sd: "عمرڪوٽ" },
    division: "Mirpur Khas",
    lat: 25.3616,
    lon: 69.7369,
    isCoastal: false,
    isRiverine: false,
    drainageType: "Thar desert fringe & agricultural drainage"
  },
  {
    id: "tharparkar",
    name: { en: "Tharparkar (Mithi)", ur: "تھرپارکر (مٹھی)", sd: "ٿرپارڪر (مٺي)" },
    division: "Mirpur Khas",
    lat: 24.7438,
    lon: 69.7972,
    isCoastal: false,
    isRiverine: false,
    drainageType: "Desert sand dunes / drought & flash rain flash flooding"
  },

  // --- Shaheed Benazirabad Division ---
  {
    id: "shaheed-benazirabad",
    name: { en: "Shaheed Benazirabad (Nawabshah)", ur: "شہید بینظیر آباد (نوابشاہ)", sd: "شهيد بينظير آباد (نوابشاهه)" },
    division: "Shaheed Benazirabad",
    lat: 26.2483,
    lon: 68.4096,
    isCoastal: false,
    isRiverine: true,
    drainageType: "Indus River Left Bank & Rohri canal command"
  },
  {
    id: "sanghar",
    name: { en: "Sanghar", ur: "سانگھڑ", sd: "سانگهڙ" },
    division: "Shaheed Benazirabad",
    lat: 26.0464,
    lon: 68.9481,
    isCoastal: false,
    isRiverine: false,
    drainageType: "Nara Canal & Chotiari Reservoir area"
  },
  {
    id: "naushahro-feroze",
    name: { en: "Naushahro Feroze", ur: "نوشہرو فیروز", sd: "نوشهرو فيروز" },
    division: "Shaheed Benazirabad",
    lat: 26.8401,
    lon: 68.1227,
    isCoastal: false,
    isRiverine: true,
    drainageType: "Indus River Left Bank embankment"
  }
];

module.exports = { SINDH_DISTRICTS };
