# 💧 AquaHarvest.AI — Rainwater Harvesting Calculator & Hydrological Optimizer

A modern, responsive web application for civil engineering students, homeowners, sustainability researchers, and facility managers to calculate, size, optimize, and track **Rainwater Harvesting (RWH)** systems.

Powered by **Next.js 14 (App Router)**, **Tailwind CSS**, **Supabase Database Persistence**, and **Google Gemini AI**.

---

## 🌟 Key Features

1. **Hydrological Calculation Engine**:
   - British / American standard civil engineering formula: $V = P \times A \times C_r \times \eta$
   - 7 Roof materials (Metal GI sheets, Concrete RCC flat roofs, Terracotta clay tiles, Slate, Asphalt shingles, Paved courtyards, Green sedum roofs) with scientifically calibrated runoff coefficients ($C_r$).
   - First-flush diverter and filtration loss efficiency settings.
   - Built-in meteorological rainfall profiles (Bangalore, Mumbai, Delhi, London, Seattle, Melbourne, Nairobi) or custom 12-month precipitation entry.

2. **Occupant Demand & Water Balance Simulation**:
   - Facility profiles: Residential home, School/College campus, Hostel, Commercial office, Agricultural farm.
   - Per-capita LPCD (Litres per capita per day) demand and usage segregation (Toilet flushing, Gardening/irrigation, Laundry washing, Drinking/potable).
   - Dynamic 12-month mass-balance curve simulating cumulative storage, dry-period autonomy days, overflow spill, and municipal deficit top-up.

3. **Smart Tank & Artificial Aquifer Recharge Sizing**:
   - Tank material selector & comparison (HDPE Polyethylene, Cast-in-place RCC Sump, Ferrocement, Masonry) with placement recommendations, durability, and cost per litre.
   - Artificial aquifer percolation pit & borewell recharge well sizing (diameter, depth, retention volume, infiltration rate based on soil classification: sandy, silty loam, laterite, clay).

4. **Financial ROI & Carbon Mitigation**:
   - Capital expenditure (Tank + Filter system + Guttering & piping).
   - Annual municipal utility bill savings ($/year) based on local water tariffs ($/kL).
   - Simple payback horizon (years).
   - Carbon offset calculator ($kg\text{ CO}_2/\text{year}$) from avoiding centralized pumping grid energy.

5. **Google Gemini AI Hydrological Advisor**:
   - Autonomous site feasibility rating (1-100).
   - Civil engineering executive summary & actionable optimization insights.
   - Tailored filtration hierarchy (First-flush diverter, dual-media sand/gravel, activated carbon, UV).
   - Seasonal preventative maintenance checklist (Pre-monsoon, monthly, post-monsoon, annually).
   - Interactive **"Ask Gemini AI"** site-specific Q&A assistant for custom engineering questions.

6. **Dual Persistence (Supabase + Local Storage)**:
   - Full offline functionality using browser storage out-of-the-box.
   - 1-click cloud sync with Supabase PostgreSQL database table with Row-Level Security (RLS).
   - Built-in SQL schema generator and connection tester.

7. **Export & Reporting Engine**:
   - Instant CSV data download for research and spreadsheets.
   - Printable engineering assessment report formatted for PDF saving and client handover.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ (tested on Node.js v20.18.0 LTS)
- npm or pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (Optional)
Create a `.env.local` file in the root folder:
```env
# Optional: Pre-configured Supabase project
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Optional: Server-side Google Gemini API Key
GEMINI_API_KEY=AIzaSy...
```
*(Note: Users can also input Supabase credentials and Gemini API keys directly in the UI modals at runtime!)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Cloud Database Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run the following script:
```sql
create table if not exists public.rwh_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  property_type text default 'residential',
  inputs jsonb not null,
  results jsonb not null,
  ai_analysis jsonb,
  status text default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.rwh_projects enable row level security;

create policy "Allow public access to rwh_projects"
  on public.rwh_projects
  for all
  using (true)
  with check (true);
```
3. Copy your **Project URL** and **anon public key** from `Project Settings > API` and paste them into the **Supabase Sync** modal in the app navbar.

---

## ☁️ Milestone 5: Deploying to Vercel

Deploying this Next.js application to Vercel takes less than 2 minutes:

### Option A: Via GitHub (Recommended)
1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AquaHarvest AI platform"
   ```
2. Push your repository to GitHub or GitLab.
3. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
4. (Optional) Add your environment variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
5. Click **Deploy**. Vercel will automatically build and assign a production URL (e.g. `https://rainwater-harvesting-calculator.vercel.app`).

### Option B: Via Vercel CLI
```bash
npx vercel
```
Follow the interactive prompts to deploy directly from your terminal.

---

## 📚 Hydrological Mathematical Reference

$$\text{Annual Harvest Potential } (V) = P \times A \times C_r \times \eta_{filter}$$
$$\text{Daily Demand } (D_{daily}) = N_{occupants} \times LPCD \times \sum (\text{Usage Factors})$$
$$\text{Optimal Tank Capacity } (V_{tank}) = \min(D_{daily} \times T_{dry}, 0.18 \times V)$$
$$\text{Percolation Pit Volume } (V_{pit}) = \frac{I_{peak} \times A \times C_r \times t}{1000}$$
