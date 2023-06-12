export interface PricePoint {
  date: string;
  price: number;
}

export type ReportStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface PriceReport {
  id: string;
  commodityId: string;
  commodityNameEn?: string;
  commodityNameBn?: string;
  commodityIcon?: string;
  marketName: string;
  division: string;
  district: string;
  price: number;
  type: "RETAIL" | "WHOLESALE";
  reporterName?: string;
  reporterPhone?: string;
  isVerified: boolean;
  status: ReportStatus;
  adminNotes?: string;
  createdAt: string;
}

export type CommodityCategory = "RICE" | "VEGETABLES" | "SPICES_OILS" | "PROTEIN" | "FRUITS";
export type SupplyStatus = "IN_STOCK" | "MODERATE" | "SCARCE";
export type SeasonalStatus = "IN_SEASON" | "OFF_SEASON" | "REGULAR";

export interface Commodity {
  id: string;
  nameEn: string;
  nameBn: string;
  category: CommodityCategory;
  unit: string;
  unitBn: string;
  icon: string;
  currentAvgPrice: number;
  wholesalePrice: number;
  tcbPrice?: number;
  change24h: number;
  supplyStatus?: SupplyStatus;
  seasonalStatus?: SeasonalStatus;
  isFeatured?: boolean;
  priceHistory: PricePoint[];
  reports?: PriceReport[];
}

export interface District {
  name: string;
  bnName: string;
}

export interface Division {
  name: string;
  bnName: string;
  districts: District[];
}

export interface MarketLocation {
  name: string;
  nameBn: string;
  division: string;
  district: string;
  type: string;
  description: string;
}

export interface MarketHub {
  id: string;
  name: string;
  nameBn: string;
  division: string;
  district: string;
  type: "WHOLESALE" | "RETAIL" | "BOTH";
  description: string;
  status: "ACTIVE" | "DISRUPTED" | "SPECIAL_MONITOR";
}

export type BulletinLevel = "INFO" | "WARNING" | "EMERGENCY" | "TCB";

export interface Announcement {
  id: string;
  titleEn: string;
  titleBn: string;
  messageEn: string;
  messageBn: string;
  level: BulletinLevel;
  isActive: boolean;
  targetMarket?: string;
  createdAt: string;
}

export interface SystemSettings {
  crowdsourcingEnabled: boolean;
  autoVerifyReports: boolean;
  tcbSubsidyAlerts: boolean;
  inflationThresholdPercent: number;
  emergencyCeilingMode: boolean;
  tickerSpeed: "normal" | "slow" | "fast";
  customTickerMessageBn?: string;
  customTickerMessageEn?: string;
  adminPasscode?: string;
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  actor: string;
  timestamp: string;
}

export interface AdminStats {
  totalCommodities: number;
  totalReports: number;
  pendingReports: number;
  verifiedReports: number;
  activeMarkets: number;
  activeBulletins: number;
  avgInflation: number;
  highInflationCount: number;
  lastReportTime?: string;
}

export interface BasketItem {
  commodity: Commodity;
  quantity: number;
}

export interface BasketCalculationResult {
  totalRetail: number;
  totalWholesale: number;
  estimatedSavings: number;
  savingsPercentage: number;
  itemCount: number;
  breakdown: {
    commodityId: string;
    nameEn: string;
    nameBn: string;
    icon: string;
    unit: string;
    unitBn: string;
    quantity: number;
    retailPricePerUnit: number;
    wholesalePricePerUnit: number;
    subRetail: number;
    subWholesale: number;
  }[];
}
