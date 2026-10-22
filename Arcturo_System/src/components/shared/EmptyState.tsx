"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    actionLabel: string;
    onAction: () => void;
    recommendationsTitle: string;
    children?: React.ReactNode;
}

export function EmptyState({
    icon: Icon,
    title,
    subtitle,
    actionLabel,
    onAction,
    recommendationsTitle,
    children
}: EmptyStateProps) {
    return (
        <div className="w-full">
            <div className="flex flex-col items-center justify-center p-12 bg-obsidian-card rounded-3xl border border-border shadow-none">
                <div className="size-16 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                    <Icon className="size-8 text-gold" />
                </div>
                <h2 className="text-content-primary font-bold text-2xl">{title}</h2>
                <p className="text-content-muted mt-2 text-center max-w-sm mb-8">
                    {subtitle}
                </p>
                <Button 
                    onClick={onAction}
                    className="h-12 px-10 bg-gold text-obsidian-nav font-black uppercase tracking-widest text-[11px] rounded-full hover:bg-gold/90 transition-all active:scale-95 shadow-none"
                >
                    {actionLabel}
                </Button>
            </div>

            <div className="flex flex-col gap-6 mt-20">
                <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold text-content-primary tracking-tight text-left">
                        {recommendationsTitle}
                    </h3>
                    <div className="w-full border-b border-border" />
                </div>
                {children}
            </div>
        </div>
    );
}
