export interface User{
    id: string,
    firstName: string,
    lastName: string,
    email: string
    emailVerfied: boolean
}

export interface UpdateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
}

export interface SubscriptionInfo {
    plan: string;
    analysesUsed: number;
    analysesAllowed: number;
    analysesRemaining: number;
    usagePercentage: number;
    hasQuotaRemaining: boolean;
    endPeriod: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
