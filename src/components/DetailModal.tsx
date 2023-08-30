"use client";

import React from "react";
import { Commodity } from "../types";
import { Language, formatPrice, formatPercent } from "../utils/i18n";
import { X, TrendingUp, TrendingDown, Clock, ShieldCheck, MapPin, Plus } from "lucide-react";
import { Sparkline } from "./Sparkline";

interface DetailModalProps {
  commodity: Commodity | null;
  onClose: () => void;
  onOpenReport: (commodityId: string) => void;
  onAddToBasket: (commodity: Commodity) => void;
  lang: Language;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  commodity,
  onClose,
  onOpenReport,
  onAddToBasket,
  lang,
}) => {
  if (!commodity) return null;

  const isUp = commodity.change24h > 0;
  const isDown = commodity.change24h < 0;
  const name = lang === "bn" ? commodity.nameBn : commodity.nameEn;
  const subName = lang === "bn" ? commodity.nameEn : commodity.nameBn;
  const unit = lang === "bn" ? commodity.unitBn : commodity.unit;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.85rem" }}>{commodity.icon}</span>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
                {name}
              </h2>
              <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                {subName} • {commodity.category}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Price highlights row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "0.65rem",
            marginBottom: "1rem",
          }}
        >
          {/* Retail */}
          <div
            style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem",
            }}
          >
            <div style={{ fontSize: "0.7rem", color: "#34d399", fontWeight: 700, textTransform: "uppercase" }}>
              {lang === "bn" ? "খুচরা গড় দর" : "Avg Retail Price"}
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", marginTop: "1px" }}>
              {formatPrice(commodity.currentAvgPrice, lang)}
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: "4px" }}>
                /{unit}
              </span>
            </div>
          </div>

          {/* Wholesale */}
          <div
            style={{
              background: "rgba(56, 189, 248, 0.08)",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem",
            }}
          >
            <div style={{ fontSize: "0.7rem", color: "#38bdf8", fontWeight: 700, textTransform: "uppercase" }}>
              {lang === "bn" ? "কাওরান বাজার পাইকারি" : "Wholesale Hub"}
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", marginTop: "1px" }}>
              {formatPrice(commodity.wholesalePrice, lang)}
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: "4px" }}>
                /{unit}
              </span>
            </div>
          </div>

          {/* 24h Change */}
          <div
            style={{
              background: isUp
                ? "rgba(244, 63, 94, 0.08)"
                : isDown
                ? "rgba(16, 185, 129, 0.08)"
                : "rgba(255, 255, 255, 0.04)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem",
            }}
          >
            <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontWeight: 700, textTransform: "uppercase" }}>
              {lang === "bn" ? "২৪ ঘণ্টার পরিবর্তন" : "24h Delta"}
            </div>
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: isUp ? "#f87171" : isDown ? "#4ade80" : "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "1px",
              }}
            >
              {isUp ? <TrendingUp size={18} /> : isDown ? <TrendingDown size={18} /> : null}
              <span>{formatPercent(commodity.change24h, lang)}</span>
            </div>
          </div>
        </div>

        {/* Official TCB Ceiling if available */}
        {commodity.tcbPrice && (
          <div className="tcb-bar" style={{ marginBottom: "1rem", padding: "0.5rem 0.75rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={15} />
              <span>{lang === "bn" ? "সরকারি টিসিবি (TCB) নির্ধারিত দর:" : "Govt TCB Benchmark Rate:"}</span>
            </span>
            <span style={{ fontWeight: 800, fontSize: "0.9rem" }}>
              {formatPrice(commodity.tcbPrice, lang)} /{unit}
            </span>
          </div>
        )}

        {/* 7-Day History Chart */}
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)" }}>
              {lang === "bn" ? "বিগত ৭ দিনের বাজার দরের গতিপথ" : "7-Day Trajectory Trend"}
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
              {lang === "bn" ? "সর্বশেষ আপডেট: আজ" : "Latest: Today"}
            </span>
          </div>

          <div
            style={{
              background: "rgba(11, 17, 32, 0.7)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "0.85rem",
            }}
          >
            <Sparkline data={commodity.priceHistory} height={60} isPositiveChange={commodity.change24h > 0} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.45rem", fontSize: "0.68rem", color: "var(--text-dim)" }}>
              {commodity.priceHistory.map((p, idx) => (
                <div key={idx} style={{ textAlign: "center" }}>
                  <div>{formatPrice(p.price, lang)}</div>
                  <div style={{ fontSize: "0.62rem", opacity: 0.65 }}>{p.date.slice(5)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Crowd Reports */}
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)" }}>
              {lang === "bn" ? "বাজারের বাস্তব দর প্রতিবেদন" : "Verified Crowd & Vendor Reports"}
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--emerald)" }}>● {lang === "bn" ? "যাচাইকৃত" : "Verified"}</span>
          </div>

          {commodity.reports && commodity.reports.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {commodity.reports.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.65rem 0.85rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={13} color="#38bdf8" />
                      <span>{r.marketName}</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontWeight: 400 }}>
                        ({r.district})
                      </span>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={11} />
                      <span>{r.reporterName || "Anonymous"}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1rem", fontWeight: 800, color: "#fff" }}>
                      {formatPrice(r.price, lang)}
                    </div>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        padding: "1px 5px",
                        borderRadius: "var(--radius-full)",
                        background: r.type === "WHOLESALE" ? "rgba(56, 189, 248, 0.15)" : "rgba(16, 185, 129, 0.15)",
                        color: r.type === "WHOLESALE" ? "#38bdf8" : "#34d399",
                        fontWeight: 700,
                      }}
                    >
                      {r.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "0.85rem", color: "var(--text-dim)", fontSize: "0.8rem" }}>
              {lang === "bn" ? "এখনো কোনো প্রতিবেদন নেই। প্রথম দরটি আপনিই রিপোর্ট করুন!" : "No individual reports yet. Be the first to report!"}
            </div>
          )}
        </div>

        {/* Modal Action buttons */}
        <div style={{ display: "flex", gap: "0.65rem" }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: "center" }}
            onClick={() => {
              onAddToBasket(commodity);
              onClose();
            }}
          >
            <Plus size={15} />
            <span>{lang === "bn" ? "থলেতে যোগ করুন" : "Add to Basket"}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            style={{ flex: 1, justifyContent: "center" }}
            onClick={() => {
              onClose();
              onOpenReport(commodity.id);
            }}
          >
            <span>📢 {lang === "bn" ? "দর রিপোর্ট করুন" : "Report Price"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
