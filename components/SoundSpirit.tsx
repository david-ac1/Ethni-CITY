"use client";

import { cn } from "@/lib/utils";

interface SoundSpiritProps {
    speaking?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeMap = {
    sm: { container: "w-16 h-16", bars: "h-6", barW: "w-1" },
    md: { container: "w-20 h-20", bars: "h-8", barW: "w-1.5" },
    lg: { container: "w-32 h-32", bars: "h-12", barW: "w-2" },
};

export default function SoundSpirit({ speaking = false, size = "md", className }: SoundSpiritProps) {
    const s = sizeMap[size];

    return (
        <div className={cn("flex flex-col items-center gap-2", className)}>
            {/* Waveform visualizer */}
            <div className="bg-white thick-outline p-3 rounded-lg">
                <div className={cn("flex gap-1 items-center justify-center", s.bars)}>
                    {[...Array(7)].map((_, i) => (
                        <span
                            key={i}
                            className={cn(
                                s.barW,
                                "rounded-full bg-primary waveform-bar",
                                speaking ? "" : "opacity-30"
                            )}
                            style={{
                                height: speaking ? undefined : "30%",
                                transform: "scaleY(0.4)",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
