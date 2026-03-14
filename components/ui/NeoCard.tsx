import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NeoCardProps {
    children: ReactNode;
    className?: string;
    variant?: "white" | "dark" | "primary" | "malachite" | "terracotta" | "electric-violet";
    shadow?: "neo" | "neo-sm" | "mechanical" | "none";
    rotation?: number;
}

const variantClasses: Record<string, string> = {
    white: "bg-white",
    dark: "bg-background-dark text-white",
    primary: "bg-primary text-white",
    malachite: "bg-malachite",
    terracotta: "bg-terracotta text-white",
    "electric-violet": "bg-electric-violet text-white",
};

const shadowClasses: Record<string, string> = {
    neo: "neo-brutalism-shadow",
    "neo-sm": "neo-brutalism-shadow-sm",
    mechanical: "mechanical-shadow",
    none: "",
};

export default function NeoCard({
    children,
    className,
    variant = "white",
    shadow = "neo-sm",
    rotation,
}: NeoCardProps) {
    const style = rotation ? { transform: `rotate(${rotation}deg)` } : undefined;

    return (
        <div
            className={cn(
                "border-4 border-black rounded-xl",
                variantClasses[variant],
                shadowClasses[shadow],
                className
            )}
            style={style}
        >
            {children}
        </div>
    );
}
