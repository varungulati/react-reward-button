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

// Types for AwesomeButton compatibility
export interface AwesomeButtonProps {
  type?: string;
  size?: string;
  disabled?: boolean;
  visible?: boolean;
  ripple?: boolean;
  placeholder?: boolean;
  onPress?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onPressed?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onReleased?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  containerProps?: Record<string, unknown>;
  cssModule?: Record<string, string>;
  target?: string;
  before?: React.ReactNode;
  after?: React.ReactNode;
  active?: boolean;
  children?: React.ReactNode;
}

export interface RewardButtonProps extends AwesomeButtonProps {
  /** The Ethereum address of the reward token contract (optional - if not provided, behaves as regular button) */
  tokenAddress?: string;
  /** The amount of tokens to reward (in wei or token units) (optional - if not provided, behaves as regular button) */
  rewardAmount?: string;
  /** The recipient address for the reward (if not provided, uses connected wallet) */
  recipientAddress?: string;
  /** Callback function called when reward is successfully claimed */
  onRewardClaimed?: (txHash: string, amount: string) => void;
  /** Callback function called when reward claim fails */
  onRewardFailed?: (error: Error) => void;
  /** Callback function called when reward claim is initiated */
  onRewardStarted?: () => void;
  /** Whether to show the reward amount on the button */
  showRewardAmount?: boolean;
  /** Custom token symbol to display (e.g., "USDC", "ETH") */
  tokenSymbol?: string;
  /** Whether to require wallet connection before claiming */
  requireConnection?: boolean;
  /** Custom loading text for reward operations */
  loadingText?: string;
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