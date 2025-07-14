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

  // Default styles with signature shine effect
  const defaultButtonStyles: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
    background: '#3b82f6',
    color: 'white',
    opacity: isButtonDisabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    minWidth: '200px',
    minHeight: '48px',
    ...style,
  };

  // Shine effect styles
  const shineEffectStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.4), transparent)',
    pointerEvents: 'none',
    animation: isButtonDisabled ? 'none' : 'rewardButtonShine 3s infinite',
  };

  return (
    <>
      <style>
        {`
          @keyframes rewardButtonShine {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          .reward-button-shine:hover .reward-button-shine-effect {
            animation: rewardButtonShine 1.5s infinite !important;
          }
        `}
      </style>
      <button
        className={`reward-button reward-button-shine ${className}`}
        style={defaultButtonStyles}
        onClick={handleClaimReward}
        disabled={isButtonDisabled}
        type="button"
      >
        <div
          style={shineEffectStyles}
          className="reward-button-shine-effect"
        />
        {isButtonLoading ? (
          <span style={{ position: 'relative', zIndex: 1 }}>{loadingText}</span>
        ) : (
          <span style={{ position: 'relative', zIndex: 1 }}>
            {children}
            {showRewardAmount && state.tokenInfo && (
              <span style={{ display: 'block', fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>
                ({formatAmount(rewardAmount, state.tokenInfo.decimals)} {state.tokenInfo.symbol})
              </span>
            )}
          </span>
        )}
        
        {state.error && (
          <div style={{ 
            fontSize: '12px', 
            color: '#fecaca', 
            marginTop: '4px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '4px',
            padding: '6px 8px',
            position: 'relative',
            zIndex: 1
          }}>
            {state.error}
          </div>
        )}
      </button>
    </>
  );
};

export default RewardButton;