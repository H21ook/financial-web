import { User } from "@/types/auth.types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const citizenRegex = /^[А-ЯЁӨҮа-яёөү]{2}\d{8}$/;
export const organizationRegex = /^\d{7}$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatName = (user: User | null): string => {
  let formatedName = "";
  if (user?.LastName && user.LastName?.length > 0) {
    formatedName = user.LastName[0].toUpperCase()
  }
  if (user?.Firstname) {
    formatedName = `${formatedName}.${user.LastName}`.toUpperCase();
    return formatedName;
  }

  return user?.UserName || ""
}

export const checkCitizenRegisterFormat = (regno: string) => {
  if (!regno) {
    return false
  }

  if (!citizenRegex.test(regno.toLowerCase())) {
    return false
  }

  return true
}

export const checkOrganizationRegisterFormat = (regno: string) => {
  if (!regno) {
    return false
  }

  if (!organizationRegex.test(regno.toLowerCase())) {
    return false
  }

  return true
}

export const generateQueryString = (params: Record<string, string | number | undefined | null>) => {
  let query = "";
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      query += `&${key}=${value}`;
    }
  }
  return query;
}