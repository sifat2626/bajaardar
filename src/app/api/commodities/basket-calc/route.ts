import { NextRequest, NextResponse } from "next/server";
import { getAllCommodities } from "@/lib/commodityStore";

export async function POST(req: NextRequest) {
  try {
    const { items = [] } = await req.json();
    const all = getAllCommodities();

    let totalRetail = 0;
    let totalWholesale = 0;
    const breakdown = [];

    for (const item of items) {
      const match = all.find((c) => c.id === item.commodityId);
      if (match) {
        const qty = Math.max(0.1, Number(item.quantity) || 1);
        const subRetail = Math.round(match.currentAvgPrice * qty);
        const subWholesale = Math.round(match.wholesalePrice * qty);
        totalRetail += subRetail;
        totalWholesale += subWholesale;

        breakdown.push({
          commodityId: match.id,
          nameEn: match.nameEn,
          nameBn: match.nameBn,
          icon: match.icon,
          unit: match.unit,
          unitBn: match.unitBn,
          quantity: qty,
          retailPricePerUnit: match.currentAvgPrice,
          wholesalePricePerUnit: match.wholesalePrice,
          subRetail,
          subWholesale,
        });
      }
    }

    const savings = Math.max(0, totalRetail - totalWholesale);
    const savingsPct = totalRetail > 0 ? Math.round((savings / totalRetail) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalRetail,
        totalWholesale,
        estimatedSavings: savings,
        savingsPercentage: savingsPct,
        itemCount: breakdown.length,
        breakdown,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Basket calculation failed" },
      { status: 500 }
    );
  }
}
