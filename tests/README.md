# Test Suite Documentation

This directory contains comprehensive test cases for the React Reward Button component library.

## Test Structure

The test suite is organized into several categories:

### Core Component Tests
- **`Button.test.tsx`** - Tests for the basic Button component
- **`RewardButton.test.tsx`** - Tests for the main RewardButton component with Web3 functionality
- **`integration.test.tsx`** - Integration tests that test components working together

### Utility and Type Tests
- **`utils.test.ts`** - Tests for utility functions (cn function)
- **`constants.test.ts`** - Tests for constants validation
- **`types.test.ts`** - Tests for TypeScript type definitions

### Specialized Tests
- **`error-handling.test.tsx`** - Comprehensive error handling scenarios
- **`state-management.test.tsx`** - State management and callback function tests

### Test Infrastructure
- **`setup.ts`** - Jest setup and global mocks
- **`test-utils.tsx`** - Test utilities and helper functions
- **`README.md`** - This documentation file

## Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

### Running Specific Test Files

```bash
# Run only Button component tests
npm test Button.test.tsx

# Run only RewardButton component tests
npm test RewardButton.test.tsx

# Run only error handling tests
npm test error-handling.test.tsx
```

### Running Tests with Specific Patterns

```bash
# Run tests matching a specific pattern
npm test -- --testNamePattern="wallet connection"

# Run tests in a specific file matching a pattern
npm test RewardButton.test.tsx -- --testNamePattern="transaction"
```

## Test Coverage

The test suite provides comprehensive coverage of:

### Button Component (Button.test.tsx)
- ✅ Basic rendering and props
- ✅ All button variants (default, secondary, outline, ghost, destructive)
- ✅ All button sizes (default, sm, lg, icon)
- ✅ Loading states and custom loading text
- ✅ Success states with confetti animations
- ✅ Event handling (onClick, disabled states)
- ✅ CSS classes and styling
- ✅ Accessibility features
- ✅ HTML attribute forwarding
- ✅ Ref forwarding
- ✅ Edge cases and error conditions

### RewardButton Component (RewardButton.test.tsx)
- ✅ Basic rendering in both regular and reward modes
- ✅ Wallet connection flow and state management
- ✅ Transaction execution (both sender and user pays gas modes)
- ✅ Loading states throughout the transaction lifecycle
- ✅ Success and error handling
- ✅ Callback function execution
- ✅ Security features and wallet validation
- ✅ Token information handling
- ✅ Component prop forwarding
- ✅ Edge cases and error recovery

### Integration Tests (integration.test.tsx)
- ✅ Full reward flow from start to finish
- ✅ Wallet connection integration
- ✅ State management across component lifecycle
- ✅ Error handling integration
- ✅ Component composition and interaction
- ✅ Real-world scenarios (rapid clicking, wallet switching, etc.)
- ✅ Performance considerations

### Error Handling (error-handling.test.tsx)
- ✅ Wallet connection errors
- ✅ Transaction submission errors
- ✅ Blockchain confirmation errors
- ✅ Token transfer specific errors
- ✅ Validation errors
- ✅ Security-related errors
- ✅ Error recovery mechanisms
- ✅ User-friendly error messages

### State Management (state-management.test.tsx)
- ✅ State transitions through all phases
- ✅ Loading state management
- ✅ Success state handling
- ✅ Callback function execution
- ✅ Button text management
- ✅ State persistence and lifecycle
- ✅ Component cleanup

### Utilities and Infrastructure
- ✅ Utility function testing (cn function)
- ✅ Constants validation
- ✅ TypeScript type safety
- ✅ Mock implementations
- ✅ Test helper functions

## Test Utilities

### Mock Functions

The test suite includes comprehensive mocking for:

- **Wagmi Hooks**: `useAccount`, `useConnect`, `useWriteContract`, `useWaitForTransactionReceipt`
- **Reown AppKit**: `useAppKit`
- **Ethers.js**: `JsonRpcProvider`, `Wallet`, `Contract`, `formatUnits`
- **Window.ethereum**: Complete Web3 provider mocking

### Helper Functions

- `setupDefaultMocks()` - Sets up standard mock configurations
- `mockWalletConnected()` - Simulates connected wallet state
- `mockWalletDisconnected()` - Simulates disconnected wallet state
- `mockTransactionLoading()` - Simulates transaction loading state
- `mockTransactionSuccess()` - Simulates successful transaction
- `mockTransactionError()` - Simulates transaction error
- `createRewardButtonProps()` - Creates test props for RewardButton
- `createButtonProps()` - Creates test props for Button

### Test Data

- **TEST_ADDRESSES**: Common test addresses for users, senders, tokens
- **TEST_AMOUNTS**: Common test amounts in wei
- **TEST_TX_HASH**: Mock transaction hash
- **TEST_PRIVATE_KEY**: Mock private key for testing

## Test Configuration

### Jest Configuration

The test suite uses Jest with the following configuration:

- **Environment**: jsdom (for React component testing)
- **Test Match**: `**/__tests__/**/*.(ts|tsx|js)` and `**/*.(test|spec).(ts|tsx|js)`
- **Setup**: `tests/setup.ts` for global setup and mocks
- **Coverage**: Configured to collect coverage from `src/**/*.{ts,tsx}`
- **Module Name Mapping**: CSS files are mocked with `identity-obj-proxy`

### TypeScript Configuration

Tests are written in TypeScript and use the same tsconfig.json as the main project, ensuring type safety across the codebase.

## Writing New Tests

### Test Structure

Follow this structure when writing new tests:

```typescript
describe('Component/Feature Name', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  describe('Feature Category', () => {
    it('should test specific behavior', async () => {
      // Arrange
      const props = createRewardButtonProps();
      
      // Act
      render(<RewardButton {...props} />);
      fireEvent.click(screen.getByRole('button'));
      
      // Assert
      await waitFor(() => {
        expect(screen.getByText('Expected Text')).toBeInTheDocument();
      });
    });
  });
});
```

### Best Practices

1. **Use descriptive test names** - Tests should clearly describe what they're testing
2. **Follow AAA pattern** - Arrange, Act, Assert
3. **Use test utilities** - Leverage existing helper functions
4. **Test user interactions** - Focus on how users interact with components
5. **Mock external dependencies** - Use the provided mock functions
6. **Test error conditions** - Don't just test happy paths
7. **Use async/await** - For testing asynchronous operations
8. **Clean up after tests** - Use `beforeEach` to reset state

### Common Patterns

```typescript
// Testing component rendering
render(<Component {...props} />);
expect(screen.getByText('Expected Text')).toBeInTheDocument();

// Testing user interactions
fireEvent.click(screen.getByRole('button'));
await waitFor(() => {
  expect(mockCallback).toHaveBeenCalled();
});

// Testing async operations
await waitFor(() => {
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

// Testing error states
mockTransactionError(new Error('Test error'));
await waitFor(() => {
  expect(screen.getByText(/Test error/)).toBeInTheDocument();
});
```

## Debugging Tests

### Common Issues

1. **Tests timing out** - Increase timeout or use proper `waitFor` statements
2. **Mocks not working** - Ensure `setupDefaultMocks()` is called in `beforeEach`
3. **Component not rendering** - Check console for React warnings
4. **Async operations** - Use `waitFor` for async state changes

### Debugging Tips

```typescript
// Add debug output to see what's rendered
screen.debug();

// Check current state of mocks
console.log(mockUseAccount.mock.calls);

// Add custom queries for debugging
const { container } = render(<Component />);
console.log(container.innerHTML);
```

## Coverage Goals

The test suite aims for:
- **Line Coverage**: >95%
- **Branch Coverage**: >90%
- **Function Coverage**: >95%
- **Statement Coverage**: >95%

## Continuous Integration

Tests are designed to run in CI/CD environments with:
- **No external dependencies** - All external services are mocked
- **Deterministic results** - Tests should pass consistently
- **Fast execution** - Optimized for quick feedback
- **Comprehensive coverage** - Catches regressions effectively

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Add tests for new functionality
4. Update this documentation if needed
5. Run coverage report to ensure adequate coverage

For bug fixes:
1. Write a test that reproduces the bug
2. Fix the bug
3. Ensure the test passes
4. Verify no regressions in existing tests 