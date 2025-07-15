import React, { useState, useEffect } from 'react';
import { AwesomeButton } from 'react-awesome-button';
import { useAccount, useConnect, useWriteContract } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { ethers } from 'ethers';
import { RewardButtonProps, RewardButtonState, TokenInfo } from './types';
import { ERC20_ABI } from './constants';

const RewardButton: React.FC<RewardButtonProps> = ({
  tokenAddress,
  rewardAmount,
  recipientAddress,
  children = 'Button',
  className = '',
  style = {},
  onPress,
  onRewardClaimed,
  onRewardFailed,
  onRewardStarted,
  disabled = false,
  loadingText = 'Loading...',
  showRewardAmount = true,
  tokenSymbol = 'TOKEN',
  requireConnection = true,
  useWeb3Modal = false, // Deprecated but kept for backwards compatibility
  type = 'primary',
  size = 'medium',
  ripple = false,
  ...awesomeButtonProps
}) => {
  const [state, setState] = useState<RewardButtonState>({
    isLoading: false,
    error: null,
    tokenInfo: null,
  });

  // Determine if this is a reward button or regular button
  const isRewardMode = Boolean(tokenAddress && rewardAmount);

  // Only use wagmi hooks if in reward mode
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  // Reown AppKit for wallet selection modal
  const { open: openAppKit } = useAppKit();

  // Check if connected
  const isWalletConnected = isConnected;

  // Determine the target address for the reward (only relevant in reward mode)
  const targetAddress = isRewardMode ? (recipientAddress || address || '0x742d35Cc6634C0532925a3b8D25c8c5c8A2B9E6D') : undefined;

  // Contract write hook for executing the transaction (only if in reward mode)
  const { writeContract: executeTransfer, isPending: isTransactionLoading } = useWriteContract({
    mutation: {
      onSuccess: (data: any) => {
        setState(prev => ({ ...prev, isLoading: false, error: null }));
        onRewardClaimed?.(data, rewardAmount || '0');
      },
      onError: (error: any) => {
        setState(prev => ({ ...prev, isLoading: false, error: error.message }));
        onRewardFailed?.(error);
      },
    },
  });

  // Fetch token information (only if in reward mode)
  useEffect(() => {
    if (!isRewardMode) return;

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
  }, [tokenAddress, tokenSymbol, isRewardMode]);

  const handleClaimReward = async () => {
    try {
      if (requireConnection && !isWalletConnected) {
        // Open Reown AppKit wallet selection modal
        openAppKit();
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));
      onRewardStarted?.();

      // Handle token transfer using wagmi
      if (executeTransfer && targetAddress && tokenAddress && rewardAmount) {
        executeTransfer({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [targetAddress as `0x${string}`, BigInt(rewardAmount)],
        });
      } else {
        // Simulate a transaction for demo purposes
        setTimeout(() => {
          const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
          setState(prev => ({ ...prev, isLoading: false, error: null }));
          onRewardClaimed?.(mockTxHash, rewardAmount || '0');
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

  const handleButtonPress = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isRewardMode) {
      handleClaimReward();
    } else {
      // Regular button mode - call the onPress handler
      onPress?.(event);
    }
  };

  const formatAmount = (amount: string, decimals: number = 18): string => {
    try {
      return ethers.formatUnits(amount, decimals);
    } catch {
      return '0';
    }
  };

  const isButtonLoading = isRewardMode ? (state.isLoading || isTransactionLoading) : false;
  const isButtonDisabled = disabled || isButtonLoading;

  // Only add minimal positioning for shine effect if in reward mode
  const rewardButtonStyle: React.CSSProperties = isRewardMode ? {
    position: 'relative',
    overflow: 'hidden',
    // Text visibility and sizing improvements
    minWidth: 'fit-content',
    width: 'auto',
    height: 'auto',
    minHeight: 'fit-content',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: '1.2',
    ...style,
  } : {
    // Regular button mode - still ensure text visibility
    minWidth: 'fit-content',
    width: 'auto',
    height: 'auto',
    minHeight: 'fit-content',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: '1.2',
    ...style,
  };

  // Shine effect styles (only applied in reward mode)
  const shineOverlay = isRewardMode ? (
    <>
      <style>
        {`
          @keyframes rewardButtonShine {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          .reward-button-shine::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.4), transparent);
            pointer-events: none;
            animation: ${isButtonDisabled ? 'none' : 'rewardButtonShine 3s infinite'};
            z-index: 1;
          }
          .reward-button-shine:hover::before {
            animation: ${isButtonDisabled ? 'none' : 'rewardButtonShine 1.5s infinite'};
          }
          /* Ensure AwesomeButton respects text sizing */
          .reward-button-shine,
          .reward-button-shine > *,
          .reward-button-shine button {
            min-width: fit-content !important;
            width: auto !important;
            height: auto !important;
            min-height: fit-content !important;
            max-width: none !important;
            overflow: visible !important;
          }
          .reward-button-shine .aws-btn,
          .reward-button-shine .aws-btn > *,
          .reward-button-shine .aws-btn button {
            min-width: fit-content !important;
            width: auto !important;
            height: auto !important;
            min-height: fit-content !important;
            max-width: none !important;
            overflow: visible !important;
            white-space: nowrap !important;
            text-overflow: ellipsis !important;
            padding: 8px 16px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        `}
      </style>
      <span style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </span>
    </>
  ) : (
    <>
      <style>
        {`
          /* Ensure AwesomeButton respects text sizing for regular buttons */
          .aws-btn,
          .aws-btn > *,
          .aws-btn button {
            min-width: fit-content !important;
            width: auto !important;
            height: auto !important;
            min-height: fit-content !important;
            max-width: none !important;
            overflow: visible !important;
            white-space: nowrap !important;
            text-overflow: ellipsis !important;
            padding: 8px 16px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        `}
      </style>
      {children}
    </>
  );

  // Create safe props object for AwesomeButton
  const safeAwesomeButtonProps = {
    type: type,
    size: size,
    className: `${isRewardMode ? 'reward-button-shine' : ''} ${className}`,
    style: rewardButtonStyle,
    onPress: handleButtonPress,
    disabled: isButtonDisabled,
    ripple: ripple,
    // Pass through all safe AwesomeButton props
    href: awesomeButtonProps.href,
    target: awesomeButtonProps.target,
    visible: awesomeButtonProps.visible,
    placeholder: awesomeButtonProps.placeholder,
    before: awesomeButtonProps.before,
    after: awesomeButtonProps.after,
    active: awesomeButtonProps.active,
    // Additional AwesomeButton properties (type-safe)
    containerProps: awesomeButtonProps.containerProps,
    cssModule: awesomeButtonProps.cssModule,
  };

  return (
    <>
      <AwesomeButton {...safeAwesomeButtonProps}>
        {isButtonLoading ? loadingText : shineOverlay}
      </AwesomeButton>
      
      {isRewardMode && state.error && (
        <div style={{ 
          fontSize: '12px', 
          color: '#ef4444', 
          marginTop: '8px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          borderRadius: '4px',
          padding: '6px 8px',
        }}>
          {state.error}
        </div>
      )}

    </>
  );
};

export default RewardButton;