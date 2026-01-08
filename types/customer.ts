export interface Customer {
    CustomerID: string;
    CustomerName: string;
    TIN?: string;
    Phone?: string;
    Email?: string;
    EBarimtRegistered?: boolean;
    NDRegistered?: boolean;
    TaxRegistered?: boolean;
    Active?: boolean;
    [key: string]: any;
}

export interface Taxpayer {
    cityPayer: boolean,
    directorLastName: string,
    directorName: string,
    found: boolean,
    freeProject: boolean,
    isGovernment: boolean,
    name: string,
    originalName: string,
    vatPayer: boolean,
    vatpayerRegisteredDate: string
}

export type Employee = {
    id: string
    firstName: string
    lastName: string
    rd: string
    phone: string
    accessRight: string
    status: "active" | "inactive"
}
