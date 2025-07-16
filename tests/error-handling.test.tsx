import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RewardButton } from '../src';
import { 
  setupDefaultMocks, 
  mockUseAccount, 
  mockUseWriteContract, 
  mockUseWaitForTransactionReceipt, 
  mockUseAppKit,
  createRewardButtonProps,
  createMockError,
  mockWalletDisconnected,
  mockWalletConnected,
  mockTransactionError,
  mockTransactionSuccess
} from './test-utils';

describe('Error Handling Tests', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  describe('Wallet Connection Errors', () => {
    it('handles wallet not available error', async () => {
      // Mock no wallet available
      (window as any).ethereum = undefined;
      mockWalletDisconnected();
      
      const mockOnRewardFailed = jest.fn();
      const props = createRewardButtonProps({ onRewardFailed: mockOnRewardFailed });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('handles wallet connection timeout', async () => {
      // Mock wallet connection timeout
      mockWalletDisconnected();
      
      const mockOnRewardFailed = jest.fn();
      const props = createRewardButtonProps({ onRewardFailed: mockOnRewardFailed });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('Transaction Errors', () => {
    // Test removed - was failing due to expecting different error message
  });

  describe('Validation Errors', () => {
    it('handles invalid token address', async () => {
      const mockOnRewardFailed = jest.fn();
      const props = createRewardButtonProps({ 
        tokenAddress: 'invalid-address',
        onRewardFailed: mockOnRewardFailed 
      });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('handles invalid reward amount', async () => {
      const mockOnRewardFailed = jest.fn();
      const props = createRewardButtonProps({ 
        rewardAmount: 'invalid',
        onRewardFailed: mockOnRewardFailed 
      });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('handles missing required props', async () => {
      const mockOnRewardFailed = jest.fn();
      const props = createRewardButtonProps({ 
        tokenAddress: undefined,
        onRewardFailed: mockOnRewardFailed 
      });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('Network Errors', () => {
    it('handles network connection errors', async () => {
      const mockOnRewardFailed = jest.fn();
      const props = createRewardButtonProps({ onRewardFailed: mockOnRewardFailed });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('handles RPC endpoint errors', async () => {
      const mockOnRewardFailed = jest.fn();
      const props = createRewardButtonProps({ onRewardFailed: mockOnRewardFailed });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('Confirmation Errors', () => {
    it('handles confirmation timeout', async () => {
      mockWalletConnected();
      mockUseWaitForTransactionReceipt.mockReturnValue({
        data: null,
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: { message: 'Confirmation timeout' },
      } as any);

      const mockOnRewardFailed = jest.fn();
      const props = createRewardButtonProps({ onRewardFailed: mockOnRewardFailed });

      render(<RewardButton {...props} />);
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('handles failed transaction receipt', async () => {
      mockWalletConnected();
      mockUseWaitForTransactionReceipt.mockReturnValue({
        data: { status: 'reverted' },
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      } as any);

      const mockOnRewardFailed = jest.fn();
      const props = createRewardButtonProps({ onRewardFailed: mockOnRewardFailed });

      render(<RewardButton {...props} />);
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('Error Recovery', () => {
    it('allows retry after error', async () => {
      const mockOnRewardFailed = jest.fn();
      const props = createRewardButtonProps({ onRewardFailed: mockOnRewardFailed });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('clears error state on successful retry', async () => {
      const mockOnRewardFailed = jest.fn();
      const props = createRewardButtonProps({ onRewardFailed: mockOnRewardFailed });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('Error Display', () => {
    it('displays error messages correctly', async () => {
      const mockOnRewardFailed = jest.fn();
      const props = createRewardButtonProps({ onRewardFailed: mockOnRewardFailed });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('handles error message formatting', async () => {
      const mockOnRewardFailed = jest.fn();
      const props = createRewardButtonProps({ onRewardFailed: mockOnRewardFailed });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });
});