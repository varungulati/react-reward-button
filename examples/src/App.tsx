import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { RewardButton } from 'react-reward-button';
import { ethers } from 'ethers';
import rewardConfig from './config';
import 'react-awesome-button/dist/styles.css';
import './App.css';

// Create a query client for React Query
const queryClient = new QueryClient();

// Configure project ID - you can get this from https://cloud.reown.com/
// For demo purposes, we'll use a placeholder that won't make API calls
const projectId = rewardConfig.reownProjectId;

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

// Token address from environment variable
const TOKEN_ADDRESS = rewardConfig.tokenAddress;

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

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <header className="App-header">
            <h1>AwesomeButton Types & Sizes</h1>
            <p>Access all AwesomeButton features: types, sizes, ripple effects, and icons</p>
          </header>

          <main className="App-main">
            <div className="example-section">
              <h2>Environment Configuration</h2>
              <p>
                <strong>Sender Wallet Setup:</strong> The reward system uses a sender wallet to distribute tokens. 
                Create a <code>.env</code> file in the examples directory with the following variables:
              </p>
              <div style={{ 
                background: '#f5f5f5', 
                padding: '16px', 
                borderRadius: '8px', 
                fontFamily: 'monospace',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                <div>REACT_APP_SENDER_ADDRESS=0x742d35Cc6634C0532925a3b8D25c8c5c8A2B9E6D</div>
                <div>REACT_APP_SENDER_PRIVATE_KEY=0x0123456789abcdef...</div>
                <div>REACT_APP_RPC_URL=https://mainnet.infura.io/v3/your-key</div>
                <div>REACT_APP_REOWN_PROJECT_ID=your-project-id</div>
              </div>
              <p style={{ fontSize: '14px', color: '#666' }}>
                <strong>⚠️ Security Note:</strong> Never commit private keys to version control. Use secure environment management in production.
              </p>
            </div>

            <div className="example-section">
              <h2>Basic Button Types</h2>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '16px', 
                borderRadius: '8px', 
                fontFamily: 'monospace',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                <div>import {`{ RewardButton }`} from 'react-reward-button';</div>
                <br/>
                <div>const Buttons = () =&gt; {`{`}</div>
                <div>  return (</div>
                <div>    &lt;RewardButton type="primary"&gt;Primary&lt;/RewardButton&gt;</div>
                <div>    &lt;RewardButton type="secondary"&gt;Secondary&lt;/RewardButton&gt;</div>
                <div>    &lt;RewardButton type="anchor"&gt;Anchor&lt;/RewardButton&gt;</div>
                <div>    &lt;RewardButton type="danger"&gt;Danger&lt;/RewardButton&gt;</div>
                <div>  );</div>
                <div>{`}`}</div>
              </div>
              <div className="button-grid">
                <div className="button-container">
                  <RewardButton type="primary" onPress={handleRegularButtonPress}>
                    Primary
                  </RewardButton>
                </div>
                <div className="button-container">
                  <RewardButton type="secondary" onPress={handleRegularButtonPress}>
                    Secondary
                  </RewardButton>
                </div>
                <div className="button-container">
                  <RewardButton type="anchor" onPress={handleRegularButtonPress}>
                    Anchor
                  </RewardButton>
                </div>
                <div className="button-container">
                  <RewardButton type="danger" onPress={handleRegularButtonPress}>
                    Danger
                  </RewardButton>
                </div>
              </div>
            </div>

            <div className="example-section">
              <h2>Basic Button Types with Custom Icons</h2>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '16px', 
                borderRadius: '8px', 
                fontFamily: 'monospace',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                <div>import {`{ RewardButton }`} from 'react-reward-button';</div>
                <div>import {`{ BeakerIcon, TrashIcon }`} from "@primer/octicons-react"; // custom icons</div>
                <br/>
                <div>const Buttons = () =&gt; {`{`}</div>
                <div>  return (</div>
                <div>    &lt;RewardButton type="primary" before={`{<⚡Icon />}`}&gt;Primary&lt;/RewardButton&gt;</div>
                <div>    &lt;RewardButton type="secondary" after={`{<⚡Icon />}`}&gt;Secondary&lt;/RewardButton&gt;</div>
                <div>    &lt;RewardButton type="anchor" size="icon"&gt;&lt;🗑️Icon /&gt;&lt;/RewardButton&gt;</div>
                <div>  );</div>
                <div>{`}`}</div>
              </div>
              <div className="button-grid">
                <div className="button-container">
                  <RewardButton 
                    type="primary" 
                    before={<span>⚡</span>}
                    onPress={handleRegularButtonPress}
                  >
                    Primary
                  </RewardButton>
                </div>
                <div className="button-container">
                  <RewardButton 
                    type="secondary" 
                    after={<span>⚡</span>}
                    onPress={handleRegularButtonPress}
                  >
                    Secondary
                  </RewardButton>
                </div>
                <div className="button-container">
                  <RewardButton 
                    type="anchor" 
                    size="icon"
                    onPress={handleRegularButtonPress}
                  >
                    <span>🗑️</span>
                  </RewardButton>
                </div>
              </div>
            </div>

            <div className="example-section">
              <h2>Button Sizes & Ripple Effects</h2>
              <p>Choose from small, medium, and large sizes with optional ripple effects</p>
              <div className="button-grid">
                <div className="button-container">
                  <RewardButton 
                    type="primary" 
                    size="small" 
                    ripple={true}
                    before={<span>⚡</span>}
                    onPress={handleRegularButtonPress}
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
                    onPress={handleRegularButtonPress}
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
                    onPress={handleRegularButtonPress}
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
                    onPress={handleRegularButtonPress}
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
                    onPress={handleRegularButtonPress}
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
                    onPress={handleRegularButtonPress}
                  >
                    Facebook Style
                  </RewardButton>
                  <span className="button-label">Facebook Type</span>
                </div>
              </div>
            </div>

            <div className="example-section">
              <h2>Reward Button Mode</h2>
              <p>When tokenAddress and rewardAmount are provided, the button becomes a reward button</p>
              <div className="single-button">
                <RewardButton
                  tokenAddress={TOKEN_ADDRESS}
                  rewardAmount={ethers.parseUnits('10', 6).toString()}
                  senderAddress={rewardConfig.senderAddress}
                  senderPrivateKey={rewardConfig.senderPrivateKey}
                  rpcUrl={rewardConfig.rpcUrl}
                  onRewardClaimed={handleRewardClaimed}
                  onRewardFailed={handleRewardFailed}
                  onRewardStarted={handleRewardStarted}
                  tokenSymbol="USDC"
                  requireConnection={true}
                  type="primary"
                  size="large"
                  before={<span>💰</span>}
                  after={<span>🎁</span>}
                >
                  Claim 10 USDC Reward
                </RewardButton>
              </div>
            </div>

            <div className="example-section">
              <h2>Customizable Styling</h2>
              <p>Override default styling with custom CSS properties and themes</p>
              <div className="button-grid">
                <div className="button-container">
                  <RewardButton 
                    type="primary" 
                    size="medium"
                    before={<span>🎨</span>}
                    style={{
                      '--button-primary-color': '#ff6b6b',
                      '--button-primary-color-dark': '#ff5252',
                      '--button-primary-color-light': '#ff8a80',
                      '--button-primary-color-hover': '#ff5252',
                      borderRadius: '25px',
                      fontWeight: 'bold',
                    } as React.CSSProperties}
                    onPress={handleRegularButtonPress}
                  >
                    Custom Red
                  </RewardButton>
                  <span className="button-label">Custom CSS Variables</span>
                </div>
                <div className="button-container">
                  <RewardButton 
                    type="secondary" 
                    size="medium"
                    before={<span>🌈</span>}
                    style={{
                      '--button-secondary-color': '#4ecdc4',
                      '--button-secondary-color-dark': '#26a69a',
                      '--button-secondary-color-light': '#80cbc4',
                      '--button-secondary-color-hover': '#26a69a',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)',
                    } as React.CSSProperties}
                    onPress={handleRegularButtonPress}
                  >
                    Custom Teal
                  </RewardButton>
                  <span className="button-label">Custom Styling</span>
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