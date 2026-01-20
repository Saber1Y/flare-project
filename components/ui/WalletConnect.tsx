"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { HiCurrencyDollar } from 'react-icons/hi';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="bg-[#e51c56] text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-[#d41848] transition-colors flex items-center gap-2"
        >
          <HiCurrencyDollar className="w-4 h-4" />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={!connector.ready || isPending}
          className="bg-[#e51c56] text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-[#d41848] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HiCurrencyDollar className="w-4 h-4" />
          {connector.name}
          {isPending && ' (connecting...)'}
        </button>
      ))}
      {error && (
        <div className="text-red-500 text-sm">{error.message}</div>
      )}
    </div>
  );
}



