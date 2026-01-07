export enum Roles {
    ACCOUNTANT = "Accountant",
    SYSTEM_ADMIN = "SystemAdmin",
    DIRECTOR = "Director",
    EMPLOYEE = "Employee",
}

export interface LoginFormValues {
    userId: string;
    password: string;
    role: Roles;
}

export interface LoginResponse {
    token: string;
    userData: {
        id: string;
        email: string;
        role: Roles;
    };
}

export interface User {
    Oid: string;
    UserName: string;
    PasswordHash: string;
    Firstname: string;
    LastName: string;
    phone: string;
    Email: string;
    IsActive: boolean;
    CreatedDate: string; // ISO datetime
    AccountantOid: string;
    RoleName: "accountant" | string;
    PicUrl: string | null;
    Introduction: boolean;
    Description: string | null;
    Bank: string | null;
    BankAccountnum: string | null;
    BankAccountName: string | null;
    IntroductionIsAcitive: boolean;
    accountantName: string;
    deviceId: string;
}