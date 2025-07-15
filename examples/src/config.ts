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
console.log('REACT_APP_REOWN_NETWORK:', process.env.REACT_APP_NETWORK);

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
// REACT_APP_NETWORK=mainnet
// REACT_APP_RPC_URL=https://mainnet.infura.io/v3/your-key
// REACT_APP_REOWN_PROJECT_ID=your-project-id

export default rewardConfig; 