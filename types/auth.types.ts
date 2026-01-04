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