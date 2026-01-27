// Universal database interface that works with both SQLite and PostgreSQL
export interface DatabaseOperations {
  // Transactions
  upsertTransaction: Function;
  getTransactionsByWallet: Function;
  updateTransactionCategory: Function;
  markAsRecorded: Function;
  getTransactionByHash: Function;
  
  // Proofs
  upsertProof: Function;
  getProofByTxHash: Function;
  getProofByReceiptId: Function;
  markProofAsAnchored: Function;
  
  // Stats
  getTransactionStats: Function;
  getTopCategories: Function;
}

// Choose database based on environment
const isProduction = process.env.NODE_ENV === 'production';
const hasPostgres = !!process.env.POSTGRES_URL;

export const db = hasPostgres ? await import('./db-postgres') : await import('./db');

// Export unified interface
export const {
  upsertTransaction,
  getTransactionsByWallet,
  updateTransactionCategory,
  markAsRecorded,
  getTransactionByHash,
  upsertProof,
  getProofByTxHash,
  getProofByReceiptId,
  markProofAsAnchored,
  getTransactionStats,
  getTopCategories
} = isProduction && hasPostgres ? db.postgres : db.sqlite;