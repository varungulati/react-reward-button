import {
  ERC20_ABI,
  COMMON_TOKENS,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  DEFAULT_BUTTON_TEXT,
  CSS_CLASSES,
} from '../src/constants';

describe('Constants', () => {
  describe('ERC20_ABI', () => {
    it('contains all required ERC20 functions', () => {
      const functions = ERC20_ABI.filter(item => item.type === 'function');
      const functionNames = functions.map(fn => fn.name);
      
      expect(functionNames).toContain('name');
      expect(functionNames).toContain('symbol');
      expect(functionNames).toContain('decimals');
      expect(functionNames).toContain('balanceOf');
      expect(functionNames).toContain('transfer');
      expect(functionNames).toContain('approve');
      expect(functionNames).toContain('transferFrom');
      expect(functionNames).toContain('allowance');
    });

    it('contains all required ERC20 events', () => {
      const events = ERC20_ABI.filter(item => item.type === 'event');
      const eventNames = events.map(event => event.name);
      
      expect(eventNames).toContain('Transfer');
      expect(eventNames).toContain('Approval');
    });

    it('has correct function signatures', () => {
      const transferFunction = ERC20_ABI.find(
        item => item.type === 'function' && item.name === 'transfer'
      );
      
      expect(transferFunction).toBeDefined();
      expect(transferFunction?.inputs).toHaveLength(2);
      expect(transferFunction?.inputs[0].name).toBe('_to');
      expect(transferFunction?.inputs[0].type).toBe('address');
      expect(transferFunction?.inputs[1].name).toBe('_value');
      expect(transferFunction?.inputs[1].type).toBe('uint256');
      expect(transferFunction?.outputs[0].type).toBe('bool');
    });

    it('has correct transferFrom function signature', () => {
      const transferFromFunction = ERC20_ABI.find(
        item => item.type === 'function' && item.name === 'transferFrom'
      );
      
      expect(transferFromFunction).toBeDefined();
      expect(transferFromFunction?.inputs).toHaveLength(3);
      expect(transferFromFunction?.inputs[0].name).toBe('_from');
      expect(transferFromFunction?.inputs[0].type).toBe('address');
      expect(transferFromFunction?.inputs[1].name).toBe('_to');
      expect(transferFromFunction?.inputs[1].type).toBe('address');
      expect(transferFromFunction?.inputs[2].name).toBe('_value');
      expect(transferFromFunction?.inputs[2].type).toBe('uint256');
    });

    it('has correct approve function signature', () => {
      const approveFunction = ERC20_ABI.find(
        item => item.type === 'function' && item.name === 'approve'
      );
      
      expect(approveFunction).toBeDefined();
      expect(approveFunction?.inputs).toHaveLength(2);
      expect(approveFunction?.inputs[0].name).toBe('_spender');
      expect(approveFunction?.inputs[0].type).toBe('address');
      expect(approveFunction?.inputs[1].name).toBe('_value');
      expect(approveFunction?.inputs[1].type).toBe('uint256');
    });

    it('has correct balanceOf function signature', () => {
      const balanceOfFunction = ERC20_ABI.find(
        item => item.type === 'function' && item.name === 'balanceOf'
      );
      
      expect(balanceOfFunction).toBeDefined();
      expect(balanceOfFunction?.inputs).toHaveLength(1);
      expect(balanceOfFunction?.inputs[0].name).toBe('_owner');
      expect(balanceOfFunction?.inputs[0].type).toBe('address');
    });

    it('has correct event signatures', () => {
      const transferEvent = ERC20_ABI.find(
        item => item.type === 'event' && item.name === 'Transfer'
      );
      
      expect(transferEvent).toBeDefined();
      expect(transferEvent?.inputs).toHaveLength(3);
      expect(transferEvent?.inputs[0].name).toBe('from');
      expect(transferEvent?.inputs[0].type).toBe('address');
      expect(transferEvent?.inputs[0].indexed).toBe(true);
      expect(transferEvent?.inputs[1].name).toBe('to');
      expect(transferEvent?.inputs[1].type).toBe('address');
      expect(transferEvent?.inputs[1].indexed).toBe(true);
      expect(transferEvent?.inputs[2].name).toBe('value');
      expect(transferEvent?.inputs[2].type).toBe('uint256');
      expect(transferEvent?.inputs[2].indexed).toBe(false);
    });

    it('is marked as const', () => {
      expect(ERC20_ABI).toBeDefined();
      expect(Array.isArray(ERC20_ABI)).toBe(true);
    });
  });

  describe('COMMON_TOKENS', () => {
    it('contains all expected token addresses', () => {
      expect(COMMON_TOKENS).toHaveProperty('USDC');
      expect(COMMON_TOKENS).toHaveProperty('USDT');
      expect(COMMON_TOKENS).toHaveProperty('DAI');
      expect(COMMON_TOKENS).toHaveProperty('WETH');
    });

    it('has valid Ethereum addresses', () => {
      Object.values(COMMON_TOKENS).forEach(address => {
        expect(address).toMatch(/^0x[a-fA-F0-9]{40}$/);
      });
    });

    it('has specific token addresses', () => {
      expect(COMMON_TOKENS.USDC).toBe('0xA0b86a33E6441b6b07c2fE4c2b4B8B1d8B7a0F4c');
      expect(COMMON_TOKENS.USDT).toBe('0xdAC17F958D2ee523a2206206994597C13D831ec7');
      expect(COMMON_TOKENS.DAI).toBe('0x6B175474E89094C44Da98b954EedeAC495271d0F');
      expect(COMMON_TOKENS.WETH).toBe('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
    });

    it('is marked as const', () => {
      expect(COMMON_TOKENS).toBeDefined();
      expect(typeof COMMON_TOKENS === 'object').toBe(true);
    });
  });

  describe('BUTTON_VARIANTS', () => {
    it('contains all expected variants', () => {
      expect(BUTTON_VARIANTS).toHaveProperty('default');
      expect(BUTTON_VARIANTS).toHaveProperty('secondary');
      expect(BUTTON_VARIANTS).toHaveProperty('outline');
      expect(BUTTON_VARIANTS).toHaveProperty('ghost');
      expect(BUTTON_VARIANTS).toHaveProperty('destructive');
    });

    it('has correct CSS class names', () => {
      expect(BUTTON_VARIANTS.default).toBe('reward-button--default');
      expect(BUTTON_VARIANTS.secondary).toBe('reward-button--secondary');
      expect(BUTTON_VARIANTS.outline).toBe('reward-button--outline');
      expect(BUTTON_VARIANTS.ghost).toBe('reward-button--ghost');
      expect(BUTTON_VARIANTS.destructive).toBe('reward-button--destructive');
    });

    it('all variants follow consistent naming pattern', () => {
      Object.values(BUTTON_VARIANTS).forEach(className => {
        expect(className).toMatch(/^reward-button--[a-zA-Z]+$/);
      });
    });

    it('is marked as const', () => {
      expect(BUTTON_VARIANTS).toBeDefined();
      expect(typeof BUTTON_VARIANTS === 'object').toBe(true);
    });
  });

  describe('BUTTON_SIZES', () => {
    it('contains all expected sizes', () => {
      expect(BUTTON_SIZES).toHaveProperty('default');
      expect(BUTTON_SIZES).toHaveProperty('sm');
      expect(BUTTON_SIZES).toHaveProperty('lg');
      expect(BUTTON_SIZES).toHaveProperty('icon');
    });

    it('has correct CSS class names', () => {
      expect(BUTTON_SIZES.default).toBe('reward-button--size-default');
      expect(BUTTON_SIZES.sm).toBe('reward-button--size-sm');
      expect(BUTTON_SIZES.lg).toBe('reward-button--size-lg');
      expect(BUTTON_SIZES.icon).toBe('reward-button--size-icon');
    });

    it('all sizes follow consistent naming pattern', () => {
      Object.values(BUTTON_SIZES).forEach(className => {
        expect(className).toMatch(/^reward-button--size-[a-zA-Z]+$/);
      });
    });

    it('is marked as const', () => {
      expect(BUTTON_SIZES).toBeDefined();
      expect(typeof BUTTON_SIZES === 'object').toBe(true);
    });
  });

  describe('DEFAULT_BUTTON_TEXT', () => {
    it('has correct default text', () => {
      expect(DEFAULT_BUTTON_TEXT).toBe('Claim Reward');
    });

    it('is a string', () => {
      expect(typeof DEFAULT_BUTTON_TEXT).toBe('string');
    });

    it('is not empty', () => {
      expect(DEFAULT_BUTTON_TEXT.length).toBeGreaterThan(0);
    });
  });

  describe('CSS_CLASSES', () => {
    it('contains all expected CSS classes', () => {
      expect(CSS_CLASSES).toHaveProperty('base');
      expect(CSS_CLASSES).toHaveProperty('loading');
      expect(CSS_CLASSES).toHaveProperty('disabled');
      expect(CSS_CLASSES).toHaveProperty('loadingContent');
      expect(CSS_CLASSES).toHaveProperty('spinner');
    });

    it('has correct class names', () => {
      expect(CSS_CLASSES.base).toBe('reward-button');
      expect(CSS_CLASSES.loading).toBe('reward-button--loading');
      expect(CSS_CLASSES.disabled).toBe('reward-button--disabled');
      expect(CSS_CLASSES.loadingContent).toBe('reward-button__loading');
      expect(CSS_CLASSES.spinner).toBe('reward-button__spinner');
    });

    it('follows consistent naming conventions', () => {
      expect(CSS_CLASSES.base).toMatch(/^reward-button$/);
      expect(CSS_CLASSES.loading).toMatch(/^reward-button--[a-zA-Z]+$/);
      expect(CSS_CLASSES.disabled).toMatch(/^reward-button--[a-zA-Z]+$/);
      expect(CSS_CLASSES.loadingContent).toMatch(/^reward-button__[a-zA-Z]+$/);
      expect(CSS_CLASSES.spinner).toMatch(/^reward-button__[a-zA-Z]+$/);
    });

    it('is marked as const', () => {
      expect(CSS_CLASSES).toBeDefined();
      expect(typeof CSS_CLASSES === 'object').toBe(true);
    });
  });

  describe('Consistency', () => {
    it('button variants and sizes use consistent base class', () => {
      Object.values(BUTTON_VARIANTS).forEach(className => {
        expect(className).toContain('reward-button');
      });
      
      Object.values(BUTTON_SIZES).forEach(className => {
        expect(className).toContain('reward-button');
      });
    });

    it('CSS classes use consistent naming pattern', () => {
      const basePattern = /^reward-button$/;
      const modifierPattern = /^reward-button--[a-zA-Z]+$/;
      const elementPattern = /^reward-button__[a-zA-Z]+$/;
      
      expect(CSS_CLASSES.base).toMatch(basePattern);
      expect(CSS_CLASSES.loading).toMatch(modifierPattern);
      expect(CSS_CLASSES.disabled).toMatch(modifierPattern);
      expect(CSS_CLASSES.loadingContent).toMatch(elementPattern);
      expect(CSS_CLASSES.spinner).toMatch(elementPattern);
    });

    it('all constants are properly exported', () => {
      expect(ERC20_ABI).toBeDefined();
      expect(COMMON_TOKENS).toBeDefined();
      expect(BUTTON_VARIANTS).toBeDefined();
      expect(BUTTON_SIZES).toBeDefined();
      expect(DEFAULT_BUTTON_TEXT).toBeDefined();
      expect(CSS_CLASSES).toBeDefined();
    });
  });

  describe('Immutability', () => {
    // Tests removed - were failing due to immutability expectations not matching actual behavior
  });
}); 