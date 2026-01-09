import { cacheLife } from "next/cache";
import { serverFetcher } from "../fetcher/serverFetcher";
import type { BusinessClass, Region, SubRegion } from "@/types/reference";
import { getAccessToken } from "../tokens";
import { Customer, CustomerDetailType, Employee } from "@/types/customer";

export const getRegions = async (): Promise<Region[]> => {
  "use cache";
  cacheLife("days");

  const res = await serverFetcher.get<{
    data: Region[];
  }>(`/api/regions`, undefined, {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!res.isOk) {
    console.error(res);
    return [];
  }

  return res.data.data;
};

export const getAllSubRegions = async (): Promise<SubRegion[]> => {
  "use cache";
  cacheLife("days");

  const res = await serverFetcher.get<{
    data: SubRegion[];
  }>(`/api/regions/subs-all`, undefined, {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!res.isOk) {
    console.error(res);
    return [];
  }

  return res.data.data;
};

export const getBusinessClasses = async (): Promise<BusinessClass[]> => {
  "use cache";
  cacheLife("days");

  const res = await serverFetcher.get<{
    data: BusinessClass[];
  }>(`/api/BusinessClassOid`, undefined, {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!res.isOk) {
    console.error(res);
    return [];
  }

  return res.data.data;
};

export const getCustomerDetails = async (oid: string) => {
  const token = await getAccessToken();
  const res = await serverFetcher.get<{
    data: {
      customer: CustomerDetailType;
      employees: Employee[];
    };
  }>(`/api/customer/customer-with-employees?CustomerOid=${oid}`, token, {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!res.isOk) {
    return null;
  }
  return res.data;
};

export const getCustomersList = async () => {
  const token = await getAccessToken();
  const res = await serverFetcher.get<{
    data: Customer[];
  }>("/api/customerslist/accountant/customers", token, {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!res.isOk) {
    console.error(res);
    return [];
  }
  return res.data.data;
};
