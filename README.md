# PropValue PK

Real Estate Value Estimator is a React + Vite app for estimating property value in Pakistan. It calculates a live market estimate based on city, marla size, bedrooms, bathrooms, and property age.

## Features

- City/area-based pricing
- Input for property size in marla
- Bedroom and bathroom controls
- Property age adjustment
- Instant valuation updates
- Value breakdown chart
- Detailed summary modal
- PDF export for estimates
- English and Urdu language support

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- jsPDF

## Project Structure

```text
Real Estate Value Estimator/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── components/
│   │       ├── PriceBreakdownChart.tsx
│   │       ├── SummaryModal.tsx
│   │       └── LanguageSwitcher.tsx
│   ├── i18n/
│   │   ├── LanguageContext.tsx
│   │   └── translations.ts
│   ├── main.tsx
│   └── styles/
├── index.html
├── package.json
├── vite.config.ts
├── pnpm-workspace.yaml
└── README.md
```

## How to Run

### Install dependencies

```bash
pnpm install
```

### Start development server

```bash
pnpm dev
```

### Build for production

```bash
pnpm build
```

## Notes

This project is a front-end estimate tool based on a simplified pricing model. It is useful for quick property valuation demos and local market estimation, not for official legal appraisal.
