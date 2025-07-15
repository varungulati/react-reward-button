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
  senderAddress,
  senderPrivateKey,
  rpcUrl,
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

  const [pendingReward, setPendingReward] = useState(false);

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
  // Priority: 1. Connected wallet address, 2. Provided recipientAddress
  // No fallback address - will throw error if neither is available
  const targetAddress = isRewardMode ? (
    address ||           // Use connected wallet address first
    recipientAddress     // Then use provided recipient address
  ) : undefined;

  // Debug logging for recipient address selection
  useEffect(() => {
    if (isRewardMode) {
      console.log('🎯 Recipient Address Selection:');
      console.log('  Connected wallet address:', address);
      console.log('  Provided recipientAddress prop:', recipientAddress);
      console.log('  Final target address:', targetAddress);
      console.log('  Using connected wallet:', address ? '✅ YES' : '❌ NO');
    }
  }, [address, recipientAddress, targetAddress, isRewardMode]);

  // Show warning if no wallet connected and no recipient address provided
  const needsWalletConnection = isRewardMode && !address && !recipientAddress && requireConnection;

  // Effect to handle wallet connection and auto-proceed with reward claim
  useEffect(() => {
    if (pendingReward && isWalletConnected && address && isRewardMode) {
      console.log('Wallet connected! Auto-proceeding with reward claim...');
      setPendingReward(false);
      // Small delay to let the UI update
      setTimeout(() => {
        handleClaimReward();
      }, 500);
    }
  }, [isWalletConnected, address, pendingReward, isRewardMode]);

  // Contract write hook for executing the transaction (only if in reward mode)
  const { writeContract: executeTransfer, isPending: isTransactionLoading } = useWriteContract({
    mutation: {
      onSuccess: (data: any) => {
        console.log('Transaction successful:', data);
        setState(prev => ({ ...prev, isLoading: false, error: null }));
        onRewardClaimed?.(data, rewardAmount || '0');
      },
      onError: (error: any) => {
        console.error('Transaction failed:', error);
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
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      onRewardStarted?.();

      // Step 1: Check wallet connection and prompt if needed
      if (requireConnection && !isWalletConnected) {
        console.log('Wallet not connected. Opening connection modal...');
        setPendingReward(true);
        setState(prev => ({ ...prev, isLoading: false }));
        // Open Reown AppKit wallet selection modal
        openAppKit();
        return;
      }

      // Step 2: Determine recipient address (connected wallet takes priority)
      const finalRecipientAddress = address || recipientAddress;
      
      console.log('🚀 Final Recipient Address Determination:');
      console.log('  Connected wallet address:', address);
      console.log('  Provided recipientAddress:', recipientAddress);
      console.log('  Final recipient address:', finalRecipientAddress);
      console.log('  Address source:', address ? 'Connected Wallet' : 'Provided Prop');
      
      // Step 3: Validate recipient address is available
      if (isRewardMode && !finalRecipientAddress) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No recipient address available. Please connect your wallet or provide a recipientAddress prop.',
        }));
        onRewardFailed?.(new Error('No recipient address available'));
        return;
      }

      // Step 4: Validate required parameters for token transfer
      if (!tokenAddress || !rewardAmount) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Missing token address or reward amount',
        }));
        onRewardFailed?.(new Error('Missing token address or reward amount'));
        return;
      }

      console.log('Initiating token transfer...', {
        tokenAddress,
        recipientAddress: finalRecipientAddress,
        amount: rewardAmount,
        senderAddress: senderAddress || address,
        tokenSymbol,
        usingSenderWallet: Boolean(senderAddress && senderPrivateKey),
      });

      // Step 5: Execute token transfer
      if (senderAddress && senderPrivateKey && finalRecipientAddress) {
        // Use sender wallet for token transfer
        console.log('Using sender wallet for token transfer...');
        await executeTokenTransferWithSenderWallet(
          tokenAddress,
          finalRecipientAddress,
          rewardAmount,
          senderPrivateKey,
          rpcUrl || 'https://mainnet.infura.io/v3/your-infura-key'
        );
      } else if (executeTransfer && finalRecipientAddress && tokenAddress && rewardAmount) {
        // Use connected wallet for token transfer (fallback)
        console.log('Using connected wallet for token transfer...');
        executeTransfer({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [finalRecipientAddress as `0x${string}`, BigInt(rewardAmount)],
        });
      } else {
        // Simulate a transaction for demo purposes
        console.log('Simulating token transfer for demo...');
        setTimeout(() => {
          const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
          console.log('Simulated transaction completed:', mockTxHash);
          setState(prev => ({ ...prev, isLoading: false, error: null }));
          onRewardClaimed?.(mockTxHash, rewardAmount || '0');
        }, 2000);
      }

    } catch (error) {
      console.error('Error in handleClaimReward:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      onRewardFailed?.(error instanceof Error ? error : new Error(errorMessage));
    }
  };

  // Function to execute token transfer using sender wallet
  const executeTokenTransferWithSenderWallet = async (
    tokenAddress: string,
    recipientAddress: string,
    amount: string,
    privateKey: string,
    rpcUrl: string
  ) => {
    try {
      // Create provider and wallet
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const wallet = new ethers.Wallet(privateKey, provider);

      // Create contract instance
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

      console.log('Executing token transfer from sender wallet:', {
        from: wallet.address,
        to: recipientAddress,
        amount: amount,
        tokenAddress: tokenAddress,
      });

      // Execute the transfer
      const tx = await contract.transfer(recipientAddress, BigInt(amount));
      console.log('Transaction submitted:', tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.transactionHash);

      setState(prev => ({ ...prev, isLoading: false, error: null }));
      onRewardClaimed?.(receipt.transactionHash, amount);

    } catch (error) {
      console.error('Error in sender wallet transfer:', error);
      throw error;
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

  const isButtonLoading = isRewardMode ? (state.isLoading || isTransactionLoading || pendingReward) : false;
  const isButtonDisabled = disabled || (isButtonLoading && !pendingReward);

  // Dynamic loading text based on current state
  const getLoadingText = () => {
    if (pendingReward) {
      return 'Connect Wallet...';
    }
    if (isTransactionLoading) {
      return 'Confirming Transaction...';
    }
    if (state.isLoading) {
      return 'Processing...';
    }
    return loadingText;
  };

  // Dynamic button text based on state
  const getButtonText = () => {
    if (pendingReward) {
      return 'Connect Wallet...';
    }
    if (isTransactionLoading) {
      return 'Confirming...';
    }
    if (state.isLoading) {
      return 'Processing...';
    }
    return children;
  };

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
        {getButtonText()}
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
      {getButtonText()}
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
        {(isButtonLoading && !pendingReward) ? getLoadingText() : shineOverlay}
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