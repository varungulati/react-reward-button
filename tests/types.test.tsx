import React from 'react';
import {
  ButtonProps,
  RewardButtonProps,
  RewardButtonState,
  TokenInfo,
} from '../src/types';

describe('Types', () => {
  describe('ButtonProps', () => {
    it('extends HTMLButtonElement attributes', () => {
      const buttonProps: ButtonProps = {
        type: 'button',
        disabled: false,
        className: 'test-class',
        onClick: () => {},
        'aria-label': 'Test button',
        id: 'test-id',
        children: 'Test Button',
      };
      
      expect(buttonProps.type).toBe('button');
      expect(buttonProps.disabled).toBe(false);
      expect(buttonProps.className).toBe('test-class');
      expect(buttonProps.onClick).toBeDefined();
      expect(buttonProps['aria-label']).toBe('Test button');
      expect(buttonProps.id).toBe('test-id');
      expect(buttonProps.children).toBe('Test Button');
    });

    it('has correct optional properties', () => {
      const minimalProps: ButtonProps = {};
      expect(minimalProps).toBeDefined();
      
      const fullProps: ButtonProps = {
        asChild: true,
        variant: 'secondary',
        size: 'lg',
        isLoading: true,
        loadingText: 'Loading...',
        isSuccess: true,
        children: 'Button Text',
      };
      
      expect(fullProps.asChild).toBe(true);
      expect(fullProps.variant).toBe('secondary');
      expect(fullProps.size).toBe('lg');
      expect(fullProps.isLoading).toBe(true);
      expect(fullProps.loadingText).toBe('Loading...');
      expect(fullProps.isSuccess).toBe(true);
      expect(fullProps.children).toBe('Button Text');
    });

    it('has correct variant type constraints', () => {
      const validVariants: ButtonProps['variant'][] = [
        'default',
        'secondary',
        'outline',
        'ghost',
        'destructive',
      ];
      
      validVariants.forEach(variant => {
        const props: ButtonProps = { variant };
        expect(props.variant).toBe(variant);
      });
    });

    it('has correct size type constraints', () => {
      const validSizes: ButtonProps['size'][] = [
        'default',
        'sm',
        'lg',
        'icon',
      ];
      
      validSizes.forEach(size => {
        const props: ButtonProps = { size };
        expect(props.size).toBe(size);
      });
    });
  });

  describe('TokenInfo', () => {
    it('has required properties', () => {
      const tokenInfo: TokenInfo = {
        symbol: 'USDC',
        decimals: 6,
        name: 'USD Coin',
      };
      
      expect(tokenInfo.symbol).toBe('USDC');
      expect(tokenInfo.decimals).toBe(6);
      expect(tokenInfo.name).toBe('USD Coin');
    });

    it('accepts valid token information', () => {
      const tokens: TokenInfo[] = [
        { symbol: 'ETH', decimals: 18, name: 'Ethereum' },
        { symbol: 'USDT', decimals: 6, name: 'Tether USD' },
        { symbol: 'DAI', decimals: 18, name: 'Dai Stablecoin' },
      ];
      
      tokens.forEach(token => {
        expect(typeof token.symbol).toBe('string');
        expect(typeof token.decimals).toBe('number');
        expect(typeof token.name).toBe('string');
      });
    });

    it('enforces number type for decimals', () => {
      const tokenInfo: TokenInfo = {
        symbol: 'TEST',
        decimals: 18,
        name: 'Test Token',
      };
      
      expect(typeof tokenInfo.decimals).toBe('number');
    });
  });

  describe('RewardButtonState', () => {
    it('has required properties', () => {
      const state: RewardButtonState = {
        isLoading: false,
        error: null,
        tokenInfo: null,
        isSuccess: false,
      };
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.tokenInfo).toBe(null);
      expect(state.isSuccess).toBe(false);
    });

    it('accepts valid state transitions', () => {
      const states: RewardButtonState[] = [
        // Initial state
        { isLoading: false, error: null, tokenInfo: null, isSuccess: false },
        // Loading state
        { isLoading: true, error: null, tokenInfo: null, isSuccess: false },
        // Success state
        { isLoading: false, error: null, tokenInfo: { symbol: 'USDC', decimals: 6, name: 'USD Coin' }, isSuccess: true },
        // Error state
        { isLoading: false, error: 'Transaction failed', tokenInfo: null, isSuccess: false },
      ];
      
      states.forEach(state => {
        expect(typeof state.isLoading).toBe('boolean');
        expect(state.error === null || typeof state.error === 'string').toBe(true);
        expect(state.tokenInfo === null || typeof state.tokenInfo === 'object').toBe(true);
        expect(typeof state.isSuccess).toBe('boolean');
      });
    });

    it('allows null values for optional properties', () => {
      const state: RewardButtonState = {
        isLoading: false,
        error: null,
        tokenInfo: null,
        isSuccess: false,
      };
      
      expect(state.error).toBe(null);
      expect(state.tokenInfo).toBe(null);
    });
  });

  describe('RewardButtonProps', () => {
    it('extends ButtonProps', () => {
      const props: RewardButtonProps = {
        // ButtonProps
        variant: 'secondary',
        size: 'lg',
        disabled: false,
        className: 'test-class',
        children: 'Test Button',
        
        // RewardButtonProps
        tokenAddress: '0x1234567890123456789012345678901234567890',
        rewardAmount: '1000000000000000000',
        tokenSymbol: 'USDC',
      };
      
      expect(props.variant).toBe('secondary');
      expect(props.size).toBe('lg');
      expect(props.disabled).toBe(false);
      expect(props.className).toBe('test-class');
      expect(props.children).toBe('Test Button');
      expect(props.tokenAddress).toBe('0x1234567890123456789012345678901234567890');
      expect(props.rewardAmount).toBe('1000000000000000000');
      expect(props.tokenSymbol).toBe('USDC');
    });

    it('has correct optional Web3 properties', () => {
      const minimalProps: RewardButtonProps = {};
      expect(minimalProps).toBeDefined();
      
      const fullProps: RewardButtonProps = {
        tokenAddress: '0x1234567890123456789012345678901234567890',
        rewardAmount: '1000000000000000000',
        recipientAddress: '0x742d35Cc6634C0532925a3b8D0c0E2C48d152c2F',
        tokenSymbol: 'USDC',
        requireConnection: true,
        loadingText: 'Processing...',
        userPaysGas: true,
        showRewardAmount: true,
        isLoading: false,
        children: 'Claim Reward',
      };
      
      expect(fullProps.tokenAddress).toBeDefined();
      expect(fullProps.rewardAmount).toBeDefined();
      expect(fullProps.recipientAddress).toBeDefined();
      expect(fullProps.tokenSymbol).toBeDefined();
      expect(fullProps.requireConnection).toBe(true);
      expect(fullProps.loadingText).toBe('Processing...');
      expect(fullProps.userPaysGas).toBe(true);
      expect(fullProps.showRewardAmount).toBe(true);
      expect(fullProps.isLoading).toBe(false);
      expect(fullProps.children).toBe('Claim Reward');
    });

    it('has correct callback function signatures', () => {
      const mockCallbacks: RewardButtonProps = {
        onReward: jest.fn(),
        onRewardClaimed: jest.fn(),
        onRewardFailed: jest.fn(),
        onRewardStarted: jest.fn(),
      };
      
      expect(typeof mockCallbacks.onReward).toBe('function');
      expect(typeof mockCallbacks.onRewardClaimed).toBe('function');
      expect(typeof mockCallbacks.onRewardFailed).toBe('function');
      expect(typeof mockCallbacks.onRewardStarted).toBe('function');
    });

    it('callback functions have correct signatures', () => {
      const props: RewardButtonProps = {
        onReward: async () => {},
        onRewardClaimed: (txHash: string, amount: string) => {
          expect(typeof txHash).toBe('string');
          expect(typeof amount).toBe('string');
        },
        onRewardFailed: (error: Error) => {
          expect(error).toBeInstanceOf(Error);
        },
        onRewardStarted: () => {},
      };
      
      // Test callback signatures
      props.onRewardClaimed?.('0x123', '1000');
      props.onRewardFailed?.(new Error('Test error'));
      props.onRewardStarted?.();
    });

    it('supports React.ReactNode for children', () => {
      const textChild: RewardButtonProps = {
        children: 'Text Button',
      };
      
      const elementChild: RewardButtonProps = {
        children: <span>Element Button</span>,
      };
      
      const arrayChild: RewardButtonProps = {
        children: ['Multiple', ' ', 'Children'],
      };
      
      expect(textChild.children).toBe('Text Button');
      expect(elementChild.children).toBeDefined();
      expect(arrayChild.children).toBeDefined();
    });

    it('omits isLoading from ButtonProps correctly', () => {
      // This test ensures that isLoading is properly omitted from ButtonProps
      // and redefined in RewardButtonProps
      const props: RewardButtonProps = {
        isLoading: true,
        // other button props should still be available
        variant: 'default',
        size: 'default',
        disabled: false,
      };
      
      expect(props.isLoading).toBe(true);
      expect(props.variant).toBe('default');
      expect(props.size).toBe('default');
      expect(props.disabled).toBe(false);
    });
  });

  describe('Type Compatibility', () => {
    it('ButtonProps is compatible with HTMLButtonElement', () => {
      const buttonProps: ButtonProps = {
        type: 'submit',
        form: 'test-form',
        name: 'test-name',
        value: 'test-value',
        autoFocus: true,
        formAction: '/submit',
        formEncType: 'application/x-www-form-urlencoded',
        formMethod: 'POST',
        formNoValidate: true,
        formTarget: '_blank',
      };
      
      expect(buttonProps.type).toBe('submit');
      expect(buttonProps.form).toBe('test-form');
      expect(buttonProps.name).toBe('test-name');
      expect(buttonProps.value).toBe('test-value');
      expect(buttonProps.autoFocus).toBe(true);
      expect(buttonProps.formAction).toBe('/submit');
      expect(buttonProps.formEncType).toBe('application/x-www-form-urlencoded');
      expect(buttonProps.formMethod).toBe('POST');
      expect(buttonProps.formNoValidate).toBe(true);
      expect(buttonProps.formTarget).toBe('_blank');
    });

    it('RewardButtonProps extends ButtonProps properly', () => {
      const rewardProps: RewardButtonProps = {
        // From ButtonProps
        variant: 'outline',
        size: 'sm',
        disabled: true,
        className: 'custom-button',
        onClick: () => {},
        
        // From RewardButtonProps
        tokenAddress: '0x1234567890123456789012345678901234567890',
        rewardAmount: '1000000000000000000',
        onRewardClaimed: (txHash: string, amount: string) => {},
        userPaysGas: false,
      };
      
      expect(rewardProps.variant).toBe('outline');
      expect(rewardProps.size).toBe('sm');
      expect(rewardProps.disabled).toBe(true);
      expect(rewardProps.className).toBe('custom-button');
      expect(rewardProps.onClick).toBeDefined();
      expect(rewardProps.tokenAddress).toBe('0x1234567890123456789012345678901234567890');
      expect(rewardProps.rewardAmount).toBe('1000000000000000000');
      expect(rewardProps.onRewardClaimed).toBeDefined();
      expect(rewardProps.userPaysGas).toBe(false);
    });
  });

  describe('Type Safety', () => {
    it('enforces required types for TokenInfo', () => {
      const tokenInfo: TokenInfo = {
        symbol: 'USDC',
        decimals: 6,
        name: 'USD Coin',
      };
      
      expect(typeof tokenInfo.symbol).toBe('string');
      expect(typeof tokenInfo.decimals).toBe('number');
      expect(typeof tokenInfo.name).toBe('string');
    });

    it('enforces boolean types for RewardButtonState', () => {
      const state: RewardButtonState = {
        isLoading: false,
        error: null,
        tokenInfo: null,
        isSuccess: false,
      };
      
      expect(typeof state.isLoading).toBe('boolean');
      expect(typeof state.isSuccess).toBe('boolean');
    });

    it('enforces union types for variants and sizes', () => {
      const validVariants: ButtonProps['variant'][] = [
        'default',
        'secondary',
        'outline',
        'ghost',
        'destructive',
      ];
      
      const validSizes: ButtonProps['size'][] = [
        'default',
        'sm',
        'lg',
        'icon',
      ];
      
      validVariants.forEach(variant => {
        const props: ButtonProps = { variant };
        expect(validVariants).toContain(props.variant);
      });
      
      validSizes.forEach(size => {
        const props: ButtonProps = { size };
        expect(validSizes).toContain(props.size);
      });
    });
  });
}); 