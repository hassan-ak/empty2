// ZeroDev wrapper
'use client';

// Imports
import React from 'react';
// Style Imports for rainbowKit
import '@rainbow-me/rainbowkit/styles.css';
// modules for interacting with the blockchain
import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
// tools for building applications that interact with cryptocurrency wallets.
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
// tools for interacting with the Wagmi protocol
import { WagmiConfig, configureChains, createClient } from 'wagmi';
// Sicial Wallets
import { githubWallet, discordWallet } from '@zerodevapp/wagmi/rainbowkit';
import { twitchWallet, twitterWallet } from '@zerodevapp/wagmi/rainbowkit';
import { enhanceWalletWithAAConnector } from '@zerodevapp/wagmi/rainbowkit';
import { googleWallet, facebookWallet } from '@zerodevapp/wagmi/rainbowkit';
// EOA Wallets
import { trustWallet, rainbowWallet } from '@rainbow-me/rainbowkit/wallets';
import { coinbaseWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';

// ZeroDev project ID
const defaultProjectId = '30a4ab5f-bb48-47e5-9e7d-ecceea467c7d';

// blockchain networks that are allowed to be used with the Wagmi protocol
const allowedChains = [polygonMumbai];

// configure the blockchain networks that will be used with the protocol,
const { chains, provider, webSocketProvider } = configureChains(allowedChains, [
  publicProvider(),
]);

// creates an array of wallet connectors that can be used with the RainbowKitProvider
// to interact with different wallets.
const connectors = connectorsForWallets([
  {
    groupName: 'Social',
    wallets: [
      googleWallet({
        chains: allowedChains,
        options: { projectId: defaultProjectId },
      }),
      facebookWallet({
        chains: allowedChains,
        options: { projectId: defaultProjectId },
      }),
      githubWallet({
        chains: allowedChains,
        options: { projectId: defaultProjectId },
      }),
      discordWallet({
        chains: allowedChains,
        options: { projectId: defaultProjectId },
      }),
      twitchWallet({
        chains: allowedChains,
        options: { projectId: defaultProjectId },
      }),
      twitterWallet({
        chains: allowedChains,
        options: { projectId: defaultProjectId },
      }),
    ],
  },
  {
    groupName: 'EOA Wrapped with AA',
    wallets: [
      enhanceWalletWithAAConnector(
        coinbaseWallet({ chains: allowedChains, appName: 'App' }),
        { projectId: defaultProjectId }
      ),
      enhanceWalletWithAAConnector(metaMaskWallet({ chains: allowedChains }), {
        projectId: defaultProjectId,
      }),
    ],
  },
  {
    groupName: 'EOA',
    wallets: [
      rainbowWallet({ chains: allowedChains }),
      trustWallet({ chains: allowedChains }),
    ],
  },
]);

// object used to interact with the specified blockchain networks
const client = createClient({
  autoConnect: false,
  connectors,
  provider,
  webSocketProvider,
});


// Zero dev wrapper to wrap components
function ZeroDevWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
}

export default ZeroDevWrapper;
