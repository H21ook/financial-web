import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const citizenRegex = /^[А-ЯЁӨҮа-яёөү]{2}\d{8}$/;
export const organizationRegex = /^\d{7}$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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