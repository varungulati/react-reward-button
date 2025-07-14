import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RewardButton } from 'react-reward-button';
import { ethers } from 'ethers';
import './App.css';

// Create a query client for React Query
const queryClient = new QueryClient();

// Configure chains and providers
const { chains, publicClient } = configureChains(
  [mainnet],
  [
    jsonRpcProvider({
      rpc: (_chain) => ({
        http: `https://eth-mainnet.alchemyapi.io/v2/demo`,
      }),
    }),
  ]
);

// Create wagmi config with minimal connectors
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
});

// Example token addresses
const EXAMPLE_TOKENS = {
  USDC: '0xA0b86a33E6441b6b07c2fE4c2b4B8B1d8B7a0F4c',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
};

function App() {
  const handleRewardClaimed = (txHash: string, amount: string) => {
    console.log('Reward claimed!', { txHash, amount });
  };

  const handleRewardFailed = (error: Error) => {
    console.error('Reward failed:', error);
  };

  const handleRewardStarted = () => {
    console.log('Reward transaction started');
  };

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <header className="App-header">
            <h1>React Reward Button Example</h1>
            <p>A simple example demonstrating the RewardButton component</p>
          </header>

          <main className="App-main">
            <div className="example-section">
              <h2>USDC Reward Button</h2>
              <RewardButton
                tokenAddress={EXAMPLE_TOKENS.USDC}
                rewardAmount={ethers.parseUnits('10', 6).toString()}
                recipientAddress="0x742d35Cc6634C0532925a3b8D25c8c5c8A2B9E6D"
                onRewardClaimed={handleRewardClaimed}
                onRewardFailed={handleRewardFailed}
                onRewardStarted={handleRewardStarted}
                tokenSymbol="USDC"
                className="reward-button-primary"
                requireConnection={false}
              >
                Claim 10 USDC
              </RewardButton>
            </div>

            <div className="example-section">
              <h2>USDT Reward Button</h2>
              <RewardButton
                tokenAddress={EXAMPLE_TOKENS.USDT}
                rewardAmount={ethers.parseUnits('5', 6).toString()}
                recipientAddress="0x742d35Cc6634C0532925a3b8D25c8c5c8A2B9E6D"
                onRewardClaimed={handleRewardClaimed}
                onRewardFailed={handleRewardFailed}
                onRewardStarted={handleRewardStarted}
                tokenSymbol="USDT"
                className="reward-button-secondary"
                requireConnection={false}
              >
                Claim 5 USDT
              </RewardButton>
            </div>
          </main>
        </div>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App; 