import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "malachite" | "terracotta" | "electric-violet" | "red" | "copper";
    size?: "sm" | "md" | "lg" | "xl";
    shape?: "rounded" | "pill" | "rect";
    shadow?: boolean;
}

const variantClasses: Record<string, string> = {
    primary: "bg-primary text-white",
    malachite: "bg-malachite text-slate-900",
    terracotta: "bg-terracotta text-white",
    "electric-violet": "bg-electric-violet text-white",
    red: "bg-red-600 text-white",
    copper: "hammered-texture text-white",
};

const sizeClasses: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-12 py-6 text-2xl md:text-4xl",
};

const shapeClasses: Record<string, string> = {
    rounded: "rounded-xl",
    pill: "rounded-full",
    rect: "rounded-sm",
};

export default function NeoButton({
    children,
    className,
    variant = "primary",
    size = "md",
    shape = "rounded",
    shadow = true,
    ...props
}: NeoButtonProps) {
    return (
        <button
            className={cn(
                "border-4 border-black font-black uppercase tracking-wide transition-all",
                "hover:translate-x-2 hover:translate-y-2",
                shadow ? "neo-brutalism-shadow hover:shadow-none" : "",
                variantClasses[variant],
                sizeClasses[size],
                shapeClasses[shape],
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
