import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@shared/lib/cn";

const alertVariants = cva(
  "relative w-full rounded-md border p-4 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:size-4 [&>svg+*]:pl-7",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-bg-elevated)] text-[var(--color-fg)] border-[var(--color-border)]",
        info:
          "bg-[var(--color-accent-soft)] text-[var(--color-fg)] border-[color-mix(in_oklab,var(--color-accent),transparent_70%)]",
        warning:
          "bg-[color-mix(in_oklab,var(--color-warning),transparent_85%)] text-[var(--color-fg)] border-[var(--color-warning)]",
        danger:
          "bg-[color-mix(in_oklab,var(--color-danger),transparent_85%)] text-[var(--color-fg)] border-[var(--color-danger)]",
        success:
          "bg-[color-mix(in_oklab,var(--color-success),transparent_85%)] text-[var(--color-fg)] border-[var(--color-success)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  ),
);
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";
