"use client";

import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const Command = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
    <CommandPrimitive
        ref={ref}
        className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-xl bg-obsidian-card text-content-primary",
            className
        )}
        {...props}
    />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
    return (
        <DialogPrimitive.Root {...props}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm transition-all" />
                <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-[10001] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border-border bg-obsidian-card shadow-none md:rounded-3xl overflow-hidden focus:outline-none h-full md:h-auto md:max-h-[85vh] border-0 md:border">
                    <DialogPrimitive.Title className="sr-only">Menu de Busca</DialogPrimitive.Title>
                    <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-content-muted [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 bg-obsidian-card h-full md:h-auto">
                        {children}
                    </Command>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

const CommandInput = React.forwardRef<
    HTMLInputElement,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
    <div className="flex items-center border-b border-border px-4" cmdk-input-wrapper="">
        <Search className="mr-3 h-5 w-5 shrink-0 text-content-muted" />
        <CommandPrimitive.Input
            ref={ref}
            className={cn(
                "flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none text-content-primary placeholder:text-content-muted/30 disabled:cursor-not-allowed disabled:opacity-50 font-medium",
                className
            )}
            {...props}
        />
    </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.List
        ref={ref}
        className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden p-2", className)}
        {...props}
    />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
    <CommandPrimitive.Empty
        ref={ref}
        className="py-6 text-center text-sm font-medium text-content-muted"
        {...props}
    />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
        ref={ref}
        className={cn(
            "overflow-hidden p-1 text-content-primary [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-content-muted",
            className
        )}
        {...props}
    />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandItem = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex items-center rounded-lg px-3 py-3 text-sm font-bold outline-none aria-selected:bg-obsidian-hover aria-selected:text-gold data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors uppercase tracking-tight w-full cursor-pointer select-none text-content-primary",
            className
        )}
        {...props}
    />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
};
