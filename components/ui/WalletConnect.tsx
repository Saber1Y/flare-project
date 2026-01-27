"use client";

import {  useDisconnect } from 'wagmi';
import { useAppKit, useAppKitAccount, useAppKitState } from '@reown/appkit/react';

export default function WalletConnect() {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  
  if (isConnected) {
    return (
      <button
        onClick={() => open({ view: "Networks" })}
        className="bg-[#e51c56] text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-[#d41848] transition-colors"
      >
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="bg-[#e51c56] text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-[#d41848] transition-colors"
    >
      Connect Wallet
    </button>
  );
}
