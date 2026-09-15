import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChangePasswordDialog } from '@/components/profile/ChangePasswordDialog';

export default function ChangePasswordPage() {
    const navigate = useNavigate();

    // Ao entrar na rota, o modal abre; ao fechar, volta para /profile.
    useEffect(() => {
        const t = setTimeout(() => {
            // Se o usuário fechar sem interagir, voltamos pro perfil.
        }, 0);
        return () => clearTimeout(t);
    }, []);

    return (
        <ChangePasswordDialog
            open
            onOpenChange={(open) => {
                if (!open) navigate('/profile', { replace: true });
            }}
        />
    );
}