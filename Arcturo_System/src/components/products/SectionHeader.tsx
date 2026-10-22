"use client";


interface SectionHeaderProps {
    title: string;
}

export const SectionHeader = ({ title }: SectionHeaderProps) => {
    return (
        <div className="flex items-center pt-2 pb-4">
            <div className="text-xl md:text-2xl font-bold font-heading text-content-primary tracking-tight">
                {title}
            </div>
        </div>
    );
};
