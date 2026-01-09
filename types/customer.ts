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
}

export interface Taxpayer {
  cityPayer: boolean;
  directorLastName: string;
  directorName: string;
  found: boolean;
  freeProject: boolean;
  isGovernment: boolean;
  name: string;
  originalName: string;
  vatPayer: boolean;
  vatpayerRegisteredDate: string;
}

export interface CustomerDetailType {
  Oid: string;
  CustomerID: string;
  CustomerName: string;
  ShortName: string;
  IsVatPayer: boolean;
  IsCityPayer: boolean;
  TinCode: string;
  Director: string;
  DrFirstname: string;
  DrLastname: string;
  BusinessClassOid: string;
  RegionId: string;
  RegionSubId: string;
  Address: string;
  Phone: string;
  Mail: string;
  ContractAmount: number;
  ContractEndDate: string;
  DigitalSignaturePassword: string;
  DigitalCertFilePath: string;
  EBarimtRegistered: string;
  TaxLoginOid: string;
  Active: boolean;
  CreatedDate: string;
  Contract_Time: string;
  InsuranceLoginId: string | null;
  empId: string | null;
  entId: string;
  pin: string;
  branchId: string | null;
  "X-API-KEY": string | null;
}

export interface Employee {
  Oid: string;
  CustomerOid: string;
  Code: string;
  Name: string;
  LastName: string;
  TIN: string;
  InsureNumber: string;
  InsureCategoryId?: string;
  Salary?: number;
  OccupationCategoryId?: string;
  InsureTypeCode?: string;
  InsureTypeName?: string;
  OccupationCode?: string;
  OccupationName?: string;
}
