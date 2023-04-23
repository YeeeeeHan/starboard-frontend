import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, rainbowWallet } from '@rainbow-me/rainbowkit/wallets';
import React from 'react';

import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const filecoinHyperspace: Chain = {
  id: 3141,
  name: 'Filecoin Hyperspace',
  network: 'filecoin-hyperspace',
  nativeCurrency: {
    name: 'testnet filecoin',
    symbol: 'tFIL',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://api.hyperspace.node.glif.io/rpc/v1'],
    },
    public: {
      http: ['https://api.hyperspace.node.glif.io/rpc/v1'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Filfox',
      url: 'https://hyperspace.filfox.info/en',
    },
    filscan: {
      name: 'Filscan',
      url: 'https://hyperspace.filscan.io',
    },
  },
};

const { chains, provider, webSocketProvider } = configureChains([filecoinHyperspace], [publicProvider()]);

const connectors = connectorsForWallets([
  {
    groupName: 'Custom Wallets',
    wallets: [rainbowWallet({ chains }), metaMaskWallet({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

interface RainbowKitWrapperProps {
  children: React.ReactNode;
}

function RainbowKitWrapper({ children }: RainbowKitWrapperProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
}

export default RainbowKitWrapper;
