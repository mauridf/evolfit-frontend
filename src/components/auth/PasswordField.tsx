import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from '@/components/ui/Input';

export type PasswordFieldProps = Omit<InputProps, 'type' | 'trailing'>;

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
    function PasswordField(props, ref) {
        const [visible, setVisible] = useState(false);
        return (
            <Input
                {...props}
                ref={ref}
                type={visible ? 'text' : 'password'}
                trailing={
                    <button
                        type="button"
                        tabIndex={-1}
                        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
                        onClick={() => setVisible((v) => !v)}
                        className="rounded-input p-1 text-foreground/50 transition-colors hover:text-foreground"
                    >
                        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                }
            />
        );
    },
);

// Reexport para conveniência de tipagem
export type { InputHTMLAttributes };