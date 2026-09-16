import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/Dialog';
import { AUTH_EXPIRED_EVENT, uiBus } from '@/lib/api/events';
import { tokenStore } from '@/lib/auth/tokenStore';
import { useAuthStore } from '@/stores/auth.store';

export function SessionExpiredDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function onExpired() {
      setOpen(true);
    }
    uiBus.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => uiBus.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  function goLogin() {
    setOpen(false);
    navigate('/login', { replace: true });
  }

  function logout() {
    tokenStore.clear();
    useAuthStore.getState().clear();
    setOpen(false);
    navigate('/login', { replace: true });
  }

  return (
    <Dialog open={open} onOpenChange={() => undefined}>
      <DialogContent
        title="Sessão expirada"
        description="Sua sessão terminou (token expirado ou reutilizado)."
        hideClose
        // Previne fechar clicando fora / Esc
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex items-start gap-3 rounded-input border border-warning/40 bg-warning/10 p-3 text-body-sm text-warning">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            Tentamos renovar automaticamente; se isto repetir, faça login novamente. Nenhum dado
            foi perdido.
          </p>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={logout}>
            Sair
          </Button>
          <Button onClick={goLogin}>Continuar logado</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}