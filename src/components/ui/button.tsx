import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary/92 text-primary-foreground shadow-[0_14px_35px_hsl(var(--primary)/0.22)] backdrop-blur hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_18px_45px_hsl(var(--primary)/0.28)]",
        destructive: "bg-destructive/90 text-destructive-foreground shadow-sm backdrop-blur hover:bg-destructive",
        outline:
          "border border-white/55 bg-white/55 text-foreground shadow-sm backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/35 hover:-translate-y-0.5 hover:bg-white/80 hover:text-primary hover:shadow-md",
        secondary: "border border-white/45 bg-secondary/65 text-secondary-foreground shadow-sm backdrop-blur-xl hover:bg-secondary/85",
        ghost: "hover:bg-white/50 hover:text-primary hover:shadow-sm hover:backdrop-blur-xl",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
