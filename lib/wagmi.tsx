import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ''

export const flare = {
  id: 14,
  name: "Flare",
  nativeCurrency: { name: "Flare", symbol: "FLR", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://flare-api.flare.network/ext/bc/C/rpc"] },
  },
  blockExplorers: {
    default: { name: "Flare Explorer", url: "https://flare-explorer.com" },
  },
}

export const flareTestnet = {
  id: 114,
  name: "Coston2 Testnet",
  nativeCurrency: { name: "Coston2 Flare", symbol: "CFLR", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.ankr.com/flare_coston2"] },
  },
  blockExplorers: {
    default: {
      name: "Coston2 Explorer",
      url: "https://coston2-explorer.flare.network",
    },
  },
  testnet: true,
}

const networks = [flareTestnet, flare]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: [flareTestnet],
  projectId,
  metadata: {
    name: 'Flare Accounting',
    description: 'Non-custodial accounting for Flare blockchain',
    url: 'https://flare-accounting.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
  features: {
    analytics: true,
  }
})

export const wagmiConfig = wagmiAdapter.wagmiConfig
