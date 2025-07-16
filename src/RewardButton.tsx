import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useWriteContract } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { ethers } from 'ethers';
import { Button } from './Button';
import { RewardButtonProps, RewardButtonState, TokenInfo } from './types';
import { ERC20_ABI } from './constants';

const RewardButton: React.FC<RewardButtonProps> = ({
  tokenAddress,
  rewardAmount,
  recipientAddress,
  senderAddress,
  senderPrivateKey,
  rpcUrl,
  onReward,
  onRewardClaimed,
  onRewardFailed,
  onRewardStarted,
  showRewardAmount = true,
  tokenSymbol = 'TOKEN',
  requireConnection = true,
  loadingText = 'Loading...',
  userPaysGas = false, // false means sender pays gas (default)
  isLoading: externalIsLoading = false,
  children = 'Claim Reward',
  variant = 'default',
  size = 'default',
  disabled = false,
  ...buttonProps
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

  // For userPaysGas mode, always require wallet connection
  const effectiveRequireConnection = userPaysGas ? true : requireConnection;

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
      console.log('  userPaysGas:', userPaysGas);
      console.log('  isConnected:', isConnected);
      console.log('  Connected wallet address:', address);
      console.log('  Wallet truly connected:', isWalletConnected);
      console.log('  Provided recipientAddress prop:', recipientAddress);
      console.log('  Final target address:', targetAddress);
      console.log('  Using connected wallet:', isWalletConnected ? '✅ YES' : '❌ NO');
      console.log('  Effective require connection:', effectiveRequireConnection);
    }
  }, [isConnected, address, recipientAddress, targetAddress, isRewardMode, isWalletConnected, userPaysGas, effectiveRequireConnection]);

  // Show warning if no wallet connected and no recipient address provided
  const needsWalletConnection = isRewardMode && !isWalletConnected && !recipientAddress && effectiveRequireConnection;

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
        console.log('✅ Transaction successful:', data);
        setState(prev => ({ ...prev, isLoading: false, error: null }));
        onRewardClaimed?.(data, rewardAmount || '0');
      },
      onError: (error: any) => {
        console.error('❌ Transaction failed:', error);
        
        // Enhanced error handling for transferFrom failures
        let errorMessage = error.message || 'Transaction failed';
        
        if (userPaysGas && errorMessage.includes('insufficient allowance')) {
          errorMessage = 'Insufficient allowance: Sender must approve your wallet address to spend tokens. Ask the sender to call approve() first.';
        } else if (userPaysGas && errorMessage.includes('transfer amount exceeds allowance')) {
          errorMessage = 'Transfer amount exceeds allowance: The approved amount is less than the reward amount.';
        } else if (userPaysGas && (errorMessage.includes('ERC20:') || errorMessage.includes('allowance'))) {
          errorMessage = 'Approval required: For receiver-pays-gas mode, the sender must first approve your wallet address to spend tokens.';
        }
        
        setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
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

        console.log('📊 Token Info:', mockTokenInfo);

        setState(prev => ({
          ...prev,
          tokenInfo: mockTokenInfo,
          isLoading: false,
        }));
      } catch (error) {
        console.error('❌ Failed to fetch token info:', error);
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

      console.log('🚀 Starting reward claim process...');

      // Step 1: Re-validate wallet connection state in real-time
      console.log('🔍 Checking current wallet connection state...');
      console.log('  userPaysGas:', userPaysGas);
      console.log('  isConnected:', isConnected);
      console.log('  address:', address);
      console.log('  effectiveRequireConnection:', effectiveRequireConnection);
      
      // More robust wallet connection check
      const isCurrentlyConnected = isConnected && address;
      
      if (effectiveRequireConnection && !isCurrentlyConnected) {
        console.log('❌ Wallet not connected or locked. Opening connection modal...');
        setPendingReward(true);
        setState(prev => ({ ...prev, isLoading: false }));
        // Open Reown AppKit wallet selection modal
        openAppKit();
        return;
      }

      // Step 2: Determine recipient address based on payment mode
      let finalRecipientAddress: string | undefined;
      
      if (userPaysGas) {
        // User pays gas - recipient is always the connected wallet
        finalRecipientAddress = address;
        console.log('🔄 User Pays Gas Mode: Using connected wallet as recipient');
      } else {
        // Sender pays gas - use connected wallet first, then fallback to recipientAddress
        finalRecipientAddress = isCurrentlyConnected ? address : recipientAddress;
        console.log('💰 Sender Pays Gas Mode: Using connected wallet or provided recipient');
      }
      
      console.log('🚀 Final Recipient Address Determination:');
      console.log('  Payment mode:', userPaysGas ? 'User Pays Gas' : 'Sender Pays Gas');
      console.log('  Wallet currently connected:', isCurrentlyConnected);
      console.log('  Connected wallet address:', address);
      console.log('  Provided recipientAddress:', recipientAddress);
      console.log('  Final recipient address:', finalRecipientAddress);
      console.log('  Address source:', isCurrentlyConnected ? 'Connected Wallet' : 'Provided Prop');
      
      // Step 3: Validate recipient address is available
      if (isRewardMode && !finalRecipientAddress) {
        const errorMessage = userPaysGas 
          ? 'User pays gas mode requires wallet connection. Please connect your wallet.'
          : 'No recipient address available. Please connect your wallet or provide a recipientAddress prop.';
        
        console.error('❌ No recipient address:', errorMessage);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        onRewardFailed?.(new Error(errorMessage));
        return;
      }

      // Step 4: Additional validation for connected wallet mode
      if (effectiveRequireConnection && !isCurrentlyConnected) {
        const errorMessage = 'Wallet connection lost. Please reconnect your wallet.';
        console.error('❌ Wallet connection lost:', errorMessage);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        onRewardFailed?.(new Error('Wallet connection lost'));
        return;
      }

      // Step 5: Validate required parameters for token transfer
      if (!tokenAddress || !rewardAmount) {
        const errorMessage = 'Missing token address or reward amount';
        console.error('❌ Missing parameters:', errorMessage);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        onRewardFailed?.(new Error(errorMessage));
        return;
      }

      console.log('💫 Initiating token transfer...', {
        tokenAddress,
        recipientAddress: finalRecipientAddress,
        amount: rewardAmount,
        senderAddress: senderAddress || address,
        tokenSymbol,
        userPaysGas,
        usingSenderWallet: Boolean(senderAddress && senderPrivateKey),
        walletConnected: isCurrentlyConnected,
      });

      // Step 6: Execute token transfer based on payment mode
      if (userPaysGas) {
        // User pays gas - use transferFrom pattern
        console.log('🔄 User pays gas: Using transferFrom pattern...');
        
        if (!isCurrentlyConnected) {
          const errorMessage = 'Wallet connection required for user-pays-gas mode.';
          console.error('❌ Wallet required:', errorMessage);
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
          }));
          onRewardFailed?.(new Error('Wallet connection required'));
          return;
        }

        // Check if senderAddress is provided for transferFrom
        if (!senderAddress) {
          const errorMessage = 'Sender address required for user-pays-gas mode.';
          console.error('❌ Sender address required:', errorMessage);
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
          }));
          onRewardFailed?.(new Error('Sender address required'));
          return;
        }

        // Use connected wallet to execute transferFrom
        console.log('🔄 Executing transferFrom with connected wallet paying gas...');
        console.log('  From (sender):', senderAddress);
        console.log('  To (recipient):', finalRecipientAddress);
        console.log('  Amount:', rewardAmount);
        console.log('  Gas paid by:', address);
        
        executeTransfer({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'transferFrom',
          args: [
            senderAddress as `0x${string}`,      // From: sender wallet
            finalRecipientAddress as `0x${string}`, // To: recipient (connected wallet)
            BigInt(rewardAmount)                  // Amount
          ],
        });
      } else {
        // Sender pays gas - use original logic
        if (senderAddress && senderPrivateKey && finalRecipientAddress) {
          // Use sender wallet for token transfer
          console.log('💰 Sender pays gas: Using sender wallet for token transfer...');
          await executeTokenTransferWithSenderWallet(
            tokenAddress,
            finalRecipientAddress,
            rewardAmount,
            senderPrivateKey,
            rpcUrl || 'https://mainnet.infura.io/v3/your-infura-key'
          );
        } else if (executeTransfer && finalRecipientAddress && tokenAddress && rewardAmount && isCurrentlyConnected) {
          // Use connected wallet for token transfer (only if still connected)
          console.log('💰 Sender pays gas: Using connected wallet for token transfer...');
          
          // Double-check wallet is still connected before executing
          if (!isCurrentlyConnected) {
            const errorMessage = 'Wallet disconnected during transaction. Please reconnect.';
            console.error('❌ Wallet disconnected:', errorMessage);
            setState(prev => ({
              ...prev,
              isLoading: false,
              error: errorMessage,
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
          console.log('🎭 Simulating token transfer for demo...');
          setTimeout(() => {
            const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
            console.log('✅ Simulated transaction completed:', mockTxHash);
            setState(prev => ({ ...prev, isLoading: false, error: null }));
            onRewardClaimed?.(mockTxHash, rewardAmount || '0');
          }, 2000);
        }
      }

    } catch (error) {
      console.error('❌ Error in handleClaimReward:', error);
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
      console.log('🔧 Creating provider and wallet...');
      // Create provider and wallet
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const wallet = new ethers.Wallet(privateKey, provider);

      // Create contract instance
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

      console.log('💸 Executing token transfer from sender wallet:', {
        from: wallet.address,
        to: recipientAddress,
        amount: amount,
        tokenAddress: tokenAddress,
      });

      // Execute the transfer
      const tx = await contract.transfer(recipientAddress, BigInt(amount));
      console.log('📤 Transaction submitted:', tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt.transactionHash);

      setState(prev => ({ ...prev, isLoading: false, error: null }));
      onRewardClaimed?.(receipt.transactionHash, amount);

    } catch (error) {
      console.error('❌ Error in sender wallet transfer:', error);
      throw error;
    }
  };

  const handleButtonClick = async () => {
    if (isRewardMode) {
      await handleClaimReward();
    } else {
      // Regular button mode - call the onReward handler
      try {
        await onReward?.();
      } catch (error) {
        console.error('❌ Error in onReward callback:', error);
      }
    }
  };

  const formatAmount = (amount: string, decimals: number = 18): string => {
    try {
      return ethers.formatUnits(amount, decimals);
    } catch {
      return '0';
    }
  };

  const internalIsLoading = isRewardMode ? (state.isLoading || isTransactionLoading || pendingReward) : false;
  const finalIsLoading = externalIsLoading || internalIsLoading;
  const isButtonDisabled = disabled || (finalIsLoading && !pendingReward);

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

  return (
    <>
      <Button
        {...buttonProps}
        variant={variant}
        size={size}
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
        isLoading={finalIsLoading}
      >
        {finalIsLoading ? getLoadingText() : getButtonText()}
      </Button>
      
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

      {isRewardMode && userPaysGas && (
        <div style={{ 
          fontSize: '12px', 
          color: '#2563eb', 
          marginTop: '8px',
          background: 'rgba(37, 99, 235, 0.1)',
          border: '1px solid #2563eb',
          borderRadius: '4px',
          padding: '6px 8px',
        }}>
          <div>💰 You will pay gas fees for this transaction</div>
          <div style={{ marginTop: '4px', fontSize: '11px', color: '#1e40af' }}>
            ⚠️ Note: Sender must have pre-approved your wallet address to spend tokens
          </div>
        </div>
      )}
    </>
  );
};

export default RewardButton;