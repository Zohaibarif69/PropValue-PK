import { useEffect, useRef } from "react";
import { X, Download, Receipt, Banknote, Home, TrendingUp, TrendingDown, Minus } from "lucide-react";
import jsPDF from "jspdf";
import { useLanguage } from "../../i18n/LanguageContext";
import { t } from "../../i18n/translations";

/* ─── Types ─────────────────────────────────────────────────────────── */
export interface EstimateData {
  city: string;
  marla: number;
  bedrooms: number;
  bathrooms: number;
  propertyAge: number;
  land: number;
  built: number;
  total: number;
  agePenalty: boolean;
  bedBonus: boolean;
  cityMultiplier: number;
}

interface SummaryModalProps {
  data: EstimateData;
  onClose: () => void;
}

/* ─── Constants ─────────────────────────────────────────────────────── */
const TRANSFER_TAX_RATE = 0.02;
const AGENCY_FEE_RATE   = 0.01;

const FX: Record<string, { rate: number; symbol: string; flag: string }> = {
  USD: { rate: 0.0035,  symbol: "$",  flag: "🇺🇸" },
  GBP: { rate: 0.00277, symbol: "£",  flag: "🇬🇧" },
  EUR: { rate: 0.00323, symbol: "€",  flag: "🇪🇺" },
};

/* ─── Helpers ───────────────────────────────────────────────────────── */
function fmtPKR(v: number) {
  if (v >= 10_000_000) return `₨ ${(v / 10_000_000).toFixed(2)} Crore`;
  if (v >= 100_000)    return `₨ ${(v / 100_000).toFixed(2)} Lakh`;
  return `₨ ${v.toLocaleString("en-PK")}`;
}

function fmtFX(v: number, rate: number, symbol: string) {
  const converted = v * rate;
  return `${symbol} ${converted >= 1_000_000
    ? (converted / 1_000_000).toFixed(2) + "M"
    : converted >= 1_000
      ? (converted / 1_000).toFixed(1) + "K"
      : converted.toFixed(0)}`;
}

/* ─── PDF generator ─────────────────────────────────────────────────── */
function downloadPDF(data: EstimateData, language: "en" | "ur") {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 0;

  const col = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    doc.setTextColor(r, g, b);
  };

  const transferTax = data.total * TRANSFER_TAX_RATE;
  const agencyFee   = data.total * AGENCY_FEE_RATE;
  const grandTotal  = data.total + transferTax + agencyFee;

  /* Header band */
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, W, 90, "F");
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("PropValue PK — Property Estimate", margin, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(199, 210, 254);
  doc.text(`Generated on ${new Date().toLocaleDateString(language === "ur" ? "en-PK" : "en-PK", { dateStyle: "long" })}`, margin, 60);
  doc.text("For informational purposes only. Consult a licensed agent for accurate valuations.", margin, 75);
  y = 110;

  /* Section helper */
  const section = (title: string) => {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    col("#4f46e5");
    doc.text(title, margin, y);
    doc.setDrawColor(199, 210, 254);
    doc.setLineWidth(1);
    doc.line(margin, y + 5, W - margin, y + 5);
    y += 20;
    doc.setFont("helvetica", "normal");
    col("#374151");
  };

  const row = (label: string, value: string, highlight = false) => {
    doc.setFontSize(10);
    if (highlight) {
      doc.setFillColor(238, 242, 255);
      doc.roundedRect(margin - 4, y - 12, W - margin * 2 + 8, 18, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      col("#4338ca");
    } else {
      doc.setFont("helvetica", "normal");
      col("#374151");
    }
    doc.text(label, margin, y);
    doc.text(value, W - margin, y, { align: "right" });
    y += 22;
  };

  /* Property info */
  section("Property Information");
  row("Location",      data.city);
  row("Size",          `${data.marla} Marla`);
  row("Configuration", `${data.bedrooms} Bedrooms · ${data.bathrooms} Bathrooms`);
  row("Property Age",  data.propertyAge === 0 ? "Brand new" : `${data.propertyAge} years`);
  row("City Multiplier", `×${data.cityMultiplier}`);
  y += 6;

  /* Value breakdown */
  section("Estimated Value Breakdown");
  row("Land Cost (60%)",           fmtPKR(data.land));
  row("Construction Value (40%)",  fmtPKR(data.built));
  if (data.agePenalty) row("Age Deduction Applied", "−10% on construction");
  if (data.bedBonus)   row("Bedroom Premium Applied", "+5% on construction");
  row("Estimated Property Value",  fmtPKR(data.total), true);
  y += 6;

  /* Taxes & fees */
  section("Taxes & Fees");
  row("Transfer Tax (2%)",  fmtPKR(transferTax));
  row("Agency Fee (1%)",    fmtPKR(agencyFee));
  row("Total Cost to Buyer", fmtPKR(grandTotal), true);
  y += 6;

  /* Currency */
  section("Currency Conversion (Static Rates)");
  Object.entries(FX).forEach(([code, { rate, symbol }]) => {
    row(`${code} (rate: ${rate})`, fmtFX(data.total, rate, symbol));
  });
  y += 6;

  /* Footer */
  doc.setFontSize(8);
  col("#9ca3af");
  doc.text("PropValue PK · Estimates are indicative only · Not financial advice", W / 2, 820, { align: "center" });

  doc.save(`PropValue_Estimate_${data.city.replace(/\s+/g, "_")}_${data.marla}Marla.pdf`);
}

/* ─── Component ─────────────────────────────────────────────────────── */
export function SummaryModal({ data, onClose }: SummaryModalProps) {
  const { language } = useLanguage();
  const overlayRef = useRef<HTMLDivElement>(null);

  /* lock body scroll */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* click-outside */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const transferTax = data.total * TRANSFER_TAX_RATE;
  const agencyFee   = data.total * AGENCY_FEE_RATE;
  const grandTotal  = data.total + transferTax + agencyFee;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,15,35,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full overflow-hidden flex flex-col"
        style={{ maxWidth: 620, maxHeight: "90vh" }}
      >
        {/* ── Modal header ── */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border" style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)" }}>
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white" style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.2 }}>{t("summary.title", language)}</p>
            <p className="text-indigo-200" style={{ fontSize: "0.75rem" }}>
              {data.marla} Marla · {data.city} · {data.bedrooms} Bed / {data.bathrooms} Bath
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Base value recap */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Home className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-indigo-500" style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{t("summary.base_property_value", language)}</p>
                <p className="text-indigo-900" style={{ fontWeight: 800, fontSize: "1.1rem" }}>{fmtPKR(data.total)}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {data.agePenalty && (
                <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-0.5" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                  <TrendingDown className="w-3 h-3" /> {t("results.age_deduction", language)}
                </span>
              )}
              {data.bedBonus && (
                <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                  <TrendingUp className="w-3 h-3" /> {t("results.bedroom_bonus", language)}
                </span>
              )}
              {!data.agePenalty && !data.bedBonus && (
                <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-0.5" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                  <Minus className="w-3 h-3" /> {t("summary.no_adjustments", language)}
                </span>
              )}
            </div>
          </div>

          {/* ── Tax breakdown ── */}
          <section>
            <SectionTitle icon={<Receipt className="w-3.5 h-3.5" />} title={t("summary.tax_fee_breakdown", language)} />
            <div className="rounded-2xl border border-border overflow-hidden">
              <TaxRow
                label={t("summary.estimated_property_value", language)}
                sublabel={t("summary.pre_tax_base", language)}
                value={fmtPKR(data.total)}
                valueColor="#374151"
                isBase
              />
              <TaxRow
                label={t("summary.transfer_tax", language)}
                sublabel={t("summary.transfer_tax_desc", language)}
                value={`+ ${fmtPKR(transferTax)}`}
                valueColor="#d97706"
                badge="2%"
                badgeColor="amber"
              />
              <TaxRow
                label={t("summary.agency_fee", language)}
                sublabel={t("summary.agency_fee_desc", language)}
                value={`+ ${fmtPKR(agencyFee)}`}
                valueColor="#7c3aed"
                badge="1%"
                badgeColor="purple"
              />
              <div className="px-5 py-4 flex items-center justify-between" style={{ background: "#f0f0ff" }}>
                <div>
                  <p className="text-indigo-900" style={{ fontWeight: 700, fontSize: "0.9rem" }}>{t("summary.total_cost_to_buyer", language)}</p>
                  <p className="text-indigo-400" style={{ fontSize: "0.75rem" }}>{t("summary.total_cost_desc", language)}</p>
                </div>
                <p className="text-indigo-700" style={{ fontWeight: 800, fontSize: "1.05rem" }}>{fmtPKR(grandTotal)}</p>
              </div>
            </div>
          </section>

          {/* ── Currency conversion ── */}
          <section>
            <SectionTitle icon={<Banknote className="w-3.5 h-3.5" />} title={t("summary.currency_conversion", language)} />
            <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
              {Object.entries(FX).map(([code, { rate, symbol, flag }]) => (
                <div key={code} className="px-5 py-3.5 flex items-center justify-between hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: "1.4rem" }}>{flag}</span>
                    <div>
                      <p className="text-foreground" style={{ fontWeight: 600, fontSize: "0.875rem" }}>{code}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>Rate: 1 PKR = {rate} {code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      {fmtFX(data.total, rate, symbol)}
                    </p>
                    <p className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>{t("summary.base_value_only", language)}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground mt-2" style={{ fontSize: "0.72rem" }}>
              * Static exchange rates. Actual rates may vary. Last updated May 2026.
            </p>
          </section>

        </div>

        {/* ── Footer actions ── */}
        <div className="px-6 py-4 border-t border-border flex items-center gap-3" style={{ background: "#fafafa" }}>
          <button
            onClick={() => downloadPDF(data, language)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            style={{ fontWeight: 600, fontSize: "0.85rem" }}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white hover:bg-muted text-foreground transition-colors ml-auto"
            style={{ fontWeight: 600, fontSize: "0.85rem" }}
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Mini sub-components ───────────────────────────────────────────── */
function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="text-indigo-500">{icon}</span>
      <p className="text-foreground" style={{ fontWeight: 700, fontSize: "0.875rem" }}>{title}</p>
    </div>
  );
}

function TaxRow({
  label, sublabel, value, valueColor, badge, badgeColor, isBase,
}: {
  label: string; sublabel: string; value: string;
  valueColor: string; badge?: string;
  badgeColor?: "amber" | "purple"; isBase?: boolean;
}) {
  const badgeStyles: Record<string, string> = {
    amber:  "bg-amber-50 text-amber-600 border border-amber-100",
    purple: "bg-purple-50 text-purple-600 border border-purple-100",
  };
  return (
    <div
      className="px-5 py-3.5 flex items-center justify-between"
      style={{ background: isBase ? "#f9f9ff" : "#fff" }}
    >
      <div className="flex items-center gap-2.5">
        {badge && badgeColor ? (
          <span className={`rounded-full px-2 py-0.5 ${badgeStyles[badgeColor]}`} style={{ fontSize: "0.7rem", fontWeight: 700 }}>
            {badge}
          </span>
        ) : (
          <span className="w-5" />
        )}
        <div>
          <p className="text-foreground" style={{ fontWeight: 600, fontSize: "0.85rem" }}>{label}</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>{sublabel}</p>
        </div>
      </div>
      <p style={{ fontWeight: 700, fontSize: "0.88rem", color: valueColor }}>{value}</p>
    </div>
  );
}
