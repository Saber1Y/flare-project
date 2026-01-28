import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { proofs, transactions } from "@/lib/schema";
import { eq, desc } from 'drizzle-orm';
import { withTimeout, handleDbError } from "@/lib/error-handlers";

export async function GET() {
  try {
    const allProofs = await withTimeout(
      db.select({
        receiptId: proofs.receiptId,
        txHash: proofs.txHash,
        status: proofs.status,
        createdAt: proofs.createdAt,
        recordHash: proofs.recordHash,
        value: transactions.value,
        category: transactions.category
      })
      .from(proofs)
      .leftJoin(transactions, eq(proofs.txHash, transactions.hash))
      .orderBy(desc(proofs.createdAt)),
      15000 // 15 second timeout
    );

    // Format data
    const formattedProofs = allProofs.map((proof: any) => ({
      receiptId: proof.receiptId,
      txHash: proof.txHash,
      amount: `${proof.value} FLR`,
      category: proof.category,
      status: proof.status,
      createdAt: proof.createdAt,
      views: 0 // Could be implemented with analytics later
    }));

    return NextResponse.json({
      success: true,
      proofs: formattedProofs,
      total: formattedProofs.length
    });

  } catch (error: any) {
    return handleDbError(error, "fetching proofs");
  }
}