import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, sepolia, polygonMumbai } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { RewardButton, Button, ethers } from 'react-reward-button';
import rewardConfig from './config';
import './App.css';

// Create a query client for React Query
const queryClient = new QueryClient();

// Configure project ID - you can get this from https://cloud.reown.com/
const projectId = rewardConfig.reownProjectId;

// Network selection based on REACT_APP_NETWORK environment variable
const getNetworkFromEnv = () => {
  const networkName = rewardConfig.network.toLowerCase();
  
  switch (networkName) {
    case 'mainnet':
      return mainnet;
    case 'sepolia':
    case 'testnet':
      return sepolia;
    case 'polygon':
      return polygon;
    case 'mumbai':
    case 'polygon-testnet':
      return polygonMumbai;
    default:
      console.warn(`Unknown network: ${networkName}, defaulting to mainnet`);
      return mainnet;
  }
};

const selectedNetwork = getNetworkFromEnv();

console.log('🌐 Network Configuration:');
console.log('  REACT_APP_NETWORK:', rewardConfig.network);
console.log('  Selected Network:', selectedNetwork.name);
console.log('  Chain ID:', selectedNetwork.id);
console.log('  RPC URL:', rewardConfig.rpcUrl);

// Set up the Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [selectedNetwork],
});

// Create the AppKit with wallet selection modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [selectedNetwork],
  projectId,
  metadata: {
    name: 'React Reward Button',
    description: 'A clean reward button component with Web3 integration',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://github.com/your-repo',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  },
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
  const [rewardCount, setRewardCount] = useState(0);

  const handleRewardClaimed = (txHash: string, amount: string) => {
    console.log('🎉 Reward claimed!', { txHash, amount });
    setRewardCount(prev => prev + 1);
  };

  const handleRewardFailed = (error: Error) => {
    console.error('❌ Reward failed:', error);
  };

  const handleRewardStarted = () => {
    console.log('🚀 Reward transaction started');
  };

  const handleRegularButtonPress = () => {
    console.log('Regular button pressed!');
    alert('This is a regular button press!');
  };

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <header className="App-header">
            <h1>React Reward Button</h1>
            <p>Clean, accessible button component with Web3 integration</p>
          </header>

          <main className="App-main">
            <div className="example-section">
              <h2>Environment Configuration</h2>
              <p>
                <strong>Sender Wallet Setup:</strong> The reward system uses a sender wallet to distribute tokens. 
                Create a <code>.env</code> file in the examples directory with the following variables:
              </p>
              <div className="code-block">
                <pre>
REACT_APP_SENDER_ADDRESS=0x742d35Cc6634C0532925a3b8D25c8c5c8A2B9E6D
REACT_APP_SENDER_PRIVATE_KEY=0x0123456789abcdef...
REACT_APP_NETWORK=polygon
REACT_APP_RPC_URL=https://polygon-mainnet.infura.io/v3/your-key
REACT_APP_TOKEN_CONTRACT_ADDRESS=0x0F35a94a4d...
REACT_APP_REOWN_PROJECT_ID=your-project-id
                </pre>
              </div>
              <div style={{ 
                background: '#e8f5e8', 
                border: '1px solid #4caf50', 
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                <strong>💡 Network Recommendation:</strong> Polygon offers the lowest gas fees and fastest transaction confirmations compared to Ethereum mainnet.
              </div>
            </div>

            <div className="example-section">
              <h2>Button Variants & Sizes</h2>
              <p>Clean shadcn/ui inspired design with multiple variants and sizes</p>
              <div className="button-grid">
                <div className="button-container">
                  <Button variant="default" onClick={handleRegularButtonPress}>
                    Default
                  </Button>
                  <span className="button-label">Default variant</span>
                </div>
                <div className="button-container">
                  <Button variant="secondary" onClick={handleRegularButtonPress}>
                    Secondary
                  </Button>
                  <span className="button-label">Secondary variant</span>
                </div>
                <div className="button-container">
                  <Button variant="outline" onClick={handleRegularButtonPress}>
                    Outline
                  </Button>
                  <span className="button-label">Outline variant</span>
                </div>
                <div className="button-container">
                  <Button variant="ghost" onClick={handleRegularButtonPress}>
                    Ghost
                  </Button>
                  <span className="button-label">Ghost variant</span>
                </div>
              </div>
            </div>

            <div className="example-section">
              <h2>Web3 Reward Button - Sender Pays Gas</h2>
              <p>When tokenAddress and rewardAmount are provided, the button becomes a Web3 reward button</p>
              <div className="single-button">
                <RewardButton
                  tokenAddress={TOKEN_ADDRESS}
                  rewardAmount={ethers.parseUnits('10', 18).toString()}
                  senderAddress={rewardConfig.senderAddress}
                  senderPrivateKey={rewardConfig.senderPrivateKey}
                  rpcUrl={rewardConfig.rpcUrl}
                  onRewardClaimed={handleRewardClaimed}
                  onRewardFailed={handleRewardFailed}
                  onRewardStarted={handleRewardStarted}
                  tokenSymbol="CRT"
                  requireConnection={true}
                  userPaysGas={false}
                  variant="default"
                  size="lg"
                >
                  🎁 Claim 10 CRT Reward
                </RewardButton>
              </div>
              <div className="reward-count">
                Total rewards claimed: {rewardCount}
              </div>
            </div>

            <div className="example-section">
              <h2>Gas Payment Comparison</h2>
              <p>Compare sender-pays-gas vs receiver-pays-gas approaches</p>
              <div style={{ 
                background: '#e8f5e8', 
                border: '1px solid #4caf50', 
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                <strong>💡 Recommended:</strong> Use Polygon network for lowest gas fees and fastest transactions!
              </div>
              <div className="button-grid">
                <div className="button-container">
                  <RewardButton
                    tokenAddress={TOKEN_ADDRESS}
                    rewardAmount={ethers.parseUnits('5', 18).toString()}
                    senderAddress={rewardConfig.senderAddress}
                    senderPrivateKey={rewardConfig.senderPrivateKey}
                    rpcUrl={rewardConfig.rpcUrl}
                    onRewardClaimed={handleRewardClaimed}
                    onRewardFailed={handleRewardFailed}
                    onRewardStarted={handleRewardStarted}
                    tokenSymbol="CRT"
                    requireConnection={true}
                    userPaysGas={false}
                    variant="default"
                    size="default"
                  >
                    🏢 Sender Pays Gas
                  </RewardButton>
                  <span className="button-label">Sender pays gas fees</span>
                </div>
                <div className="button-container">
                  <RewardButton
                    tokenAddress={TOKEN_ADDRESS}
                    rewardAmount={ethers.parseUnits('5', 18).toString()}
                    senderAddress={rewardConfig.senderAddress}
                    senderPrivateKey={rewardConfig.senderPrivateKey}
                    rpcUrl={rewardConfig.rpcUrl}
                    onRewardClaimed={handleRewardClaimed}
                    onRewardFailed={handleRewardFailed}
                    onRewardStarted={handleRewardStarted}
                    tokenSymbol="CRT"
                    requireConnection={true}
                    userPaysGas={true}
                    variant="secondary"
                    size="default"
                  >
                    👤 Receiver Pays Gas
                  </RewardButton>
                  <span className="button-label">You pay gas fees</span>
                </div>
              </div>
              <div className="code-block">
                <h3>Key Differences:</h3>
                <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '14px' }}>
                  <li><strong>Sender Pays Gas:</strong> Uses <code>transfer()</code> function, sender wallet pays gas fees</li>
                  <li><strong>Receiver Pays Gas:</strong> Uses <code>transferFrom()</code> function, connected wallet pays gas fees</li>
                  <li><strong>⚠️ Important:</strong> For receiver-pays-gas, sender must first call <code>approve(receiverAddress, amount)</code></li>
                  <li><strong>🚀 Network Choice:</strong> Gas fees vary by blockchain - Polygon offers the lowest costs and fastest confirmations</li>
                </ul>
              </div>
            </div>

            <div className="example-section">
              <h2>Different Reward Amounts & Variants</h2>
              <p>Different scenarios for reward distribution</p>
              <div className="button-grid">
                <div className="button-container">
                  <RewardButton
                    tokenAddress={TOKEN_ADDRESS}
                    rewardAmount={ethers.parseUnits('1', 18).toString()}
                    senderAddress={rewardConfig.senderAddress}
                    senderPrivateKey={rewardConfig.senderPrivateKey}
                    rpcUrl={rewardConfig.rpcUrl}
                    onRewardClaimed={handleRewardClaimed}
                    onRewardFailed={handleRewardFailed}
                    onRewardStarted={handleRewardStarted}
                    tokenSymbol="CRT"
                    requireConnection={true}
                    userPaysGas={false}
                    variant="outline"
                    size="sm"
                  >
                    🎁 Small Reward (1 CRT)
                  </RewardButton>
                  <span className="button-label">Good for small amounts</span>
                </div>
                <div className="button-container">
                  <RewardButton
                    tokenAddress={TOKEN_ADDRESS}
                    rewardAmount={ethers.parseUnits('25', 18).toString()}
                    senderAddress={rewardConfig.senderAddress}
                    senderPrivateKey={rewardConfig.senderPrivateKey}
                    rpcUrl={rewardConfig.rpcUrl}
                    onRewardClaimed={handleRewardClaimed}
                    onRewardFailed={handleRewardFailed}
                    onRewardStarted={handleRewardStarted}
                    tokenSymbol="CRT"
                    requireConnection={true}
                    userPaysGas={false}
                    variant="default"
                    size="default"
                  >
                    💎 Medium Reward (25 CRT)
                  </RewardButton>
                  <span className="button-label">Good for medium amounts</span>
                </div>
                <div className="button-container">
                  <RewardButton
                    tokenAddress={TOKEN_ADDRESS}
                    rewardAmount={ethers.parseUnits('100', 18).toString()}
                    senderAddress={rewardConfig.senderAddress}
                    senderPrivateKey={rewardConfig.senderPrivateKey}
                    rpcUrl={rewardConfig.rpcUrl}
                    onRewardClaimed={handleRewardClaimed}
                    onRewardFailed={handleRewardFailed}
                    onRewardStarted={handleRewardStarted}
                    tokenSymbol="CRT"
                    requireConnection={true}
                    userPaysGas={false}
                    variant="destructive"
                    size="lg"
                  >
                    🚀 Large Reward (100 CRT)
                  </RewardButton>
                  <span className="button-label">Good for large amounts</span>
                </div>
              </div>
            </div>

            <div className="example-section">
              <h2>Regular Button Examples</h2>
              <p>Use the base Button component for non-Web3 use cases</p>
              <div className="button-grid">
                <div className="button-container">
                  <Button 
                    variant="default"
                    onClick={handleRegularButtonPress}
                  >
                    Regular Button
                  </Button>
                  <span className="button-label">No Web3 functionality</span>
                </div>
                <div className="button-container">
                  <Button 
                    variant="secondary"
                    onClick={handleRegularButtonPress}
                    disabled
                  >
                    Disabled Button
                  </Button>
                  <span className="button-label">Disabled state</span>
                </div>
                <div className="button-container">
                  <Button 
                    variant="ghost"
                    onClick={handleRegularButtonPress}
                    isLoading={true}
                  >
                    Loading Button
                  </Button>
                  <span className="button-label">Loading state</span>
                </div>
              </div>
            </div>

            <div className="example-section">
              <h2>Usage Examples</h2>
              <div className="code-block">
                <h3>Basic Web3 Reward Button:</h3>
                <pre>{`import { RewardButton, ethers } from 'react-reward-button';

<RewardButton
  tokenAddress="0x..."
  rewardAmount={ethers.parseUnits('10', 18).toString()}
  senderAddress="0x..."
  senderPrivateKey="0x..."
  rpcUrl="https://polygon-mainnet.infura.io/v3/..."
  onRewardClaimed={(txHash, amount) => {
    console.log('Reward claimed!', txHash, amount);
  }}
  onRewardFailed={(error) => {
    console.error('Reward failed:', error);
  }}
  tokenSymbol="CRT"
  userPaysGas={false}
  variant="default"
  size="lg"
>
  Claim 10 CRT Reward
</RewardButton>`}</pre>
                
                <h3>Regular Button:</h3>
                <pre>{`import { Button } from 'react-reward-button';

<Button 
  variant="outline" 
  onClick={() => console.log('clicked')}
>
  Click me
</Button>`}</pre>
              </div>
            </div>

            <div className="example-section">
              <h2>Console Logging</h2>
              <p>Open your browser's developer console to see detailed logging of all Web3 operations:</p>
              <div className="code-block">
                <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '14px' }}>
                  <li>🎯 Recipient address selection logic</li>
                  <li>🚀 Reward claim process steps</li>
                  <li>🔍 Wallet connection validation</li>
                  <li>💫 Token transfer initiation</li>
                  <li>📤 Transaction submission</li>
                  <li>✅ Transaction confirmation</li>
                  <li>❌ Error handling with detailed messages</li>
                </ul>
              </div>
            </div>
          </main>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App; 