import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpeechBubbleProps {
    children: ReactNode;
    className?: string;
    tailDirection?: "left" | "right" | "bottom-left";
    variant?: "white" | "primary";
}

export default function SpeechBubble({
    children,
    className,
    tailDirection = "bottom-left",
    variant = "white",
}: SpeechBubbleProps) {
    const isWhite = variant === "white";

    const tailMap = {
        "bottom-left": (
            <div
                className={cn(
                    "absolute bottom-[-16px] left-10 w-8 h-8 rotate-45 border-b-4 border-r-4",
                    isWhite
                        ? "bg-white border-black"
                        : "bg-primary border-primary"
                )}
            />
        ),
        left: (
            <div
                className={cn(
                    "absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 border-t-0 border-r-0 border-2",
                    isWhite ? "bg-white border-black" : "bg-primary border-primary"
                )}
            />
        ),
        right: (
            <div
                className={cn(
                    "absolute -right-4 top-4 w-8 h-8 rotate-45 border-b-4 border-l-4",
                    isWhite ? "bg-white border-black" : "bg-primary border-primary"
                )}
            />
        ),
    };

    return (
        <div
            className={cn(
                "relative border-4 border-black p-4 rounded-3xl",
                isWhite ? "bg-white" : "bg-primary text-white",
                "neo-brutalism-shadow-sm",
                className
            )}
        >
            {children}
            {tailMap[tailDirection]}
        </div>
    );
}
