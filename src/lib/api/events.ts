/**
 * Barramento mínimo de eventos do frontend.
 * Usamos EventTarget nativo para não puxar dependência extra.
 */

export const AUTH_EXPIRED_EVENT = 'auth:expired' as const;
export const TOAST_EVENT = 'ui:toast' as const;

type ToastDetail = {
    type: 'success' | 'warning' | 'error';
    message: string;
    sticky?: boolean;
};

class UiBus extends EventTarget {
    emitAuthExpired() {
        this.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }
    emitToast(detail: ToastDetail) {
        this.dispatchEvent(new CustomEvent<ToastDetail>(TOAST_EVENT, { detail }));
    }
}

export const uiBus = new UiBus();

export type { ToastDetail };