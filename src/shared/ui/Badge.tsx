import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@shared/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-accent)] text-[var(--color-accent-fg)]",
        secondary:
          "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg)]",
        soft:
          "border-transparent bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
        outline:
          "border-[var(--color-border-strong)] text-[var(--color-fg)]",
        success:
          "border-transparent bg-[var(--color-success)] text-white",
        danger:
          "border-transparent bg-[var(--color-danger)] text-white",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
