export interface Account {
    Oid: string;
    Code: string;
    Name: string;
}

export interface AccountBalance {
    Oid: string;
    CustomerOid: string;
    YearType: number;
    ActiveAmount: number;
    PassiveAmount: number;
    CustomerName: string;
    CustomerPin: string;
}
