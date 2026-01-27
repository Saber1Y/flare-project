import { eq, and, desc, or } from 'drizzle-orm';
import { db } from './db-postgres';
import { transactions, proofs, type Transaction, type Proof } from './schema';

// Transaction operations
export async function upsertTransaction(tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
  const existingTx = await db.select()
    .from(transactions)
    .where(eq(transactions.hash, tx.hash))
    .limit(1);

  if (existingTx.length > 0) {
    // Update existing transaction
    return await db.update(transactions)
      .set({
        ...tx,
        updatedAt: new Date()
      })
      .where(eq(transactions.hash, tx.hash));
  } else {
    // Insert new transaction
    return await db.insert(transactions)
      .values({
        ...tx,
        createdAt: new Date(),
        updatedAt: new Date()
      });
  }
}

export async function getTransactionsByWallet(walletAddress: string): Promise<Transaction[]> {
  const result = await db.select()
    .from(transactions)
    .where(
      or(
        eq(transactions.fromAddress, walletAddress.toLowerCase()),
        eq(transactions.toAddress, walletAddress.toLowerCase())
      )
    )
    .orderBy(desc(transactions.blockNumber))
    .limit(100);
  
  return result;
}

export async function updateTransactionCategory(hash: string, category: string) {
  return await db.update(transactions)
    .set({
      category,
      updatedAt: new Date()
    })
    .where(eq(transactions.hash, hash));
}

export async function markAsRecorded(hash: string, proofId: string) {
  return await db.update(transactions)
    .set({
      recorded: true,
      proofId,
      updatedAt: new Date()
    })
    .where(eq(transactions.hash, hash));
}

export async function getTransactionByHash(hash: string): Promise<Transaction | undefined> {
  const result = await db.select()
    .from(transactions)
    .where(eq(transactions.hash, hash))
    .limit(1);
  
  return result[0];
}

// Proof operations
export async function upsertProof(proof: Omit<Proof, 'id' | 'createdAt'>) {
  const existingProof = await db.select()
    .from(proofs)
    .where(eq(proofs.txHash, proof.txHash))
    .limit(1);

  if (existingProof.length > 0) {
    // Update existing proof
    return await db.update(proofs)
      .set(proof)
      .where(eq(proofs.txHash, proof.txHash));
  } else {
    // Insert new proof
    return await db.insert(proofs)
      .values({
        ...proof,
        createdAt: new Date()
      });
  }
}

export async function getProofByTxHash(txHash: string): Promise<Proof | undefined> {
  const result = await db.select()
    .from(proofs)
    .where(eq(proofs.txHash, txHash))
    .limit(1);
  
  return result[0];
}

export async function getProofByReceiptId(receiptId: string): Promise<Proof | undefined> {
  const result = await db.select()
    .from(proofs)
    .where(eq(proofs.receiptId, receiptId))
    .orderBy(desc(proofs.createdAt))
    .limit(1);
  
  return result[0];
}

export async function markProofAsAnchored(receiptId: string, anchorTxHash: string, recordHash: string) {
  return await db.update(proofs)
    .set({
      status: 'anchored',
      anchorTxHash,
      recordHash
    })
    .where(eq(proofs.receiptId, receiptId));
}

// Stats operations
export async function getTransactionStats() {
  // Get total stats
  const allTxs = await db.select().from(transactions);
  const recordedTxs = await db.select().from(transactions).where(eq(transactions.recorded, true));
  
  const totalTransactions = allTxs.length;
  const recordedTransactions = recordedTxs.length;
  
  // Calculate volumes (convert FLR string to number)
  const totalVolume = allTxs.reduce((sum, tx) => {
    const value = parseFloat(tx.value.replace(' FLR', ''));
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
  
  const recordedVolume = recordedTxs.reduce((sum, tx) => {
    const value = parseFloat(tx.value.replace(' FLR', ''));
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
  
  return {
    totalTransactions,
    recordedTransactions,
    totalVolume,
    recordedVolume
  };
}

export async function getTopCategories() {
  const allTxs = await db.select().from(transactions);
  
  // Group by category and count
  const categoryCounts: Record<string, number> = {};
  allTxs.forEach(tx => {
    const category = tx.category || 'uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  // Convert to array and sort
  return Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}