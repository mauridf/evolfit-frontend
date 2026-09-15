/**
 * Armazenamento de tokens.
 * - access token: MEMÓRIA (não persiste; some ao recarregar a página).
 * - refresh token: localStorage (MVP). Em produção, migrar para cookie httpOnly
 *   quando o backend suportar (nota no README).
 */

const REFRESH_STORAGE_KEY = 'evolfit:refreshToken';

let accessToken: string | null = null;
let refreshToken: string | null = readRefreshFromStorage();

function readRefreshFromStorage(): string | null {
    try {
        return window.localStorage.getItem(REFRESH_STORAGE_KEY);
    } catch {
        return null;
    }
}

function writeRefreshToStorage(token: string | null) {
    try {
        if (token) window.localStorage.setItem(REFRESH_STORAGE_KEY, token);
        else window.localStorage.removeItem(REFRESH_STORAGE_KEY);
    } catch {
        /* storage indisponível — segue só com memória */
    }
}

export const tokenStore = {
    getAccess(): string | null {
        return accessToken;
    },
    getRefresh(): string | null {
        return refreshToken;
    },
    setTokens(access: string, refresh: string) {
        accessToken = access;
        refreshToken = refresh;
        writeRefreshToStorage(refresh);
    },
    setAccess(access: string) {
        accessToken = access;
    },
    clear() {
        accessToken = null;
        refreshToken = null;
        writeRefreshToStorage(null);
    },
    hasSession(): boolean {
        return accessToken !== null || refreshToken !== null;
    },
};