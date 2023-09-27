"use client";

import React from "react";
import { BasketItem, BasketCalculationResult } from "../types";
import { Language, formatPrice, toBanglaNumber, translations } from "../utils/i18n";
import { X, Printer, CheckSquare, Calendar, ShoppingBag } from "lucide-react";

interface PrintSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  basket: BasketItem[];
  calcResult: BasketCalculationResult | null;
  lang: Language;
}

export const PrintSlipModal: React.FC<PrintSlipModalProps> = ({
  isOpen,
  onClose,
  basket,
  calcResult,
  lang,
}) => {
  const t = translations[lang];

  if (!isOpen || basket.length === 0) return null;

  const today = new Date().toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content print-slip-modal"
        style={{ maxWidth: "660px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls - Hidden during print */}
        <div className="modal-header no-print">
          <div className="modal-title">
            <Printer size={20} color="#10b981" />
            <span>{t.printSlipBtn}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Printable Paper Slip Container */}
        <div className="printable-slip">
          {/* Slip Header */}
          <div className="slip-header">
            <div className="slip-brand">
              <span className="slip-logo">⚖️</span>
              <div>
                <h2 className="slip-title">BajaarDar • বাজার দর</h2>
                <div className="slip-sub">{t.printSlipTitle}</div>
              </div>
            </div>
            <div className="slip-date">
              <Calendar size={13} style={{ display: "inline", marginRight: "4px" }} />
              <span>{today}</span>
            </div>
          </div>

          <hr className="slip-divider" />

          {/* Checklist of Grocery Items */}
          <table className="slip-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>✓</th>
                <th>{t.tableItem}</th>
                <th className="text-center">{lang === "bn" ? "পরিমাণ" : "Qty"}</th>
                <th className="text-right">{lang === "bn" ? "গড় দর" : "Rate"}</th>
                <th className="text-right">{lang === "bn" ? "আনুমানিক মূল্য" : "Est. Subtotal"}</th>
              </tr>
            </thead>
            <tbody>
              {basket.map((item, idx) => {
                const name = lang === "bn" ? item.commodity.nameBn : item.commodity.nameEn;
                const unit = lang === "bn" ? item.commodity.unitBn : item.commodity.unit;
                const subtotal = Math.round(item.commodity.currentAvgPrice * item.quantity);

                return (
                  <tr key={idx}>
                    <td>
                      <div className="slip-checkbox" />
                    </td>
                    <td>
                      <span style={{ fontWeight: 700 }}>{name}</span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>
                        {lang === "bn" ? item.commodity.nameEn : item.commodity.nameBn}
                      </span>
                    </td>
                    <td className="text-center" style={{ fontWeight: 600 }}>
                      {lang === "bn" ? toBanglaNumber(item.quantity) : item.quantity} {unit}
                    </td>
                    <td className="text-right" style={{ color: "#475569" }}>
                      {formatPrice(item.commodity.currentAvgPrice, lang)}
                    </td>
                    <td className="text-right" style={{ fontWeight: 700 }}>
                      {formatPrice(subtotal, lang)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Slip Summary */}
          {(() => {
            const totalRetail = calcResult ? calcResult.totalRetail : basket.reduce((acc, item) => acc + item.commodity.currentAvgPrice * item.quantity, 0);
            const totalWholesale = calcResult ? calcResult.totalWholesale : basket.reduce((acc, item) => acc + item.commodity.wholesalePrice * item.quantity, 0);
            return (
              <div className="slip-summary">
                <div className="slip-summary-row">
                  <span>{lang === "bn" ? "মোট আইটেম সংখ্যা:" : "Total Items Count:"}</span>
                  <span style={{ fontWeight: 700 }}>
                    {lang === "bn" ? toBanglaNumber(basket.length) : basket.length}
                  </span>
                </div>
                <div className="slip-summary-row">
                  <span>{lang === "bn" ? "কাওরান বাজার পাইকারি সমতুল্য:" : "Karwan Bazar Wholesale Hub Equivalent:"}</span>
                  <span style={{ color: "#0284c7", fontWeight: 700 }}>
                    {formatPrice(totalWholesale, lang)}
                  </span>
                </div>
                <div className="slip-summary-row slip-total">
                  <span>{t.printSlipTotalEst}:</span>
                  <span style={{ color: "#059669", fontWeight: 800 }}>
                    {formatPrice(totalRetail, lang)}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Handwritten Notes Section */}
          <div className="slip-notes">
            <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "#64748b" }}>
              {lang === "bn" ? "ব্যক্তিগত নোট বা অতিরিক্ত পণ্য:" : "Handwritten Notes / Extra items:"}
            </span>
            <div className="slip-note-lines">
              <div className="note-line"></div>
              <div className="note-line"></div>
            </div>
          </div>

          {/* Footer watermark */}
          <div className="slip-footer">
            {lang === "bn"
              ? "কাওরান বাজার ও শ্যামবাজারের আজকের সর্বশেষ গড় বাজার দর অনুযায়ী প্রস্তুতকৃত।"
              : "Generated according to today's benchmark market rates from Karwan Bazar & Shyambazar."}
          </div>
        </div>

        {/* Modal Buttons - Hidden during print */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }} className="no-print">
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: "center" }}
            onClick={handlePrint}
          >
            <Printer size={16} />
            <span>{lang === "bn" ? "ফর্দ প্রিন্ট বা PDF সেভ করুন" : "Print or Save as PDF"}</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            <span>{lang === "bn" ? "বন্ধ করুন" : "Close"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
