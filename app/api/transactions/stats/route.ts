import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // Get transaction stats
    const totalTxs = db.prepare(`
      SELECT COUNT(*) as count, 
             SUM(CAST(value AS REAL)) as volume,
             COUNT(CASE WHEN recorded = 1 THEN 1 END) as recorded_count,
             SUM(CASE WHEN recorded = 1 THEN CAST(value AS REAL) ELSE 0 END) as recorded_volume
      FROM transactions
    `).get();

    // Get top categories
    const topCategories = db.prepare(`
      SELECT category, COUNT(*) as count
      FROM transactions 
      WHERE category != 'uncategorized'
      GROUP BY category 
      ORDER BY count DESC 
      LIMIT 5
    `).all();

    // Get uncategorized count
    const uncategorizedCount = db.prepare(`
      SELECT COUNT(*) as count
      FROM transactions 
      WHERE category = 'uncategorized'
    `).get();

    // Format top categories, include uncategorized if it's top
    const categories = topCategories.map((cat: any) => ({
      name: cat.category,
      count: cat.count
    }));

    if (uncategorizedCount.count > 0 && (categories.length < 5 || uncategorizedCount.count > (categories[0]?.count || 0))) {
      categories.push({ name: 'uncategorized', count: uncategorizedCount.count });
    }

    return NextResponse.json({
      totalTransactions: totalTxs.count,
      recordedTransactions: totalTxs.recorded_count,
      totalVolume: totalTxs.volume || 0,
      recordedVolume: totalTxs.recorded_volume || 0,
      topCategories: categories.slice(0, 5)
    });

  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats", details: error.message },
      { status: 500 }
    );
  }
}