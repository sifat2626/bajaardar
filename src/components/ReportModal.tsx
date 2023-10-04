"use client";

import React, { useState } from "react";
import { Commodity, Division } from "../types";
import { Language } from "../utils/i18n";
import { X, Send, CheckCircle2, AlertCircle } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  commodities: Commodity[];
  divisions: Division[];
  selectedCommodityId?: string;
  onSuccess: () => void;
  lang: Language;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  commodities,
  divisions,
  selectedCommodityId = "",
  onSuccess,
  lang,
}) => {
  const [commodityId, setCommodityId] = useState(selectedCommodityId || (commodities[0]?.id ?? ""));
  const [division, setDivision] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [marketName, setMarketName] = useState("Karwan Bazar");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"RETAIL" | "WHOLESALE">("RETAIL");
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const currentDivisionObj = divisions.find((d) => d.name === division) || divisions[0];
  const selectedComm = commodities.find((c) => c.id === (commodityId || selectedCommodityId));

  const quickMarkets = [
    "Karwan Bazar",
    "Mirpur-1 Kacha Bazar",
    "Mohammadpur Krishi Market",
    "Shyambazar",
    "Khatunganj",
    "Reazuddin Bazar",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || Number(price) <= 0) {
      setErrorMsg(lang === "bn" ? "দয়া করে সঠিক দাম লিখুন" : "Please enter a valid price");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/commodities/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commodityId: commodityId || selectedCommodityId,
          marketName,
          division,
          district,
          price: Number(price),
          type,
          reporterName: reporterName || (lang === "bn" ? "সাধারণ ক্রেতা" : "Consumer"),
          reporterPhone: reporterPhone || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(
          lang === "bn"
            ? "ধন্যবাদ! আপনার দেওয়া বাজার দর সফলভাবে তালিকাভুক্ত হয়েছে।"
            : "Thank you! Your price report was submitted successfully."
        );
        setTimeout(() => {
          onSuccess();
          onClose();
          setSuccessMsg("");
          setPrice("");
        }, 1500);
      } else {
        setErrorMsg(data.message || "Failed to submit price report");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span>📢</span>
            <span>{lang === "bn" ? "বাজার দর রিপোর্ট করুন" : "Report a Local Market Price"}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {successMsg ? (
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <CheckCircle2 size={50} color="#10b981" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.2rem", color: "#10b981", marginBottom: "0.5rem" }}>
              {successMsg}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              {lang === "bn" ? "বাজারে স্বচ্ছতা বজায় রাখতে সহায়তা করার জন্য ধন্যবাদ।" : "Thank you for contributing to market transparency."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {errorMsg && (
              <div
                style={{
                  background: "rgba(244, 63, 94, 0.15)",
                  border: "1px solid rgba(244, 63, 94, 0.3)",
                  color: "#f87171",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Commodity selection */}
            <div className="form-group">
              <label className="form-label">{lang === "bn" ? "পণ্য নির্বাচন করুন" : "Select Commodity"}</label>
              <select
                className="form-select"
                value={commodityId || selectedCommodityId}
                onChange={(e) => setCommodityId(e.target.value)}
              >
                {commodities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {lang === "bn" ? c.nameBn : c.nameEn} ({lang === "bn" ? c.unitBn : c.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Price & Type */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              <div className="form-group">
                <label className="form-label">
                  {lang === "bn" ? `মূল্য (৳ প্রতি ${selectedComm?.unitBn || "একক"})` : `Price (Tk per ${selectedComm?.unit || "unit"})`}
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder={lang === "bn" ? "যেমন: ৭৫" : "e.g. 75"}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{lang === "bn" ? "বাজারের ধরণ" : "Market Type"}</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="RETAIL">{lang === "bn" ? "খুচরা বাজার (Retail)" : "Retail Market"}</option>
                  <option value="WHOLESALE">{lang === "bn" ? "পাইকারি মোকাম (Wholesale)" : "Wholesale Hub"}</option>
                </select>
              </div>
            </div>

            {/* Division & District */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              <div className="form-group">
                <label className="form-label">{lang === "bn" ? "বিভাগ" : "Division"}</label>
                <select
                  className="form-select"
                  value={division}
                  onChange={(e) => {
                    const newDiv = e.target.value;
                    setDivision(newDiv);
                    const match = divisions.find((d) => d.name === newDiv);
                    if (match && match.districts.length > 0) {
                      setDistrict(match.districts[0].name);
                    }
                  }}
                >
                  {divisions.map((d) => (
                    <option key={d.name} value={d.name}>
                      {lang === "bn" ? d.bnName : d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{lang === "bn" ? "জেলা" : "District"}</label>
                <select
                  className="form-select"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  {currentDivisionObj?.districts.map((dst) => (
                    <option key={dst.name} value={dst.name}>
                      {lang === "bn" ? dst.bnName : dst.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Market Name */}
            <div className="form-group">
              <label className="form-label">{lang === "bn" ? "বাজারের নাম" : "Market Name"}</label>
              <input
                type="text"
                className="form-input"
                placeholder={lang === "bn" ? "যেমন: কাওরান বাজার, মিরপুর-১..." : "e.g. Karwan Bazar, Mirpur-1..."}
                value={marketName}
                onChange={(e) => setMarketName(e.target.value)}
                required
              />
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                {quickMarkets.map((qm) => (
                  <button
                    type="button"
                    key={qm}
                    onClick={() => setMarketName(qm)}
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "2px 8px",
                      fontSize: "0.72rem",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                    }}
                  >
                    {qm}
                  </button>
                ))}
              </div>
            </div>

            {/* Reporter details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              <div className="form-group">
                <label className="form-label">{lang === "bn" ? "আপনার নাম (ঐচ্ছিক)" : "Your Name (Optional)"}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={lang === "bn" ? "যেমন: তানভীর" : "e.g. Tanvir"}
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{lang === "bn" ? "মোবাইল নম্বর (ঐচ্ছিক)" : "Phone (Optional)"}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="017XXXXXXXX"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: "100%", justifyContent: "center", marginTop: "0.4rem" }}
            >
              <Send size={15} />
              <span>{isSubmitting ? (lang === "bn" ? "জমা হচ্ছে..." : "Submitting...") : (lang === "bn" ? "দর জমা দিন" : "Submit Price Report")}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
