# 🎁 React Reward Button

A React component that provides a reward button with Ethereum token rewards. Perfect for gamification, loyalty programs, and user engagement in Web3 applications.

## Features

- 🚀 **Easy to use**: Simple React component with minimal setup
- 🔧 **Highly customizable**: Customize styles, text, and behavior
- 🔗 **Web3 integrated**: Built-in wallet connection and Ethereum integration
- 📱 **Mobile friendly**: Responsive design that works on all devices
- 🎨 **Beautiful UI**: Modern, sleek design with smooth animations
- 🔒 **Type safe**: Full TypeScript support
- ⚡ **Performance optimized**: Efficient rendering and minimal bundle size

## Installation

```bash
npm install react-reward-button
```

## Prerequisites

Your application needs to be wrapped with the necessary Web3 providers. Here's a basic setup:

```jsx
import { WagmiConfig, createConfig, mainnet } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const config = createConfig(
  getDefaultConfig({
    appName: 'Your App Name',
    walletConnectProjectId: 'your-project-id',
    chains: [mainnet],
  })
);

function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          {/* Your app components */}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
```

## Quick Start

```jsx
import { RewardButton, ethers } from 'react-reward-button';

function MyComponent() {
  return (
    <RewardButton
      tokenAddress="0x..." // Your token contract address
      rewardAmount={ethers.parseUnits('10', 18).toString()} // 10 tokens
      onRewardClaimed={(txHash, amount) => {
        console.log('Reward claimed!', txHash, amount);
      }}
      onRewardFailed={(error) => {
        console.error('Reward failed:', error);
      }}
      tokenSymbol="USDC"
      showRewardAmount={true}
    >
      Claim Reward
    </RewardButton>
  );
}
```

## API Reference

### RewardButton Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tokenAddress` | `string` | ✅ | The Ethereum address of the reward token contract |
| `rewardAmount` | `string` | ✅ | The amount of tokens to reward (in wei or token units) |
| `recipientAddress` | `string` | ❌ | The recipient address for the reward (defaults to connected wallet) |
| `children` | `React.ReactNode` | ❌ | Custom button text (defaults to "Claim Reward") |
| `className` | `string` | ❌ | Custom CSS class name |
| `style` | `React.CSSProperties` | ❌ | Custom inline styles |
| `onRewardClaimed` | `(txHash: string, amount: string) => void` | ❌ | Callback when reward is successfully claimed |
| `onRewardFailed` | `(error: Error) => void` | ❌ | Callback when reward claim fails |
| `onRewardStarted` | `() => void` | ❌ | Callback when reward claim is initiated |
| `disabled` | `boolean` | ❌ | Whether the button should be disabled |
| `loadingText` | `string` | ❌ | Custom loading text (defaults to "Claiming...") |
| `showRewardAmount` | `boolean` | ❌ | Whether to show the reward amount on the button |
| `tokenSymbol` | `string` | ❌ | Custom token symbol to display (e.g., "USDC", "ETH") |
| `requireConnection` | `boolean` | ❌ | Whether to require wallet connection before claiming |

## Examples

### Basic Usage

```jsx
import { RewardButton, ethers } from 'react-reward-button';

function BasicExample() {
  return (
    <RewardButton
      tokenAddress="0xA0b86a33E6441b6b07c2fE4c2b4B8B1d8B7a0F4c"
      rewardAmount={ethers.parseUnits('10', 6).toString()} // 10 USDC
      tokenSymbol="USDC"
      onRewardClaimed={(txHash, amount) => {
        alert(`Reward claimed! TX: ${txHash}`);
      }}
    >
      Claim 10 USDC
    </RewardButton>
  );
}
```

### Custom Styling

```jsx
function CustomStyledExample() {
  return (
    <RewardButton
      tokenAddress="0x6B175474E89094C44Da98b954EedeAC495271d0F"
      rewardAmount={ethers.parseUnits('100', 18).toString()} // 100 DAI
      tokenSymbol="DAI"
      style={{
        backgroundColor: '#ff6b6b',
        borderRadius: '20px',
        padding: '15px 30px',
        fontSize: '18px',
        boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
      }}
      onRewardClaimed={(txHash, amount) => {
        console.log('DAI reward claimed!', txHash);
      }}
    >
      🎉 Get DAI Bonus
    </RewardButton>
  );
}
```

### Specific Recipient

```jsx
function SpecificRecipientExample() {
  return (
    <RewardButton
      tokenAddress="0xA0b86a33E6441b6b07c2fE4c2b4B8B1d8B7a0F4c"
      rewardAmount={ethers.parseUnits('25', 6).toString()} // 25 USDC
      recipientAddress="0x742d35Cc6634C0532925a3b8D000a600DC21c4f0"
      tokenSymbol="USDC"
      requireConnection={false}
      onRewardClaimed={(txHash, amount) => {
        console.log('Sent to specific address!', txHash);
      }}
    >
      Send to Friend
    </RewardButton>
  );
}
```

### With Error Handling

```jsx
function ErrorHandlingExample() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  return (
    <div>
      <RewardButton
        tokenAddress="0xA0b86a33E6441b6b07c2fE4c2b4B8B1d8B7a0F4c"
        rewardAmount={ethers.parseUnits('5', 6).toString()}
        tokenSymbol="USDC"
        onRewardClaimed={(txHash, amount) => {
          setSuccess(true);
          setError(null);
        }}
        onRewardFailed={(error) => {
          setError(error.message);
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

## Token Amount Formatting

The `rewardAmount` prop expects the amount in the smallest unit of the token (wei for 18-decimal tokens). Use `ethers.parseUnits()` to convert from human-readable amounts:

```jsx
// For 18-decimal tokens (like DAI, WETH)
const amount = ethers.parseUnits('10', 18).toString(); // 10 tokens

// For 6-decimal tokens (like USDC, USDT)
const amount = ethers.parseUnits('10', 6).toString(); // 10 tokens

// For 8-decimal tokens (like WBTC)
const amount = ethers.parseUnits('0.1', 8).toString(); // 0.1 tokens
```

## Smart Contract Requirements

Your token contract must:

1. **Be an ERC20 token** with standard `transfer()` function
2. **Have sufficient balance** to distribute rewards
3. **Approve the reward distribution** (if using `transferFrom`)

### Example Contract Setup

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    constructor() ERC20("RewardToken", "REWARD") {
        _mint(msg.sender, 1000000 * 10**18); // 1M tokens
    }
    
    // Function to distribute rewards
    function distributeReward(address recipient, uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _transfer(msg.sender, recipient, amount);
    }
}
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **Test on testnets first** before deploying to mainnet
2. **Verify token contracts** before using them
3. **Implement proper access controls** in your smart contracts
4. **Monitor gas costs** for your users
5. **Consider rate limiting** to prevent abuse
6. **Validate recipient addresses** to prevent loss of tokens

## Supported Networks

- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- Other EVM-compatible chains (configure through wagmi)

## Common Token Addresses

```jsx
import { COMMON_TOKENS } from 'react-reward-button';

// Ethereum Mainnet
const tokens = {
  USDC: COMMON_TOKENS.USDC,
  USDT: COMMON_TOKENS.USDT,
  DAI: COMMON_TOKENS.DAI,
  WETH: COMMON_TOKENS.WETH,
};
```

## Development

### Running the Example

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run the example
cd examples
npm install
npm start
```

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 **Email**: support@yourcompany.com
- 💬 **Discord**: [Join our community](https://discord.gg/yourserver)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/react-reward-button/issues)
- 📖 **Documentation**: [Full docs](https://your-docs-site.com)

## Changelog

### v1.0.0
- Initial release
- Basic reward button functionality
- Web3 integration with wagmi
- TypeScript support
- Comprehensive examples

---

Made with ❤️ by [Your Name](https://github.com/your-username)