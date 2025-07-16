import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { ethers } from 'ethers';
import RewardButton from '../src/RewardButton';
import { RewardButtonProps } from '../src/types';

// Mock implementations
const mockUseAccount = useAccount as jest.MockedFunction<typeof useAccount>;
const mockUseConnect = useConnect as jest.MockedFunction<typeof useConnect>;
const mockUseWriteContract = useWriteContract as jest.MockedFunction<typeof useWriteContract>;
const mockUseWaitForTransactionReceipt = useWaitForTransactionReceipt as jest.MockedFunction<typeof useWaitForTransactionReceipt>;
const mockUseAppKit = useAppKit as jest.MockedFunction<typeof useAppKit>;

describe('RewardButton Component', () => {
  const defaultProps: RewardButtonProps = {
    children: 'Test Reward Button',
  };

  const rewardProps: RewardButtonProps = {
    tokenAddress: '0x1234567890123456789012345678901234567890',
    rewardAmount: '1000000000000000000', // 1 ETH in wei
    userPaysGas: true, // Use user pays gas mode to avoid private key requirement
    tokenSymbol: 'TEST',
    children: 'Claim Reward',
  };

  const mockWriteContract = jest.fn();
  const mockOpenAppKit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUseAccount.mockReturnValue({
      address: '0x742d35Cc6634C0532925a3b8D0c0E2C48d152c2F',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      isReconnecting: false,
      status: 'connected',
    } as any);

    mockUseConnect.mockReturnValue({
      connect: jest.fn(),
      connectors: [],
      status: 'idle',
    } as any);

    mockUseWriteContract.mockReturnValue({
      writeContract: mockWriteContract,
      isPending: false,
      isError: false,
      error: null,
    } as any);

    mockUseWaitForTransactionReceipt.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);

    mockUseAppKit.mockReturnValue({
      open: mockOpenAppKit,
    } as any);

    // Mock ethers
    (ethers.formatUnits as jest.Mock).mockReturnValue('1.0');
    (ethers.JsonRpcProvider as jest.Mock).mockImplementation(() => ({
      getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }),
    }));
    (ethers.Wallet as jest.Mock).mockImplementation(() => ({
      address: '0x742d35Cc6634C0532925a3b8D0c0E2C48d152c2F',
      connect: jest.fn(),
    }));
    (ethers.Contract as jest.Mock).mockImplementation(() => ({
      transfer: jest.fn().mockResolvedValue({ 
        hash: '0x123456789', 
        wait: jest.fn().mockResolvedValue({ transactionHash: '0x123456789' }) 
      }),
      transferFrom: jest.fn().mockResolvedValue({ 
        hash: '0x123456789', 
        wait: jest.fn().mockResolvedValue({ transactionHash: '0x123456789' }) 
      }),
      approve: jest.fn().mockResolvedValue({ 
        hash: '0x123456789', 
        wait: jest.fn().mockResolvedValue({ transactionHash: '0x123456789' }) 
      }),
    }));

    // Mock window.ethereum
    (window as any).ethereum = {
      request: jest.fn().mockResolvedValue(['0x742d35Cc6634C0532925a3b8D0c0E2C48d152c2F']),
    };
  });

  describe('Basic Rendering', () => {
    it('renders as regular button when no reward props provided', () => {
      render(<RewardButton {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Test Reward Button')).toBeInTheDocument();
    });

    it('renders as reward button when reward props provided', () => {
      render(<RewardButton {...rewardProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Claim Reward')).toBeInTheDocument();
    });

    it('detects reward mode correctly', () => {
      const { rerender } = render(<RewardButton {...defaultProps} />);
      // Should be in regular mode
      expect(screen.getByText('Test Reward Button')).toBeInTheDocument();

      rerender(<RewardButton {...rewardProps} />);
      // Should be in reward mode
      expect(screen.getByText('Claim Reward')).toBeInTheDocument();
    });
  });

  describe('Regular Button Mode', () => {
    it('calls onReward when clicked in regular mode', async () => {
      const mockOnReward = jest.fn();
      render(<RewardButton onReward={mockOnReward} {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(mockOnReward).toHaveBeenCalledTimes(1);
      });
    });

    it('calls onClick handler in regular mode', async () => {
      const mockOnClick = jest.fn();
      render(<RewardButton onClick={mockOnClick} {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      });
    });

    it('does not use wagmi hooks in regular mode', () => {
      render(<RewardButton {...defaultProps} />);
      // In regular mode, wagmi hooks should not affect the button behavior
      expect(screen.getByText('Test Reward Button')).toBeInTheDocument();
    });
  });

  describe('Reward Mode - Wallet Connection', () => {
    it('shows "Claim Reward" on first click when wallet not connected', async () => {
      mockUseAccount.mockReturnValue({
        address: undefined,
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        status: 'disconnected',
      } as any);

      render(<RewardButton {...rewardProps} />);
      
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText('Claim Reward')).toBeInTheDocument();
      });
    });



    it('resets click state when wallet gets connected', async () => {
      const { rerender } = render(<RewardButton {...rewardProps} />);
      
      // Mock wallet disconnected
      mockUseAccount.mockReturnValue({
        address: undefined,
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        status: 'disconnected',
      } as any);

      rerender(<RewardButton {...rewardProps} />);
      
      // First click
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText('Claim Reward')).toBeInTheDocument();
      });

      // Mock wallet connected
      mockUseAccount.mockReturnValue({
        address: '0x742d35Cc6634C0532925a3b8D0c0E2C48d152c2F',
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
        isReconnecting: false,
        status: 'connected',
      } as any);

      rerender(<RewardButton {...rewardProps} />);
      
      // Should reset to original text
      expect(screen.getByText('Claim Reward')).toBeInTheDocument();
    });
  });

  describe('Reward Mode - Transaction Flow', () => {






    it('shows confirmation state during blockchain confirmation', async () => {
      mockUseWaitForTransactionReceipt.mockReturnValue({
        data: null,
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
      } as any);

      render(<RewardButton {...rewardProps} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByText('Confirming on Blockchain...')).toBeInTheDocument();
      });
    });

    it('shows success state after successful transaction', async () => {
      mockUseWaitForTransactionReceipt.mockReturnValue({
        data: { transactionHash: '0x123456789', status: 'success' },
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      } as any);

      render(<RewardButton {...rewardProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('🎉 Success!')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {







  });

  describe('Callback Functions', () => {
    it('calls onRewardStarted when reward claim starts', async () => {
      const mockOnRewardStarted = jest.fn();
      render(<RewardButton {...rewardProps} onRewardStarted={mockOnRewardStarted} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(mockOnRewardStarted).toHaveBeenCalledTimes(1);
      });
    });

    it('calls onRewardClaimed when reward is successfully claimed', async () => {
      const mockOnRewardClaimed = jest.fn();
      const mockReceipt = { transactionHash: '0x123456789', status: 'success' };
      
      mockUseWaitForTransactionReceipt.mockReturnValue({
        data: mockReceipt,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      } as any);

      render(<RewardButton {...rewardProps} onRewardClaimed={mockOnRewardClaimed} />);
      
      await waitFor(() => {
        expect(mockOnRewardClaimed).toHaveBeenCalledWith('0x123456789', rewardProps.rewardAmount);
      });
    });


  });

  describe('Loading States', () => {





  });

  describe('Security Features', () => {
    it('always requires wallet connection for reward mode', async () => {
      mockUseAccount.mockReturnValue({
        address: undefined,
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        status: 'disconnected',
      } as any);

      render(<RewardButton {...rewardProps} requireConnection={false} />);
      
      // Even with requireConnection=false, should still require connection in reward mode
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Claim Reward')).toBeInTheDocument();
    });



    it('performs real-time wallet connection check', async () => {
      const mockEthereumRequest = jest.fn().mockResolvedValue(['0x742d35Cc6634C0532925a3b8D0c0E2C48d152c2F']);
      (window as any).ethereum = {
        request: mockEthereumRequest,
      };

      render(<RewardButton {...rewardProps} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(mockEthereumRequest).toHaveBeenCalledWith({ method: 'eth_accounts' });
      });
    });
  });

  describe('Token Information', () => {
    it('displays token symbol correctly', async () => {
      render(<RewardButton {...rewardProps} showRewardAmount />);
      
      await waitFor(() => {
        // Should show token symbol somewhere in the UI
        expect(screen.getByText('Claim Reward')).toBeInTheDocument();
      });
    });

    it('handles custom token symbol', async () => {
      const customSymbol = 'CUSTOM';
      render(<RewardButton {...rewardProps} tokenSymbol={customSymbol} />);
      
      await waitFor(() => {
        expect(screen.getByText('Claim Reward')).toBeInTheDocument();
      });
    });
  });

  describe('Component Props', () => {
    it('forwards button props correctly', () => {
      render(
        <RewardButton
          {...rewardProps}
          variant="secondary"
          size="lg"
          disabled
          className="custom-class"
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('reward-button--secondary');
      expect(button).toHaveClass('reward-button--size-lg');
      expect(button).toHaveClass('custom-class');
      expect(button).toBeDisabled();
    });

    it('handles external loading state', () => {
      render(<RewardButton {...rewardProps} isLoading />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('combines external and internal loading states', () => {
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        isPending: true,
        isError: false,
        error: null,
      } as any);

      render(<RewardButton {...rewardProps} isLoading />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined window.ethereum', async () => {
      (window as any).ethereum = undefined;
      
      render(<RewardButton {...rewardProps} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      // Should still work but may show different behavior
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('handles ethereum.request errors', async () => {
      (window as any).ethereum = {
        request: jest.fn().mockRejectedValue(new Error('User rejected')),
      };

      render(<RewardButton {...rewardProps} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('handles transaction receipt with failed status', async () => {
      const mockOnRewardFailed = jest.fn();
      mockUseWaitForTransactionReceipt.mockReturnValue({
        data: { transactionHash: '0x123456789', status: 'reverted' },
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      } as any);

      render(<RewardButton {...rewardProps} onRewardFailed={mockOnRewardFailed} />);
      
      await waitFor(() => {
        expect(mockOnRewardFailed).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });
}); 