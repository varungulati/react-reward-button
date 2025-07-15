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
  // Default awesome-button styling that matches the awesome-buttons page
  type = 'primary',
  size = 'medium',
  ripple = true,
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

  // Check if connected - more robust validation
  const isWalletConnected = isConnected && address;

  // Determine the target address for the reward (only relevant in reward mode)
  // Priority: 1. Connected wallet address (if truly connected), 2. Provided recipientAddress
  // No fallback address - will throw error if neither is available
  const targetAddress = isRewardMode ? (
    (isWalletConnected ? address : null) ||  // Use connected wallet address first only if truly connected
    recipientAddress     // Then use provided recipient address
  ) : undefined;

  // Debug logging for recipient address selection
  useEffect(() => {
    if (isRewardMode) {
      console.log('🎯 Recipient Address Selection:');
      console.log('  isConnected:', isConnected);
      console.log('  Connected wallet address:', address);
      console.log('  Wallet truly connected:', isWalletConnected);
      console.log('  Provided recipientAddress prop:', recipientAddress);
      console.log('  Final target address:', targetAddress);
      console.log('  Using connected wallet:', isWalletConnected ? '✅ YES' : '❌ NO');
    }
  }, [isConnected, address, recipientAddress, targetAddress, isRewardMode, isWalletConnected]);

  // Show warning if no wallet connected and no recipient address provided
  const needsWalletConnection = isRewardMode && !isWalletConnected && !recipientAddress && requireConnection;

  // Effect to handle wallet connection and auto-proceed with reward claim
  useEffect(() => {
    // More robust check for wallet connection
    const isCurrentlyConnected = isConnected && address;
    
    if (pendingReward && isCurrentlyConnected && isRewardMode) {
      console.log('Wallet connected! Auto-proceeding with reward claim...');
      setPendingReward(false);
      // Small delay to let the UI update
      setTimeout(() => {
        handleClaimReward();
      }, 500);
    }
  }, [isConnected, address, pendingReward, isRewardMode]);

  // Effect to clear pending reward if wallet gets disconnected
  useEffect(() => {
    const isCurrentlyConnected = isConnected && address;
    
    if (pendingReward && !isCurrentlyConnected && isRewardMode) {
      console.log('Wallet disconnected while pending reward. Clearing pending state...');
      setPendingReward(false);
    }
  }, [isConnected, address, pendingReward, isRewardMode]);

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

      // Step 1: Re-validate wallet connection state in real-time
      console.log('🔍 Checking current wallet connection state...');
      console.log('  isConnected:', isConnected);
      console.log('  address:', address);
      console.log('  requireConnection:', requireConnection);
      
      // More robust wallet connection check
      const isCurrentlyConnected = isConnected && address;
      
      if (requireConnection && !isCurrentlyConnected) {
        console.log('❌ Wallet not connected or locked. Opening connection modal...');
        setPendingReward(true);
        setState(prev => ({ ...prev, isLoading: false }));
        // Open Reown AppKit wallet selection modal
        openAppKit();
        return;
      }

      // Step 2: Determine recipient address (connected wallet takes priority)
      // Only use connected wallet address if wallet is actually connected
      const finalRecipientAddress = isCurrentlyConnected ? address : recipientAddress;
      
      console.log('🚀 Final Recipient Address Determination:');
      console.log('  Wallet currently connected:', isCurrentlyConnected);
      console.log('  Connected wallet address:', address);
      console.log('  Provided recipientAddress:', recipientAddress);
      console.log('  Final recipient address:', finalRecipientAddress);
      console.log('  Address source:', isCurrentlyConnected ? 'Connected Wallet' : 'Provided Prop');
      
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

      // Step 4: Additional validation for connected wallet mode
      if (requireConnection && !isCurrentlyConnected) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Wallet connection lost. Please reconnect your wallet.',
        }));
        onRewardFailed?.(new Error('Wallet connection lost'));
        return;
      }

      // Step 5: Validate required parameters for token transfer
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
        walletConnected: isCurrentlyConnected,
      });

      // Step 6: Execute token transfer
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
      } else if (executeTransfer && finalRecipientAddress && tokenAddress && rewardAmount && isCurrentlyConnected) {
        // Use connected wallet for token transfer (only if still connected)
        console.log('Using connected wallet for token transfer...');
        
        // Double-check wallet is still connected before executing
        if (!isCurrentlyConnected) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Wallet disconnected during transaction. Please reconnect.',
          }));
          onRewardFailed?.(new Error('Wallet disconnected during transaction'));
          return;
        }
        
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

  // Enhanced button styling for clean awesome-buttons look
  const rewardButtonStyle: React.CSSProperties = {
    // Base styling for clean appearance
    fontWeight: '500',
    letterSpacing: '0.025em',
    ...style,
  };

  // Enhanced button content with better spacing
  const buttonContent = getButtonText();

  // Create safe props object for AwesomeButton with enhanced defaults
  const safeAwesomeButtonProps = {
    type: type,
    size: size,
    className: `reward-button ${className}`,
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
        {(isButtonLoading && !pendingReward) ? getLoadingText() : buttonContent}
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