import { db } from './db';
import { proofs } from './schema';
import { eq, desc } from 'drizzle-orm';
import type { NewProof, Proof } from './schema';

export async function upsertProof(proof: NewProof) {
  const existingProof = await db
    .select()
    .from(proofs)
    .where(eq(proofs.receiptId, proof.receiptId))
    .limit(1);

  if (existingProof.length > 0) {
    const [updated] = await db
      .update(proofs)
      .set(proof)
      .where(eq(proofs.receiptId, proof.receiptId))
      .returning();
    return updated;
  } else {
    const [inserted] = await db
      .insert(proofs)
      .values(proof)
      .returning();
    return inserted;
  }
}

export async function getProofByTxHash(txHash: string): Promise<Proof | undefined> {
  const [proof] = await db
    .select()
    .from(proofs)
    .where(eq(proofs.txHash, txHash))
    .limit(1);
  return proof;
}

export async function getProofByReceiptId(receiptId: string): Promise<Proof | undefined> {
  const [proof] = await db
    .select()
    .from(proofs)
    .where(eq(proofs.receiptId, receiptId))
    .orderBy(desc(proofs.createdAt))
    .limit(1);
  return proof;
}

export async function markProofAsAnchored(receiptId: string, anchorTxHash: string, recordHash: string) {
  const [updated] = await db
    .update(proofs)
    .set({ 
      status: 'anchored', 
      anchorTxHash,
      recordHash
    })
    .where(eq(proofs.receiptId, receiptId))
    .returning();
  return updated;
}

export async function updateProofStatus(receiptId: string, status: string) {
  const [updated] = await db
    .update(proofs)
    .set({ status })
    .where(eq(proofs.receiptId, receiptId))
    .returning();
  return updated;
}