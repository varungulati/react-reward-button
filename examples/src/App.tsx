import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RewardButton } from 'react-reward-button';
import { ethers } from 'ethers';
import 'react-awesome-button/dist/styles.css';
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

  const handleRegularButtonPress = () => {
    console.log('Regular button pressed!');
    alert('This is a regular AwesomeButton press!');
  };

  const handleCustomButtonPress = () => {
    console.log('Custom button pressed!');
    alert('This is a custom styled AwesomeButton!');
  };

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <header className="App-header">
            <h1>React Reward Button Example</h1>
            <p>Built on top of react-awesome-button with reward functionality</p>
          </header>

          <main className="App-main">
            <div className="example-section">
              <h2>Regular AwesomeButton Mode</h2>
              <p>When no reward props are provided, it behaves like a regular AwesomeButton</p>
              <RewardButton 
                type="primary" 
                size="medium" 
                onPress={handleRegularButtonPress}
              >
                Click Me!
              </RewardButton>
            </div>

            <div className="example-section">
              <h2>Custom AwesomeButton Features</h2>
              <p>Access all AwesomeButton features: types, sizes, ripple effects</p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <RewardButton 
                  type="primary" 
                  size="small" 
                  ripple={true}
                  onPress={handleCustomButtonPress}
                >
                  Primary Small
                </RewardButton>
                <RewardButton 
                  type="secondary" 
                  size="medium" 
                  ripple={true}
                  onPress={handleCustomButtonPress}
                >
                  Secondary Medium
                </RewardButton>
                <RewardButton 
                  type="primary" 
                  size="large" 
                  ripple={true}
                  onPress={handleCustomButtonPress}
                >
                  Primary Large
                </RewardButton>
              </div>
            </div>

            <div className="example-section">
              <h2>Reward Button Mode</h2>
              <p>When reward props are provided, it becomes a reward button with shine effect</p>
              <RewardButton
                tokenAddress={EXAMPLE_TOKENS.USDC}
                rewardAmount={ethers.parseUnits('10', 6).toString()}
                recipientAddress="0x742d35Cc6634C0532925a3b8D25c8c5c8A2B9E6D"
                onRewardClaimed={handleRewardClaimed}
                onRewardFailed={handleRewardFailed}
                onRewardStarted={handleRewardStarted}
                tokenSymbol="USDC"
                requireConnection={false}
                type="primary"
                size="medium"
                ripple={true}
              >
                Claim 10 USDC Reward
              </RewardButton>
            </div>

            <div className="example-section">
              <h2>Multiple Reward Buttons</h2>
              <p>Different reward buttons with various tokens and styles</p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <RewardButton
                  tokenAddress={EXAMPLE_TOKENS.USDT}
                  rewardAmount={ethers.parseUnits('5', 6).toString()}
                  recipientAddress="0x742d35Cc6634C0532925a3b8D25c8c5c8A2B9E6D"
                  onRewardClaimed={handleRewardClaimed}
                  onRewardFailed={handleRewardFailed}
                  onRewardStarted={handleRewardStarted}
                  tokenSymbol="USDT"
                  requireConnection={false}
                  type="primary"
                  size="small"
                >
                  Claim 5 USDT
                </RewardButton>
                <RewardButton
                  tokenAddress={EXAMPLE_TOKENS.DAI}
                  rewardAmount={ethers.parseUnits('20', 18).toString()}
                  recipientAddress="0x742d35Cc6634C0532925a3b8D25c8c5c8A2B9E6D"
                  onRewardClaimed={handleRewardClaimed}
                  onRewardFailed={handleRewardFailed}
                  onRewardStarted={handleRewardStarted}
                  tokenSymbol="DAI"
                  requireConnection={false}
                  type="primary"
                  size="large"
                >
                  Claim 20 DAI
                </RewardButton>
              </div>
            </div>

            <div className="example-section">
              <h2>Disabled States</h2>
              <p>Both regular and reward buttons can be disabled</p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <RewardButton 
                  disabled 
                  type="primary" 
                  onPress={handleRegularButtonPress}
                >
                  Disabled Regular
                </RewardButton>
                <RewardButton 
                  disabled
                  tokenAddress={EXAMPLE_TOKENS.USDC}
                  rewardAmount={ethers.parseUnits('10', 6).toString()}
                  tokenSymbol="USDC"
                  requireConnection={false}
                  type="primary"
                >
                  Disabled Reward
                </RewardButton>
              </div>
            </div>

            <div className="example-section">
              <h2>The Shine Effect</h2>
              <p>Identical buttons - the only difference is the shine effect on reward buttons</p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <RewardButton 
                  type="primary" 
                  size="medium" 
                  ripple={true}
                  onPress={handleRegularButtonPress}
                >
                  Regular Button
                </RewardButton>
                <RewardButton
                  tokenAddress={EXAMPLE_TOKENS.USDC}
                  rewardAmount={ethers.parseUnits('1', 6).toString()}
                  tokenSymbol="USDC"
                  requireConnection={false}
                  type="primary"
                  size="medium"
                  ripple={true}
                >
                  Reward Button
                </RewardButton>
              </div>
            </div>
          </main>
        </div>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App; 