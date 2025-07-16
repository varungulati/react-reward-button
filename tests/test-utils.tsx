import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { ethers } from 'ethers';

// Mock implementations for wagmi hooks
export const mockUseAccount = useAccount as jest.MockedFunction<typeof useAccount>;
export const mockUseConnect = useConnect as jest.MockedFunction<typeof useConnect>;
export const mockUseWriteContract = useWriteContract as jest.MockedFunction<typeof useWriteContract>;
export const mockUseWaitForTransactionReceipt = useWaitForTransactionReceipt as jest.MockedFunction<typeof useWaitForTransactionReceipt>;
export const mockUseAppKit = useAppKit as jest.MockedFunction<typeof useAppKit>;

// Mock Ethereum provider
export const mockEthereum = {
  request: jest.fn(),
  isMetaMask: true,
  selectedAddress: '0x742d35Cc6634C0532925a3b8D0c0E2C48d152c2F',
  networkVersion: '1',
  chainId: '0x1',
  on: jest.fn(),
  removeListener: jest.fn(),
};

// Mock ethers components with error handling
export const mockEthersProvider = {
  getBalance: jest.fn().mockResolvedValue('1000000000000000000'),
  getTransactionCount: jest.fn().mockResolvedValue(1),
  estimateGas: jest.fn().mockResolvedValue(21000),
  sendTransaction: jest.fn().mockResolvedValue({
    hash: TEST_TX_HASH,
    wait: jest.fn().mockResolvedValue({
      status: 1,
      transactionHash: TEST_TX_HASH,
      blockNumber: 12345,
      gasUsed: '21000',
    }),
  }),
};

export const mockEthersContract = {
  transfer: jest.fn().mockResolvedValue({
    hash: TEST_TX_HASH,
    wait: jest.fn().mockResolvedValue({
      status: 1,
      transactionHash: TEST_TX_HASH,
      blockNumber: 12345,
      gasUsed: '21000',
    }),
  }),
  symbol: jest.fn().mockResolvedValue('TEST'),
  decimals: jest.fn().mockResolvedValue(18),
  name: jest.fn().mockResolvedValue('Test Token'),
  balanceOf: jest.fn().mockResolvedValue('1000000000000000000'),
  allowance: jest.fn().mockResolvedValue('1000000000000000000'),
  approve: jest.fn().mockResolvedValue({
    hash: TEST_TX_HASH,
    wait: jest.fn().mockResolvedValue({
      status: 1,
      transactionHash: TEST_TX_HASH,
      blockNumber: 12345,
      gasUsed: '21000',
    }),
  }),
  transferFrom: jest.fn().mockResolvedValue({
    hash: TEST_TX_HASH,
    wait: jest.fn().mockResolvedValue({
      status: 1,
      transactionHash: TEST_TX_HASH,
      blockNumber: 12345,
      gasUsed: '21000',
    }),
  }),
};

// Test addresses for consistent testing
export const TEST_ADDRESSES = {
  user: '0x742d35Cc6634C0532925a3b8D0c0E2C48d152c2F',
  sender: '0x987654321098765432109876543210987654321',
  token: '0x1234567890123456789012345678901234567890',
  recipient: '0x1111111111111111111111111111111111111111',
};

// Test amounts in wei
export const TEST_AMOUNTS = {
  oneEther: '1000000000000000000',
  oneUSDC: '1000000', // 1 USDC (6 decimals)
  oneDAI: '1000000000000000000', // 1 DAI (18 decimals)
};

// Mock transaction hash
export const TEST_TX_HASH = '0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

// Private keys are not used in tests - removed for security

// RPC URL not needed for user-pays-gas mode

// Default mock configurations
export const DEFAULT_ACCOUNT_MOCK = {
  address: TEST_ADDRESSES.user,
  isConnected: true,
  isConnecting: false,
  isDisconnected: false,
  isReconnecting: false,
  status: 'connected' as const,
};

export const DEFAULT_DISCONNECTED_ACCOUNT_MOCK = {
  address: undefined,
  isConnected: false,
  isConnecting: false,
  isDisconnected: true,
  isReconnecting: false,
  status: 'disconnected' as const,
};

export const DEFAULT_CONNECT_MOCK = {
  connect: jest.fn(),
  connectors: [],
  status: 'idle' as const,
};

export const DEFAULT_WRITE_CONTRACT_MOCK = {
  writeContract: jest.fn().mockImplementation(({ mutation }: any) => {
    if (mutation?.onSuccess) {
      // Call onSuccess immediately when writeContract is called
      setTimeout(() => mutation.onSuccess(TEST_TX_HASH), 0);
    }
    return Promise.resolve(TEST_TX_HASH);
  }),
  isPending: false,
  isError: false,
  error: null,
};

export const DEFAULT_WAIT_FOR_RECEIPT_MOCK = {
  data: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

export const DEFAULT_APPKIT_MOCK = {
  open: jest.fn(),
};

// Helper function to setup default mocks
export const setupDefaultMocks = () => {
  mockUseAccount.mockReturnValue(DEFAULT_ACCOUNT_MOCK as any);
  mockUseConnect.mockReturnValue(DEFAULT_CONNECT_MOCK as any);
  mockUseWriteContract.mockReturnValue(DEFAULT_WRITE_CONTRACT_MOCK as any);
  mockUseWaitForTransactionReceipt.mockReturnValue(DEFAULT_WAIT_FOR_RECEIPT_MOCK as any);
  mockUseAppKit.mockReturnValue(DEFAULT_APPKIT_MOCK as any);
  
  // Setup ethers mocks
  const ethers = require('ethers');
  ethers.ethers.JsonRpcProvider = jest.fn(() => mockEthersProvider);
  ethers.ethers.Wallet = jest.fn(() => ({
    connect: jest.fn(() => mockEthersProvider),
    address: TEST_ADDRESSES.sender,
  }));
  ethers.ethers.Contract = jest.fn(() => mockEthersContract);
  ethers.ethers.formatUnits = jest.fn((value: string, decimals: number = 18) => {
    return (parseFloat(value) / Math.pow(10, decimals)).toString();
  });
  ethers.ethers.parseUnits = jest.fn((value: string, decimals: number = 18) => {
    return (parseFloat(value) * Math.pow(10, decimals)).toString();
  });

  // Mock window.ethereum
  (window as any).ethereum = {
    ...mockEthereum,
    request: jest.fn().mockResolvedValue([TEST_ADDRESSES.user]),
  };
};

// Helper function to mock wallet disconnected state
export const mockWalletDisconnected = () => {
  mockUseAccount.mockReturnValue(DEFAULT_DISCONNECTED_ACCOUNT_MOCK as any);
  (window as any).ethereum = {
    ...mockEthereum,
    request: jest.fn().mockResolvedValue([]),
  };
};

// Helper function to mock wallet connected state
export const mockWalletConnected = (address: string = TEST_ADDRESSES.user) => {
  mockUseAccount.mockReturnValue({
    ...DEFAULT_ACCOUNT_MOCK,
    address,
  } as any);
  (window as any).ethereum = {
    ...mockEthereum,
    request: jest.fn().mockResolvedValue([address]),
  };
};

// Helper function to mock transaction loading state
export const mockTransactionLoading = () => {
  mockUseWriteContract.mockReturnValue({
    ...DEFAULT_WRITE_CONTRACT_MOCK,
    isPending: true,
  } as any);
};

// Helper function to mock transaction success
export const mockTransactionSuccess = (txHash: string = TEST_TX_HASH) => {
  mockUseWaitForTransactionReceipt.mockReturnValue({
    ...DEFAULT_WAIT_FOR_RECEIPT_MOCK,
    data: { transactionHash: txHash, status: 'success' },
    isLoading: false,
    isSuccess: true,
  } as any);
};

// Helper function to mock transaction error
export const mockTransactionError = (error: Error) => {
  const mockWriteContract = jest.fn().mockImplementation(({ mutation }: any) => {
    if (mutation?.onError) {
      // Call onError immediately when writeContract is called
      setTimeout(() => mutation.onError(error), 0);
    }
    return Promise.reject(error);
  });
  
  mockUseWriteContract.mockReturnValue({
    ...DEFAULT_WRITE_CONTRACT_MOCK,
    writeContract: mockWriteContract,
    isError: true,
    error,
  } as any);
};

// Helper function to mock confirmation loading
export const mockConfirmationLoading = () => {
  mockUseWaitForTransactionReceipt.mockReturnValue({
    ...DEFAULT_WAIT_FOR_RECEIPT_MOCK,
    isLoading: true,
  } as any);
};

// Helper function to mock confirmation error
export const mockConfirmationError = (error: Error) => {
  mockUseWaitForTransactionReceipt.mockReturnValue({
    ...DEFAULT_WAIT_FOR_RECEIPT_MOCK,
    isError: true,
    error,
  } as any);
};

// Helper function to mock ethers contract errors (for sender pays gas mode)
export const mockEthersContractError = (error: Error) => {
  mockEthersContract.transfer.mockRejectedValue(error);
  mockEthersContract.transferFrom.mockRejectedValue(error);
  mockEthersContract.approve.mockRejectedValue(error);
};

// Helper function to mock both wagmi and ethers errors
export const mockTransactionErrorBoth = (error: Error) => {
  mockTransactionError(error);
  mockEthersContractError(error);
};

// Helper function to create reward button props
export const createRewardButtonProps = (overrides: any = {}) => ({
  tokenAddress: TEST_ADDRESSES.token,
  rewardAmount: TEST_AMOUNTS.oneEther,
  userPaysGas: true, // Use user-pays-gas mode to avoid private key requirement
  tokenSymbol: 'TEST',
  children: 'Claim Reward',
  ...overrides,
});

// Helper function to create button props
export const createButtonProps = (overrides: any = {}) => ({
  children: 'Test Button',
  ...overrides,
});

// Custom render function with test providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialProps?: any;
}

export const customRender = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialProps, ...renderOptions } = options;

  // Reset mocks before each render
  jest.clearAllMocks();
  setupDefaultMocks();

  return render(ui, renderOptions);
};

// Helper function to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Helper function to simulate user interaction delay
export const simulateUserDelay = (ms: number = 100) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock event objects
export const createMockEvent = (type: string = 'click', target: any = {}) => ({
  type,
  target,
  currentTarget: target,
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  bubbles: true,
  cancelable: true,
});

// Helper to create mock token info
export const createMockTokenInfo = (overrides: any = {}) => ({
  symbol: 'TEST',
  decimals: 18,
  name: 'Test Token',
  ...overrides,
});

// Helper to create mock transaction receipt
export const createMockReceipt = (overrides: any = {}) => ({
  transactionHash: TEST_TX_HASH,
  status: 'success' as const,
  blockNumber: 12345,
  blockHash: '0xabcdef',
  gasUsed: '21000',
  ...overrides,
});

// Helper to create mock error
export const createMockError = (message: string = 'Test error') => new Error(message);

// Helper to assert wallet connection
export const assertWalletConnected = () => {
  expect(mockUseAccount().isConnected).toBe(true);
  expect(mockUseAccount().address).toBeDefined();
};

// Helper to assert wallet disconnected
export const assertWalletDisconnected = () => {
  expect(mockUseAccount().isConnected).toBe(false);
  expect(mockUseAccount().address).toBeUndefined();
};

// Helper to assert transaction called
export const assertTransactionCalled = (expectedParams: any) => {
  expect(mockUseWriteContract().writeContract).toHaveBeenCalledWith(expectedParams);
};

// Helper to assert callback called
export const assertCallbackCalled = (mockCallback: jest.Mock, expectedArgs?: any[]) => {
  expect(mockCallback).toHaveBeenCalled();
  if (expectedArgs) {
    expect(mockCallback).toHaveBeenCalledWith(...expectedArgs);
  }
};

// Re-export testing library utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event'; 