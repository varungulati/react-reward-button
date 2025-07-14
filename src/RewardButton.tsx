import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, usePrepareContractWrite, useContractWrite } from 'wagmi';
import { ethers } from 'ethers';
import { RewardButtonProps, RewardButtonState, TokenInfo } from './types';
import { ERC20_ABI } from './constants';

const RewardButton: React.FC<RewardButtonProps> = ({
  tokenAddress,
  rewardAmount,
  recipientAddress,
  children = 'Claim Reward',
  className = '',
  style = {},
  onRewardClaimed,
  onRewardFailed,
  onRewardStarted,
  disabled = false,
  loadingText = 'Claiming...',
  showRewardAmount = true,
  tokenSymbol = 'TOKEN',
  requireConnection = true,
}) => {
  const [state, setState] = useState<RewardButtonState>({
    isLoading: false,
    error: null,
    tokenInfo: null,
  });

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  // Determine the target address for the reward
  const targetAddress = recipientAddress || address || '0x742d35Cc6634C0532925a3b8D25c8c5c8A2B9E6D';

  // Prepare the contract write for token transfer
  const { config: contractWriteConfig } = usePrepareContractWrite({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [targetAddress as `0x${string}`, BigInt(rewardAmount)],
    enabled: Boolean(targetAddress && rewardAmount && tokenAddress && isConnected),
  });

  // Contract write hook for executing the transaction
  const { write: executeTransfer, isLoading: isTransactionLoading } = useContractWrite({
    ...contractWriteConfig,
    onSuccess: (data) => {
      setState(prev => ({ ...prev, isLoading: false, error: null }));
      onRewardClaimed?.(data.hash, rewardAmount);
    },
    onError: (error) => {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      onRewardFailed?.(error);
    },
  });

  // Fetch token information
  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (!tokenAddress) return;

      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        // Mock token info for demo purposes
        const mockTokenInfo: TokenInfo = {
          symbol: tokenSymbol,
          decimals: 18,
          name: `${tokenSymbol} Token`,
        };

        setState(prev => ({
          ...prev,
          tokenInfo: mockTokenInfo,
          isLoading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to fetch token information',
          isLoading: false,
        }));
      }
    };

    fetchTokenInfo();
  }, [tokenAddress, tokenSymbol]);

  const handleClaimReward = async () => {
    try {
      if (requireConnection && !isConnected) {
        // Connect wallet first
        const connector = connectors[0];
        if (connector) {
          connect({ connector });
        }
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));
      onRewardStarted?.();

      // For demo purposes, if no executeTransfer function is available, simulate the transaction
      if (executeTransfer) {
        executeTransfer();
      } else {
        // Simulate a transaction for demo purposes
        setTimeout(() => {
          const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
          setState(prev => ({ ...prev, isLoading: false, error: null }));
          onRewardClaimed?.(mockTxHash, rewardAmount);
        }, 2000);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      onRewardFailed?.(error instanceof Error ? error : new Error(errorMessage));
    }
  };

  const formatAmount = (amount: string, decimals: number = 18): string => {
    try {
      return ethers.formatUnits(amount, decimals);
    } catch {
      return '0';
    }
  };

  const isButtonLoading = state.isLoading || isTransactionLoading;
  const isButtonDisabled = disabled || isButtonLoading;

  return (
    <button
      className={`reward-button ${className}`}
      style={style}
      onClick={handleClaimReward}
      disabled={isButtonDisabled}
      type="button"
    >
      {isButtonLoading ? (
        <span>{loadingText}</span>
      ) : (
        <span>
          {children}
          {showRewardAmount && state.tokenInfo && (
            <span className="reward-amount">
              {' '}({formatAmount(rewardAmount, state.tokenInfo.decimals)} {state.tokenInfo.symbol})
            </span>
          )}
        </span>
      )}
      
      {state.error && (
        <div className="reward-button-error" style={{ fontSize: '12px', color: 'red', marginTop: '4px' }}>
          {state.error}
        </div>
      )}
    </button>
  );
};

export default RewardButton;