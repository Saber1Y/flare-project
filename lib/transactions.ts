import { db } from './db';
import { transactions } from './schema';
import { eq, and, or, desc } from 'drizzle-orm';
import type { NewTransaction, Transaction } from './schema';

export async function upsertTransaction(tx: NewTransaction) {
  const existingTx = await db
    .select()
    .from(transactions)
    .where(eq(transactions.hash, tx.hash))
    .limit(1);

  if (existingTx.length > 0) {
    const [updated] = await db
      .update(transactions)
      .set(tx)
      .where(eq(transactions.hash, tx.hash))
      .returning();
    return updated;
  } else {
    const [inserted] = await db
      .insert(transactions)
      .values(tx)
      .returning();
    return inserted;
  }
}

export async function getTransactionsByWallet(walletAddress: string): Promise<Transaction[]> {
  return await db
    .select()
    .from(transactions)
    .where(
      or(
        eq(transactions.fromAddress, walletAddress.toLowerCase()),
        eq(transactions.toAddress, walletAddress.toLowerCase())
      )
    )
    .orderBy(desc(transactions.blockNumber))
    .limit(100);
}

export async function updateTransactionCategory(hash: string, category: string) {
  const [updated] = await db
    .update(transactions)
    .set({ 
      category, 
      updatedAt: new Date() 
    })
    .where(eq(transactions.hash, hash))
    .returning();
  return updated;
}

export async function markAsRecorded(hash: string, proofId: string) {
  const [updated] = await db
    .update(transactions)
    .set({ 
      recorded: true, 
      proofId,
      updatedAt: new Date() 
    })
    .where(eq(transactions.hash, hash))
    .returning();
  return updated;
}

export async function getTransactionByHash(hash: string): Promise<Transaction | undefined> {
  const [tx] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.hash, hash))
    .limit(1);
  return tx;
}