import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'flare-accounting.db')
const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT UNIQUE NOT NULL,
    from_address TEXT NOT NULL,
    to_address TEXT,
    value TEXT NOT NULL,
    block_number INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    gas_used TEXT,
    gas_price TEXT,
    category TEXT DEFAULT 'uncategorized',
    recorded BOOLEAN DEFAULT 0,
    proof_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_from_address ON transactions(from_address);
  CREATE INDEX IF NOT EXISTS idx_to_address ON transactions(to_address);
  CREATE INDEX IF NOT EXISTS idx_hash ON transactions(hash);
  CREATE INDEX IF NOT EXISTS idx_category ON transactions(category);
`)

export interface Transaction {
  id?: number
  hash: string
  from_address: string
  to_address?: string
  value: string
  block_number: number
  timestamp: number
  gas_used?: string
  gas_price?: string
  category: string
  recorded: boolean
  proof_id?: string
  created_at?: string
  updated_at?: string
}

export function upsertTransaction(tx: Transaction) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO transactions 
    (hash, from_address, to_address, value, block_number, timestamp, gas_used, gas_price, category, recorded, proof_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  return stmt.run(
    tx.hash,
    tx.from_address,
    tx.to_address,
    tx.value,
    tx.block_number,
    tx.timestamp,
    tx.gas_used,
    tx.gas_price,
    tx.category,
    tx.recorded ? 1 : 0,
    tx.proof_id
  )
}

export function getTransactionsByWallet(walletAddress: string): Transaction[] {
  const stmt = db.prepare(`
    SELECT * FROM transactions 
    WHERE LOWER(from_address) = LOWER(?) OR LOWER(to_address) = LOWER(?)
    ORDER BY block_number DESC
    LIMIT 100
  `)
  return stmt.all(walletAddress, walletAddress) as Transaction[]
}

export function updateTransactionCategory(hash: string, category: string) {
  const stmt = db.prepare(`
    UPDATE transactions 
    SET category = ?, updated_at = CURRENT_TIMESTAMP
    WHERE hash = ?
  `)
  return stmt.run(category, hash)
}

export function markAsRecorded(hash: string, proofId: string) {
  const stmt = db.prepare(`
    UPDATE transactions 
    SET recorded = 1, proof_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE hash = ?
  `)
  return stmt.run(proofId, hash)
}

export function getTransactionByHash(hash: string): Transaction | undefined {
  const stmt = db.prepare('SELECT * FROM transactions WHERE hash = ?')
  return stmt.get(hash) as Transaction | undefined
}

export default db
