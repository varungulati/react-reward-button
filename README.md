# 🎁 React Reward Button

A React component that provides a reward button with Ethereum token rewards. Built with wagmi, AppKit, and ethers.js for seamless Web3 integration.

## Why settle for clicks that do nothing?

React Reward Button is a drop-in, beautifully styled button powered by shadcn/ui and Reown wallet integration — but with a twist: every click can reward your users with real tokens.

### Unique Selling Points

1. **🎨 Beautiful by Design**  
   Built on top of shadcn/ui's Button component — fully customizable with variants, sizes, and accessible design patterns out of the box.

2. **🔗 Seamless Wallet Integration with Reown**  
   Handles wallet connection automatically using the Reown React library. Users connect once and are ready to receive rewards instantly.

3. **🪙 Compatible with Any ERC-20 Token**  
   Reward users in your own token or any existing ERC-20 token on supported EVM chains (Polygon recommended).

4. **⚡ One Click = Real Value**  
   Trigger token rewards instantly when users interact with the button — perfect for gamified actions, engagement campaigns, or loyalty flows.

5. **⚙️ Flexible Gas Modes**  
   Choose how rewards are delivered:
   - Developer-funded (gasless for user)
   - Or user-funded (MetaMask/Reown confirmation per claim)

6. **🧩 Plug-and-Play Integration**  
   Drop it into any React project like a regular button. Add reward props, and you're done — no backend required unless you want one.

## Demo

Try the demo here: [React Reward Button Demo](https://react-reward-button-demo.fly.dev/)


## Features

- 🌐 **Web3 Integration**: Built with wagmi and AppKit for modern Web3 functionality
- 💰 **ERC20 Token Rewards**: Send any ERC20 token as rewards
- 🔗 **Wallet Connection**: Seamless wallet connection with AppKit
- ⚙️ **Gas Fee Options**: Choose who pays gas fees (sender or receiver)
- 🎨 **Customizable UI**: Multiple variants, sizes, and styling options
- 🔒 **Type Safe**: Full TypeScript support with comprehensive types
- 📱 **Mobile Friendly**: Works on all devices with responsive design
- ♿ **Accessible**: Built with accessibility standards in mind
- 🚀 **Performance**: Optimized for production use

## Installation

```bash
npm install react-reward-button
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install wagmi @tanstack/react-query ethers @reown/appkit @reown/appkit-adapter-wagmi react react-dom
```

## Setup

### 1. Provider Setup

Wrap your app with the necessary providers:

```tsx
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

const queryClient = new QueryClient();

// Get your project ID from https://cloud.reown.com/
const projectId = 'YOUR_PROJECT_ID';

// Configure networks
const networks = [mainnet, polygon, sepolia];

// Set up the Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
});

// Create the AppKit instance
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'My App',
    description: 'My App Description',
    url: 'https://myapp.com',
    icons: ['https://myapp.com/icon.png']
  }
});

function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* Your app components */}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 2. Basic Usage

```tsx
import { RewardButton } from 'react-reward-button';

function MyComponent() {
  const handleRewardClaimed = (txHash: string, amount: string) => {
    console.log('Reward claimed!', { txHash, amount });
  };

  const handleRewardFailed = (error: Error) => {
    console.error('Reward failed:', error);
  };

  return (
    <RewardButton
      tokenAddress="0xA0b86a33E6441357C49c74aA8F4b3f0B7C6d6b2c" // Example USDC address
      rewardAmount="1000000" // 1 USDC (6 decimals)
      senderAddress="0x..." // Your wallet address holding the tokens
      senderPrivateKey="0x..." // Your private key (keep secure!)
      onRewardClaimed={handleRewardClaimed}
      onRewardFailed={handleRewardFailed}
      tokenSymbol="USDC"
      showRewardAmount={true}
    >
      Claim 1 USDC Reward
    </RewardButton>
  );
}
```

## API Reference

### RewardButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tokenAddress` | `string` | `undefined` | The Ethereum address of the reward token contract |
| `rewardAmount` | `string` | `undefined` | The amount of tokens to reward (in wei or token units) |
| `recipientAddress` | `string` | `undefined` | The recipient address (falls back to connected wallet) |
| `senderAddress` | `string` | `undefined` | The sender wallet address that holds the reward tokens |
| `senderPrivateKey` | `string` | `undefined` | The private key of the sender wallet |
| `rpcUrl` | `string` | `undefined` | RPC URL for the network |
| `onReward` | `() => void \| Promise<void>` | `undefined` | Callback for non-Web3 mode |
| `onRewardClaimed` | `(txHash: string, amount: string) => void` | `undefined` | Called when reward is successfully claimed |
| `onRewardFailed` | `(error: Error) => void` | `undefined` | Called when reward claim fails |
| `onRewardStarted` | `() => void` | `undefined` | Called when reward claim is initiated |
| `showRewardAmount` | `boolean` | `true` | Whether to show the reward amount on the button |
| `tokenSymbol` | `string` | `'TOKEN'` | Custom token symbol to display |
| `requireConnection` | `boolean` | `true` | Whether to require wallet connection |
| `loadingText` | `string` | `'Claiming Reward...'` | Custom loading text |
| `userPaysGas` | `boolean` | `false` | Whether user pays gas fees (vs sender) |
| `isLoading` | `boolean` | `false` | External loading state |
| `children` | `React.ReactNode` | `'Claim Reward'` | Button content |
| `variant` | `'default' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'` | `'default'` | Button variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `className` | `string` | `undefined` | Additional CSS classes |

## Examples

### Basic ERC20 Token Reward

```tsx
import { RewardButton } from 'react-reward-button';

function BasicReward() {
  return (
    <RewardButton
      tokenAddress="0xA0b86a33E6441357C49c74aA8F4b3f0B7C6d6b2c"
      rewardAmount="1000000" // 1 USDC (6 decimals)
      senderAddress="0x742d35Cc6634C0532925a3b8D372C468F8c9d5b7"
      senderPrivateKey="0x..." // Keep this secure!
      tokenSymbol="USDC"
      onRewardClaimed={(txHash, amount) => {
        console.log(`Reward claimed! Amount: ${amount}, TX: ${txHash}`);
      }}
    >
      Claim 1 USDC
    </RewardButton>
  );
}
```

### Different Token Examples

```tsx
// ETH-based reward
<RewardButton
  tokenAddress="0x..." // WETH address
  rewardAmount={ethers.parseEther("0.01")} // 0.01 ETH
  senderAddress="0x..."
  senderPrivateKey="0x..."
  tokenSymbol="WETH"
>
  Claim 0.01 WETH
</RewardButton>

// Custom ERC20 token
<RewardButton
  tokenAddress="0x..." // Your token address
  rewardAmount="100000000000000000000" // 100 tokens (18 decimals)
  senderAddress="0x..."
  senderPrivateKey="0x..."
  tokenSymbol="MYTOKEN"
  showRewardAmount={true}
>
  Claim Daily Reward
</RewardButton>
```

### Gas Fee Options

```tsx
// Sender pays gas fees (default)
<RewardButton
  tokenAddress="0x..."
  rewardAmount="1000000"
  senderAddress="0x..."
  senderPrivateKey="0x..."
  userPaysGas={false} // Sender pays gas
>
  Free Reward (No Gas Required)
</RewardButton>

// User pays gas fees
<RewardButton
  tokenAddress="0x..."
  rewardAmount="1000000"
  senderAddress="0x..."
  senderPrivateKey="0x..."
  userPaysGas={true} // User pays gas
>
  Claim Reward (You Pay Gas)
</RewardButton>
```

### Custom Styling

```tsx
<RewardButton
  tokenAddress="0x..."
  rewardAmount="1000000"
  senderAddress="0x..."
  senderPrivateKey="0x..."
  variant="outline"
  size="lg"
  className="my-custom-styles"
  style={{
    backgroundColor: '#ff6b6b',
    borderRadius: '12px',
    padding: '16px 32px'
  }}
>
  🎁 Special Reward
</RewardButton>
```

### Error Handling

```tsx
import { useState } from 'react';
import { RewardButton } from 'react-reward-button';

function RewardWithErrorHandling() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  return (
    <div>
      <RewardButton
        tokenAddress="0x..."
        rewardAmount="1000000"
        senderAddress="0x..."
        senderPrivateKey="0x..."
        onRewardClaimed={(txHash, amount) => {
          setSuccess(true);
          setError(null);
          console.log('Success!', { txHash, amount });
        }}
        onRewardFailed={(error) => {
          setError(error.message);
          setSuccess(false);
        }}
        onRewardStarted={() => {
          setError(null);
          setSuccess(false);
        }}
      >
        Claim Reward
      </RewardButton>
      
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {success && <p style={{ color: 'green' }}>Reward claimed successfully!</p>}
    </div>
  );
}
```

### Using as Regular Button

If you don't provide `tokenAddress` and `rewardAmount`, it works as a regular button:

```tsx
import { RewardButton } from 'react-reward-button';

function RegularButton() {
  return (
    <RewardButton
      onReward={() => {
        console.log('Regular button clicked!');
      }}
      variant="secondary"
    >
      Regular Button
    </RewardButton>
  );
}
```

## Configuration

### Environment Variables

For development, you can use environment variables:

```bash
# .env
VITE_REOWN_PROJECT_ID=your_project_id
VITE_NETWORK=mainnet
VITE_RPC_URL=https://mainnet.infura.io/v3/your_key
```

### Network Configuration

```tsx
import { mainnet, polygon, sepolia, arbitrum } from 'wagmi/chains';

const networks = [
  mainnet,    // Ethereum Mainnet
  polygon,    // Polygon
  sepolia,    // Ethereum Sepolia Testnet
  arbitrum,   // Arbitrum One
];
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **Never expose private keys in client-side code** - The `senderPrivateKey` should only be used in secure environments
2. **Use environment variables** for sensitive data
3. **Consider using a backend service** for production applications
4. **Validate all inputs** and amounts before processing
5. **Test thoroughly** on testnets before mainnet deployment

## Supported Networks

- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- Sepolia Testnet
- Polygon Mumbai Testnet
- Any EVM-compatible network

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers with Web3 wallet support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/react-reward-button/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/react-reward-button/discussions)
- 📖 **Documentation**: [Full Documentation](https://github.com/your-username/react-reward-button#readme)

---

Made with ❤️ for the Web3 community