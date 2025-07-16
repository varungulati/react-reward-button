# 🎁 React Reward Button

A clean, minimal, and accessible React button component inspired by shadcn/ui. Perfect for reward systems, gamification, and user engagement.

## Features

- 🚀 **Easy to use**: Simple React component with minimal setup
- 🔧 **Highly customizable**: Multiple variants, sizes, and full style control
- 🎨 **Beautiful UI**: Modern, accessible design with smooth animations
- 📱 **Mobile friendly**: Responsive design that works on all devices
- 🔒 **Type safe**: Full TypeScript support
- ⚡ **Performance optimized**: Minimal bundle size with zero external dependencies
- ♿ **Accessible**: Built with accessibility in mind (ARIA labels, keyboard navigation)
- 🎯 **Framework agnostic**: Works with any React app (no Tailwind required)

## Installation

```bash
npm install react-reward-button
```

## Quick Start

```jsx
import { RewardButton } from 'react-reward-button';

function MyComponent() {
  const handleReward = async () => {
    // Your reward logic here
    console.log('Reward claimed!');
  };

  return (
    <RewardButton onReward={handleReward}>
      Claim Reward
    </RewardButton>
  );
}
```

## API Reference

### RewardButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onReward` | `() => void \| Promise<void>` | `undefined` | Callback function called when button is clicked |
| `isLoading` | `boolean` | `false` | Whether the button is in loading state |
| `children` | `React.ReactNode` | `"Claim Reward"` | Button content |
| `variant` | `'default' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'` | `'default'` | Button visual variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `className` | `string` | `undefined` | Additional CSS classes |
| `...props` | `ButtonHTMLAttributes` | - | All standard button HTML attributes |

### Button Component

For non-reward use cases, use the base `Button` component:

```jsx
import { Button } from 'react-reward-button';

<Button onClick={handleClick} variant="outline">
  Regular Button
</Button>
```

## Examples

### Basic Usage

```jsx
import { RewardButton } from 'react-reward-button';

function BasicExample() {
  const handleReward = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Reward claimed!');
  };

  return (
    <RewardButton onReward={handleReward}>
      Claim Daily Reward
    </RewardButton>
  );
}
```

### Different Variants

```jsx
function VariantExample() {
  const handleReward = async () => {
    console.log('Reward claimed!');
  };

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <RewardButton variant="default" onReward={handleReward}>
        Default
      </RewardButton>
      <RewardButton variant="secondary" onReward={handleReward}>
        Secondary
      </RewardButton>
      <RewardButton variant="outline" onReward={handleReward}>
        Outline
      </RewardButton>
      <RewardButton variant="ghost" onReward={handleReward}>
        Ghost
      </RewardButton>
      <RewardButton variant="destructive" onReward={handleReward}>
        Destructive
      </RewardButton>
    </div>
  );
}
```

### Different Sizes

```jsx
function SizeExample() {
  const handleReward = async () => {
    console.log('Reward claimed!');
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <RewardButton size="sm" onReward={handleReward}>
        Small
      </RewardButton>
      <RewardButton size="default" onReward={handleReward}>
        Default
      </RewardButton>
      <RewardButton size="lg" onReward={handleReward}>
        Large
      </RewardButton>
      <RewardButton size="icon" onReward={handleReward}>
        🎁
      </RewardButton>
    </div>
  );
}
```

### Loading States

```jsx
function LoadingExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleReward = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      alert('Reward claimed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RewardButton 
      onReward={handleReward}
      isLoading={isLoading}
      variant="default"
      size="lg"
    >
      {isLoading ? 'Processing...' : 'Claim Reward'}
    </RewardButton>
  );
}
```

### Custom Content

```jsx
function CustomContentExample() {
  const handleReward = async () => {
    console.log('Premium reward claimed!');
  };

  return (
    <RewardButton onReward={handleReward} variant="secondary">
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>💎</span>
        <span>Premium Reward</span>
        <span>🚀</span>
      </span>
    </RewardButton>
  );
}
```

### Using the Base Button Component

```jsx
import { Button } from 'react-reward-button';

function ButtonExample() {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button onClick={() => console.log('clicked')}>
        Regular Button
      </Button>
      <Button variant="outline" disabled>
        Disabled Button
      </Button>
      <Button variant="ghost" isLoading>
        Loading Button
      </Button>
    </div>
  );
}
```

## Styling

### CSS Variables

You can customize the button appearance using CSS variables:

```css
.reward-button {
  --button-border-radius: 12px;
  --button-font-weight: 600;
}

.reward-button--default {
  --button-bg: #3b82f6;
  --button-bg-hover: #2563eb;
  --button-color: white;
}

.reward-button--secondary {
  --button-bg: #f1f5f9;
  --button-bg-hover: #e2e8f0;
  --button-color: #1e293b;
}
```

### Custom Styles

```jsx
<RewardButton
  onReward={handleReward}
  style={{
    backgroundColor: '#ff6b6b',
    borderRadius: '20px',
    padding: '12px 24px',
    fontSize: '16px',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
  }}
>
  Custom Styled Button
</RewardButton>
```

### Custom Classes

```jsx
<RewardButton
  onReward={handleReward}
  className="my-custom-button"
  variant="outline"
>
  Custom Class Button
</RewardButton>
```

## Accessibility

The component is built with accessibility in mind:

- ✅ **Keyboard navigation**: Full keyboard support with proper focus management
- ✅ **Screen readers**: ARIA labels and proper semantic HTML
- ✅ **Focus indicators**: Clear focus states for keyboard users
- ✅ **Loading states**: Proper loading indicators and disabled states
- ✅ **Color contrast**: Meets WCAG accessibility standards

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/react-reward-button/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/react-reward-button/discussions)

---

Made with ❤️ for the React community