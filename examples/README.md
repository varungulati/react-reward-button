# React Reward Button Examples

This directory contains examples demonstrating how to use the React Reward Button component with wallet connection and token transfers.

## Environment Setup

### Required Environment Variables

Create a `.env` file in this directory with the following variables:

```bash
# Sender wallet configuration (required for reward functionality)
VITE_SENDER_ADDRESS=0x742d35Cc6634C0532925a3b8D25c8c5c8A2B9E6D
VITE_SENDER_PRIVATE_KEY=0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# Network configuration
VITE_RPC_URL=https://mainnet.infura.io/v3/your-infura-key
VITE_NETWORK=mainnet

# Token contract address (required for reward functionality)
VITE_TOKEN_CONTRACT_ADDRESS=0xA0b86a33E6441b6b07c2fE4c2b4B8B1d8B7a0F4c

# Wallet connection (REQUIRED for Dynamic Wallet Connection button)
# Get from: https://cloud.reown.com/
# The wallet selection modal will NOT open without this!
VITE_REOWN_PROJECT_ID=your-project-id-here
```

### How It Works

1. **Sender Wallet**: The `VITE_SENDER_ADDRESS` should be a wallet that holds the reward tokens
2. **Private Key**: The `VITE_SENDER_PRIVATE_KEY` is used to sign transactions for token transfers
3. **RPC URL**: Used to connect to the Ethereum network for executing transactions
4. **Recipient**: The reward tokens are sent to the connected user's wallet address

### Token Transfer Flow

1. User clicks "Connect & Claim Reward" button
2. If wallet not connected, Reown AppKit modal opens for wallet selection
3. User connects their wallet
4. Recipient address is set to the connected wallet address
5. Token transfer is executed from sender wallet to recipient wallet
6. Transaction is confirmed on the blockchain

## Security Notes

⚠️ **Never commit private keys to version control**

- Use secure environment variable management in production
- Consider using services like AWS Secrets Manager, Azure Key Vault, or similar
- The private key should have access to sufficient reward tokens
- Monitor the sender wallet balance to ensure rewards can be distributed

## Running the Examples

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Example Usage

```tsx
import { RewardButton } from 'react-reward-button';
import { ethers } from 'ethers';

function App() {
  return (
    <RewardButton
      tokenAddress="0xA0b86a33E6441b6b07c2fE4c2b4B8B1d8B7a0F4c"
      rewardAmount={ethers.parseUnits('10', 6).toString()}
      senderAddress={import.meta.env.VITE_SENDER_ADDRESS}
senderPrivateKey={import.meta.env.VITE_SENDER_PRIVATE_KEY}
rpcUrl={import.meta.env.VITE_RPC_URL}
      tokenSymbol="CRT"
      requireConnection={true}
      onRewardClaimed={(txHash, amount) => {
        console.log('Reward claimed!', { txHash, amount });
      }}
      onRewardFailed={(error) => {
        console.error('Reward failed:', error);
      }}
    >
      Claim 10 CRT Reward
    </RewardButton>
  );
}
```

## Troubleshooting

### Dynamic Wallet Connection Button Not Opening

If the "Dynamic Wallet Connection" button doesn't open the wallet selection modal:

1. **Check Reown Project ID**: Ensure `VITE_REOWN_PROJECT_ID` is set in your `.env` file
2. **Get Project ID**: Visit [https://cloud.reown.com/](https://cloud.reown.com/) to create a project and get your Project ID
3. **Restart Development Server**: After updating the `.env` file, restart your development server with `npm run dev`

### Common Issues

- **Empty Project ID**: The placeholder `your-project-id-here` won't work - you need a real Project ID
- **Missing .env file**: Make sure the `.env` file exists in the `examples/` directory
- **Cached Build**: Clear your browser cache and restart the development server

## Testing

For testing purposes, you can use:
- **Testnet**: Use a testnet like Sepolia or Goerli
- **Local Network**: Use Hardhat or Ganache for local development
- **Mock Tokens**: Deploy test ERC20 tokens for testing

Make sure to use testnet tokens and never use real funds during development. 