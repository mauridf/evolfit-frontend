import { cn } from '@/lib/utils/cn';

interface SpinnerProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    label?: string;
}

const SIZES = { sm: 'h-4 w-4 border-2', md: 'h-5 w-5 border-2', lg: 'h-8 w-8 border-[3px]' };

export function Spinner({ className, size = 'md', label = 'Carregando' }: SpinnerProps) {
    return (
        <span
            role="status"
            aria-label={label}
            className={cn(
                'inline-block animate-spin rounded-full border-current border-t-transparent',
                SIZES[size],
                className,
            )}
        />
    );
}