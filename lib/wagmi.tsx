import { WagmiProvider, createConfig, http } from "wagmi";
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

const flare = {
  id: 14,
  name: "Flare",
  nativeCurrency: { name: "Flare", symbol: "FLR", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://flare-api.flare.network/ext/C/rpc"] },
  },
  blockExplorers: {
    default: { name: "Flare Explorer", url: "https://flare-explorer.com" },
  },
};

const flareTestnet = {
  id: 16,
  name: "Coston Testnet",
  nativeCurrency: { name: "Coston Flare", symbol: "CFLR", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://coston-api.flare.network/ext/C/rpc"] },
  },
  blockExplorers: {
    default: {
      name: "Coston Explorer",
      url: "https://coston-explorer.flare.network",
    },
  },
  testnet: true,
};

export const wagmiConfig = createConfig({
  chains: [flare, flareTestnet],
  connectors: [
    walletConnect({ projectId, showQrModal: true }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: "Flare Accounting",
      appLogoUrl: "https://flare-accounting.com/logo.png",
    }),
  ],
  transports: {
    [flare.id]: http(),
    [flareTestnet.id]: http(),
  },
});
