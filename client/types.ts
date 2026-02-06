


export interface VendorData {
  name: string;
  logo: string;
  vatCert: string;
  businessLicense: string;
  tin: string;
  email: string;
  phone: string;
  website: string;

  regCode: string; // New: Unique identifier for the vendor
  businessType: string;
  logoFile?: File;
  vatCertFile?: File;
  businessLicenseFile?: File;
  image?: string;
  imageFile?: File;
}

export interface BranchData {
  id: string;
  name: string;
  address: string;
  coordinates: string;
  phone: string;
  openingHours?: string;
  closingHours?: string;
  isBusy: boolean;
}

export interface ManagerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  branchId: string;
  password?: string;
}

export enum Step {
  BUSINESS_INFO = 0,
  BRANCHES = 1,
  MANAGERS = 2,
  SUMMARY = 3
}

export type ViewState = 'LANDING' | 'REGISTER' | 'BRANCH_LOGIN' | 'SELECT_BRANCH';
