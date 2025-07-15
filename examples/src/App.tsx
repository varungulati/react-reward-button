import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { RewardButton } from 'react-reward-button';
import { ethers } from 'ethers';
import 'react-awesome-button/dist/styles.css';
import './App.css';

// Create a query client for React Query
const queryClient = new QueryClient();

// Configure project ID - you can get this from https://cloud.reown.com/
// For demo purposes, we'll use a placeholder that won't make API calls
const projectId = process.env.REACT_APP_REOWN_PROJECT_ID || 'your-project-id-here';

// Set up the Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [mainnet],
});

// Create the AppKit with wallet selection modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet],
  projectId,
  metadata: {
    name: 'React Reward Button',
    description: 'A reward button component with wallet selection',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://github.com/your-repo',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  },
  // Disable features that require API calls if using placeholder project ID
  features: {
    analytics: projectId !== 'your-project-id-here',
    email: false,
    socials: [],
  },
});

// Get the wagmi config
const wagmiConfig = wagmiAdapter.wagmiConfig;

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
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <header className="App-header">
            <h1>React Reward Button Example</h1>
            <p>Built on top of react-awesome-button with Web3 wallet support</p>
          </header>

            <main className="App-main">
              <div className="example-section">
                <h2>Regular AwesomeButton Mode</h2>
                <p>When no reward props are provided, it behaves like a regular AwesomeButton</p>
                <div className="single-button">
                  <RewardButton 
                    type="primary" 
                    size="large" 
                    ripple={true}
                    before={<span>🎉</span>}
                    after={<span>→</span>}
                    onPress={handleRegularButtonPress}
                  >
                    Click Me!
                  </RewardButton>
                </div>
              </div>

              <div className="example-section">
                <h2>AwesomeButton Types & Sizes</h2>
                <p>Access all AwesomeButton features: types, sizes, ripple effects, and icons</p>
                <div className="button-grid">
                  <div className="button-container">
                    <RewardButton 
                      type="primary" 
                      size="small" 
                      ripple={true}
                      before={<span>⚡</span>}
                      onPress={handleCustomButtonPress}
                    >
                      Primary Small
                    </RewardButton>
                    <span className="button-label">Primary + Icon</span>
                  </div>
                  <div className="button-container">
                    <RewardButton 
                      type="secondary" 
                      size="medium" 
                      ripple={true}
                      before={<span>🔥</span>}
                      after={<span>✨</span>}
                      onPress={handleCustomButtonPress}
                    >
                      Secondary Medium
                    </RewardButton>
                    <span className="button-label">Secondary + Icons</span>
                  </div>
                  <div className="button-container">
                    <RewardButton 
                      type="primary" 
                      size="large" 
                      ripple={true}
                      before={<span>🚀</span>}
                      active={true}
                      onPress={handleCustomButtonPress}
                    >
                      Primary Large
                    </RewardButton>
                    <span className="button-label">Large + Active</span>
                  </div>
                </div>
              </div>

              <div className="example-section">
                <h2>More Button Variants</h2>
                <p>Explore different button types and visual styles</p>
                <div className="button-grid">
                  <div className="button-container">
                    <RewardButton 
                      type="link" 
                      size="medium" 
                      ripple={true}
                      before={<span>🔗</span>}
                      onPress={handleCustomButtonPress}
                    >
                      Link Button
                    </RewardButton>
                    <span className="button-label">Link Type</span>
                  </div>
                  <div className="button-container">
                    <RewardButton 
                      type="anchor" 
                      size="medium" 
                      ripple={true}
                      before={<span>⚓</span>}
                      onPress={handleCustomButtonPress}
                    >
                      Anchor Button
                    </RewardButton>
                    <span className="button-label">Anchor Type</span>
                  </div>
                  <div className="button-container">
                    <RewardButton 
                      type="facebook" 
                      size="medium" 
                      ripple={true}
                      before={<span>📘</span>}
                      onPress={handleCustomButtonPress}
                    >
                      Facebook Style
                    </RewardButton>
                    <span className="button-label">Facebook Type</span>
                  </div>
                </div>
              </div>

              <div className="example-section">
                <h2>Enhanced Reward Button Mode</h2>
                <p>Reward buttons with enhanced visual appeal and icons</p>
                <div className="single-button">
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
                    size="large"
                    ripple={true}
                    before={<span>💰</span>}
                    after={<span>🎁</span>}
                  >
                    Claim 10 USDC Reward
                  </RewardButton>
                </div>
              </div>

              <div className="example-section">
                <h2>Wallet Connection with Style</h2>
                <p>Reward button with enhanced wallet connection styling</p>
                <div className="single-button">
                  <RewardButton
                    tokenAddress={EXAMPLE_TOKENS.USDC}
                    rewardAmount={ethers.parseUnits('5', 6).toString()}
                    recipientAddress="0x742d35Cc6634C0532925a3b8D25c8c5c8A2B9E6D"
                    onRewardClaimed={handleRewardClaimed}
                    onRewardFailed={handleRewardFailed}
                    onRewardStarted={handleRewardStarted}
                    tokenSymbol="USDC"
                    requireConnection={true}
                    type="primary"
                    size="large"
                    ripple={true}
                    before={<span>🔗</span>}
                    after={<span>💳</span>}
                  >
                    Connect & Claim 5 USDC
                  </RewardButton>
                </div>
              </div>

              <div className="example-section">
                <h2>Styled Multi-Token Rewards</h2>
                <p>Different reward buttons with enhanced styling and token-specific icons</p>
                <div className="button-row">
                  <div className="button-container">
                    <RewardButton
                      tokenAddress={EXAMPLE_TOKENS.USDT}
                      rewardAmount={ethers.parseUnits('5', 6).toString()}
                      recipientAddress="0x742d35Cc6634C0532925a3b8D25c8c5c8A2B9E6D"
                      onRewardClaimed={handleRewardClaimed}
                      onRewardFailed={handleRewardFailed}
                      onRewardStarted={handleRewardStarted}
                      tokenSymbol="USDT"
                      requireConnection={false}
                      type="secondary"
                      size="medium"
                      ripple={true}
                      before={<span>🟢</span>}
                      after={<span>💎</span>}
                    >
                      Claim 5 USDT
                    </RewardButton>
                    <span className="button-label">USDT Rewards</span>
                  </div>
                  <div className="button-container">
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
                      size="medium"
                      ripple={true}
                      before={<span>🟡</span>}
                      after={<span>🌟</span>}
                    >
                      Claim 20 DAI
                    </RewardButton>
                    <span className="button-label">DAI Rewards</span>
                  </div>
                </div>
              </div>

              <div className="example-section">
                <h2>Placeholder & Loading States</h2>
                <p>Buttons with placeholder effects and loading demonstrations</p>
                <div className="button-row">
                  <div className="button-container">
                    <RewardButton 
                      type="primary" 
                      size="medium"
                      ripple={true}
                      placeholder={true}
                      before={<span>⏳</span>}
                      onPress={handleCustomButtonPress}
                    >
                      Placeholder Button
                    </RewardButton>
                    <span className="button-label">With Placeholder</span>
                  </div>
                  <div className="button-container">
                    <RewardButton 
                      type="secondary" 
                      size="medium"
                      ripple={true}
                      before={<span>🔄</span>}
                      loadingText="Processing..."
                      onPress={handleCustomButtonPress}
                    >
                      Loading Demo
                    </RewardButton>
                    <span className="button-label">Custom Loading</span>
                  </div>
                </div>
              </div>

              <div className="example-section">
                <h2>Disabled States with Style</h2>
                <p>Disabled buttons maintaining visual appeal</p>
                <div className="button-row">
                  <div className="button-container">
                    <RewardButton 
                      disabled 
                      type="primary" 
                      size="medium"
                      before={<span>🚫</span>}
                      onPress={handleRegularButtonPress}
                    >
                      Disabled Regular
                    </RewardButton>
                    <span className="button-label">Regular Disabled</span>
                  </div>
                  <div className="button-container">
                    <RewardButton 
                      disabled
                      tokenAddress={EXAMPLE_TOKENS.USDC}
                      rewardAmount={ethers.parseUnits('10', 6).toString()}
                      tokenSymbol="USDC"
                      requireConnection={false}
                      type="primary"
                      size="medium"
                      before={<span>🔒</span>}
                      after={<span>💰</span>}
                    >
                      Disabled Reward
                    </RewardButton>
                    <span className="button-label">Reward Disabled</span>
                  </div>
                </div>
              </div>

              <div className="example-section">
                <h2>Shine Effect Comparison</h2>
                <p>Visual comparison showing the shine effect on reward buttons</p>
                <div className="button-row">
                  <div className="button-container">
                    <RewardButton 
                      type="primary" 
                      size="large" 
                      ripple={true}
                      before={<span>✨</span>}
                      after={<span>🔥</span>}
                      onPress={handleRegularButtonPress}
                    >
                      Regular Button
                    </RewardButton>
                    <span className="button-label">No Shine Effect</span>
                  </div>
                  <div className="button-container">
                    <RewardButton
                      tokenAddress={EXAMPLE_TOKENS.USDC}
                      rewardAmount={ethers.parseUnits('1', 6).toString()}
                      tokenSymbol="USDC"
                      requireConnection={false}
                      type="primary"
                      size="large"
                      ripple={true}
                      before={<span>✨</span>}
                      after={<span>🎁</span>}
                    >
                      Reward Button
                    </RewardButton>
                    <span className="button-label">With Shine Effect</span>
                  </div>
                </div>
              </div>

              <div className="example-section">
                <h2>Advanced Features</h2>
                <p>Demonstrating href links and other advanced AwesomeButton features</p>
                <div className="button-row">
                  <div className="button-container">
                    <RewardButton 
                      type="link" 
                      size="medium"
                      ripple={true}
                      href="https://github.com/rcaferati/react-awesome-button"
                      target="_blank"
                      before={<span>📖</span>}
                      after={<span>🔗</span>}
                    >
                      React Awesome Button Docs
                    </RewardButton>
                    <span className="button-label">External Link</span>
                  </div>
                  <div className="button-container">
                    <RewardButton 
                      type="primary" 
                      size="medium"
                      ripple={true}
                      active={true}
                      before={<span>🎯</span>}
                      after={<span>🌈</span>}
                      onPress={handleCustomButtonPress}
                    >
                      Active State
                    </RewardButton>
                    <span className="button-label">Always Active</span>
                  </div>
                </div>
              </div>

              <div className="example-section">
                <h2>Custom Styling & Container Props</h2>
                <p>Advanced customization with container props and custom styling</p>
                <div className="button-row">
                  <div className="button-container">
                    <RewardButton 
                      type="primary" 
                      size="medium"
                      ripple={true}
                      before={<span>🎨</span>}
                      after={<span>✨</span>}
                      containerProps={{ 
                        'data-testid': 'custom-button',
                        title: 'Custom styled button'
                      }}
                      style={{
                        '--button-primary-color': '#ff6b6b',
                        '--button-primary-color-dark': '#ff5252',
                        '--button-primary-color-light': '#ff8a80',
                        '--button-primary-color-hover': '#ff5252',
                        '--button-primary-border': '2px solid #ff6b6b',
                        borderRadius: '25px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      } as React.CSSProperties}
                      onPress={handleCustomButtonPress}
                    >
                      Custom Styled
                    </RewardButton>
                    <span className="button-label">Custom CSS Variables</span>
                  </div>
                  <div className="button-container">
                    <RewardButton 
                      type="secondary" 
                      size="medium"
                      ripple={true}
                      before={<span>🔧</span>}
                      after={<span>⚙️</span>}
                      containerProps={{ 
                        'data-category': 'utility',
                        role: 'button',
                        'aria-label': 'Utility button with custom props'
                      }}
                      style={{
                        '--button-secondary-color': '#4ecdc4',
                        '--button-secondary-color-dark': '#26a69a',
                        '--button-secondary-color-light': '#80cbc4',
                        '--button-secondary-color-hover': '#26a69a',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)',
                      } as React.CSSProperties}
                      onPress={handleCustomButtonPress}
                    >
                      With Container Props
                    </RewardButton>
                    <span className="button-label">Custom Container</span>
                  </div>
                </div>
              </div>
            </main>
          </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App; 