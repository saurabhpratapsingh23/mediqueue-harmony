
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-xl text-card-foreground shadow transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card",
        glass: "glass-card",
        outline: "bg-transparent border",
        elevated: "bg-card shadow-elevated hover:shadow-lg",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      hover: {
        none: "",
        subtle: "hover:translate-y-[-3px] hover:shadow-md",
        lift: "hover:translate-y-[-5px] hover:shadow-elevated",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      hover: "none",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const AppCard = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, hover, className }))}
        {...props}
      />
    );
  }
);

AppCard.displayName = "AppCard";

export { AppCard, cardVariants };
