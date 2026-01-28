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

// Types (camelCase for app, snake_case for PostgreSQL)
export interface Transaction {
  id?: number;
  hash: string;
  from_address: string;
  to_address: string | null;
  value: string;
  block_number: number;
  timestamp: number;
  gas_used: string | null;
  gas_price: string | null;
  category: string | null;
  recorded: boolean | null;
  proof_id: string | null;
  network: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface Proof {
  id?: number;
  tx_hash: string;
  receipt_id: string;
  iso_type: string | null;
  record_hash: string | null;
  anchor_tx_hash: string | null;
  status: string | null;
  created_at?: Date;
}

// Mapping function to convert snake_case DB response to camelCase for app
export function mapDbToAppTransaction(dbRow: any): Transaction {
  return {
    id: dbRow.id,
    hash: dbRow.hash,
    fromAddress: dbRow.from_address,
    toAddress: dbRow.to_address,
    value: dbRow.value,
    blockNumber: dbRow.block_number,
    timestamp: dbRow.timestamp,
    gasUsed: dbRow.gas_used,
    gasPrice: dbRow.gas_price,
    category: dbRow.category,
    recorded: dbRow.recorded,
    proofId: dbRow.proof_id,
    network: dbRow.network,
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at
  };
}

export function mapDbToAppProof(dbRow: any): Proof {
  return {
    id: dbRow.id,
    txHash: dbRow.tx_hash,
    receiptId: dbRow.receipt_id,
    isoType: dbRow.iso_type,
    recordHash: dbRow.record_hash,
    anchorTxHash: dbRow.anchor_tx_hash,
    status: dbRow.status,
    createdAt: dbRow.created_at
  };
}

export interface Proof {
  id?: number;
  txHash: string;
  receiptId: string;
  isoType: string | null;
  recordHash: string | null;
  anchorTxHash: string | null;
  status: string | null;
  createdAt: Date | null;
}