import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock window.ethereum for Web3 tests
const mockEthereum = {
  request: jest.fn(),
  isMetaMask: true,
  selectedAddress: '0x742d35Cc6634C0532925a3b8D0c0E2C48d152c2F',
  networkVersion: '1',
  chainId: '0x1',
  on: jest.fn(),
  removeListener: jest.fn(),
};

Object.defineProperty(window, 'ethereum', {
  value: mockEthereum,
  writable: true,
});

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useConnect: jest.fn(),
  useWriteContract: jest.fn(),
  useWaitForTransactionReceipt: jest.fn(),
  useConfig: jest.fn(),
}));

// Mock @reown/appkit
jest.mock('@reown/appkit/react', () => ({
  useAppKit: jest.fn(),
}));

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    JsonRpcProvider: jest.fn(),
    Wallet: jest.fn(),
    Contract: jest.fn(),
    formatUnits: jest.fn(),
    parseUnits: jest.fn(),
  },
}));

// Mock CSS imports
jest.mock('../src/styles.css', () => ({}));

// Global test utilities
global.mockEthereum = mockEthereum;

// Suppress console.log during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   error: jest.fn(),
//   warn: jest.fn(),
// }; 