import type { Gender } from '@/lib/constants';

/* ---------- POST /auth/register ---------- */

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    displayName: string;
    birthDate?: string; // ISO date (YYYY-MM-DD)
}

export interface RegisterResponse {
    id: number;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
}

/* ---------- POST /auth/login ---------- */

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    displayName: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // segundos
    user: AuthUser;
}

/* ---------- POST /auth/refresh ---------- */

export interface RefreshRequest {
    refreshToken: string;
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

/* ---------- POST /auth/logout ---------- */

export interface LogoutRequest {
    refreshToken: string;
}

/* ---------- GET /auth/profile ---------- */

export interface ProfileResponse {
    id: number;
    username: string;
    email: string;
    displayName: string;
    birthDate: string | null;
    createdAt: string;
}

/* ---------- PUT /auth/profile ---------- */

export interface UpdateProfileRequest {
    displayName: string;
    birthDate?: string;
}

/* ---------- POST /auth/change-password ---------- */

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

/* Re-export para conveniência */
export type { Gender };