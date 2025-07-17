// Configuration for the reward system
// This file reads from environment variables for the sender wallet

// Debug: Log environment variables
console.log('🔍 Environment Variables Check:');
console.log('VITE_SENDER_ADDRESS:', import.meta.env.VITE_SENDER_ADDRESS);
console.log('VITE_SENDER_PRIVATE_KEY:', import.meta.env.VITE_SENDER_PRIVATE_KEY ? '[HIDDEN]' : 'undefined');
console.log('VITE_TOKEN_CONTRACT_ADDRESS:', import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS);
console.log('VITE_RPC_URL:', import.meta.env.VITE_RPC_URL);
console.log('VITE_REOWN_PROJECT_ID:', import.meta.env.VITE_REOWN_PROJECT_ID);
console.log('VITE_NETWORK:', import.meta.env.VITE_NETWORK);

// Helper function to get required env var
const getRequiredEnvVar = (name: string): string => {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set! Check your .env file.`);
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