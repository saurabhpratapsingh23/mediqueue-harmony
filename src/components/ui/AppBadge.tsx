import React from 'react';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

export interface AppBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  className?: string;
}

export const AppBadge = React.forwardRef<HTMLDivElement, AppBadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const badgeVariant = variant === 'success' ? 'default' : variant;
    
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variant === 'success' && "bg-green-500 text-white border-green-600 hover:bg-green-600",
          variant === 'default' && "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
          variant === 'secondary' && "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
          variant === 'destructive' && "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
          variant === 'outline' && "text-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

AppBadge.displayName = "AppBadge"; 