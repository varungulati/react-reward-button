import React from 'react';
import { ButtonProps } from './Button';

// Web3 related types
export interface TokenInfo {
  symbol: string;
  decimals: number;
  name: string;
}

export interface RewardButtonState {
  isLoading: boolean;
  error: string | null;
  tokenInfo: TokenInfo | null;
}

// Enhanced RewardButton component props with Web3 functionality
export interface RewardButtonProps extends Omit<ButtonProps, 'onClick' | 'isLoading'> {
  /** The Ethereum address of the reward token contract (optional - if not provided, behaves as regular button) */
  tokenAddress?: string;
  /** The amount of tokens to reward (in wei or token units) (optional - if not provided, behaves as regular button) */
  rewardAmount?: string;
  /** 
   * The recipient address for the reward (optional)
   * Priority: 1. Connected wallet address, 2. This recipientAddress prop
   * If neither is provided, the reward claim will fail with an error
   * No fallback address is used for security reasons
   */
  recipientAddress?: string;
  /** The sender wallet address that holds the reward tokens */
  senderAddress?: string;
  /** The private key of the sender wallet (for signing transactions) */
  senderPrivateKey?: string;
  /** RPC URL for the network (optional - uses default if not provided) */
  rpcUrl?: string;
  /** 
   * Callback function called when the reward button is clicked (for non-Web3 mode)
   * If tokenAddress and rewardAmount are provided, this is ignored in favor of Web3 functionality
   */
  onReward?: () => void | Promise<void>;
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
  /** 
   * Whether the user (receiver) pays gas fees instead of sender
   * - true: Connected wallet pays gas fees (transferFrom pattern)
   * - false: Sender wallet pays gas fees (transfer pattern - default)
   */
  userPaysGas?: boolean;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** 
   * Content to display inside the button
   * @default "Claim Reward"
   */
  children?: React.ReactNode;
}

// Re-export types from component files
export type { ButtonProps } from './Button'; 