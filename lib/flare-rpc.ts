import { createPublicClient, http, formatUnits, parseUnits, type Block, type Transaction as EvmTransaction } from 'viem'
import { type Address } from 'viem'
import { flare, flareTestnet } from './wagmi'

const mainnetClient = createPublicClient({
  chain: flare,
  transport: http("https://flare-api.flare.network/ext/bc/C/rpc")
})

const testnetClient = createPublicClient({
  chain: flareTestnet,
  transport: http("https://rpc.ankr.com/flare_coston2")
})

export interface FlareTransaction {
  hash: string
  from: string
  to?: string
  value: string // in FLR (formatted)
  valueWei: string // in wei
  blockNumber: bigint
  timestamp: number
  gasUsed?: bigint
  gasPrice?: bigint
}

export async function fetchTransactions(
  walletAddress: string,
  isTestnet = false
): Promise<FlareTransaction[]> {
  const address = walletAddress as `0x${string}`
  
  console.log(`Fetching transactions for wallet: ${address} on ${isTestnet ? 'testnet' : 'mainnet'}`)
  
  // Use Blockscout API for direct address transaction lookup
  const explorerUrl = isTestnet 
    ? 'https://coston2-explorer.flare.network'
    : 'https://flare-explorer.com'
  
  const apiUrl = `${explorerUrl}/api?module=account&action=txlist&address=${address}`
  
  console.log(`Fetching from Blockscout API: ${apiUrl}`)
  
  const response = await fetch(apiUrl)
  const data = await response.json()
  
  if (data.status !== '1' || data.error) {
    console.error('Blockscout API error:', data.message || data.error)
    return []
  }
  
  const transactions: FlareTransaction[] = data.result.map((tx: any) => ({
    hash: tx.hash,
    from: tx.from,
    to: tx.to || undefined,
    value: formatUnits(BigInt(tx.value), 18),
    valueWei: tx.value,
    blockNumber: BigInt(tx.blockNumber),
    timestamp: parseInt(tx.timeStamp),
    gasUsed: BigInt(tx.gasUsed || 0),
    gasPrice: BigInt(tx.gasPrice || 0)
  }))
  
  console.log(`Found ${transactions.length} transactions`)
  return transactions
}

// Alternative: Use the Flare API for better performance
export async function fetchTransactionsViaFlareAPI(
  walletAddress: string,
  isTestnet = false
): Promise<FlareTransaction[]> {
  const apiUrl = isTestnet 
    ? 'https://coston.flare.network/ext/C/rpc'
    : 'https://flare.flare.network/ext/C/rpc'
  
  // This is a placeholder - in production you'd use the actual Flare API
  // For now, fall back to the RPC method
  return fetchTransactions(walletAddress, isTestnet)
}
