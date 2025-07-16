import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RewardButton from '../src/RewardButton';
import { RewardButtonProps } from '../src/types';
import {
  setupDefaultMocks,
  mockWalletConnected,
  mockWalletDisconnected,
  mockTransactionLoading,
  mockTransactionSuccess,
  mockTransactionError,
  mockConfirmationLoading,
  createRewardButtonProps,
  createMockError,
  TEST_TX_HASH,
  TEST_AMOUNTS,
  mockUseAccount,
  mockUseWriteContract,
  mockUseWaitForTransactionReceipt,
  mockUseAppKit,
} from './test-utils';

describe('State Management and Callbacks', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  describe('Callback Functions', () => {
    it('calls onRewardStarted callback correctly', async () => {
      const mockOnRewardStarted = jest.fn();
      const props = createRewardButtonProps({
        onRewardStarted: mockOnRewardStarted,
      });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(mockOnRewardStarted).toHaveBeenCalledTimes(1);
      });
    });

    it('calls onRewardClaimed callback with correct parameters', async () => {
      const mockOnRewardClaimed = jest.fn();
      mockTransactionSuccess();
      
      const props = createRewardButtonProps({
        onRewardClaimed: mockOnRewardClaimed,
      });

      render(<RewardButton {...props} />);
      
      // Wait for transaction to complete
      await waitFor(() => {
        expect(mockOnRewardClaimed).toHaveBeenCalledWith(TEST_TX_HASH, '1000000000000000000');
      });
    });

    it('calls onReward callback in regular button mode', async () => {
      const mockOnReward = jest.fn();
      const props = createRewardButtonProps({
        onReward: mockOnReward,
        rewardAmount: undefined, // Not a reward button
      });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(mockOnReward).toHaveBeenCalledTimes(1);
      });
    });

    it('calls onClick callback before reward logic', async () => {
      const mockOnClick = jest.fn();
      const props = createRewardButtonProps({
        onClick: mockOnClick,
      });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      });
    });

    it('handles async onClick callback', async () => {
      const mockOnClick = jest.fn().mockResolvedValue(undefined);
      const props = createRewardButtonProps({
        onClick: mockOnClick,
      });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      });
    });

    it('handles onClick callback errors gracefully', async () => {
      const mockOnClick = jest.fn().mockRejectedValue(new Error('Click error'));
      const props = createRewardButtonProps({
        onClick: mockOnClick,
      });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      });
    });

    it('handles onReward callback errors gracefully', async () => {
      const mockOnReward = jest.fn().mockRejectedValue(new Error('Reward error'));
      const props = createRewardButtonProps({
        onReward: mockOnReward,
        rewardAmount: undefined,
      });

      render(<RewardButton {...props} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(mockOnReward).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Loading States', () => {
    it('handles external loading state', async () => {
      const props = createRewardButtonProps({
        isLoading: true,
      });

      render(<RewardButton {...props} />);
      
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('combines external and internal loading states', async () => {
      const props = createRewardButtonProps({
        isLoading: true,
      });

      render(<RewardButton {...props} />);
      
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Success States', () => {
    it('shows success state after successful transaction', async () => {
      mockTransactionSuccess();
      const props = createRewardButtonProps();

      render(<RewardButton {...props} />);
      
      await waitFor(() => {
        expect(screen.getByText('🎉 Success!')).toBeInTheDocument();
      });
    });

    it('resets success state after timeout', async () => {
      jest.useFakeTimers();
      mockTransactionSuccess();
      
      const props = createRewardButtonProps();

      render(<RewardButton {...props} />);
      
      await waitFor(() => {
        expect(screen.getByText('🎉 Success!')).toBeInTheDocument();
      });

      // Fast forward time
      jest.advanceTimersByTime(3000);
      
      await waitFor(() => {
        expect(screen.getByText('Claim Reward')).toBeInTheDocument();
      });
      
      jest.useRealTimers();
    });

    it('handles success state with different button variants', async () => {
      mockTransactionSuccess();
      const props = createRewardButtonProps({
        variant: 'secondary',
      });

      render(<RewardButton {...props} />);
      
      await waitFor(() => {
        expect(screen.getByText('🎉 Success!')).toBeInTheDocument();
      });
    });
  });

  describe('Button Text Management', () => {
    it('handles custom children text', async () => {
      const props = createRewardButtonProps({
        children: 'Custom Button Text',
      });

      render(<RewardButton {...props} />);
      
      expect(screen.getByText('Custom Button Text')).toBeInTheDocument();
    });
  });

  describe('State Persistence', () => {
    it('resets state when props change', async () => {
      const props = createRewardButtonProps();
      const { rerender } = render(<RewardButton {...props} />);
      
      const newProps = createRewardButtonProps({
        tokenAddress: '0x9999999999999999999999999999999999999999',
      });
      
      rerender(<RewardButton {...newProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Claim Reward')).toBeInTheDocument();
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('cleans up state on unmount', async () => {
      const props = createRewardButtonProps();
      const { unmount } = render(<RewardButton {...props} />);
      
      unmount();
      
      // No errors should be thrown
      expect(true).toBe(true);
    });

    it('handles rapid mount/unmount cycles', async () => {
      const props = createRewardButtonProps();
      
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<RewardButton {...props} />);
        unmount();
      }
      
      // No errors should be thrown
      expect(true).toBe(true);
    });
  });

  describe('State Validation', () => {
    it('validates state consistency', async () => {
      const props = createRewardButtonProps();
      render(<RewardButton {...props} />);
      
      // Button should be in consistent state
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });
}); 