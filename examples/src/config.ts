// Configuration for the reward system
// This file reads from environment variables for the sender wallet

// Debug: Log environment variables
console.log('🔍 Environment Variables Check:');
console.log('VITE_SENDER_ADDRESS:', import.meta.env.VITE_SENDER_ADDRESS || process.env.VITE_SENDER_ADDRESS || 'Not Set');
console.log('VITE_SENDER_PRIVATE_KEY:', import.meta.env.VITE_SENDER_PRIVATE_KEY ? '[HIDDEN]' : (process.env.VITE_SENDER_PRIVATE_KEY ? '[HIDDEN]' : 'Not Set'));
console.log('VITE_TOKEN_CONTRACT_ADDRESS:', import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS || process.env.VITE_TOKEN_CONTRACT_ADDRESS || 'Not Set');
console.log('VITE_RPC_URL:', import.meta.env.VITE_RPC_URL || process.env.VITE_RPC_URL || 'Not Set');
console.log('VITE_REOWN_PROJECT_ID:', import.meta.env.VITE_REOWN_PROJECT_ID || process.env.VITE_REOWN_PROJECT_ID || 'Not Set');
console.log('VITE_NETWORK:', import.meta.env.VITE_NETWORK || process.env.VITE_NETWORK || 'Not Set');

// Helper function to get required env var with fallback for deployment
const getRequiredEnvVar = (name: string): string => {
  // Try import.meta.env first (for local development)
  let value = import.meta.env[name];
  
  // Fallback to process.env for deployment scenarios (like fly.io)
  if (!value && typeof process !== 'undefined' && process.env) {
    value = process.env[name];
  }
  
  if (!value) {
    console.error(`❌ Required environment variable ${name} is not set!`);
    console.error('Make sure to set it in your .env file or deployment environment.');
    throw new Error(`Required environment variable ${name} is not set! Check your .env file or deployment environment.`);
  }
  return value;
};

export const rewardConfig = {
  // Sender wallet (holds the reward tokens)
  // ALL values must be provided via environment variables
  senderAddress: getRequiredEnvVar('VITE_SENDER_ADDRESS'),
  senderPrivateKey: getRequiredEnvVar('VITE_SENDER_PRIVATE_KEY'),
  
  // Token contract address (ERC20 token to transfer)
  tokenAddress: getRequiredEnvVar('VITE_TOKEN_CONTRACT_ADDRESS'),
  
  // Network configuration
  network: getRequiredEnvVar('VITE_NETWORK'),
  rpcUrl: getRequiredEnvVar('VITE_RPC_URL'),
  
  // Reown Project ID
  reownProjectId: getRequiredEnvVar('VITE_REOWN_PROJECT_ID'),
};

// Environment variables setup instructions:
// Create a .env file in the examples directory with:
// VITE_SENDER_ADDRESS=0x...
// VITE_SENDER_PRIVATE_KEY=0x...
// VITE_TOKEN_CONTRACT_ADDRESS=0x... (token address for your chosen network)
// VITE_NETWORK=mainnet (options: mainnet, sepolia, testnet, polygon, mumbai, polygon-testnet)
// VITE_RPC_URL=https://mainnet.infura.io/v3/your-key (RPC URL for your chosen network)
// VITE_REOWN_PROJECT_ID=your-project-id
//
// Network Examples:
// For Ethereum Mainnet:
//   VITE_NETWORK=mainnet
//   VITE_RPC_URL=https://mainnet.infura.io/v3/your-key
//   VITE_TOKEN_CONTRACT_ADDRESS=0xA0b86a33E6441E95b4df2E8FAb4B6CbF6F77eB4D (example)
//
// For Ethereum Sepolia Testnet:
//   VITE_NETWORK=sepolia
//   VITE_RPC_URL=https://sepolia.infura.io/v3/your-key
//   VITE_TOKEN_CONTRACT_ADDRESS=0x... (testnet token address)
//
// For Polygon Mainnet:
//   VITE_NETWORK=polygon
//   VITE_RPC_URL=https://polygon-rpc.com
//   VITE_TOKEN_CONTRACT_ADDRESS=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174 (CRT on Polygon)
//
// For Polygon Mumbai Testnet:
//   VITE_NETWORK=mumbai
//   VITE_RPC_URL=https://rpc-mumbai.maticvigil.com
//   VITE_TOKEN_CONTRACT_ADDRESS=0x... (Mumbai testnet token address)

export default rewardConfig; 