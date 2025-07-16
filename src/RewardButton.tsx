import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
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
  loadingText = 'Claiming Reward...',
  userPaysGas = false, // false means sender pays gas (default)
  isLoading: externalIsLoading = false,
  children = 'Claim Reward',
  variant = 'default',
  size = 'default',
  disabled = false,
  onClick,
  ...buttonProps
}) => {
  const [state, setState] = useState<RewardButtonState>({
    isLoading: false,
    error: null,
    tokenInfo: null,
  });

  const [pendingReward, setPendingReward] = useState(false);
  const [hasClickedOnce, setHasClickedOnce] = useState(false);

  // Determine if this is a reward button or regular button
  const isRewardMode = Boolean(tokenAddress && rewardAmount);

  // Only use wagmi hooks if in reward mode
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  // Reown AppKit for wallet selection modal
  const { open: openAppKit } = useAppKit();

  // Check if connected - more robust validation
  const isWalletConnected = isConnected && address;

  // 🔒 SECURITY FIX: ALWAYS require wallet connection for ANY reward transfers
  const effectiveRequireConnection = isRewardMode ? true : requireConnection;

  // 🔒 SECURITY FIX: Never fall back to recipientAddress - always use connected wallet
  const targetAddress = isRewardMode ? (
    isWalletConnected ? address : null  // Only use connected wallet, no fallback
  ) : undefined;

  // Reset hasClickedOnce when wallet gets connected
  useEffect(() => {
    if (isWalletConnected && hasClickedOnce) {
      console.log('💡 Wallet connected - resetting click state');
      setHasClickedOnce(false);
    }
  }, [isWalletConnected, hasClickedOnce]);

  // Debug logging for recipient address selection
  useEffect(() => {
    if (isRewardMode) {
      console.log('🎯 Recipient Address Selection (Security Enhanced):');
      console.log('  userPaysGas:', userPaysGas);
      console.log('  isConnected:', isConnected);
      console.log('  Connected wallet address:', address);
      console.log('  Wallet truly connected:', isWalletConnected);
      console.log('  Provided recipientAddress prop (IGNORED for security):', recipientAddress);
      console.log('  Final target address:', targetAddress);
      console.log('  Using connected wallet:', isWalletConnected ? '✅ YES' : '❌ NO - WILL PROMPT TO CONNECT');
      console.log('  Effective require connection:', effectiveRequireConnection);
      
      if (!isWalletConnected) {
        console.log('🔒 SECURITY: Wallet not connected - transfers will be blocked');
      }
    }
  }, [isConnected, address, recipientAddress, targetAddress, isRewardMode, isWalletConnected, userPaysGas, effectiveRequireConnection]);

  // 🔒 SECURITY FIX: Always require wallet connection for reward mode
  const needsWalletConnection = isRewardMode && !isWalletConnected;

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

  // Track transaction hash for confirmation
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  // Contract write hook for executing the transaction (only if in reward mode)
  const { writeContract: executeTransfer, isPending: isTransactionLoading } = useWriteContract({
    mutation: {
      onSuccess: (hash: `0x${string}`) => {
        console.log('📤 Transaction submitted to mempool:', hash);
        console.log('⏳ Waiting for blockchain confirmation...');
        setTxHash(hash);
        // Don't call success callback yet - wait for confirmation
      },
      onError: (error: any) => {
        console.error('❌ Transaction submission failed:', error);
        
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
        setTxHash(undefined);
      },
    },
  });

  // Wait for transaction confirmation
  const { 
    data: receipt, 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    isError: isConfirmError,
    error: confirmError 
  } = useWaitForTransactionReceipt({
    hash: txHash,
    query: {
      enabled: !!txHash,
    },
  });

  // Handle transaction confirmation results
  useEffect(() => {
    if (isConfirmed && receipt) {
      console.log('✅ Transaction confirmed on blockchain:', receipt.transactionHash);
      console.log('📊 Transaction status:', receipt.status === 'success' ? 'SUCCESS' : 'FAILED');
      
      if (receipt.status === 'success') {
        setState(prev => ({ ...prev, isLoading: false, error: null }));
        onRewardClaimed?.(receipt.transactionHash, rewardAmount || '0');
      } else {
        // Transaction was mined but failed
        const errorMessage = 'Transaction failed on blockchain. This usually means insufficient allowance or balance.';
        console.error('❌ Transaction failed on blockchain:', errorMessage);
        setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
        onRewardFailed?.(new Error(errorMessage));
      }
      setTxHash(undefined);
    }
  }, [isConfirmed, receipt, rewardAmount, onRewardClaimed, onRewardFailed]);

  // Handle confirmation errors
  useEffect(() => {
    if (isConfirmError && confirmError) {
      console.error('❌ Transaction confirmation error:', confirmError);
      const errorMessage = 'Transaction confirmation failed. Please check the blockchain explorer.';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      onRewardFailed?.(confirmError);
      setTxHash(undefined);
    }
  }, [isConfirmError, confirmError, onRewardFailed]);

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

      // Step 1: ROBUST REAL-TIME wallet connection validation
      console.log('🔍 Performing real-time wallet connection validation...');
      console.log('  userPaysGas:', userPaysGas);
      console.log('  isConnected (cached):', isConnected);
      console.log('  address (cached):', address);
      console.log('  effectiveRequireConnection:', effectiveRequireConnection);
      
      // 🔒 SECURITY ENHANCEMENT: Perform real-time wallet connection check
      let realTimeConnectionState = false;
      let realTimeAddress = null;
      
      try {
        // Check if MetaMask/wallet is available and connected
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          // Request accounts to get real-time connection state
          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
          realTimeConnectionState = accounts && accounts.length > 0;
          realTimeAddress = accounts && accounts.length > 0 ? accounts[0] : null;
          
          console.log('🔍 Real-time wallet check results:');
          console.log('  Real-time connected:', realTimeConnectionState);
          console.log('  Real-time address:', realTimeAddress);
          console.log('  Cached vs Real-time match:', isConnected === realTimeConnectionState);
        }
      } catch (error) {
        console.error('❌ Real-time wallet check failed:', error);
        realTimeConnectionState = false;
        realTimeAddress = null;
      }
      
      // Use real-time connection state for security decisions
      const isCurrentlyConnected = realTimeConnectionState && realTimeAddress;
      const finalAddress = realTimeAddress || address;
      
      // 🔒 SECURITY FIX: Block ALL transfers if wallet is not connected in real-time
      if (!isCurrentlyConnected) {
        console.log('❌ SECURITY BLOCK: Wallet not connected or locked in real-time check');
        console.log('🔒 SECURITY: Blocking transfer - real-time wallet connection required');
        console.log('🔄 UX: Falling back to "Claim Reward" button state - user must click again to connect');
        setHasClickedOnce(true);  // Show "Claim Reward" button
        setState(prev => ({ ...prev, isLoading: false }));
        // Don't open modal immediately - let user choose when to connect
        return;
      }
      
      // Double-check that we have a valid address
      if (!finalAddress) {
        console.log('❌ SECURITY BLOCK: No valid wallet address available');
        console.log('🔒 SECURITY: Blocking transfer - valid address required');
        console.log('🔄 UX: Falling back to "Claim Reward" button state - user must click again to connect');
        setHasClickedOnce(true);  // Show "Claim Reward" button
        setState(prev => ({ ...prev, isLoading: false }));
        // Don't open modal immediately - let user choose when to connect
        return;
      }

      // Step 2: 🔒 SECURITY FIX: Always use real-time connected wallet address
      const finalRecipientAddress = finalAddress;  // Always use real-time connected wallet
      
      console.log('🚀 Final Recipient Address Determination (Security Enhanced):');
      console.log('  Payment mode:', userPaysGas ? 'User Pays Gas' : 'Sender Pays Gas');
      console.log('  Wallet currently connected (real-time):', isCurrentlyConnected);
      console.log('  Real-time wallet address:', realTimeAddress);
      console.log('  Cached wallet address:', address);
      console.log('  Final recipient address:', finalRecipientAddress);
      console.log('  Address source: Real-time Connected Wallet (recipientAddress prop ignored for security)');
      
      // Step 3: Validate recipient address is available
      if (isRewardMode && !finalRecipientAddress) {
        const errorMessage = 'Wallet connection required for reward transfers. Please connect your wallet.';
        
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

      // Step 6: FINAL security check - Re-validate wallet connection right before transfer
      try {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          const finalCheck = await (window as any).ethereum.request({ method: 'eth_accounts' });
          const finalConnectionState = finalCheck && finalCheck.length > 0;
          
          if (!finalConnectionState) {
            const errorMessage = 'Wallet disconnected immediately before transaction. Please reconnect.';
            console.error('❌ FINAL SECURITY CHECK FAILED:', errorMessage);
            console.log('🔄 UX: Falling back to "Claim Reward" button state - user must click again to connect');
            setState(prev => ({
              ...prev,
              isLoading: false,
              error: errorMessage,
            }));
            onRewardFailed?.(new Error(errorMessage));
            setHasClickedOnce(true);  // Show "Claim Reward" button
            // Don't open modal immediately - let user choose when to connect
            return;
          }
          
          console.log('✅ FINAL SECURITY CHECK PASSED: Wallet still connected');
        }
      } catch (error) {
        const errorMessage = 'Failed to verify wallet connection before transaction';
        console.error('❌ FINAL SECURITY CHECK ERROR:', error);
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

        // Check if senderAddress and senderPrivateKey are provided for transferFrom
        if (!senderAddress || !senderPrivateKey) {
          const errorMessage = 'Sender address and private key required for user-pays-gas mode.';
          console.error('❌ Sender credentials required:', errorMessage);
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
          }));
          onRewardFailed?.(new Error('Sender credentials required'));
          return;
        }

        // Step 6a: Auto-approve receiver using sender's private key
        console.log('🔐 Auto-approving receiver wallet using sender credentials...');
        console.log('  Sender approving:', senderAddress);
        console.log('  Receiver being approved:', finalRecipientAddress);
        console.log('  Amount to approve:', rewardAmount);
        
        try {
          // Create provider and sender wallet
          const provider = new ethers.JsonRpcProvider(rpcUrl || 'https://polygon-mainnet.infura.io/v3/your-key');
          const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
          const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, senderWallet);
          
          // Approve the receiver to spend tokens
          console.log('📝 Submitting approval transaction...');
          const approvalTx = await tokenContract.approve(finalRecipientAddress, BigInt(rewardAmount));
          console.log('📤 Approval transaction submitted:', approvalTx.hash);
          
          // Wait for approval confirmation
          console.log('⏳ Waiting for approval confirmation...');
          await approvalTx.wait();
          console.log('✅ Receiver approved successfully!');
          
        } catch (approvalError) {
          console.error('❌ Approval failed:', approvalError);
          const errorMessage = `Approval failed: ${approvalError instanceof Error ? approvalError.message : 'Unknown error'}`;
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
          }));
          onRewardFailed?.(approvalError instanceof Error ? approvalError : new Error(errorMessage));
          return;
        }

        // Step 6b: Now execute transferFrom with connected wallet
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

  const handleButtonClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Call the regular onClick handler first if provided
    try {
      await onClick?.(event);
    } catch (error) {
      console.error('❌ Error in onClick callback:', error);
    }

    if (isRewardMode) {
      // First click: Check wallet connection
      if (!hasClickedOnce && !isWalletConnected) {
        console.log('🎯 First click - checking wallet connection...');
        setHasClickedOnce(true);
        console.log('💡 Wallet not connected. Button text changed to "Claim Reward". Click again to connect wallet.');
        return;
      }
      
      // Second click but wallet still not connected: Open wallet connection modal
      if (hasClickedOnce && !isWalletConnected) {
        console.log('🎯 Second click - opening wallet connection modal...');
        console.log('🔗 User clicked "Claim Reward" button - opening Reown AppKit to connect wallet');
        setPendingReward(true);
        openAppKit();
        return;
      }
      
      // Wallet is connected: Start reward flow
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

  const internalIsLoading = isRewardMode ? (state.isLoading || isTransactionLoading || isConfirming || pendingReward) : false;
  const finalIsLoading = externalIsLoading || internalIsLoading;
  const isButtonDisabled = disabled || (finalIsLoading && !pendingReward);

  // Dynamic loading text based on current state
  const getLoadingText = () => {
    if (pendingReward) {
      return 'Connect Wallet...';
    }
    if (isConfirming) {
      return 'Confirming on Blockchain...';
    }
    if (isTransactionLoading) {
      return 'Submitting Reward...';
    }
    if (state.isLoading) {
      return userPaysGas ? 'Approving & Claiming Reward...' : 'Claiming Reward...';
    }
    return loadingText;
  };

  // Dynamic button text based on state
  const getButtonText = () => {
    if (pendingReward) {
      return 'Connect Wallet...';
    }
    if (isConfirming) {
      return 'Confirming on Blockchain...';
    }
    if (isTransactionLoading) {
      return 'Submitting Reward...';
    }
    if (state.isLoading) {
      return userPaysGas ? 'Approving & Claiming Reward...' : 'Claiming Reward...';
    }
    
    // Show "Claim Reward" if user clicked once but wallet is not connected
    if (isRewardMode && hasClickedOnce && !isWalletConnected) {
      return 'Claim Reward';
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
        loadingText={getLoadingText()}
      >
        {getButtonText()}
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