"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Commodity,
  PriceReport,
  Announcement,
  SystemSettings,
  AuditLog,
  AdminStats,
  MarketHub,
  CommodityCategory,
  SupplyStatus,
  SeasonalStatus,
} from "../../types";
import {
  Shield,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Bell,
  Sliders,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Moon,
  Sun,
  Globe2,
  Search,
  Lock,
  Unlock,
  Store,
  Layers,
  History,
  Check,
  Percent,
} from "lucide-react";

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputPasscode, setInputPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // UI Theme & Lang
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const [currentTab, setCurrentTab] = useState<
    "overview" | "commodities" | "reports" | "announcements" | "markets" | "settings"
  >("overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [reports, setReports] = useState<PriceReport[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [markets, setMarkets] = useState<MarketHub[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Filter States
  const [commSearch, setCommSearch] = useState("");
  const [commCategoryFilter, setCommCategoryFilter] = useState("ALL");
  const [reportFilterStatus, setReportFilterStatus] = useState<"ALL" | "PENDING" | "VERIFIED" | "REJECTED">("ALL");

  // Modals
  const [addCommModalOpen, setAddCommModalOpen] = useState(false);
  const [editCommModalData, setEditCommModalData] = useState<Commodity | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [addAnnModalOpen, setAddAnnModalOpen] = useState(false);
  const [addMarketModalOpen, setAddMarketModalOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Form State: New Commodity
  const [newComm, setNewComm] = useState({
    nameEn: "",
    nameBn: "",
    category: "VEGETABLES" as CommodityCategory,
    unit: "kg",
    unitBn: "কেজি",
    icon: "🥬",
    currentAvgPrice: 60,
    wholesalePrice: 50,
    tcbPrice: 55,
    supplyStatus: "IN_STOCK" as SupplyStatus,
    seasonalStatus: "IN_SEASON" as SeasonalStatus,
  });

  // Form State: Bulk Adjust
  const [bulkCategory, setBulkCategory] = useState("ALL");
  const [bulkPercentage, setBulkPercentage] = useState<number>(0);
  const [bulkFlatAmount, setBulkFlatAmount] = useState<number>(0);

  // Form State: New Announcement
  const [newAnn, setNewAnn] = useState({
    titleEn: "",
    titleBn: "",
    messageEn: "",
    messageBn: "",
    level: "INFO" as "INFO" | "WARNING" | "EMERGENCY" | "TCB",
    targetMarket: "ALL",
  });

  // Form State: New Market
  const [newMarket, setNewMarket] = useState({
    name: "",
    nameBn: "",
    division: "Dhaka",
    district: "Dhaka",
    type: "BOTH" as "WHOLESALE" | "RETAIL" | "BOTH",
    description: "",
    status: "ACTIVE" as "ACTIVE" | "DISRUPTED" | "SPECIAL_MONITOR",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputPasscode === "admin123" || (settings?.adminPasscode && inputPasscode === settings.adminPasscode)) {
      setIsAuthenticated(true);
      setAuthError("");
      try {
        sessionStorage.setItem("bajaardar_admin_auth", "true");
      } catch (err) {}
      showToast(lang === "bn" ? "অ্যাডমিন প্যানেলে স্বাগতম!" : "Welcome to BajaarDar Admin Console!");
    } else {
      setAuthError(lang === "bn" ? "ভুল পাসকোড! ডেমো পাসকোড: admin123" : "Incorrect passcode! Demo key: admin123");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem("bajaardar_admin_auth");
    } catch (err) {}
    showToast(lang === "bn" ? "অ্যাডমিন সেশন লক করা হয়েছে" : "Admin session locked");
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [rStats, rComm, rReps, rAnns, rMkts, rSets, rLogs] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/admin/commodities").then((r) => r.json()),
        fetch("/api/admin/reports").then((r) => r.json()),
        fetch("/api/admin/announcements").then((r) => r.json()),
        fetch("/api/admin/markets").then((r) => r.json()),
        fetch("/api/admin/settings").then((r) => r.json()),
        fetch("/api/admin/audit-logs").then((r) => r.json()),
      ]);

      if (rStats.success) setStats(rStats.data);
      if (rComm.success) setCommodities(rComm.data);
      if (rReps.success) setReports(rReps.data);
      if (rAnns.success) setAnnouncements(rAnns.data);
      if (rMkts.success) setMarkets(rMkts.data);
      if (rSets.success) setSettings(rSets.data);
      if (rLogs.success) setAuditLogs(rLogs.data);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      showToast("Failed to fetch fresh data from backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check session auth
    const savedAuth = sessionStorage.getItem("bajaardar_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }

    // Theme init
    const savedTheme = (localStorage.getItem("bajaardar_theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    fetchAllData();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("bajaardar_theme", nextTheme);
  };

  // -------------------------------------------------------------
  // COMMODITY ACTIONS
  // -------------------------------------------------------------
  const handleCreateCommodity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/commodities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComm),
      });
      const data = await res.json();
      if (data.success) {
        showToast(lang === "bn" ? `নতুন পণ্য ${newComm.nameBn} সফলভাবে যুক্ত হয়েছে!` : `Commodity ${newComm.nameEn} added successfully!`);
        setAddCommModalOpen(false);
        setNewComm({
          nameEn: "",
          nameBn: "",
          category: "VEGETABLES",
          unit: "kg",
          unitBn: "কেজি",
          icon: "🥬",
          currentAvgPrice: 60,
          wholesalePrice: 50,
          tcbPrice: 55,
          supplyStatus: "IN_STOCK",
          seasonalStatus: "IN_SEASON",
        });
        fetchAllData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error adding commodity");
    }
  };

  const handleUpdateCommodity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCommModalData) return;
    try {
      const res = await fetch(`/api/admin/commodities/${editCommModalData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCommModalData),
      });
      const data = await res.json();
      if (data.success) {
        showToast(lang === "bn" ? "পণ্য তথ্য সফলভাবে হালনাগাদ হয়েছে" : "Commodity updated successfully");
        setEditCommModalData(null);
        fetchAllData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error updating commodity");
    }
  };

  const handleDeleteCommodity = async (id: string, name: string) => {
    if (!confirm(lang === "bn" ? `আপনি কি নিশ্চিতভাবে "${name}" মুছে ফেলতে চান?` : `Are you sure you want to delete "${name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/commodities/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(lang === "bn" ? "পণ্য মুছে ফেলা হয়েছে" : "Commodity deleted successfully");
        fetchAllData();
      }
    } catch (err) {
      alert("Error deleting commodity");
    }
  };

  const handleQuickPriceChange = async (comm: Commodity, delta: number) => {
    const nextPrice = Math.max(1, comm.currentAvgPrice + delta);
    try {
      const res = await fetch(`/api/admin/commodities/${comm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentAvgPrice: nextPrice }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${comm.nameEn} price: ৳${nextPrice}`);
        fetchAllData();
      }
    } catch (err) {
      alert("Error updating price");
    }
  };

  const handleBulkAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/commodities/bulk-adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: bulkCategory,
          percentage: bulkPercentage || undefined,
          flatAmount: bulkFlatAmount || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setBulkModalOpen(false);
        setBulkPercentage(0);
        setBulkFlatAmount(0);
        fetchAllData();
      }
    } catch (err) {
      alert("Error in bulk adjust");
    }
  };

  // -------------------------------------------------------------
  // REPORT MODERATION ACTIONS
  // -------------------------------------------------------------
  const handleModerateReport = async (reportId: string, status: "VERIFIED" | "REJECTED", applyPrice = true) => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, applyPrice }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          status === "VERIFIED"
            ? lang === "bn"
              ? "রিপোর্টটি অনুমোদিত হয়েছে এবং লাইভ বাজার দরে প্রভাব পড়েছে!"
              : "Report approved and incorporated into live market index!"
            : lang === "bn"
            ? "রিপোর্টটি বাতিল করা হয়েছে"
            : "Report marked as rejected"
        );
        fetchAllData();
      }
    } catch (err) {
      alert("Error moderating report");
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm(lang === "bn" ? "রিপোর্টটি স্থায়ীভাবে মুছে ফেলতে চান?" : "Permanently delete report?")) return;
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Report deleted");
        fetchAllData();
      }
    } catch (err) {
      alert("Error deleting report");
    }
  };

  // -------------------------------------------------------------
  // ANNOUNCEMENTS ACTIONS
  // -------------------------------------------------------------
  const handleToggleAnnouncement = async (ann: Announcement) => {
    try {
      const res = await fetch(`/api/admin/announcements/${ann.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !ann.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(ann.isActive ? "Announcement deactivated" : "Announcement live on public site!");
        fetchAllData();
      }
    } catch (err) {
      alert("Error toggling announcement");
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAnn, isActive: true }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(lang === "bn" ? "নতুন বুলেটিন সফলভাবে প্রকাশিত হয়েছে!" : "Market Bulletin broadcasted live!");
        setAddAnnModalOpen(false);
        setNewAnn({
          titleEn: "",
          titleBn: "",
          messageEn: "",
          messageBn: "",
          level: "INFO",
          targetMarket: "ALL",
        });
        fetchAllData();
      }
    } catch (err) {
      alert("Error creating announcement");
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm(lang === "bn" ? "বুলেটিনটি মুছে ফেলতে চান?" : "Delete bulletin?")) return;
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Bulletin removed");
        fetchAllData();
      }
    } catch (err) {
      alert("Error deleting announcement");
    }
  };

  // -------------------------------------------------------------
  // MARKETS ACTIONS
  // -------------------------------------------------------------
  const handleCreateMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/markets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMarket),
      });
      const data = await res.json();
      if (data.success) {
        showToast(lang === "bn" ? "নতুন মোকাম যুক্ত হয়েছে!" : "Market hub added successfully!");
        setAddMarketModalOpen(false);
        setNewMarket({
          name: "",
          nameBn: "",
          division: "Dhaka",
          district: "Dhaka",
          type: "BOTH",
          description: "",
          status: "ACTIVE",
        });
        fetchAllData();
      }
    } catch (err) {
      alert("Error adding market");
    }
  };

  const handleToggleMarketStatus = async (market: MarketHub) => {
    const nextStatus = market.status === "ACTIVE" ? "SPECIAL_MONITOR" : market.status === "SPECIAL_MONITOR" ? "DISRUPTED" : "ACTIVE";
    try {
      const res = await fetch(`/api/admin/markets/${market.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Market status changed to ${nextStatus}`);
        fetchAllData();
      }
    } catch (err) {
      alert("Error updating market");
    }
  };

  // -------------------------------------------------------------
  // SYSTEM SETTINGS ACTIONS
  // -------------------------------------------------------------
  const handleSaveSettings = async (updates: Partial<SystemSettings>) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        showToast(lang === "bn" ? "সিস্টেম সেটিংস সংরক্ষিত হয়েছে" : "System settings saved successfully");
        fetchAllData();
      }
    } catch (err) {
      alert("Error saving settings");
    }
  };

  const handleResetFactory = async () => {
    try {
      const res = await fetch("/api/admin/settings/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast(lang === "bn" ? "সিস্টেম সফলভাবে প্রাথমিক ডেমো তথ্যে রিসেট হয়েছে" : "System reset to initial seeds!");
        setResetConfirmOpen(false);
        fetchAllData();
      }
    } catch (err) {
      alert("Error resetting system");
    }
  };

  // Filtered commodities
  const filteredCommodities = commodities.filter((c) => {
    const matchesCat = commCategoryFilter === "ALL" || c.category === commCategoryFilter;
    const q = commSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.nameEn.toLowerCase().includes(q) ||
      c.nameBn.includes(q) ||
      c.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (reportFilterStatus === "ALL") return true;
    return r.status === reportFilterStatus;
  });

  // -------------------------------------------------------------
  // PASSCODE UNLOCK OVERLAY
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="admin-layout" style={{ justifyContent: "center", alignItems: "center", padding: "1.5rem" }}>
        <div
          style={{
            maxWidth: "440px",
            width: "100%",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "2.5rem 2rem",
            boxShadow: "var(--shadow-lg)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              margin: "0 auto 1.25rem auto",
              background: "linear-gradient(135deg, #059669 0%, #0284c7 100%)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Lock size={30} />
          </div>

          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.4rem" }}>
            {lang === "bn" ? "অ্যাডমিন কন্ট্রোল সেন্টার" : "Admin Control Console"}
          </h2>
          <p style={{ fontSize: "0.86rem", color: "var(--text-dim)", marginBottom: "1.75rem" }}>
            {lang === "bn"
              ? "সিস্টেম ও বাজার মূল্য নিয়ন্ত্রণ করতে পাসকোড প্রবেশ করান"
              : "Enter your admin security passcode to manage live market data"}
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1.25rem", textAlign: "left" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, display: "block", marginBottom: "0.4rem" }}>
                {lang === "bn" ? "সিকিউরিটি পাসকোড" : "Security Passcode"}
              </label>
              <input
                type="password"
                className="admin-input"
                style={{ width: "100%", textAlign: "center", letterSpacing: "0.2em", fontSize: "1.1rem" }}
                placeholder="••••••••"
                value={inputPasscode}
                onChange={(e) => setInputPasscode(e.target.value)}
                autoFocus
              />
              {authError && (
                <div style={{ color: "#f43f5e", fontSize: "0.78rem", marginTop: "0.4rem", fontWeight: 600 }}>
                  {authError}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: "1rem" }}>
              <Unlock size={16} />
              <span>{lang === "bn" ? "লগইন করুন" : "Unlock Admin Dashboard"}</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: "100%", justifyContent: "center", fontSize: "0.78rem" }}
              onClick={() => {
                setInputPasscode("admin123");
                setTimeout(() => handleLogin(), 50);
              }}
            >
              <span>🔑 {lang === "bn" ? "ডেমো কি ব্যবহার করুন (admin123)" : "Use Demo Key (admin123)"}</span>
            </button>
          </form>

          <div style={{ marginTop: "1.75rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
            <Link href="/" style={{ color: "var(--text-dim)", fontSize: "0.82rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <ArrowLeft size={14} />
              <span>{lang === "bn" ? "পাবলিক সাইটে ফিরে যান" : "Return to Public Market"}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="admin-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            zIndex: 1500,
            background: "#059669",
            color: "#ffffff",
            padding: "0.75rem 1.25rem",
            borderRadius: "var(--radius-md)",
            fontWeight: 700,
            fontSize: "0.86rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
            animation: "fadeInDown 0.25s ease-out",
          }}
        >
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <div className="admin-brand-icon">🛡️</div>
            <div>
              <div className="admin-brand-title">
                <span>{lang === "bn" ? "বাজার দর — অ্যাডমিন প্যানেল" : "BajaarDar Control Console"}</span>
                <span className="admin-brand-badge">{lang === "bn" ? "সক্রিয় কন্ট্রোল" : "LIVE BACKEND"}</span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                {lang === "bn" ? "বাংলাদেশ কাঁচাবাজার ও মোকাম মনিটরিং সিস্টেম" : "National Kitchen Market & Wholesale Hub Regulator"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {/* Quick Refresh */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={fetchAllData}
              title="Refresh Data"
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>{lang === "bn" ? "রিফ্রেশ" : "Sync"}</span>
            </button>

            {/* Language Switch */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setLang((prev) => (prev === "bn" ? "en" : "bn"))}
              title="Toggle Language"
            >
              <Globe2 size={14} />
              <span>{lang === "bn" ? "English" : "বাংলা"}</span>
            </button>

            {/* Theme Toggle */}
            <button className="btn btn-theme btn-sm" onClick={toggleTheme}>
              {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
            </button>

            {/* Back to Public Site */}
            <Link href="/" className="btn btn-secondary btn-sm" style={{ textDecoration: "none" }}>
              <ArrowLeft size={14} />
              <span>{lang === "bn" ? "পাবলিক সাইট" : "Public View"}</span>
            </Link>

            {/* Logout */}
            <button className="btn btn-secondary btn-sm" onClick={handleLogout} title="Lock session">
              <Lock size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1380px", margin: "0 auto", padding: "0.5rem 1.5rem" }}>
          <div className="admin-nav-tabs">
            <button
              className={`admin-tab-btn ${currentTab === "overview" ? "active" : ""}`}
              onClick={() => setCurrentTab("overview")}
            >
              <Layers size={16} />
              <span>{lang === "bn" ? "একনজরে ওভারভিউ" : "Overview"}</span>
            </button>

            <button
              className={`admin-tab-btn ${currentTab === "commodities" ? "active" : ""}`}
              onClick={() => setCurrentTab("commodities")}
            >
              <ShoppingBag size={16} />
              <span>{lang === "bn" ? "পণ্য ও দর ব্যবস্থাপনা" : "Commodities Master"}</span>
              <span style={{ fontSize: "0.72rem", opacity: 0.8 }}>({commodities.length})</span>
            </button>

            <button
              className={`admin-tab-btn ${currentTab === "reports" ? "active" : ""}`}
              onClick={() => setCurrentTab("reports")}
            >
              <CheckCircle size={16} />
              <span>{lang === "bn" ? "নাগরিক রিপোর্ট মডারেশন" : "Crowd Reports"}</span>
              {stats?.pendingReports ? (
                <span className="admin-tab-badge">{stats.pendingReports}</span>
              ) : null}
            </button>

            <button
              className={`admin-tab-btn ${currentTab === "announcements" ? "active" : ""}`}
              onClick={() => setCurrentTab("announcements")}
            >
              <Bell size={16} />
              <span>{lang === "bn" ? "লাইভ বুলেটিন ও নোটিশ" : "Live Bulletins"}</span>
              <span style={{ fontSize: "0.72rem", opacity: 0.8 }}>({announcements.filter((a) => a.isActive).length})</span>
            </button>

            <button
              className={`admin-tab-btn ${currentTab === "markets" ? "active" : ""}`}
              onClick={() => setCurrentTab("markets")}
            >
              <Store size={16} />
              <span>{lang === "bn" ? "পাইকারি মোকাম ও বাজার" : "Market Hubs"}</span>
              <span style={{ fontSize: "0.72rem", opacity: 0.8 }}>({markets.length})</span>
            </button>

            <button
              className={`admin-tab-btn ${currentTab === "settings" ? "active" : ""}`}
              onClick={() => setCurrentTab("settings")}
            >
              <Sliders size={16} />
              <span>{lang === "bn" ? "সিস্টেম নিয়ন্ত্রণ" : "System Control"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <main className="admin-content">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {currentTab === "overview" && (
          <div>
            {/* KPI Metric Cards */}
            <div className="admin-metric-grid">
              <div className="admin-metric-card">
                <div className="admin-metric-icon emerald">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <div className="admin-metric-val">{stats?.totalCommodities || commodities.length}</div>
                  <div className="admin-metric-label">{lang === "bn" ? "ট্র্যাক করা পণ্য" : "Tracked Commodities"}</div>
                </div>
              </div>

              <div
                className="admin-metric-card"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setReportFilterStatus("PENDING");
                  setCurrentTab("reports");
                }}
              >
                <div className="admin-metric-icon amber">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <div className="admin-metric-val" style={{ color: "#d97706" }}>
                    {stats?.pendingReports ?? 0}
                  </div>
                  <div className="admin-metric-label">{lang === "bn" ? "অপেক্ষমাণ রিপোর্ট (যাচাই করুন)" : "Pending Review Queue"}</div>
                </div>
              </div>

              <div className="admin-metric-card">
                <div className="admin-metric-icon sky">
                  <Store size={24} />
                </div>
                <div>
                  <div className="admin-metric-val">{stats?.activeMarkets || markets.length}</div>
                  <div className="admin-metric-label">{lang === "bn" ? "সক্রিয় মোকাম ও বাজার" : "Active Market Hubs"}</div>
                </div>
              </div>

              <div className="admin-metric-card">
                <div className="admin-metric-icon rose">
                  {stats && stats.avgInflation >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                </div>
                <div>
                  <div
                    className="admin-metric-val"
                    style={{ color: stats && stats.avgInflation > 0 ? "#f43f5e" : "#10b981" }}
                  >
                    {stats ? `${stats.avgInflation > 0 ? "+" : ""}${stats.avgInflation}%` : "0%"}
                  </div>
                  <div className="admin-metric-label">{lang === "bn" ? "সারাদেশে গড় মূল্যস্ফীতি" : "Average 24h Inflation"}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions & High Inflation Alerts */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
              {/* Quick Launchers */}
              <div className="admin-card-section" style={{ margin: 0 }}>
                <h3 className="admin-card-title">⚡ {lang === "bn" ? "দ্রুত নিয়ন্ত্রণ কমান্ড" : "Quick Operations"}</h3>
                <p className="admin-card-desc">{lang === "bn" ? "সরাসরি সিস্টেম হালনাগাদ করার টুলস" : "Immediate actions to regulate the market"}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <button className="btn btn-primary" onClick={() => setAddCommModalOpen(true)}>
                    <Plus size={15} />
                    <span>{lang === "bn" ? "নতুন পণ্য যোগ" : "Add Commodity"}</span>
                  </button>

                  <button className="btn btn-secondary" onClick={() => setBulkModalOpen(true)}>
                    <Percent size={15} />
                    <span>{lang === "bn" ? "বাল্ক দর সমন্বয়" : "Bulk Adjust"}</span>
                  </button>

                  <button className="btn btn-secondary" onClick={() => setAddAnnModalOpen(true)}>
                    <Bell size={15} />
                    <span>{lang === "bn" ? "জরুরি বুলেটিন" : "Post Bulletin"}</span>
                  </button>

                  <button className="btn btn-secondary" onClick={() => setCurrentTab("reports")}>
                    <CheckCircle size={15} />
                    <span>{lang === "bn" ? "রিপোর্ট স্ক্রিনিং" : "Review Reports"}</span>
                  </button>
                </div>
              </div>

              {/* High Inflation Monitor */}
              <div className="admin-card-section" style={{ margin: 0 }}>
                <h3 className="admin-card-title" style={{ color: "#f43f5e" }}>
                  <TrendingUp size={18} />
                  <span>{lang === "bn" ? "উচ্চ মূল্যস্ফীতি অ্যালার্ট" : "High Inflation Watchlist"}</span>
                </h3>
                <p className="admin-card-desc">
                  {lang === "bn"
                    ? `যেসব পণ্যের দর নির্ধারিত সীমার (>${settings?.inflationThresholdPercent || 8}%) চেয়ে দ্রুত বেড়েছে:`
                    : `Commodities exceeding inflation threshold (>${settings?.inflationThresholdPercent || 8}%):`}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {commodities
                    .filter((c) => c.change24h >= (settings?.inflationThresholdPercent || 8))
                    .slice(0, 4)
                    .map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.5rem 0.75rem",
                          background: "rgba(244, 63, 94, 0.08)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid rgba(244, 63, 94, 0.2)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                              {lang === "bn" ? item.nameBn : item.nameEn}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                              {lang === "bn" ? `বর্তমান দর: ৳${item.currentAvgPrice}` : `Current: ৳${item.currentAvgPrice}`}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <span className="status-pill scarce" style={{ fontWeight: 800 }}>
                            +{item.change24h}%
                          </span>
                        </div>
                      </div>
                    ))}

                  {commodities.filter((c) => c.change24h >= (settings?.inflationThresholdPercent || 8)).length === 0 && (
                    <div style={{ color: "var(--emerald)", fontSize: "0.85rem", fontWeight: 600, padding: "0.5rem 0" }}>
                      ✓ {lang === "bn" ? "কোনো অস্বাভাবিক মূল্যস্ফীতি শনাক্ত হয়নি।" : "No extreme inflation alerts right now."}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Audit Logs Timeline */}
            <div className="admin-card-section">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                <h3 className="admin-card-title">
                  <History size={18} />
                  <span>{lang === "bn" ? "সাম্প্রতিক সিস্টেম অডিট লগ" : "Recent System Audit Activity"}</span>
                </h3>
                <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                  {lang === "bn" ? "লাইভ রেকর্ড সংরক্ষণ" : "Immutable Audit Trail"}
                </span>
              </div>

              <div className="audit-list">
                {auditLogs.slice(0, 7).map((log) => (
                  <div key={log.id} className="audit-item">
                    <div className="audit-dot"></div>
                    <div style={{ flex: 1 }}>
                      <div>
                        <span className="audit-action">{log.action}</span>
                        <span style={{ fontWeight: 500, marginLeft: "0.5rem" }}>{log.details}</span>
                      </div>
                      <div className="audit-meta">
                        <span>By {log.actor} • {new Date(log.timestamp).toLocaleTimeString()} ({new Date(log.timestamp).toLocaleDateString()})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: COMMODITIES MASTER */}
        {/* ========================================================================= */}
        {currentTab === "commodities" && (
          <div>
            <div className="admin-action-bar">
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                <div className="admin-search-box">
                  <Search size={16} style={{ color: "var(--text-dim)" }} />
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder={lang === "bn" ? "পণ্য খুঁজুন (চাল, ডাল, আলু)..." : "Search commodities..."}
                    value={commSearch}
                    onChange={(e) => setCommSearch(e.target.value)}
                  />
                </div>

                <select
                  className="admin-select"
                  value={commCategoryFilter}
                  onChange={(e) => setCommCategoryFilter(e.target.value)}
                >
                  <option value="ALL">{lang === "bn" ? "সকল ক্যাটাগরি" : "All Categories"}</option>
                  <option value="RICE">{lang === "bn" ? "চাল (Rice)" : "Rice"}</option>
                  <option value="VEGETABLES">{lang === "bn" ? "শাক-সবজি (Vegetables)" : "Vegetables"}</option>
                  <option value="SPICES_OILS">{lang === "bn" ? "তেল ও মসলা (Spices & Oils)" : "Spices & Oils"}</option>
                  <option value="PROTEIN">{lang === "bn" ? "মাছ, মাংস ও ডিম (Protein)" : "Protein"}</option>
                  <option value="FRUITS">{lang === "bn" ? "ফলমূল (Fruits)" : "Fruits"}</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setBulkModalOpen(true)}>
                  <Percent size={14} />
                  <span>{lang === "bn" ? "বাল্ক সমন্বয়" : "Bulk Adjust"}</span>
                </button>

                <button className="btn btn-primary btn-sm" onClick={() => setAddCommModalOpen(true)}>
                  <Plus size={14} />
                  <span>{lang === "bn" ? "+ নতুন পণ্য যুক্ত করুন" : "+ Add Commodity"}</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="admin-table-container">
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{lang === "bn" ? "পণ্য" : "Item"}</th>
                      <th>{lang === "bn" ? "ক্যাটাগরি" : "Category"}</th>
                      <th>{lang === "bn" ? "খুচরা দর (গড়)" : "Retail (Avg)"}</th>
                      <th>{lang === "bn" ? "পাইকারি মোকাম" : "Wholesale"}</th>
                      <th>{lang === "bn" ? "টিসিবি দর" : "TCB"}</th>
                      <th>{lang === "bn" ? "২৪ ঘণ্টার পরিবর্তন" : "24h Shift"}</th>
                      <th>{lang === "bn" ? "সরবরাহ অবস্থা" : "Supply"}</th>
                      <th>{lang === "bn" ? "অ্যাকশন" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCommodities.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <span style={{ fontSize: "1.4rem" }}>{c.icon}</span>
                            <div>
                              <div style={{ fontWeight: 700 }}>{lang === "bn" ? c.nameBn : c.nameEn}</div>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                                {lang === "bn" ? c.nameEn : c.nameBn} • {c.unit}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: 600 }}>
                            {c.category}
                          </span>
                        </td>

                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>৳{c.currentAvgPrice}</span>
                            {/* Quick delta buttons */}
                            <button
                              className="btn-icon-only success"
                              style={{ width: "20px", height: "20px", fontSize: "0.68rem" }}
                              onClick={() => handleQuickPriceChange(c, 2)}
                              title="+৳2"
                            >
                              +
                            </button>
                            <button
                              className="btn-icon-only danger"
                              style={{ width: "20px", height: "20px", fontSize: "0.68rem" }}
                              onClick={() => handleQuickPriceChange(c, -2)}
                              title="-৳2"
                            >
                              -
                            </button>
                          </div>
                        </td>

                        <td>
                          <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>৳{c.wholesalePrice}</span>
                        </td>

                        <td>
                          <span style={{ fontSize: "0.85rem", color: "var(--emerald)", fontWeight: 600 }}>
                            {c.tcbPrice ? `৳${c.tcbPrice}` : "—"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status-pill ${
                              c.change24h > 0 ? "scarce" : c.change24h < 0 ? "in-stock" : "moderate"
                            }`}
                          >
                            {c.change24h > 0 ? `+${c.change24h}%` : `${c.change24h}%`}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status-pill ${
                              c.supplyStatus === "IN_STOCK"
                                ? "in-stock"
                                : c.supplyStatus === "MODERATE"
                                ? "moderate"
                                : "scarce"
                            }`}
                          >
                            {c.supplyStatus === "IN_STOCK"
                              ? lang === "bn"
                                ? "পর্যাপ্ত"
                                : "In Stock"
                              : c.supplyStatus === "MODERATE"
                              ? lang === "bn"
                                ? "স্বাভাবিক"
                                : "Moderate"
                              : lang === "bn"
                              ? "সংকটপূর্ণ"
                              : "Scarce"}
                          </span>
                        </td>

                        <td>
                          <div style={{ display: "flex", gap: "0.4rem" }}>
                            <button
                              className="btn-icon-only"
                              onClick={() => setEditCommModalData(c)}
                              title="Edit Commodity"
                            >
                              <Edit2 size={13} />
                            </button>

                            <button
                              className="btn-icon-only danger"
                              onClick={() => handleDeleteCommodity(c.id, c.nameEn)}
                              title="Delete Commodity"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CROWD REPORTS MODERATION */}
        {/* ========================================================================= */}
        {currentTab === "reports" && (
          <div>
            <div className="admin-action-bar">
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className={`btn btn-sm ${reportFilterStatus === "ALL" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setReportFilterStatus("ALL")}
                >
                  {lang === "bn" ? "সকল রিপোর্ট" : "All Reports"} ({reports.length})
                </button>
                <button
                  className={`btn btn-sm ${reportFilterStatus === "PENDING" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setReportFilterStatus("PENDING")}
                >
                  {lang === "bn" ? "অপেক্ষমাণ" : "Pending"} ({reports.filter((r) => r.status === "PENDING").length})
                </button>
                <button
                  className={`btn btn-sm ${reportFilterStatus === "VERIFIED" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setReportFilterStatus("VERIFIED")}
                >
                  {lang === "bn" ? "অনুমোদিত" : "Verified"} ({reports.filter((r) => r.status === "VERIFIED").length})
                </button>
                <button
                  className={`btn btn-sm ${reportFilterStatus === "REJECTED" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setReportFilterStatus("REJECTED")}
                >
                  {lang === "bn" ? "বাতিল" : "Rejected"} ({reports.filter((r) => r.status === "REJECTED").length})
                </button>
              </div>

              <div style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
                {lang === "bn"
                  ? "অনুমোদিত রিপোর্টগুলো সরাসরি লাইভ পণ্যের গড় দরে প্রভাব ফেলে"
                  : "Verified reports dynamically update the official weighted market index"}
              </div>
            </div>

            <div className="admin-table-container">
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{lang === "bn" ? "পণ্য" : "Commodity"}</th>
                      <th>{lang === "bn" ? "বাজার ও এলাকা" : "Market & Location"}</th>
                      <th>{lang === "bn" ? "দাখিলকৃত দর" : "Reported Price"}</th>
                      <th>{lang === "bn" ? "রিপোর্টার" : "Reporter"}</th>
                      <th>{lang === "bn" ? "স্ট্যাটাস" : "Status"}</th>
                      <th>{lang === "bn" ? "সময়" : "Time"}</th>
                      <th>{lang === "bn" ? "সিদ্ধান্ত ও অ্যাকশন" : "Moderation"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontSize: "1.25rem" }}>{r.commodityIcon || "🛒"}</span>
                            <div>
                              <div style={{ fontWeight: 700 }}>{lang === "bn" ? r.commodityNameBn : r.commodityNameEn}</div>
                              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>{r.type}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div style={{ fontWeight: 600 }}>{r.marketName}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                            {r.district}, {r.division}
                          </div>
                        </td>

                        <td>
                          <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--emerald)" }}>
                            ৳{r.price}
                          </span>
                        </td>

                        <td>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{r.reporterName || "Citizen"}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>{r.reporterPhone || "No Phone"}</div>
                        </td>

                        <td>
                          <span
                            className={`status-pill ${
                              r.status === "VERIFIED"
                                ? "verified"
                                : r.status === "PENDING"
                                ? "pending"
                                : "rejected"
                            }`}
                          >
                            {r.status === "VERIFIED"
                              ? lang === "bn"
                                ? "✓ অনুমোদিত"
                                : "Verified"
                              : r.status === "PENDING"
                              ? lang === "bn"
                                ? "⏳ অপেক্ষমাণ"
                                : "Pending"
                              : lang === "bn"
                              ? "✗ বাতিল"
                              : "Rejected"}
                          </span>
                        </td>

                        <td style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                          {new Date(r.createdAt).toLocaleString()}
                        </td>

                        <td>
                          <div style={{ display: "flex", gap: "0.4rem" }}>
                            {r.status === "PENDING" && (
                              <>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleModerateReport(r.id, "VERIFIED", true)}
                                  title="Approve and apply to commodity price"
                                >
                                  <Check size={13} />
                                  <span>{lang === "bn" ? "অনুমোদন ও দর আপডেট" : "Approve & Update"}</span>
                                </button>

                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => handleModerateReport(r.id, "REJECTED", false)}
                                  title="Reject report"
                                >
                                  <XCircle size={13} />
                                  <span>{lang === "bn" ? "বাতিল" : "Reject"}</span>
                                </button>
                              </>
                            )}

                            {r.status !== "PENDING" && (
                              <button
                                className="btn-icon-only danger"
                                onClick={() => handleDeleteReport(r.id)}
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredReports.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-dim)" }}>
                          {lang === "bn" ? "কোনো রিপোর্ট পাওয়া যায়নি" : "No price reports in this category"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: BULLETINS & ANNOUNCEMENTS */}
        {/* ========================================================================= */}
        {currentTab === "announcements" && (
          <div>
            <div className="admin-action-bar">
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                  {lang === "bn" ? "জরুরি বাজার বুলেটিন ও সরকারি নোটিশ" : "Live Market Bulletins & Public Notices"}
                </h3>
                <div style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
                  {lang === "bn"
                    ? "সক্রিয় নোটিশগুলো সরাসরি মূল ওয়েবসাইটের উপরে ব্যানার আকারে দৃশ্যমান হয়"
                    : "Active bulletins are broadcast directly on top of the public interface"}
                </div>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => setAddAnnModalOpen(true)}>
                <Plus size={14} />
                <span>{lang === "bn" ? "+ নতুন বুলেটিন প্রচার করুন" : "+ Broadcast New Bulletin"}</span>
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem" }}>
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.25rem",
                    boxShadow: "var(--shadow-card)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                      <span className={`status-pill ${ann.level.toLowerCase()}`}>
                        {ann.level}
                      </span>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: ann.isActive ? "var(--emerald)" : "var(--text-dim)" }}>
                          {ann.isActive ? (lang === "bn" ? "লাইভ প্রচার হচ্ছে" : "BROADCASTING") : (lang === "bn" ? "নিষ্ক্রিয়" : "INACTIVE")}
                        </span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={ann.isActive}
                            onChange={() => handleToggleAnnouncement(ann)}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    <h4 style={{ fontSize: "0.98rem", fontWeight: 800, marginBottom: "0.35rem" }}>
                      {lang === "bn" ? ann.titleBn : ann.titleEn}
                    </h4>

                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                      {lang === "bn" ? ann.messageBn : ann.messageEn}
                    </p>

                    <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                      {lang === "bn" ? "টার্গেট মার্কেট:" : "Target:"} <strong>{ann.targetMarket}</strong> • {new Date(ann.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
                    <button
                      className="btn-icon-only danger"
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      title="Delete Bulletin"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MARKET HUBS */}
        {/* ========================================================================= */}
        {currentTab === "markets" && (
          <div>
            <div className="admin-action-bar">
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                  {lang === "bn" ? "মোকাম ও বাজার ব্যবস্থাপনা" : "Wholesale Hubs & Retail Markets"}
                </h3>
                <div style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
                  {lang === "bn" ? "দেশের প্রধান পাইকারি ও খুচরা হাটবাজারের অপারেশনাল স্ট্যাটাস" : "Operational status of agricultural hubs across 8 divisions"}
                </div>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => setAddMarketModalOpen(true)}>
                <Plus size={14} />
                <span>{lang === "bn" ? "+ নতুন বাজার যুক্ত করুন" : "+ Add Market Hub"}</span>
              </button>
            </div>

            <div className="admin-table-container">
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{lang === "bn" ? "বাজারের নাম" : "Market Name"}</th>
                      <th>{lang === "bn" ? "বিভাগ ও জেলা" : "Division & District"}</th>
                      <th>{lang === "bn" ? "ধরন" : "Type"}</th>
                      <th>{lang === "bn" ? "বিবরণ" : "Description"}</th>
                      <th>{lang === "bn" ? "অপারেশনাল স্ট্যাটাস" : "Status"}</th>
                      <th>{lang === "bn" ? "অ্যাকশন" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {markets.map((m) => (
                      <tr key={m.id}>
                        <td>
                          <div style={{ fontWeight: 800 }}>{lang === "bn" ? m.nameBn : m.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{m.name}</div>
                        </td>

                        <td>
                          <div style={{ fontWeight: 600 }}>{m.division}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{m.district}</div>
                        </td>

                        <td>
                          <span className="status-pill in-stock">{m.type}</span>
                        </td>

                        <td style={{ maxWidth: "320px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                          {m.description}
                        </td>

                        <td>
                          <span
                            className={`status-pill ${
                              m.status === "ACTIVE"
                                ? "in-stock"
                                : m.status === "SPECIAL_MONITOR"
                                ? "moderate"
                                : "scarce"
                            }`}
                          >
                            {m.status === "ACTIVE"
                              ? lang === "bn"
                                ? "সক্রিয় মোকাম"
                                : "Active"
                              : m.status === "SPECIAL_MONITOR"
                              ? lang === "bn"
                                ? "বিশেষ নজরদারি"
                                : "Taskforce Monitored"
                              : lang === "bn"
                              ? "সরবরাহ ব্যাহত"
                              : "Disrupted"}
                          </span>
                        </td>

                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleToggleMarketStatus(m)}
                            title="Toggle Market Operational Status"
                          >
                            <span>{lang === "bn" ? "স্ট্যাটাস পরিবর্তন" : "Change Status"}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: SYSTEM SETTINGS */}
        {/* ========================================================================= */}
        {currentTab === "settings" && settings && (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="admin-card-section">
              <h3 className="admin-card-title">
                <Sliders size={18} />
                <span>{lang === "bn" ? "সিস্টেম ও পলিসি নিয়ন্ত্রণ" : "Global System & Policy Controls"}</span>
              </h3>
              <p className="admin-card-desc">
                {lang === "bn"
                  ? "সারাদেশের ব্যবহারকারীদের জন্য প্ল্যাটফর্মের লাইভ আচরণ নিয়ন্ত্রণ করুন"
                  : "Regulate real-time application behavior and crowdsourcing rules"}
              </p>

              {/* Setting 1: Crowdsourcing Switch */}
              <div className="admin-toggle-row">
                <div className="admin-toggle-info">
                  <div className="admin-toggle-title">
                    {lang === "bn" ? "নাগরিক মূল্য রিপোর্টিং (Crowdsourcing Master Switch)" : "Public Price Crowdsourcing"}
                  </div>
                  <div className="admin-toggle-desc">
                    {lang === "bn"
                      ? "চালু থাকলে সাধারণ ভোক্তারা তাদের এলাকার স্থানীয় দর ওয়েবসাইটে রিপোর্ট করতে পারবেন"
                      : "When enabled, citizens and vendors can submit live local prices from any district"}
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.crowdsourcingEnabled}
                    onChange={(e) => handleSaveSettings({ crowdsourcingEnabled: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Setting 2: Auto Verify */}
              <div className="admin-toggle-row">
                <div className="admin-toggle-info">
                  <div className="admin-toggle-title">
                    {lang === "bn" ? "স্বয়ংক্রিয় অনুমোদন মোড (Auto-Verification)" : "Auto-Verification Mode"}
                  </div>
                  <div className="admin-toggle-desc">
                    {lang === "bn"
                      ? "চালু থাকলে ব্যবহারকারীর দাখিলকৃত দর অ্যাডমিন অনুমোদন ছাড়াই সাথে সাথে লাইভ ইনডেক্সে যুক্ত হবে"
                      : "When enabled, incoming price reports bypass the admin moderation queue and update rates instantly"}
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.autoVerifyReports}
                    onChange={(e) => handleSaveSettings({ autoVerifyReports: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Setting 3: TCB Subsidy Alert */}
              <div className="admin-toggle-row">
                <div className="admin-toggle-info">
                  <div className="admin-toggle-title">
                    {lang === "bn" ? "টিসিবি ভর্তুকি ও সিলিং মনিটরিং" : "TCB Benchmark & Subsidy Indicator"}
                  </div>
                  <div className="admin-toggle-desc">
                    {lang === "bn"
                      ? "সরকারি টিসিবির নির্ধারিত সর্বোচ্চ মূল্যসীমা পণ্যের কার্ডে প্রদর্শন করুন"
                      : "Display Trading Corporation of Bangladesh (TCB) benchmark caps on commodity items"}
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.tcbSubsidyAlerts}
                    onChange={(e) => handleSaveSettings({ tcbSubsidyAlerts: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Setting 4: Inflation Threshold */}
              <div style={{ padding: "1.25rem 0", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div>
                    <div className="admin-toggle-title">
                      {lang === "bn" ? "মূল্যস্ফীতি সতর্কতা সীমা (Inflation Alert Threshold)" : "Inflation Spike Alert Threshold"}
                    </div>
                    <div className="admin-toggle-desc">
                      {lang === "bn"
                        ? "কোনো পণ্যের ২৪ ঘণ্টার মূল্যবৃদ্ধি এই শতাংশ অতিক্রম করলে লাল সতর্কতা ব্যাজ প্রদর্শিত হবে"
                        : "Trigger high-inflation badges when 24h price surge exceeds this percentage"}
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--rose)" }}>
                    {settings.inflationThresholdPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="25"
                  step="1"
                  value={settings.inflationThresholdPercent}
                  onChange={(e) => handleSaveSettings({ inflationThresholdPercent: Number(e.target.value) })}
                  style={{ width: "100%", accentColor: "var(--emerald)", cursor: "pointer" }}
                />
              </div>

              {/* Setting 5: Ticker tape speed */}
              <div style={{ padding: "1.25rem 0", borderBottom: "1px solid var(--border-subtle)" }}>
                <div className="admin-toggle-title" style={{ marginBottom: "0.4rem" }}>
                  {lang === "bn" ? "লাইভ মোকাম টিকার বার্তা (বাংলা)" : "Live Ticker Headline Message (Bangla)"}
                </div>
                <input
                  type="text"
                  className="admin-input"
                  style={{ width: "100%", marginBottom: "0.75rem" }}
                  value={settings.customTickerMessageBn || ""}
                  onChange={(e) => setSettings({ ...settings, customTickerMessageBn: e.target.value })}
                  onBlur={() => handleSaveSettings({ customTickerMessageBn: settings.customTickerMessageBn })}
                />

                <div className="admin-toggle-title" style={{ marginBottom: "0.4rem" }}>
                  {lang === "bn" ? "লাইভ মোকাম টিকার বার্তা (English)" : "Live Ticker Headline Message (English)"}
                </div>
                <input
                  type="text"
                  className="admin-input"
                  style={{ width: "100%" }}
                  value={settings.customTickerMessageEn || ""}
                  onChange={(e) => setSettings({ ...settings, customTickerMessageEn: e.target.value })}
                  onBlur={() => handleSaveSettings({ customTickerMessageEn: settings.customTickerMessageEn })}
                />
              </div>

              {/* Danger Zone: Factory Reset */}
              <div style={{ marginTop: "2rem", padding: "1.25rem", background: "rgba(244, 63, 94, 0.06)", border: "1px solid rgba(244, 63, 94, 0.25)", borderRadius: "var(--radius-md)" }}>
                <h4 style={{ color: "#f43f5e", fontWeight: 800, fontSize: "0.95rem", marginBottom: "0.3rem" }}>
                  ⚠️ {lang === "bn" ? "ডেঞ্জার জোন: ফ্যাক্টরি ডেমো রিসেট" : "Danger Zone: Factory Demo Reset"}
                </h4>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                  {lang === "bn"
                    ? "সমস্ত পরিবর্তিত তথ্য মুছে ফেলে প্ল্যাটফর্মটিকে প্রাথমিক কাওরান বাজার ও খাতুনগঞ্জের সিড ডাটায় ফিরিয়ে নিয়ে যাবে।"
                    : "Reset all commodities, reports and settings back to initial factory demonstration seeds."}
                </p>
                <button className="btn btn-secondary" style={{ color: "#f43f5e", borderColor: "rgba(244, 63, 94, 0.4)" }} onClick={() => setResetConfirmOpen(true)}>
                  <span>{lang === "bn" ? "ফ্যাক্টরি রিসেট কার্যকর করুন" : "Perform Factory Reset"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: ADD COMMODITY */}
      {/* ========================================================================= */}
      {addCommModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setAddCommModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                {lang === "bn" ? "নতুন ভোগ্যপণ্য যুক্ত করুন" : "Add New Commodity"}
              </h3>
              <button className="btn-icon-only" onClick={() => setAddCommModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateCommodity}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "বাংলা নাম" : "Bengali Name"}</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="মিনিকেট চাল / গোল আলু"
                      value={newComm.nameBn}
                      onChange={(e) => setNewComm({ ...newComm, nameBn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "ইংরেজি নাম" : "English Name"}</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Miniket Rice / Diamond Potato"
                      value={newComm.nameEn}
                      onChange={(e) => setNewComm({ ...newComm, nameEn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "ক্যাটাগরি" : "Category"}</label>
                    <select
                      className="admin-select"
                      value={newComm.category}
                      onChange={(e) => setNewComm({ ...newComm, category: e.target.value as CommodityCategory })}
                    >
                      <option value="RICE">চাল (Rice)</option>
                      <option value="VEGETABLES">শাক-সবজি (Vegetables)</option>
                      <option value="SPICES_OILS">তেল ও মসলা (Spices & Oils)</option>
                      <option value="PROTEIN">মাছ, মাংস ও ডিম (Protein)</option>
                      <option value="FRUITS">ফলমূল (Fruits)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "আইকন (ইমোজি)" : "Icon (Emoji)"}</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newComm.icon}
                      onChange={(e) => setNewComm({ ...newComm, icon: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "পরিমাপের একক (Unit)" : "Unit (e.g. kg, liter)"}</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newComm.unit}
                      onChange={(e) => setNewComm({ ...newComm, unit: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "বাংলা একক (কেজি, লিটার)" : "Unit in Bangla"}</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newComm.unitBn}
                      onChange={(e) => setNewComm({ ...newComm, unitBn: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "খুচরা গড় মূল্য (৳)" : "Retail Avg Price (৳)"}</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={newComm.currentAvgPrice}
                      onChange={(e) => setNewComm({ ...newComm, currentAvgPrice: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "কাওরান বাজার পাইকারি দর (৳)" : "Wholesale Price (৳)"}</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={newComm.wholesalePrice}
                      onChange={(e) => setNewComm({ ...newComm, wholesalePrice: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "টিসিবি সিলিং দর (ঐচ্ছিক)" : "TCB Benchmark (Optional)"}</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={newComm.tcbPrice}
                      onChange={(e) => setNewComm({ ...newComm, tcbPrice: Number(e.target.value) })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "সরবরাহ অবস্থা" : "Supply Status"}</label>
                    <select
                      className="admin-select"
                      value={newComm.supplyStatus}
                      onChange={(e) => setNewComm({ ...newComm, supplyStatus: e.target.value as SupplyStatus })}
                    >
                      <option value="IN_STOCK">পর্যাপ্ত সরবরাহ (In Stock)</option>
                      <option value="MODERATE">স্বাভাবিক (Moderate)</option>
                      <option value="SCARCE">সংকটপূর্ণ (Scarce)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAddCommModalOpen(false)}>
                  {lang === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button type="submit" className="btn btn-primary">
                  {lang === "bn" ? "পণ্য সংরক্ষণ করুন" : "Save Commodity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT COMMODITY */}
      {/* ========================================================================= */}
      {editCommModalData && (
        <div className="admin-modal-overlay" onClick={() => setEditCommModalData(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                {lang === "bn" ? "পণ্য ও দর সম্পাদনা করুন" : "Edit Commodity & Prices"}
              </h3>
              <button className="btn-icon-only" onClick={() => setEditCommModalData(null)}>✕</button>
            </div>

            <form onSubmit={handleUpdateCommodity}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "বাংলা নাম" : "Bengali Name"}</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editCommModalData.nameBn}
                      onChange={(e) => setEditCommModalData({ ...editCommModalData, nameBn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "ইংরেজি নাম" : "English Name"}</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editCommModalData.nameEn}
                      onChange={(e) => setEditCommModalData({ ...editCommModalData, nameEn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "খুচরা গড় মূল্য (৳)" : "Retail Price (৳)"}</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={editCommModalData.currentAvgPrice}
                      onChange={(e) =>
                        setEditCommModalData({ ...editCommModalData, currentAvgPrice: Number(e.target.value) })
                      }
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "পাইকারি দর (৳)" : "Wholesale Price (৳)"}</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={editCommModalData.wholesalePrice}
                      onChange={(e) =>
                        setEditCommModalData({ ...editCommModalData, wholesalePrice: Number(e.target.value) })
                      }
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "টিসিবি দর (৳)" : "TCB Price (৳)"}</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={editCommModalData.tcbPrice || ""}
                      onChange={(e) =>
                        setEditCommModalData({
                          ...editCommModalData,
                          tcbPrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "সরবরাহ অবস্থা" : "Supply Status"}</label>
                    <select
                      className="admin-select"
                      value={editCommModalData.supplyStatus || "IN_STOCK"}
                      onChange={(e) =>
                        setEditCommModalData({
                          ...editCommModalData,
                          supplyStatus: e.target.value as SupplyStatus,
                        })
                      }
                    >
                      <option value="IN_STOCK">পর্যাপ্ত সরবরাহ (In Stock)</option>
                      <option value="MODERATE">স্বাভাবিক (Moderate)</option>
                      <option value="SCARCE">সংকটপূর্ণ (Scarce)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditCommModalData(null)}>
                  {lang === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button type="submit" className="btn btn-primary">
                  {lang === "bn" ? "হালনাগাদ সংরক্ষণ" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BULK CATEGORY ADJUST */}
      {/* ========================================================================= */}
      {bulkModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setBulkModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                {lang === "bn" ? "ক্যাটাগরিভিত্তিক বাল্ক দর সমন্বয়" : "Bulk Category Price Adjustment"}
              </h3>
              <button className="btn-icon-only" onClick={() => setBulkModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleBulkAdjust}>
              <div className="admin-modal-body">
                <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginBottom: "1.25rem" }}>
                  {lang === "bn"
                    ? "এক ক্লিকে কোনো নির্দিষ্ট ক্যাটাগরির সকল পণ্যের দর শতকরা হারে বা ফিক্সড টাকায় বাড়াতে বা কমাতে পারেন।"
                    : "Apply a percentage or flat adjustment across an entire category simultaneously."}
                </p>

                <div className="admin-form-group" style={{ marginBottom: "1rem" }}>
                  <label className="admin-label">{lang === "bn" ? "টার্গেট ক্যাটাগরি" : "Target Category"}</label>
                  <select
                    className="admin-select"
                    value={bulkCategory}
                    onChange={(e) => setBulkCategory(e.target.value)}
                  >
                    <option value="ALL">{lang === "bn" ? "সকল পণ্য (All Items)" : "All Items"}</option>
                    <option value="VEGETABLES">{lang === "bn" ? "শাক-সবজি (Vegetables)" : "Vegetables"}</option>
                    <option value="RICE">{lang === "bn" ? "চাল (Rice)" : "Rice"}</option>
                    <option value="SPICES_OILS">{lang === "bn" ? "তেল ও মসলা (Spices & Oils)" : "Spices & Oils"}</option>
                    <option value="PROTEIN">{lang === "bn" ? "মাছ, মাংস ও ডিম (Protein)" : "Protein"}</option>
                    <option value="FRUITS">{lang === "bn" ? "ফলমূল (Fruits)" : "Fruits"}</option>
                  </select>
                </div>

                <div className="admin-form-group" style={{ marginBottom: "1rem" }}>
                  <label className="admin-label">{lang === "bn" ? "শতকরা পরিবর্তন (+ বা - %)" : "Percentage Shift (+ or - %)"}</label>
                  <input
                    type="number"
                    step="0.5"
                    className="admin-input"
                    placeholder="e.g. 5 or -10"
                    value={bulkPercentage || ""}
                    onChange={(e) => setBulkPercentage(Number(e.target.value))}
                  />
                  <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                    {lang === "bn" ? "যেমন: ৫ দিলে ৫% বাড়বে, -১০ দিলে ১০% কমবে" : "e.g. 5 means +5%, -10 means -10%"}
                  </span>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">{lang === "bn" ? "অথবা ফিক্সড টাকা সমন্বয় (৳)" : "Or Flat Amount Adjustment (৳)"}</label>
                  <input
                    type="number"
                    className="admin-input"
                    placeholder="e.g. 5 or -5"
                    value={bulkFlatAmount || ""}
                    onChange={(e) => setBulkFlatAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setBulkModalOpen(false)}>
                  {lang === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button type="submit" className="btn btn-primary">
                  {lang === "bn" ? "সমন্বয় কার্যকর করুন" : "Apply Bulk Shift"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE BULLETIN */}
      {/* ========================================================================= */}
      {addAnnModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setAddAnnModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                {lang === "bn" ? "নতুন বাজার বুলেটিন প্রকাশ করুন" : "Broadcast Market Bulletin"}
              </h3>
              <button className="btn-icon-only" onClick={() => setAddAnnModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateAnnouncement}>
              <div className="admin-modal-body">
                <div className="admin-form-group" style={{ marginBottom: "1rem" }}>
                  <label className="admin-label">{lang === "bn" ? "বুলেটিনের তীব্রতা / ধরন" : "Bulletin Urgency Level"}</label>
                  <select
                    className="admin-select"
                    value={newAnn.level}
                    onChange={(e) => setNewAnn({ ...newAnn, level: e.target.value as any })}
                  >
                    <option value="TCB">টিসিবি নোটিশ (TCB Subsidized Announcement)</option>
                    <option value="INFO">সাধারণ বাজার সংবাদ (General Info)</option>
                    <option value="WARNING">সতর্কবার্তা (Market Warning)</option>
                    <option value="EMERGENCY">জরুরি সিন্ডিকেট বা মূল্য অ্যালার্ট (Emergency)</option>
                  </select>
                </div>

                <div className="admin-form-group" style={{ marginBottom: "1rem" }}>
                  <label className="admin-label">{lang === "bn" ? "বাংলা শিরোনাম" : "Title (Bangla)"}</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="ঢাকা শহরের ৫০টি স্থানে টিসিবির ভ্রাম্যমাণ ট্রাক সেল চালু"
                    value={newAnn.titleBn}
                    onChange={(e) => setNewAnn({ ...newAnn, titleBn: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: "1rem" }}>
                  <label className="admin-label">{lang === "bn" ? "ইংরেজি শিরোনাম" : "Title (English)"}</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="TCB Subsidized Open Truck Sales Launched in 50 Locations"
                    value={newAnn.titleEn}
                    onChange={(e) => setNewAnn({ ...newAnn, titleEn: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: "1rem" }}>
                  <label className="admin-label">{lang === "bn" ? "বিস্তারিত বার্তা (বাংলা)" : "Detailed Message (Bangla)"}</label>
                  <textarea
                    className="admin-textarea"
                    placeholder="ভোক্তাদের সুবিধার্থে আলু প্রতি কেজি ৪০ টাকা এবং সয়াবিন তেল ১০০ টাকা দরে বিক্রি হচ্ছে..."
                    value={newAnn.messageBn}
                    onChange={(e) => setNewAnn({ ...newAnn, messageBn: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">{lang === "bn" ? "বিস্তারিত বার্তা (ইংরেজি)" : "Detailed Message (English)"}</label>
                  <textarea
                    className="admin-textarea"
                    placeholder="Subsidized potato at ৳40/kg and soybean oil at ৳100/liter available for family cardholders..."
                    value={newAnn.messageEn}
                    onChange={(e) => setNewAnn({ ...newAnn, messageEn: e.target.value })}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAddAnnModalOpen(false)}>
                  {lang === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button type="submit" className="btn btn-primary">
                  {lang === "bn" ? "লাইভ প্রচার করুন" : "Broadcast Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD MARKET */}
      {/* ========================================================================= */}
      {addMarketModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setAddMarketModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                {lang === "bn" ? "নতুন মোকাম বা বাজার যুক্ত করুন" : "Add Market Hub"}
              </h3>
              <button className="btn-icon-only" onClick={() => setAddMarketModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateMarket}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "বাজারের নাম (বাংলা)" : "Name (Bangla)"}</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="কাওরান বাজার / শ্যামবাজার"
                      value={newMarket.nameBn}
                      onChange={(e) => setNewMarket({ ...newMarket, nameBn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "বাজারের নাম (ইংরেজি)" : "Name (English)"}</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Karwan Bazar / Shyambazar"
                      value={newMarket.name}
                      onChange={(e) => setNewMarket({ ...newMarket, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "বিভাগ" : "Division"}</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newMarket.division}
                      onChange={(e) => setNewMarket({ ...newMarket, division: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "জেলা" : "District"}</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newMarket.district}
                      onChange={(e) => setNewMarket({ ...newMarket, district: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "বাজারের ধরন" : "Type"}</label>
                    <select
                      className="admin-select"
                      value={newMarket.type}
                      onChange={(e) => setNewMarket({ ...newMarket, type: e.target.value as any })}
                    >
                      <option value="WHOLESALE">পাইকারি মোকাম (Wholesale Hub)</option>
                      <option value="RETAIL">খুচরা বাজার (Retail Market)</option>
                      <option value="BOTH">উভয় (Both Wholesale & Retail)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">{lang === "bn" ? "স্ট্যাটাস" : "Status"}</label>
                    <select
                      className="admin-select"
                      value={newMarket.status}
                      onChange={(e) => setNewMarket({ ...newMarket, status: e.target.value as any })}
                    >
                      <option value="ACTIVE">সক্রিয় (Active)</option>
                      <option value="SPECIAL_MONITOR">বিশেষ নজরদারি (Special Monitoring)</option>
                      <option value="DISRUPTED">সরবরাহ ব্যাহত (Disrupted)</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginTop: "1rem" }}>
                  <label className="admin-label">{lang === "bn" ? "সংক্ষিপ্ত বিবরণ" : "Description"}</label>
                  <textarea
                    className="admin-textarea"
                    placeholder="দেশের সর্ববৃহৎ কেন্দ্রীয় পাইকারি কৃষিপণ্য মোকাম..."
                    value={newMarket.description}
                    onChange={(e) => setNewMarket({ ...newMarket, description: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAddMarketModalOpen(false)}>
                  {lang === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button type="submit" className="btn btn-primary">
                  {lang === "bn" ? "মোকাম সংরক্ষণ করুন" : "Save Market Hub"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FACTORY RESET CONFIRM */}
      {/* ========================================================================= */}
      {resetConfirmOpen && (
        <div className="admin-modal-overlay" onClick={() => setResetConfirmOpen(false)}>
          <div className="admin-modal-content" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f43f5e" }}>
                ⚠️ {lang === "bn" ? "ফ্যাক্টরি রিসেট নিশ্চিতকরণ" : "Confirm Factory Reset"}
              </h3>
              <button className="btn-icon-only" onClick={() => setResetConfirmOpen(false)}>✕</button>
            </div>

            <div className="admin-modal-body">
              <p style={{ fontSize: "0.88rem", lineHeight: 1.5, color: "var(--text-muted)" }}>
                {lang === "bn"
                  ? "আপনি কি নিশ্চিতভাবে সিস্টেমের সকল তথ্য রিসেট করতে চান? আপনার কাস্টম যুক্ত করা পণ্য, রিপোর্ট ও বুলেটিন মুছে যাবে।"
                  : "Are you sure you want to restore the platform to factory demo seeds? Custom modifications will be reset."}
              </p>
            </div>

            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setResetConfirmOpen(false)}>
                {lang === "bn" ? "না, ফিরে যান" : "No, Keep Data"}
              </button>
              <button className="btn btn-primary" style={{ background: "#f43f5e" }} onClick={handleResetFactory}>
                {lang === "bn" ? "হ্যাঁ, রিসেট করুন" : "Yes, Reset Everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
