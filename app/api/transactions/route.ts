import { NextRequest, NextResponse } from "next/server";
import { upsertTransaction, getTransactionsByWallet, updateTransactionCategory } from "@/lib/db-operations";
import { fetchTransactions } from "@/lib/flare-rpc";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");
  const testnet = searchParams.get("testnet") === "true";

  if (!wallet) {
    return NextResponse.json(
      { error: "Wallet address required" },
      { status: 400 },
    );
  }

  try {
    // First, try to fetch existing transactions from DB
    const existingTxs = getTransactionsByWallet(wallet);

    // Fetch new transactions from Flare RPC
    const newTxs = await fetchTransactions(wallet, testnet);

    // Store/Update in DB
    for (const tx of newTxs) {
      await upsertTransaction({
        hash: tx.hash,
        fromAddress: tx.from,
        toAddress: tx.to || null,
        value: tx.value,
        block_number: Number(tx.blockNumber),
        timestamp: tx.timestamp,
        category: "uncategorized",
        recorded: false,
        gas_used: tx.gasUsed ? tx.gasUsed.toString() : null,
        gas_price: tx.gasPrice ? tx.gasPrice.toString() : null,
        proof_id: null,
        network: testnet ? "coston2" : "flare"
      });
    }

    console.log(`Fetched ${newTxs.length} new transactions from RPC`)
    
    // Get updated list from DB
    const allTxs = await getTransactionsByWallet(wallet);
    console.log(`Total transactions in DB: ${allTxs.length}`)

    return NextResponse.json({
      success: true,
      transactions: allTxs,
      fetched: newTxs.length,
      total: allTxs.length,
    });

  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hash, category } = body;

    if (!hash || !category) {
      return NextResponse.json(
        { error: "Hash and category required" },
        { status: 400 },
      );
    }

    // Update transaction category
    await updateTransactionCategory(hash, category);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction", details: error.message },
      { status: 500 },
    );
  }
}
