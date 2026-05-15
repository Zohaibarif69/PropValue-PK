export type Language = "en" | "ur";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "header.title": "PropValue PK",
    "header.subtitle": "Real Estate Estimator",
    "header.status": "Live Estimates",

    // Page title
    "page.title": "Property Value Estimator",
    "page.description": "Enter property details below to get an instant market estimate in Pakistani Rupees.",

    // Form section
    "form.title": "Property Details",
    "form.subtitle": "All fields affect the estimate in real time",

    // Form labels
    "form.city": "City / Area",
    "form.size": "Property Size (Marla)",
    "form.bedrooms": "Bedrooms",
    "form.bathrooms": "Bathrooms",
    "form.age": "Property Age",

    // Form values
    "form.age.brand_new": "Brand new",
    "form.age.years": "yr",
    "form.age.years_plural": "yrs",
    "form.age.no_deduction": "No deduction applied",
    "form.age.deduction": "−10% age deduction",

    // Pricing rules
    "rules.title": "How the estimate is calculated",
    "rules.base_rate": "Base rate: ₨ 50 Lakh per Marla",
    "rules.city_multiplier": "City multiplier adjusts for location demand",
    "rules.age_deduction": "−10% on construction if property age > 10 yrs",
    "rules.bedroom_bonus": "+5% on construction for more than 3 bedrooms",

    // Results section
    "results.estimated_value": "Estimated Market Value",
    "results.age_deduction": "Age −10%",
    "results.no_age_deduction": "No age deduction",
    "results.bedroom_bonus": "Bedrooms +5%",
    "results.view_summary": "View Detailed Summary",
    "results.tax_fx": "Tax + FX",

    // Metric cards
    "metrics.land_cost": "Land Cost",
    "metrics.construction": "Construction",
    "metrics.rate_per_marla": "Rate / Marla",
    "metrics.of_total": "% of total",
    "metrics.city_factor": "×{multiplier} city factor",

    // Chart section
    "chart.title": "Price Breakdown",
    "chart.description": "Visual comparison of land cost, construction value, and combined total",
    "chart.legend.land": "Land Cost",
    "chart.legend.construction": "Construction",
    "chart.legend.total": "Total Value",

    // Distribution section
    "distribution.title": "Value Distribution",
    "distribution.land": "Land Cost",
    "distribution.construction": "Construction",

    // Tags
    "tags.city_multiplier": "City ×{multiplier}",
    "tags.premium": "+5% premium",

    // Footer
    "footer.disclaimer": "Estimates are indicative only and based on algorithmic pricing rules. Consult a licensed real estate agent for accurate valuations.",

    // Summary modal
    "summary.title": "Property Valuation Summary",
    "summary.base_property_value": "Base Property Value",
    "summary.tax_fee_breakdown": "Tax & Fee Breakdown",
    "summary.currency_conversion": "Currency Conversion",
    "summary.property_info": "Property Information",
    "summary.location": "Location",
    "summary.size": "Size",
    "summary.configuration": "Configuration",
    "summary.property_age": "Property Age",
    "summary.city_multiplier": "City Multiplier",
    "summary.value_breakdown": "Estimated Value Breakdown",
    "summary.land_cost": "Land Cost (60%)",
    "summary.construction_value": "Construction Value (40%)",
    "summary.age_deduction_applied": "Age Deduction Applied",
    "summary.bedroom_premium_applied": "Bedroom Premium Applied",
    "summary.estimated_property_value": "Estimated Property Value",
    "summary.transfer_tax": "Transfer Tax",
    "summary.transfer_tax_desc": "2% of property value",
    "summary.agency_fee": "Agency Fee",
    "summary.agency_fee_desc": "1% of property value",
    "summary.total_cost_to_buyer": "Total Cost to Buyer",
    "summary.total_cost_desc": "Property + Transfer Tax + Agency Fee",
    "summary.age_10": "−10% on construction",
    "summary.beds_5": "+5% on construction",
    "summary.no_adjustments": "No adjustments",
    "summary.download_pdf": "Download PDF",
    "summary.close": "Close",
    "summary.pre_tax_base": "Pre-tax base",
    "summary.base_value_only": "base value only",
  },
  ur: {
    // Header
    "header.title": "پراپ ویلیو پی کے",
    "header.subtitle": "رئیل اسٹیٹ تخمینہ",
    "header.status": "براہ راست تخمینے",

    // Page title
    "page.title": "جائیداد کی قیمت کا تخمینہ کار",
    "page.description": "جائیداد کی تفصیلات درج کریں تاکہ پاکستانی روپوں میں فوری بازار کی قیمت حاصل کریں۔",

    // Form section
    "form.title": "جائیداد کی تفصیلات",
    "form.subtitle": "تمام فیلڈز رئیل ٹائم میں تخمینے کو متاثر کرتے ہیں",

    // Form labels
    "form.city": "شہر / علاقہ",
    "form.size": "جائیداد کا سائز (مرلہ)",
    "form.bedrooms": "بیڈروم",
    "form.bathrooms": "باتھ روم",
    "form.age": "جائیداد کی عمر",

    // Form values
    "form.age.brand_new": "بالکل نیا",
    "form.age.years": "سال",
    "form.age.years_plural": "سال",
    "form.age.no_deduction": "کوئی کٹوتی نہیں",
    "form.age.deduction": "−10% عمر میں کٹوتی",

    // Pricing rules
    "rules.title": "تخمینہ کیسے شمار کیا جاتا ہے",
    "rules.base_rate": "بنیادی شرح: ₨ 50 لاکھ فی مرلہ",
    "rules.city_multiplier": "شہر کا ضارب مقام کی مانگ کے مطابق ہے",
    "rules.age_deduction": "اگر جائیداد کی عمر > 10 سال ہو تو تعمیر پر −10%",
    "rules.bedroom_bonus": "3 سے زیادہ بیڈروم کے لیے تعمیر میں +5%",

    // Results section
    "results.estimated_value": "متوقع بازار کی قیمت",
    "results.age_deduction": "عمر −10%",
    "results.no_age_deduction": "کوئی عمر کٹوتی نہیں",
    "results.bedroom_bonus": "بیڈروم +5%",
    "results.view_summary": "تفصیلی خلاصہ دیکھیں",
    "results.tax_fx": "ٹیکس + FX",

    // Metric cards
    "metrics.land_cost": "زمین کی قیمت",
    "metrics.construction": "تعمیر",
    "metrics.rate_per_marla": "فی مرلہ شرح",
    "metrics.of_total": "کل میں سے %",
    "metrics.city_factor": "×{multiplier} شہر کا عامل",

    // Chart section
    "chart.title": "قیمت کی تقسیم",
    "chart.description": "زمین کی قیمت، تعمیر کی قیمت اور کل کا بصری موازنہ",
    "chart.legend.land": "زمین کی قیمت",
    "chart.legend.construction": "تعمیر",
    "chart.legend.total": "کل قیمت",

    // Distribution section
    "distribution.land": "زمین کی قیمت",
    "distribution.construction": "تعمیر",

    // Tags
    "tags.city_multiplier": "شہر ×{multiplier}",
    "tags.premium": "+5% اضافی قیمت",

    // Footer
    "footer.disclaimer": "تخمینے صرف اشارے ہیں اور الگورتھمک قیمت کے اصول پر مبنی ہیں۔ درست تخمینے کے لیے لائسنس یافتہ رئیل اسٹیٹ ایجنٹ سے رجوع کریں۔",

    // Summary modal
    "summary.title": "جائیداد کی قیمت کا خلاصہ",
    "summary.base_property_value": "بنیادی جائیداد کی قیمت",
    "summary.tax_fee_breakdown": "ٹیکس اور فیس کی تفصیل",
    "summary.currency_conversion": "کرنسی کی تبدیلی",
    "summary.property_info": "جائیداد کی معلومات",
    "summary.location": "مقام",
    "summary.size": "سائز",
    "summary.configuration": "ترتیب",
    "summary.property_age": "جائیداد کی عمر",
    "summary.city_multiplier": "شہر کا ضارب",
    "summary.value_breakdown": "متوقع قیمت کی تفصیل",
    "summary.land_cost": "زمین کی قیمت (60%)",
    "summary.construction_value": "تعمیر کی قیمت (40%)",
    "summary.age_deduction_applied": "عمر میں کٹوتی لاگو کی گئی",
    "summary.bedroom_premium_applied": "بیڈروم پریمیم لاگو کیا گیا",
    "summary.estimated_property_value": "متوقع جائیداد کی قیمت",
    "summary.transfer_tax": "ٹرانسفر ٹیکس",
    "summary.transfer_tax_desc": "جائیداد کی قیمت کا 2%",
    "summary.agency_fee": "ایجنسی فیس",
    "summary.agency_fee_desc": "جائیداد کی قیمت کا 1%",
    "summary.total_cost_to_buyer": "خریدار کی کل لاگت",
    "summary.total_cost_desc": "جائیداد + ٹرانسفر ٹیکس + ایجنسی فیس",
    "summary.age_10": "−10% تعمیر پر",
    "summary.beds_5": "+5% تعمیر پر",
    "summary.no_adjustments": "کوئی ترمیم نہیں",
    "summary.download_pdf": "PDF ڈاؤن لوڈ کریں",
    "summary.close": "بند کریں",
    "summary.pre_tax_base": "ٹیکس سے پہلے بنیاد",
    "summary.base_value_only": "صرف بنیادی قیمت",
  },
};

export function t(key: string, language: Language, replacements?: Record<string, string | number>): string {
  let text = translations[language][key] || translations["en"][key] || key;

  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, value]) => {
      text = text.replace(`{${placeholder}}`, String(value));
    });
  }

  return text;
}
