import { get, post, put } from '@/lib/api/client';
import type {
    ChangePasswordRequest,
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    ProfileResponse,
    RefreshRequest,
    RefreshResponse,
    RegisterRequest,
    RegisterResponse,
    UpdateProfileRequest,
} from '@/types/auth.types';

/* POST /auth/register */
export function register(body: RegisterRequest): Promise<RegisterResponse> {
    return post<RegisterResponse, RegisterRequest>('/auth/register', body);
}

/* POST /auth/login */
export function login(body: LoginRequest): Promise<LoginResponse> {
    return post<LoginResponse, LoginRequest>('/auth/login', body);
}

/* POST /auth/refresh */
export function refresh(body: RefreshRequest): Promise<RefreshResponse> {
    return post<RefreshResponse, RefreshRequest>('/auth/refresh', body);
}

/* POST /auth/logout */
export function logout(body: LogoutRequest): Promise<void> {
    return post<void, LogoutRequest>('/auth/logout', body);
}

/* GET /auth/profile */
export function getProfile(): Promise<ProfileResponse> {
    return get<ProfileResponse>('/auth/profile');
}

/* PUT /auth/profile */
export function updateProfile(body: UpdateProfileRequest): Promise<ProfileResponse> {
    return put<ProfileResponse, UpdateProfileRequest>('/auth/profile', body);
}

/* POST /auth/change-password */
export function changePassword(body: ChangePasswordRequest): Promise<void> {
    return post<void, ChangePasswordRequest>('/auth/change-password', body);
}