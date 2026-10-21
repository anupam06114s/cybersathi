# 🛡️ CyberSathi — Cyber Crime Assistance & Intelligence Portal

> **CyberSathi** ek advanced digital cyber crime assistance aur phone intelligence platform hai. Ye users ko fraud detection, cyber victim guidance, helpline reporting aur real-time geographic route tracing provide karta hai.

---

## 🌟 Key Features

### 1. 🔍 Phone Intelligence & Number Lookup
- **Live Caller Verification**: Telecom metadata, circle info, carrier details aur subscriber profile retrieve karta hai.
- **Smart Data Parsing**: Raw telecom records se clean information extract karke structured view me present karta hai.

### 2. 🗺️ Precision Location Tracing & Navigation
- **Filter-Optimized Geocoding**: Telecom address se sensitive identity details (jaise Father's Name, personal names, flat/house numbers) ko automatically filter karta hai taaki geocoding accurate ho sake.
- **Village / District Level Tracking**: Direct village, tehsil, city, district ya state coordinates identify karta hai.
- **Straight-Line Distance (Aerial)**: Origin se destination ke beech precise Haversine distance calculate karta hai.
- **Compass Direction**: Geographic bearing (North, North-East, East, South-East, South, South-West, West, North-West) display karta hai.
- **Interactive Routing**: Turn-by-turn road route, road distance, estimated travel time aur embedded live interactive maps (Driving, Walking, Cycling).

### 3. 🚨 Cyber Pidita Awareness & Help Desk
- **Interactive Awareness Banners**: Financial fraud, identity theft, women safety aur cyber awareness carousels.
- **Step-by-Step Reporting Guides**:
  - Financial Fraud & UPI scams reporting
  - Women safety & online harassment protocols
  - Fake identity / social media imposter accounts
  - SIM swap & OTP extortion remedies
- **National Helplines**: Instant access to National Cyber Crime Helpline (1930) and cybercrime.gov.in portal guidance.

### 4. 💬 Integrated Cyber Assistant
- **AI/Quick Assistance Chatbot**: 24/7 basic query resolution, safety guidelines aur emergency response advice.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: Tailwind CSS & Tailwind Animate
- **Icons**: Lucide React & React Icons
- **Mapping & Geocoding**: OpenStreetMap Nominatim & Open Source Routing Machine (OSRM)
- **Language**: TypeScript

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.17 or higher recommended)
- npm / yarn / pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anupam06114s/cybersathi.git
   cd cybersathi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔒 Privacy & Security

- **Hidden Endpoint Architecture**: Internal proxy routes secure external APIs and prevent exposing sensitive upstream endpoints directly to the client browser.
- **Identity Redaction**: Location tracing module personal identity attributes ko clean karke sirf district/village level geocodes use karta hai.

---

## 👤 Author & Support

- **Developer**: Anupam
- **Telegram**: [@anupam0611](https://t.me/anupam0611)
- **Repository**: [github.com/anupam06114s/cybersathi](https://github.com/anupam06114s/cybersathi)
