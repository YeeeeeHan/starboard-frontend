import { Chain } from '@wagmi/core'

export const filecoinHyperspace = {
  id: /* Chain ID */,
  name: 'Filecoin Hyperspace',
  network: 'filecoinHyperspace',
  nativeCurrency: {
    decimals: /* Decimals */,
    name: 'Filecoin Hyperspace',
    symbol: /* Symbol */,
  },
  rpcUrls: {
    public: { http: [/* Public RPC URL */] },
    default: { http: [/* Default RPC URL */] },
  },
  blockExplorers: {
    etherscan: { name: /* Block Explorer Name */, url: /* Block Explorer URL */ },
    default: { name: /* Block Explorer Name */, url: /* Block Explorer URL */ },
  },
  contracts: {
    /* Add any contracts specific to the chain */,
  },
} as const satisfies Chain