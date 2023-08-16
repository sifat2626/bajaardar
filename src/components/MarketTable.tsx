"use client";

import React from "react";
import { Commodity } from "../types";
import { Language, translations, formatPrice, formatPercent } from "../utils/i18n";
import { Sparkline } from "./Sparkline";
import { Plus, Eye, TrendingUp, TrendingDown, Star } from "lucide-react";

interface MarketTableProps {
  commodities: Commodity[];
  lang: Language;
  onAddToBasket: (comm: Commodity) => void;
  onOpenDetails: (comm: Commodity) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const MarketTable: React.FC<MarketTableProps> = ({
  commodities,
  lang,
  onAddToBasket,
  onOpenDetails,
  favorites = [],
  onToggleFavorite,
}) => {
  const t = translations[lang];

  return (
    <div className="table-responsive-container">
      <table className="market-table">
        <thead>
          <tr>
            <th>{t.tableItem}</th>
            <th>{t.tableCategory}</th>
            <th className="text-right">{t.tableRetail}</th>
            <th className="text-right">{t.tableWholesale}</th>
            <th className="text-center">{t.tableChange}</th>
            <th className="text-center" style={{ minWidth: "140px" }}>{t.tableTrend}</th>
            <th className="text-right">{t.tableAction}</th>
          </tr>
        </thead>
        <tbody>
          {commodities.map((c) => {
            const isUp = c.change24h > 0;
            const isDown = c.change24h < 0;
            const name = lang === "bn" ? c.nameBn : c.nameEn;
            const subName = lang === "bn" ? c.nameEn : c.nameBn;
            const unit = lang === "bn" ? c.unitBn : c.unit;
            const categoryLabel = (t.categories as any)[c.category] || c.category;
            const isFav = Array.isArray(favorites) && favorites.includes(c.id);

            return (
              <tr key={c.id} className="table-row">
                {/* Item Name */}
                <td>
                  <div className="table-item-cell">
                    <button
                      type="button"
                      className={`star-btn ${isFav ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(c.id);
                      }}
                      title={
                        favorites.includes(c.id)
                          ? lang === "bn"
                            ? "পছন্দ থেকে সরান"
                            : "Remove from favorites"
                          : lang === "bn"
                          ? "পছন্দে যোগ করুন"
                          : "Add to favorites"
                      }
                    >
                      <Star size={15} fill={favorites.includes(c.id) ? "currentColor" : "none"} />
                    </button>
                    <span className="table-item-icon">{c.icon}</span>
                    <div>
                      <div className="table-item-name">{name}</div>
                      <div className="table-item-sub">{subName}</div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td>
                  <span className="table-cat-badge">{categoryLabel}</span>
                </td>

                {/* Retail Price */}
                <td className="text-right">
                  <div className="table-price-primary">
                    {formatPrice(c.currentAvgPrice, lang)}
                    <span className="table-price-unit">/{unit}</span>
                  </div>
                  {c.tcbPrice && (
                    <div className="table-tcb-hint">
                      TCB: {formatPrice(c.tcbPrice, lang)}
                    </div>
                  )}
                </td>

                {/* Wholesale Price */}
                <td className="text-right">
                  <div className="table-price-wholesale">
                    {formatPrice(c.wholesalePrice, lang)}
                    <span className="table-price-unit">/{unit}</span>
                  </div>
                  <div className="table-wholesale-hint">
                    {lang === "bn" ? "কাওরান বাজার" : "Karwan Bazar"}
                  </div>
                </td>

                {/* 24h Change */}
                <td className="text-center">
                  <span className={`delta-pill ${isUp ? "up" : isDown ? "down" : "neutral"}`}>
                    {isUp ? <TrendingUp size={12} /> : isDown ? <TrendingDown size={12} /> : null}
                    <span>{formatPercent(c.change24h, lang)}</span>
                  </span>
                </td>

                {/* 7-Day Sparkline */}
                <td className="text-center" style={{ padding: "0.4rem 1rem" }}>
                  <div style={{ width: "130px", margin: "0 auto", height: "34px" }}>
                    <Sparkline data={c.priceHistory} height={34} width={130} isPositiveChange={c.change24h > 0} />
                  </div>
                </td>

                {/* Actions */}
                <td className="text-right">
                  <div className="table-action-btns">
                    <button
                      type="button"
                      className="table-btn table-btn-basket"
                      onClick={() => onAddToBasket(c)}
                      title={t.addToBasket}
                    >
                      <Plus size={14} />
                      <span>{t.addToBasket}</span>
                    </button>
                    <button
                      type="button"
                      className="table-btn table-btn-detail"
                      onClick={() => onOpenDetails(c)}
                      title={t.details}
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
