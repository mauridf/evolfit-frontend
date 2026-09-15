import { cn } from '@/lib/utils/cn';

export interface AvatarProps {
    displayName: string;
    /** URL opcional de imagem; quando ausente, mostramos as iniciais. */
    src?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const SIZES = {
    sm: 'h-7 w-7 text-mono-label',
    md: 'h-9 w-9 text-body-sm',
    lg: 'h-28 w-28 text-headline-xl',
};

function initialsOf(name: string): string {
    return (
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase() ?? '')
            .join('') || '?'
    );
}

export function Avatar({ displayName, src, size = 'md', className }: AvatarProps) {
    return (
        <span
            className={cn(
                'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-input border border-primary/30 bg-primary/15 font-mono text-primary',
                SIZES[size],
                className,
            )}
            aria-hidden={!!src}
        >
            {src ? (
                <img src={src} alt={displayName} className="h-full w-full object-cover" />
            ) : (
                initialsOf(displayName)
            )}
        </span>
    );
}