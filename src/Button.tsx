import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from './utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Whether the button should render as a child component (using Slot)
   * This allows for composition patterns common in shadcn/ui
   */
  asChild?: boolean;
  /**
   * Visual variants for the button
   */
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  /**
   * Size variants for the button
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;
}

const buttonVariants = {
  variant: {
    default: 'reward-button--default',
    secondary: 'reward-button--secondary',
    outline: 'reward-button--outline',
    ghost: 'reward-button--ghost',
    destructive: 'reward-button--destructive',
  },
  size: {
    default: 'reward-button--size-default',
    sm: 'reward-button--size-sm',
    lg: 'reward-button--size-lg',
    icon: 'reward-button--size-icon',
  },
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default',
    asChild = false,
    isLoading = false,
    disabled,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(
          'reward-button',
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          isLoading && 'reward-button--loading',
          (disabled || isLoading) && 'reward-button--disabled',
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="reward-button__loading">
            <span className="reward-button__spinner" />
            Loading...
          </span>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button }; 