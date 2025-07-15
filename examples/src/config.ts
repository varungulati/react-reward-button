// Configuration for the reward system
// This file reads from environment variables for the sender wallet

// Debug: Log ALL environment variables
console.log('🔍 Environment Variables Check:');
console.log('All process.env:', process.env);
console.log('REACT_APP_SENDER_ADDRESS:', process.env.REACT_APP_SENDER_ADDRESS);
console.log('REACT_APP_SENDER_PRIVATE_KEY:', process.env.REACT_APP_SENDER_PRIVATE_KEY ? '[HIDDEN]' : 'undefined');
console.log('REACT_APP_TOKEN_CONTRACT_ADDRESS:', process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS);
console.log('REACT_APP_RPC_URL:', process.env.REACT_APP_RPC_URL);
console.log('REACT_APP_REOWN_PROJECT_ID:', process.env.REACT_APP_REOWN_PROJECT_ID);
console.log('REACT_APP_NETWORK:', process.env.REACT_APP_NETWORK);

// Helper function to get required env var
const getRequiredEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set! Check your .env file.`);
  }
  return value;
};

export const rewardConfig = {
  // Sender wallet (holds the reward tokens)
  // ALL values must be provided via environment variables
  senderAddress: getRequiredEnvVar('REACT_APP_SENDER_ADDRESS'),
  senderPrivateKey: getRequiredEnvVar('REACT_APP_SENDER_PRIVATE_KEY'),
  
  // Token contract address (ERC20 token to transfer)
  tokenAddress: getRequiredEnvVar('REACT_APP_TOKEN_CONTRACT_ADDRESS'),
  
  // Network configuration
  network: getRequiredEnvVar('REACT_APP_NETWORK'),
  rpcUrl: getRequiredEnvVar('REACT_APP_RPC_URL'),
  
  // Reown Project ID
  reownProjectId: getRequiredEnvVar('REACT_APP_REOWN_PROJECT_ID'),
};

// Environment variables setup instructions:
// Create a .env file in the examples directory with:
// REACT_APP_SENDER_ADDRESS=0x...
// REACT_APP_SENDER_PRIVATE_KEY=0x...
// REACT_APP_TOKEN_CONTRACT_ADDRESS=0x... (token address for your chosen network)
// REACT_APP_NETWORK=mainnet (options: mainnet, sepolia, testnet, polygon, mumbai, polygon-testnet)
// REACT_APP_RPC_URL=https://mainnet.infura.io/v3/your-key (RPC URL for your chosen network)
// REACT_APP_REOWN_PROJECT_ID=your-project-id
//
// Network Examples:
// For Ethereum Mainnet:
//   REACT_APP_NETWORK=mainnet
//   REACT_APP_RPC_URL=https://mainnet.infura.io/v3/your-key
//   REACT_APP_TOKEN_CONTRACT_ADDRESS=0xA0b86a33E6441E95b4df2E8FAb4B6CbF6F77eB4D (example)
//
// For Ethereum Sepolia Testnet:
//   REACT_APP_NETWORK=sepolia
//   REACT_APP_RPC_URL=https://sepolia.infura.io/v3/your-key
//   REACT_APP_TOKEN_CONTRACT_ADDRESS=0x... (testnet token address)
//
// For Polygon Mainnet:
//   REACT_APP_NETWORK=polygon
//   REACT_APP_RPC_URL=https://polygon-rpc.com
//   REACT_APP_TOKEN_CONTRACT_ADDRESS=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174 (USDC on Polygon)
//
// For Polygon Mumbai Testnet:
//   REACT_APP_NETWORK=mumbai
//   REACT_APP_RPC_URL=https://rpc-mumbai.maticvigil.com
//   REACT_APP_TOKEN_CONTRACT_ADDRESS=0x... (Mumbai testnet token address)

export default rewardConfig; 