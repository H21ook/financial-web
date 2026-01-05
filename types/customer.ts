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
