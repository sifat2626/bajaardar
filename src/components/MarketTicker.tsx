"use client";

import React from "react";
import { Commodity } from "../types";
import { Language, formatPrice, formatPercent } from "../utils/i18n";
import { TrendingUp, TrendingDown, Bell } from "lucide-react";

interface MarketTickerProps {
  commodities: Commodity[];
  lang: Language;
  customMessage?: string;
}

export const MarketTicker: React.FC<MarketTickerProps> = ({ commodities, lang, customMessage }) => {
  if (!commodities || commodities.length === 0) return null;

  // Duplicate items for continuous seamless scroll
  const tickerItems = [...commodities, ...commodities];

  return (
    <div className="ticker-wrapper">
      <div className="ticker-label">
        <span className="ticker-dot"></span>
        <span>{lang === "bn" ? "লাইভ মোকাম" : "LIVE HUB"}</span>
      </div>

      <div className="ticker-track">
        <div className="ticker-content">
          {customMessage && (
            <div className="ticker-item" style={{ color: "#38bdf8", fontWeight: 700 }}>
              <Bell size={13} style={{ display: "inline", marginRight: "4px" }} />
              <span>{customMessage}</span>
              <span className="ticker-divider">•</span>
            </div>
          )}

          {tickerItems.map((c, i) => {
            const isUp = c.change24h > 0;
            const isDown = c.change24h < 0;
            const name = lang === "bn" ? c.nameBn : c.nameEn;
            const unit = lang === "bn" ? c.unitBn : c.unit;

            return (
              <div className="ticker-item" key={`${c.id}-${i}`}>
                <span className="ticker-icon">{c.icon}</span>
                <span className="ticker-name">{name}</span>
                <span className="ticker-price">
                  {formatPrice(c.currentAvgPrice, lang)}
                  <span className="ticker-unit">/{unit}</span>
                </span>
                <span className={`ticker-delta ${isUp ? "up" : isDown ? "down" : "neutral"}`}>
                  {isUp ? <TrendingUp size={11} /> : isDown ? <TrendingDown size={11} /> : null}
                  <span>{formatPercent(c.change24h, lang)}</span>
                </span>
                <span className="ticker-divider">•</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
