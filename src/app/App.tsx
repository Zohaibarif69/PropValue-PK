import { useState, useMemo } from "react";
import {
  Building2, MapPin, BedDouble, ShowerHead,
  CalendarDays, TrendingUp, TrendingDown, Minus, FileText,
} from "lucide-react";
import { PriceBreakdownChart } from "./components/PriceBreakdownChart";
import { SummaryModal, type EstimateData } from "./components/SummaryModal";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { useLanguage } from "../i18n/LanguageContext";
import { t } from "../i18n/translations";

/* ─── Data ────────────────────────────────────────────────────────────── */
const CITIES = [
  "Islamabad", "DHA Lahore", "Bahria Town Lahore",
  "Bahria Town Karachi", "Lahore", "Karachi",
  "Rawalpindi", "Gulshan-e-Iqbal", "Sialkot",
  "Gujranwala", "Faisalabad", "Multan", "Peshawar", "Quetta",
];

const CITY_MULTIPLIERS: Record<string, number> = {
  "Islamabad": 1.4, "DHA Lahore": 1.35, "Bahria Town Lahore": 1.25,
  "Bahria Town Karachi": 1.2, "Lahore": 1.15, "Karachi": 1.1,
  "Rawalpindi": 1.0, "Gulshan-e-Iqbal": 1.05, "Sialkot": 0.95,
  "Gujranwala": 0.9, "Faisalabad": 0.9, "Multan": 0.85,
  "Peshawar": 0.8, "Quetta": 0.75,
};

const BASE_PER_MARLA = 5_000_000;

/* ─── Helpers ─────────────────────────────────────────────────────────── */
function fmtPKR(v: number) {
  if (v >= 10_000_000) return `₨ ${(v / 10_000_000).toFixed(2)} Crore`;
  if (v >= 100_000)    return `₨ ${(v / 100_000).toFixed(2)} Lakh`;
  return `₨ ${v.toLocaleString()}`;
}

/* ─── Sub-components ──────────────────────────────────────────────────── */
function Counter({
  value, min, max, onChange,
}: { value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-9 h-9 rounded-xl border border-border bg-white hover:bg-muted flex items-center justify-center transition-colors text-foreground"
        style={{ fontSize: 18 }}
      >−</button>
      <span className="w-6 text-center text-foreground" style={{ fontWeight: 600 }}>{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-9 h-9 rounded-xl border border-border bg-white hover:bg-muted flex items-center justify-center transition-colors text-foreground"
        style={{ fontSize: 18 }}
      >+</button>
    </div>
  );
}

function MetricCard({
  label, value, sub, accent,
}: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-1 shadow-sm">
      <p className="text-xs text-muted-foreground" style={{ letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{label}</p>
      <p className="text-foreground" style={{ fontWeight: 700, fontSize: "1.05rem" }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: accent ?? "#9ca3af" }}>{sub}</p>}
    </div>
  );
}

function Tag({ children, variant }: { children: React.ReactNode; variant: "indigo" | "amber" | "emerald" | "slate" }) {
  const styles: Record<string, string> = {
    indigo:  "bg-indigo-50 text-indigo-600 border border-indigo-100",
    amber:   "bg-amber-50  text-amber-600  border border-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    slate:   "bg-slate-50  text-slate-500  border border-slate-100",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${styles[variant]}`} style={{ fontWeight: 600 }}>
      {children}
    </span>
  );
}

/* ─── App ─────────────────────────────────────────────────────────────── */
export default function App() {
  const { language } = useLanguage();
  const [city, setCity]             = useState("Lahore");
  const [marla, setMarla]           = useState(5);
  const [bedrooms, setBedrooms]     = useState(3);
  const [bathrooms, setBathrooms]   = useState(2);
  const [propertyAge, setPropertyAge] = useState(5);
  const [showModal, setShowModal]   = useState(false);

  const est = useMemo(() => {
    const cityMult  = CITY_MULTIPLIERS[city] ?? 1.0;
    const base      = marla * BASE_PER_MARLA * cityMult;
    const ageFactor = propertyAge > 10 ? 0.9  : 1.0;
    const bedFactor = bedrooms   > 3   ? 1.05 : 1.0;
    const land      = base * 0.6;
    const built     = base * 0.4 * ageFactor * bedFactor;
    return {
      land, built,
      total: land + built,
      agePenalty:  propertyAge > 10,
      bedBonus:    bedrooms    > 3,
    };
  }, [city, marla, bedrooms, bathrooms, propertyAge]);

  const landPct  = ((est.land  / est.total) * 100).toFixed(0);
  const builtPct = ((est.built / est.total) * 100).toFixed(0);

  return (
    <div className="min-h-screen" style={{ background: "#f8f8fc" }}>

      {/* ── Header ── */}
      <header className="bg-white border-b border-border sticky top-0 z-20" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-foreground" style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.2 }}>{t("header.title", language)}</p>
            <p className="text-muted-foreground" style={{ fontSize: "0.72rem", lineHeight: 1 }}>{t("header.subtitle", language)}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700" style={{ fontSize: "0.72rem", fontWeight: 600 }}>{t("header.status", language)}</span>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Page title ── */}
        <div className="mb-7">
          <h1 className="text-foreground" style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.3 }}>
            {t("page.title", language)}
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem", marginTop: 4 }}>
            {t("page.description", language)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* ══ LEFT – Inputs ══ */}
          <div className="lg:col-span-2 space-y-4">

            {/* Form card */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border" style={{ background: "#fafafa" }}>
                <p className="text-foreground" style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t("form.title", language)}</p>
                <p className="text-muted-foreground" style={{ fontSize: "0.78rem", marginTop: 2 }}>{t("form.subtitle", language)}</p>
              </div>

              <div className="px-6 py-5 space-y-5">

                {/* City */}
                <div>
                  <label className="flex items-center gap-1.5 text-muted-foreground mb-2" style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    <MapPin className="w-3.5 h-3.5" /> {t("form.city", language)}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Size */}
                <div>
                  <label className="flex items-center gap-1.5 text-muted-foreground mb-2" style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    <Building2 className="w-3.5 h-3.5" /> {t("form.size", language)}
                  </label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="number" min={1} max={100} value={marla}
                      onChange={(e) => setMarla(Math.max(1, Math.min(100, Number(e.target.value))))}
                      className="w-20 px-3 py-2.5 rounded-xl border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow"
                      style={{ fontSize: "0.875rem" }}
                    />
                    <div className="flex gap-1.5">
                      {[3, 5, 7, 10, 20].map((v) => (
                        <button
                          key={v} onClick={() => setMarla(v)}
                          className="px-3 py-1.5 rounded-lg transition-all"
                          style={{
                            fontSize: "0.78rem", fontWeight: 600,
                            background: marla === v ? "#6366f1" : "#f0f0f5",
                            color: marla === v ? "#fff" : "#717182",
                          }}
                        >{v}M</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Beds & Baths */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-muted-foreground mb-2" style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      <BedDouble className="w-3.5 h-3.5" /> {t("form.bedrooms", language)}
                    </label>
                    <Counter value={bedrooms} min={1} max={10} onChange={setBedrooms} />
                    {bedrooms > 3 && (
                      <div className="mt-2">
                        <Tag variant="emerald"><TrendingUp className="w-3 h-3" /> {t("tags.premium", language)}</Tag>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-muted-foreground mb-2" style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      <ShowerHead className="w-3.5 h-3.5" /> {t("form.bathrooms", language)}
                    </label>
                    <Counter value={bathrooms} min={1} max={10} onChange={setBathrooms} />
                  </div>
                </div>

                {/* Age slider */}
                <div>
                  <label className="flex items-center gap-1.5 text-muted-foreground mb-2" style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    <CalendarDays className="w-3.5 h-3.5" /> {t("form.age", language)}
                    <span className="ml-auto text-indigo-600" style={{ fontWeight: 700, fontSize: "0.85rem", textTransform: "none", letterSpacing: 0 }}>
                      {propertyAge === 0 ? t("form.age.brand_new", language) : `${propertyAge} ${t(propertyAge === 1 ? "form.age.years" : "form.age.years_plural", language)}`}
                    </span>
                  </label>
                  <input
                    type="range" min={0} max={40} value={propertyAge}
                    onChange={(e) => setPropertyAge(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between mt-1.5">
                    <span className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>{t("form.age.brand_new", language)}</span>
                    <span style={{ fontSize: "0.72rem", color: propertyAge > 10 ? "#d97706" : "#9ca3af", fontWeight: propertyAge > 10 ? 600 : 400 }}>
                      {propertyAge > 10 ? t("form.age.deduction", language) : t("form.age.no_deduction", language)}
                    </span>
                    <span className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>40 yrs</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Pricing rules */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <p className="text-foreground mb-3" style={{ fontWeight: 600, fontSize: "0.875rem" }}>{t("rules.title", language)}</p>
              <ul className="space-y-2.5">
                {[
                  { icon: "₨", bg: "bg-indigo-50", textKey: "rules.base_rate", color: "text-indigo-500" },
                  { icon: "×", bg: "bg-blue-50",   textKey: "rules.city_multiplier", color: "text-blue-500" },
                  { icon: "↓", bg: "bg-amber-50",  textKey: "rules.age_deduction", color: "text-amber-500" },
                  { icon: "↑", bg: "bg-emerald-50",textKey: "rules.bedroom_bonus", color: "text-emerald-500" },
                ].map(({ icon, bg, textKey, color }) => (
                  <li key={textKey} className="flex items-start gap-3">
                    <span className={`w-6 h-6 rounded-lg ${bg} ${color} flex items-center justify-center shrink-0`} style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                      {icon}
                    </span>
                    <span className="text-muted-foreground" style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>{t(textKey, language)}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* ══ RIGHT – Results ══ */}
          <div className="lg:col-span-3 space-y-4">

            {/* Hero estimate */}
            <div
              className="rounded-2xl p-7 text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 60%, #818cf8 100%)" }}
            >
              {/* subtle grid overlay */}
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 32px)" }} />

              <p className="text-indigo-200 relative" style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                {t("results.estimated_value", language)}
              </p>
              <p className="text-white relative" style={{ fontSize: "2.4rem", fontWeight: 800, lineHeight: 1.1, marginBottom: 8 }}>
                {fmtPKR(est.total)}
              </p>
              <p className="text-indigo-200 relative" style={{ fontSize: "0.82rem" }}>
                {marla} Marla &middot; {bedrooms} Bed &middot; {bathrooms} Bath &middot; {propertyAge === 0 ? t("form.age.brand_new", language) : `${propertyAge} yr old`} &middot; {city}
              </p>

              <div className="flex flex-wrap gap-2 mt-5 relative">
                <Tag variant="indigo">
                  <span>{t("tags.city_multiplier", language, { multiplier: CITY_MULTIPLIERS[city] ?? 1.0 })}</span>
                </Tag>
                {est.agePenalty ? (
                  <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs bg-amber-400/20 text-amber-200 border border-amber-300/30" style={{ fontWeight: 600 }}>
                    <TrendingDown className="w-3 h-3" /> {t("results.age_deduction", language)}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs bg-white/10 text-indigo-200 border border-white/20" style={{ fontWeight: 600 }}>
                    <Minus className="w-3 h-3" /> {t("results.no_age_deduction", language)}
                  </span>
                )}
                {est.bedBonus && (
                  <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs bg-emerald-400/20 text-emerald-200 border border-emerald-300/30" style={{ fontWeight: 600 }}>
                    <TrendingUp className="w-3 h-3" /> {t("results.bedroom_bonus", language)}
                  </span>
                )}
              </div>

              {/* CTA — only active once a non-zero estimate exists */}
              <button
                onClick={() => setShowModal(true)}
                disabled={est.total <= 0}
                className="mt-5 relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ fontWeight: 700, fontSize: "0.85rem" }}
              >
                <FileText className="w-4 h-4" />
                {t("results.view_summary", language)}
                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-600" style={{ fontSize: "0.65rem", fontWeight: 700 }}>{t("results.tax_fx", language)}</span>
              </button>
            </div>

            {/* 3 metric tiles */}
            <div className="grid grid-cols-3 gap-3">
              <MetricCard
                label={t("metrics.land_cost", language)}
                value={fmtPKR(est.land)}
                sub={`${landPct}% ${t("metrics.of_total", language)}`}
                accent="#6366f1"
              />
              <MetricCard
                label={t("metrics.construction", language)}
                value={fmtPKR(est.built)}
                sub={`${builtPct}% ${t("metrics.of_total", language)}`}
                accent="#10b981"
              />
              <MetricCard
                label={t("metrics.rate_per_marla", language)}
                value={fmtPKR(est.total / marla)}
                sub={t("metrics.city_factor", language, { multiplier: CITY_MULTIPLIERS[city] ?? 1.0 })}
                accent="#f59e0b"
              />
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <p className="text-foreground mb-0.5" style={{ fontWeight: 700, fontSize: "0.95rem" }}>{t("chart.title", language)}</p>
              <p className="text-muted-foreground mb-5" style={{ fontSize: "0.8rem" }}>
                {t("chart.description", language)}
              </p>
              <PriceBreakdownChart landCost={est.land} constructionValue={est.built} />

              {/* Legend */}
              <div className="flex items-center gap-5 mt-3 justify-center">
                {[
                  { color: "#6366f1", labelKey: "chart.legend.land" },
                  { color: "#10b981", labelKey: "chart.legend.construction" },
                  { color: "#f59e0b", labelKey: "chart.legend.total" },
                ].map(({ color, labelKey }) => (
                  <div key={labelKey} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                    <span className="text-muted-foreground" style={{ fontSize: "0.78rem", fontWeight: 500 }}>{t(labelKey, language)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribution bars */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <p className="text-foreground mb-4" style={{ fontWeight: 700, fontSize: "0.95rem" }}>{t("distribution.title", language)}</p>
              <div className="space-y-4">
                {[
                  { labelKey: "distribution.land",    value: est.land,  pct: Number(landPct),  color: "#6366f1", bg: "bg-indigo-500" },
                  { labelKey: "distribution.construction", value: est.built, pct: Number(builtPct), color: "#10b981", bg: "bg-emerald-500" },
                ].map(({ labelKey, value, pct, color, bg }) => (
                  <div key={labelKey}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-foreground" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{t(labelKey, language)}</span>
                      <span className="flex items-center gap-3">
                        <span className="text-muted-foreground" style={{ fontSize: "0.78rem" }}>{fmtPKR(value)}</span>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color }}>{pct}%</span>
                      </span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${bg} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <p className="text-center text-muted-foreground mt-8" style={{ fontSize: "0.75rem" }}>
          {t("footer.disclaimer", language)}
        </p>
      </div>

      {/* ── Summary Modal ── */}
      {showModal && (
        <SummaryModal
          data={{
            city, marla, bedrooms, bathrooms, propertyAge,
            land: est.land, built: est.built, total: est.total,
            agePenalty: est.agePenalty, bedBonus: est.bedBonus,
            cityMultiplier: CITY_MULTIPLIERS[city] ?? 1.0,
          } satisfies EstimateData}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
