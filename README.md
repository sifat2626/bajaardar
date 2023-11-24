# ⚖️ BajaarDar (বাজার দর) — Bangladesh Daily Commodity & Kitchen Market Tracker

> A modern, real-time public commodity price index and kitchen market tracker for Bangladesh. Compare retail grocery prices against wholesale hubs like **Karwan Bazar (কাওরান বাজার)** and **Khatunganj (খাতুনগঞ্জ)**, calculate your household grocery budget, and contribute crowdsourced market prices.

---

## 🌟 Key Features

1. **📊 Live Daily Price Index (আজকের বাজার দর):**
   - Categorized by **Rice (চাল)**, **Vegetables (শাক-সবজি)**, **Spices & Cooking Oils (তেল ও মসলা)**, and **Protein & Fish (মাছ, মাংস ও ডিম)**.
   - Shows live retail prices vs. central wholesale prices (e.g., Karwan Bazar, Shyam Bazar, Khatunganj).
   - 24-hour price change pills with indicators (▲ price inflation or ▼ price drop).
   - Official **TCB (Trading Corporation of Bangladesh)** ceiling and benchmark indicators.

2. **📈 7-Day Price Trajectory & Sparklines:**
   - Interactive, lightweight SVG sparkline for every commodity showing weekly price momentum.
   - Detailed modal with historic day-by-day prices.

3. **🧺 Smart Kitchen Basket Budget Calculator (বাজারের থলে ও খরচের হিসাব):**
   - Select daily grocery items (e.g., 5kg Miniket rice, 2kg potatoes, 1 dozen eggs, 1kg chicken) and set custom quantities.
   - Instant calculation of total retail budget vs. wholesale equivalent.
   - Visual calculation of **Wholesale Savings Potential (সাশ্রয়)**.

4. **📢 Crowdsourced Verified Market Reports (দর রিপোর্ট করুন):**
   - Consumers and local vendors can submit real-time prices from any market across the 8 Divisions and 64 Districts of Bangladesh.

5. **🌐 Full Bilingual Support (বাংলা / English):**
   - Instant one-click toggle between Bengali (বাংলা) and English.

6. **⚡ Resilient Architecture (Zero-Downtime Guarantee):**
   - Native integration with **MongoDB Atlas** via **Prisma ORM**.
   - Built-in graceful fallback to high-speed in-memory store so the platform boots up and works even before you paste your Atlas URL!

---

## 🛠️ Technology Stack

* **Backend:** Node.js, Express, TypeScript, Prisma ORM, Zod, CORS, Dotenv.
* **Database:** MongoDB Atlas (via Prisma MongoDB connector).
* **Frontend:** Next.js (App Router), TypeScript, Vanilla CSS Design System with dark glassmorphism, Lucide Icons.
* **Architecture:** Decoupled client-server with Next.js API proxy rewrites.

---

## 📂 Project Structure

```text
tanjim/
├── backend/                  # Express + TypeScript + Prisma ORM
│   ├── prisma/
│   │   └── schema.prisma     # MongoDB Atlas schema (Commodity, PriceReport, etc.)
│   ├── src/
│   │   ├── controllers/      # API Controllers (commodities, reports, basket calc)
│   │   ├── data/             # Bangladesh geo data (8 divisions, 64 districts, markets)
│   │   ├── routes/           # Express REST routes
│   │   ├── services/         # Resilient DB service with Atlas & memory fallback
│   │   ├── db.ts             # Prisma client singleton
│   │   └── index.ts          # Main Express app
│   ├── .env.example          # Environment template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Next.js (App Router) + TypeScript
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css   # Tailored dark-mode glassmorphic design system
│   │   │   ├── layout.tsx    # SEO metadata for Bangladesh market search
│   │   │   └── page.tsx      # Main dashboard with live filters and cards
│   │   ├── components/       # Sparkline, ReportModal, BasketModal, DetailModal
│   │   └── types/            # Shared TypeScript interfaces
│   ├── next.config.ts        # Next.js config with API proxy rewrites
│   ├── package.json
│   └── tsconfig.json
│
├── package.json              # Root workspace scripts to run both apps together
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ or v20+ (v24 tested)
- **npm** or **pnpm**

### 2. Environment Setup (MongoDB Atlas)
Open [backend/.env](file:///home/sifat/Projects/tanjim/backend/.env) and replace the connection string with your MongoDB Atlas URL:

```env
PORT=5000
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/roktokhoj?retryWrites=true&w=majority"
CORS_ORIGIN="http://localhost:3000"
```

> **Note:** If you run the app without setting an Atlas URL, it will automatically run in high-speed resilient mode with pre-seeded realistic data from Karwan Bazar, Mirpur-1, and Khatunganj!

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Run the Project
You can run both the Backend and Frontend with a single command from the project root:

```bash
npm run dev
```

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:5000](http://localhost:5000)

Or run them individually in separate terminals:
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

---

## 📡 Backend API Reference

### Public API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & system status |
| `GET` | `/api/commodities` | Fetch all commodities with filters (`?category=RICE&search=miniket&sortBy=price_asc`) |
| `GET` | `/api/commodities/:id` | Get single commodity with 7-day price history & crowd reports |
| `POST` | `/api/commodities/reports` | Submit crowdsourced local market price report |
| `GET` | `/api/commodities/analytics` | Fetch top price gainers, steepest drops, and category averages |
| `POST` | `/api/commodities/basket-calc` | Smart Kitchen Basket Budget Calculator |
| `GET` | `/api/geo/divisions` | Bangladesh 8 divisions and 64 districts data |
| `GET` | `/api/markets` | Major wholesale and retail markets list |
| `GET` | `/api/announcements` | Active emergency & TCB market bulletin notices |
| `GET` | `/api/settings` | Public system settings & policy status |

### Admin Control Console APIs (`/admin`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | National KPI overview & inflation indices |
| `GET`, `POST` | `/api/admin/commodities` | Fetch complete items list / add new commodity |
| `GET`, `PUT`, `DELETE` | `/api/admin/commodities/:id` | Update retail/wholesale/TCB price, supply status, delete item |
| `POST` | `/api/admin/commodities/bulk-adjust` | Bulk percentage or flat shift by category |
| `GET` | `/api/admin/reports` | Filter reports by status (`PENDING`, `VERIFIED`, `REJECTED`) |
| `PATCH`, `DELETE` | `/api/admin/reports/:id` | Approve and incorporate into live prices, or reject |
| `GET`, `POST` | `/api/admin/announcements` | Broadcast new emergency, warning, or TCB bulletin |
| `PATCH`, `DELETE` | `/api/admin/announcements/:id` | Toggle active broadcast or delete notice |
| `GET`, `POST` | `/api/admin/markets` | Manage wholesale & retail agricultural hubs |
| `PUT`, `DELETE` | `/api/admin/markets/:id` | Update operational status (`ACTIVE`, `SPECIAL_MONITOR`, `DISRUPTED`) |
| `GET`, `PUT` | `/api/admin/settings` | System controls (crowdsourcing, auto-verify, inflation threshold) |
| `POST` | `/api/admin/settings/reset` | Restore demo seed benchmarks |
| `GET` | `/api/admin/audit-logs` | Retrieve chronological audit activity |

---

## 🧪 Production Build & Testing

Build both backend and frontend for production:
```bash
npm run build
```

Both TypeScript builds complete with 0 errors and 0 warnings.
