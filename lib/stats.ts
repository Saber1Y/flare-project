import { db } from './db';
import { transactions } from './schema';
import { sql, count, sum } from 'drizzle-orm';

export async function getTransactionStats() {
  const [totalTxResult] = await db
    .select({ count: count() })
    .from(transactions);

  const [recordedTxResult] = await db
    .select({ count: count() })
    .from(transactions)
    .where(sql`recorded = true`);

  const [totalVolumeResult] = await db
    .select({ total: sum(sql`CAST(value AS NUMERIC)`) })
    .from(transactions);

  const [recordedVolumeResult] = await db
    .select({ total: sum(sql`CAST(value AS NUMERIC)`) })
    .from(transactions)
    .where(sql`recorded = true`);

  return {
    totalTransactions: Number(totalTxResult?.count || 0),
    recordedTransactions: Number(recordedTxResult?.count || 0),
    totalVolume: Number(totalVolumeResult?.total || 0),
    recordedVolume: Number(recordedVolumeResult?.total || 0)
  };
}

export async function getTopCategories() {
  const results = await db
    .select({
      category: transactions.category,
      count: count(),
      volume: sum(sql`CAST(value AS NUMERIC)`)
    })
    .from(transactions)
    .where(sql`category IS NOT NULL AND category != 'uncategorized'`)
    .groupBy(transactions.category)
    .orderBy(sql`count DESC`)
    .limit(10);

  return results.map(row => ({
    category: row.category,
    count: Number(row.count),
    volume: Number(row.volume || 0)
  }));
}