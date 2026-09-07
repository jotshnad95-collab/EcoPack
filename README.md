# EchoPack 📦🌱
> **"Design smarter. Protect better. Waste less."**

EchoPack is an AI-powered sustainable packaging design, simulation, multi-objective optimization, and decision-support engineering platform.

Finding the optimal trade-off between **product protection, unit cost, lifecycle carbon footprint, branding, material circularity, and freight logistics** is difficult. EchoPack eliminates guesswork by combining deterministic physics calculation engines with interactive 3D simulation and AI-driven decision intelligence.

---

## 🌟 Key Features

### 1. Interactive 3D AI Design Studio
- **Three.js Viewport**: Real-time rendering of product geometry (e.g. fragile glass cosmetic bottle) inside customizable packaging enclosures.
- **Dynamic Cushioning Buffers**: Thermoformed molded pulp endcaps, honeycomb paper buffers, and bio-foam corner blocks.
- **Exploded View & X-Ray Cutaway**: Interactive layer separation and transparency modes.
- **Full Reactive Physics**: Dimension adjustments dynamically ripple through raw material mass, unit cost, carbon footprint, and BCT compression capacity.

### 2. Deterministic Engineering Engines
- **Cost Engine**: FEFCO 0201 blank area calculations, scrap factors, tooling amortization, printing, cushioning volume, and freight allocation.
- **Carbon Engine**: Cradle-to-grave LCA estimates incorporating DEFRA/GLEC freight factors (0.096 kg CO₂e/tonne-km for road), recycled fiber credits, and educational equivalents (trees planted, EV km avoided).
- **Protection Engine**: Deceleration shock calculations ($G = \frac{h}{d \cdot \eta}$) against product fragility limits, plus Box Compression Test (McKee equation $BCT = 5.876 \times ECT \times \sqrt{T \cdot Z}$).
- **Logistics & Palletization**: EUR 1200×800mm pallet packing, 53ft trailer cube utilization %, and density improvements (e.g. 1,200 baseline boxes vs 1,456 optimized boxes per truck).

### 3. Virtual Validation Lab
- **ASTM D5276 Drop Shock Test**: 0.5m to 2.0m drops across corner, edge, and face orientations with peak deceleration $G$-load gauges.
- **ISO 12048 Stacking Compression Test**: Evaluates warehouse stack height, environmental humidity degradation, and creep fatigue over 7–180 days.
- **ASTM D4169 Vibration Resonance Test**: Harmonic frequency analysis across road, rail, and air cargo spectra.

### 4. Packaging Decision Matrix
- **3D/2D Bubble Chart Visualization**: Cost ($X$-axis) vs Protection ($Y$-axis) vs Carbon Footprint (Bubble Volume).
- **Pareto Frontier**: Highlights recommended optimal designs and compares them directly with legacy baselines.

### 5. What-If Scenario Sandbox
- Perturb priority weights (Protection, Cost, Sustainability, Logistics, Material Efficiency), target budgets, or transport modes with instant delta updates.

### 6. Material Intelligence Database
- Detailed mechanical and environmental profiles across 12 packaging substrates (Corrugated C/B-Flute, Kraft Paper, Recycled Paperboard, Molded Pulp, rPET, HDPE, PLA, Starch Bioplastic, Aluminum, Glass, Mycelium Bio-Foam, Ocean-Bound Plastic).
- Side-by-side comparative radar analysis.

### 7. Global Compliance & Supplier Sourcing
- **Compliance Center**: Checklist for EU PPWR (Article 9 void space &lt;40%), California SB 54 EPR, and Indian Plastic Waste Management rules.
- **Supplier Engine**: Verified directory with MOQs, unit cost bands, lead times, and ISO/FSC/GRS certifications.
- **Industry Benchmarks**: Statistical percentiles against peer cosmetics, electronics, and fragile consumer goods.

### 8. Executive Reports & EchoCopilot
- **16-Section Engineering Report**: Instant preview, browser PDF export, and raw JSON download.
- **EchoCopilot Assistant**: Conversational AI assistant grounded in live deterministic project calculations.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **3D Graphics**: Three.js
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Architecture**: Unified Reactive Store with pure deterministic engineering calculation modules

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd echopack

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Building for Production

```bash
npm run build
```

---

## 📄 License
MIT License
