import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Tier = 1 | 2;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    tier?: Tier;
    interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
    { tier = 1, interactive, className, children, ...rest },
    ref,
) {
    return (
        <div
            ref={ref}
            className={cn(
                tier === 1 ? 'card-tier1' : 'card-tier2',
                interactive && 'cursor-pointer hover:shadow-glow',
                className,
            )}
            {...rest}
        >
            {children}
        </div>
    );
});

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('flex flex-col gap-1 p-6 pb-3', className)} {...rest} />;
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={cn('text-headline-sm text-foreground', className)} {...rest} />;
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
    return <p className={cn('text-body-sm text-foreground/60', className)} {...rest} />;
}

export function CardContent({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('p-6 pt-3', className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('flex items-center gap-3 p-6 pt-0', className)} {...rest} />;
}