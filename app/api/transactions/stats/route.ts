import { NextResponse } from "next/server";
import { getTransactionStats, getTopCategories } from "@/lib/stats";

export async function GET() {
  try {
    // Get transaction stats
    const stats = await getTransactionStats();
    const categories = await getTopCategories();

    return NextResponse.json({
      totalTransactions: stats.totalTransactions,
      recordedTransactions: stats.recordedTransactions,
      totalVolume: stats.totalVolume,
      recordedVolume: stats.recordedVolume,
      topCategories: categories
    });

  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats", details: error.message },
      { status: 500 }
    );
  }
}