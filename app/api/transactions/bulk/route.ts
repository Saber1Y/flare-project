import { NextRequest, NextResponse } from "next/server";
import { updateTransactionCategory } from "@/lib/transactions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hashes, category } = body;

    if (!hashes || !Array.isArray(hashes) || !category) {
      return NextResponse.json(
        { error: "Hashes array and category required" },
        { status: 400 }
      );
    }

    // Update all transactions
    for (const hash of hashes) {
      await updateTransactionCategory(hash, category);
    }

    return NextResponse.json({
      success: true,
      updated: hashes.length,
    });
  } catch (error: any) {
    console.error("Error bulk updating transactions:", error);
    return NextResponse.json(
      { error: "Failed to bulk update transactions", details: error.message },
      { status: 500 }
    );
  }
}
