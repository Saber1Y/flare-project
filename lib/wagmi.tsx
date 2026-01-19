import { WagmiProvider, createConfig, http } from 'wagmi'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'
import { flare, flareTestnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const projectId = '2cc0cd91791d512142b9f3bae0a9e361'

const queryClient = new QueryClient()

const wagmiConfig = createConfig({
  chains: [flare, flareTestnet],
  connectors: [
    walletConnect({ projectId, showQrModal: true }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: 'Flare Accounting',
      appLogoUrl: 'https://flare-accounting.com/logo.png'
    })
  ],
  transports: {
    [flare.id]: http(),
    [flareTestnet.id]: http()
  }
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

