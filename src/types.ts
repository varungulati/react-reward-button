// Window interface extension for ethereum property
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export interface RewardButtonProps {
  /** The Ethereum address of the reward token contract */
  tokenAddress: string;
  /** The amount of tokens to reward (in wei or token units) */
  rewardAmount: string;
  /** The recipient address for the reward (if not provided, uses connected wallet) */
  recipientAddress?: string;
  /** Custom button text */
  children?: React.ReactNode;
  /** Custom CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** Callback function called when reward is successfully claimed */
  onRewardClaimed?: (txHash: string, amount: string) => void;
  /** Callback function called when reward claim fails */
  onRewardFailed?: (error: Error) => void;
  /** Callback function called when reward claim is initiated */
  onRewardStarted?: () => void;
  /** Whether the button should be disabled */
  disabled?: boolean;
  /** Custom loading text */
  loadingText?: string;
  /** Whether to show the reward amount on the button */
  showRewardAmount?: boolean;
  /** Custom token symbol to display (e.g., "USDC", "ETH") */
  tokenSymbol?: string;
  /** Whether to require wallet connection before claiming */
  requireConnection?: boolean;
}

export interface RewardButtonState {
  isLoading: boolean;
  error: string | null;
  tokenInfo: TokenInfo | null;
}

export interface TokenInfo {
  symbol: string;
  decimals: number;
  name: string;
} 