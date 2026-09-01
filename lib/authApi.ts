import { API_BASE_URL, apiFetch } from "@/lib/api-client";
import type { ChangePasswordRequest, SubscriptionInfo, UpdateUserRequest, User } from "@/app/types/user";

export function getGoogleOAuthUrl() {
  return `${API_BASE_URL}/oauth2/authorization/google`;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  email: string;
}

export interface VerifyOtpRequest {
  otp: string;
  email: string;
  purpose: string;
}

export interface VerifyOtpResponse {
  resetToken?: string;
}

export function loginUser(data: LoginRequest) {
  return apiFetch<void>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function registerUser(data: RegisterRequest) {
  return apiFetch<RegisterResponse>("/api/v1/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function sendOtp(email: string) {
  return apiFetch<void>("/api/v1/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyOtp(data: VerifyOtpRequest) {
  return apiFetch<VerifyOtpResponse>("/api/v1/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function resetPassword(newPassword: string, resetToken: string) {
  return apiFetch<void>("/api/v1/auth/reset-password", {
    method: "PATCH",
    body: JSON.stringify({ newPassword, resetToken }),
  });
}

export function updateUser(data: UpdateUserRequest) {
  return apiFetch<User>("/api/v1/users/me", { method: "PUT", body: JSON.stringify(data) });
}

export function getSubscriptionInfo() {
  return apiFetch<SubscriptionInfo>("/api/v1/users/me/subscription");
}

export function changePassword(data: ChangePasswordRequest) {
  return apiFetch<void>("/api/v1/users/me/change-password", { method: "PATCH", body: JSON.stringify(data) });
}

export function logOutUser() {
  return apiFetch<void>("/api/v1/auth/logout", {method: "POST"})
}
