import { pgTable, text, integer, boolean, timestamp, serial } from 'drizzle-orm/pg-core';

// Transactions table
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  hash: text('hash').notNull().unique(),
  fromAddress: text('from_address').notNull(),
  toAddress: text('to_address'),
  value: text('value').notNull(),
  blockNumber: integer('block_number').notNull(),
  timestamp: integer('timestamp').notNull(),
  gasUsed: text('gas_used'),
  gasPrice: text('gas_price'),
  category: text('category').default('uncategorized'),
  recorded: boolean('recorded').default(false),
  proofId: text('proof_id'),
  network: text('network').default('coston2'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Proofs table
export const proofs = pgTable('proofs', {
  id: serial('id').primaryKey(),
  txHash: text('tx_hash').notNull(),
  receiptId: text('receipt_id').notNull(),
  isoType: text('iso_type').default('payment'),
  recordHash: text('record_hash'),
  anchorTxHash: text('anchor_tx_hash'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow()
});

// Types
export interface Transaction {
  id?: number;
  hash: string;
  fromAddress: string;
  toAddress?: string;
  value: string;
  blockNumber: number;
  timestamp: number;
  gasUsed?: string;
  gasPrice?: string;
  category: string;
  recorded: boolean;
  proofId?: string;
  network?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Proof {
  id?: number;
  txHash: string;
  receiptId: string;
  isoType?: string;
  recordHash?: string;
  anchorTxHash?: string;
  status: string;
  createdAt?: Date;
}