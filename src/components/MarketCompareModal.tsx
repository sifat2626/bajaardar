"use client";

import React, { useState } from "react";
import { Commodity } from "../types";
import { Language, formatPrice, toBanglaNumber, translations } from "../utils/i18n";
import { X, ArrowRightLeft, Building2, TrendingDown, CheckCircle2 } from "lucide-react";

interface MarketCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  commodities: Commodity[];
  lang: Language;
}

export const MarketCompareModal: React.FC<MarketCompareModalProps> = ({
  isOpen,
  onClose,
  commodities,
  lang,
}) => {
  const t = translations[lang];

  const markets = [
    {
      id: "karwan_bazar",
      nameBn: "কাওরান বাজার পাইকারি মোকাম",
      nameEn: "Karwan Bazar Wholesale Hub",
      type: "WHOLESALE",
      factor: 1.0, // base wholesale rate
    },
    {
      id: "mirpur_1",
      nameBn: "মিরপুর-১ কাঁচাবাজার (খুচরা)",
      nameEn: "Mirpur-1 Kitchen Market (Retail)",
      type: "RETAIL",
      factor: 1.18, // ~18% higher than central wholesale
    },
    {
      id: "khatunganj",
      nameBn: "খাতুনগঞ্জ পাইকারি মোকাম (চট্টগ্রাম)",
      nameEn: "Khatunganj Hub (Chattogram)",
      type: "WHOLESALE",
      factor: 0.98, // port wholesale
    },
    {
      id: "mohammadpur",
      nameBn: "মোহাম্মদপুর কৃষি মার্কেট",
      nameEn: "Mohammadpur Krishi Market",
      type: "RETAIL",
      factor: 1.15,
    },
    {
      id: "shyam_bazar",
      nameBn: "শ্যামবাজার পাইকারি আড়ত",
      nameEn: "Shyam Bazar Wholesale Hub",
      type: "WHOLESALE",
      factor: 0.97,
    },
  ];

  const [marketAId, setMarketAId] = useState("karwan_bazar");
  const [marketBId, setMarketBId] = useState("mirpur_1");

  if (!isOpen) return null;

  const marketA = markets.find((m) => m.id === marketAId) || markets[0];
  const marketB = markets.find((m) => m.id === marketBId) || markets[1];

  // Compare key staple commodities
  const stapleItems = commodities.slice(0, 8);

  const handleSwap = () => {
    setMarketAId(marketBId);
    setMarketBId(marketAId);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "720px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <ArrowRightLeft size={20} color="#10b981" />
            <span>{t.marketCompareTitle}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
          {t.marketCompareSub}
        </p>

        {/* Market Selectors with Swap Button */}
        <div className="market-compare-header">
          <div className="compare-picker-box">
            <label className="form-label">{t.selectMarketA}</label>
            <select
              className="form-select"
              value={marketAId}
              onChange={(e) => setMarketAId(e.target.value)}
            >
              {markets.map((m) => (
                <option key={m.id} value={m.id} disabled={m.id === marketBId}>
                  {lang === "bn" ? m.nameBn : m.nameEn}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="swap-market-btn"
            onClick={handleSwap}
            title="Swap Markets"
          >
            <ArrowRightLeft size={16} />
          </button>

          <div className="compare-picker-box">
            <label className="form-label">{t.selectMarketB}</label>
            <select
              className="form-select"
              value={marketBId}
              onChange={(e) => setMarketBId(e.target.value)}
            >
              {markets.map((m) => (
                <option key={m.id} value={m.id} disabled={m.id === marketAId}>
                  {lang === "bn" ? m.nameBn : m.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="table-responsive-container" style={{ margin: "1.25rem 0", maxHeight: "360px", overflowY: "auto" }}>
          <table className="market-table">
            <thead>
              <tr>
                <th>{t.tableItem}</th>
                <th className="text-right">
                  {lang === "bn" ? marketA.nameBn.split(" ")[0] : marketA.nameEn.split(" ")[0]}
                </th>
                <th className="text-right">
                  {lang === "bn" ? marketB.nameBn.split(" ")[0] : marketB.nameEn.split(" ")[0]}
                </th>
                <th className="text-right">{t.priceDifference}</th>
              </tr>
            </thead>
            <tbody>
              {stapleItems.map((c) => {
                const name = lang === "bn" ? c.nameBn : c.nameEn;
                const unit = lang === "bn" ? c.unitBn : c.unit;

                // Price A and Price B calculated based on market characteristics
                const priceA = Math.round(c.wholesalePrice * marketA.factor);
                const priceB = Math.round(
                  marketB.type === "RETAIL"
                    ? c.currentAvgPrice * (marketB.factor / 1.15)
                    : c.wholesalePrice * marketB.factor
                );
                const diff = priceB - priceA;
                const absDiff = Math.abs(diff);

                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "1.25rem" }}>{c.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{name}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>/{unit}</div>
                        </div>
                      </div>
                    </td>

                    <td className="text-right" style={{ fontWeight: 700 }}>
                      {formatPrice(priceA, lang)}
                    </td>

                    <td className="text-right" style={{ fontWeight: 700 }}>
                      {formatPrice(priceB, lang)}
                    </td>

                    <td className="text-right">
                      {diff === 0 ? (
                        <span style={{ color: "var(--text-dim)", fontSize: "0.82rem" }}>
                          {lang === "bn" ? "সমান দর" : "Equal"}
                        </span>
                      ) : diff > 0 ? (
                        <span style={{ color: "var(--emerald)", fontWeight: 700, fontSize: "0.82rem" }}>
                          {marketA.nameBn.split(" ")[0]} {formatPrice(absDiff, lang)} {t.cheaperIn}
                        </span>
                      ) : (
                        <span style={{ color: "#38bdf8", fontWeight: 700, fontSize: "0.82rem" }}>
                          {marketB.nameBn.split(" ")[0]} {formatPrice(absDiff, lang)} {t.cheaperIn}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Insight Card */}
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "0.85rem 1.15rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
          }}
        >
          <Building2 size={20} color="#059669" flex-shrink={0} />
          <span>
            {lang === "bn"
              ? "কাওরান বাজার ও শ্যামবাজারের মতো পাইকারি মোকাম থেকে পাইকারি লটে পণ্য কিনলে প্রতি পণ্যে গড়ে ১৫% থেকে ২২% পর্যন্ত সাশ্রয় সম্ভব।"
              : "Buying in bulk directly from wholesale trading hubs like Karwan Bazar yields an average 15% to 22% direct grocery savings."}
          </span>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
          style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
        >
          <span>{lang === "bn" ? "বন্ধ করুন" : "Close"}</span>
        </button>
      </div>
    </div>
  );
};
