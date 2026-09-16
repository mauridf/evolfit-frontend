import { useEffect } from 'react';
import { TOAST_EVENT, type ToastDetail, uiBus } from '@/lib/api/events';
import { toast } from '@/lib/ui/toast';

export function GlobalErrorListener() {
  useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent<ToastDetail>).detail;
      if (!detail) return;
      const fn = toast[detail.type] ?? toast.info;
      fn(detail.message);
    }
    uiBus.addEventListener(TOAST_EVENT, onToast as EventListener);
    return () => uiBus.removeEventListener(TOAST_EVENT, onToast as EventListener);
  }, []);

  return null;
}