"use client";

import React, { useEffect, useState } from "react";
import { BasketItem, BasketCalculationResult } from "../types";
import { Language, formatPrice, toBanglaNumber } from "../utils/i18n";
import { X, Trash2, ShoppingBag, Plus, Minus, TrendingDown, ArrowRight, Printer } from "lucide-react";

interface BasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  basket: BasketItem[];
  onUpdateQuantity: (commodityId: string, quantity: number) => void;
  onRemoveItem: (commodityId: string) => void;
  onClearBasket: () => void;
  onOpenPrintSlip: () => void;
  lang: Language;
}

export const BasketModal: React.FC<BasketModalProps> = ({
  isOpen,
  onClose,
  basket,
  onUpdateQuantity,
  onRemoveItem,
  onClearBasket,
  onOpenPrintSlip,
  lang,
}) => {
  const [calcResult, setCalcResult] = useState<BasketCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || basket.length === 0) {
      setCalcResult(null);
      return;
    }

    const fetchCalculation = async () => {
      setIsLoading(true);
      try {
        const payload = {
          items: basket.map((item) => ({
            commodityId: item.commodity.id,
            quantity: item.quantity,
          })),
        };

        const res = await fetch("/api/commodities/basket-calc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.success) {
          setCalcResult(data.data);
        }
      } catch (err) {
        console.error("Basket calc error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalculation();
  }, [basket, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <ShoppingBag size={20} color="#f59e0b" />
            <span>{lang === "bn" ? "বাজারের থলে ও খরচের হিসাব" : "Kitchen Basket Budget Calculator"}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {basket.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
            <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }}>🧺</span>
            <p style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
              {lang === "bn" ? "আপনার থলে এখনো ফাঁকা" : "Your kitchen basket is empty"}
            </p>
            <p style={{ fontSize: "0.82rem", maxWidth: "320px", margin: "0 auto" }}>
              {lang === "bn"
                ? "পণ্য তালিকা থেকে '+ থলেতে যোগ' বাটনে ক্লিক করে পণ্য নির্বাচন করুন।"
                : "Add items from the market price board to estimate total grocery cost and savings."}
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                {lang === "bn"
                  ? `${toBanglaNumber(basket.length)} টি পণ্য নির্বাচিত`
                  : `${basket.length} items selected`}
              </span>
              <button
                type="button"
                onClick={onClearBasket}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#f87171",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Trash2 size={13} />
                <span>{lang === "bn" ? "থলে খালি করুন" : "Clear Basket"}</span>
              </button>
            </div>

            {/* List of items */}
            <div style={{ maxHeight: "240px", overflowY: "auto", paddingRight: "4px" }}>
              {basket.map((item) => (
                <div className="basket-item" key={item.commodity.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <span style={{ fontSize: "1.35rem" }}>{item.commodity.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>
                        {lang === "bn" ? item.commodity.nameBn : item.commodity.nameEn}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                        {formatPrice(item.commodity.currentAvgPrice, lang)} / {lang === "bn" ? item.commodity.unitBn : item.commodity.unit}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div className="basket-qty-ctrl">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.commodity.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus size={11} />
                      </button>
                      <span style={{ minWidth: "24px", textAlign: "center", fontWeight: 700, fontSize: "0.85rem" }}>
                        {lang === "bn" ? toBanglaNumber(item.quantity) : item.quantity}
                      </span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.commodity.id, item.quantity + 1)}
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.commodity.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-dim)",
                        cursor: "pointer",
                        padding: "2px",
                      }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Calculation Summary */}
            {calcResult && (
              <div className="basket-summary-box">
                <div className="summary-row">
                  <span>{lang === "bn" ? "খুচরা বাজার আনুমানিক ব্যয়:" : "Estimated Retail Total:"}</span>
                  <span style={{ fontWeight: 700, color: "#fff" }}>{formatPrice(calcResult.totalRetail, lang)}</span>
                </div>
                <div className="summary-row">
                  <span>{lang === "bn" ? "কাওরান বাজার পাইকারি সমতুল্য:" : "Wholesale Hub Equivalent:"}</span>
                  <span style={{ fontWeight: 700, color: "#38bdf8" }}>{formatPrice(calcResult.totalWholesale, lang)}</span>
                </div>
                <div className="summary-row" style={{ color: "var(--emerald)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <TrendingDown size={15} />
                    <span>{lang === "bn" ? "পাইকারি ক্রয়ে সম্ভাব্য সাশ্রয়:" : "Wholesale Savings Potential:"}</span>
                  </span>
                  <span style={{ fontWeight: 800 }}>
                    {formatPrice(calcResult.estimatedSavings, lang)} ({lang === "bn" ? toBanglaNumber(calcResult.savingsPercentage) : calcResult.savingsPercentage}%)
                  </span>
                </div>

                <div className="summary-row total">
                  <span>{lang === "bn" ? "আজকের মোট বাজেট:" : "Total Estimated Budget:"}</span>
                  <span style={{ color: "#f59e0b" }}>{formatPrice(calcResult.totalRetail, lang)}</span>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.65rem", marginTop: "1.15rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => {
                  onClose();
                  onOpenPrintSlip();
                }}
              >
                <Printer size={15} style={{ color: "var(--emerald)" }} />
                <span>{lang === "bn" ? "বাজারের ফর্দ প্রিন্ট করুন" : "Print Grocery Slip"}</span>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
                style={{ flex: 1, justifyContent: "center" }}
              >
                <span>{lang === "bn" ? "তালিকা দেখুন" : "Back to Market Rates"}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
