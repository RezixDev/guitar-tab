import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@shared/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:bg-[color-mix(in_oklab,var(--color-accent),black_8%)] shadow-sm",
        secondary:
          "bg-[var(--color-bg-elevated)] text-[var(--color-fg)] border border-[var(--color-border)] hover:bg-[var(--color-accent-soft)]",
        ghost:
          "text-[var(--color-fg)] hover:bg-[var(--color-accent-soft)]",
        outline:
          "border border-[var(--color-border-strong)] text-[var(--color-fg)] hover:bg-[var(--color-accent-soft)]",
        danger:
          "bg-[var(--color-danger)] text-white hover:bg-[color-mix(in_oklab,var(--color-danger),black_10%)]",
        link:
          "text-[var(--color-accent)] underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
