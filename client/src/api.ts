
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// In development, we use relative paths to leverage the Vite proxy (fixes CORS and 500 errors)
export const API_BASE_URL = isDev 
  ? '' 
  : 'https://onboardingapi.bezawcurbside.com';

export const API_ROUTES = {
    LOGIN: `${API_BASE_URL}/api/onboard/login`,
    REGISTER: `${API_BASE_URL}/api/onboard/register`,
    BUSINESS_TYPES: `${API_BASE_URL}/api/onboard/business-types`,
    BRANCHES: (vendorId: string) => `${API_BASE_URL}/api/onboard/${vendorId}/branches`,
    MANAGERS: `${API_BASE_URL}/api/onboard/managers`,
    BRANCH_MANAGERS: (branchId: string) => `${API_BASE_URL}/api/onboard/branches/${branchId}/managers`,
    DELETE_MANAGER: (id: string) => `${API_BASE_URL}/api/onboard/managers/${id}`,
    DELETE_BRANCH: (vendorId: string, branchId: string) => `${API_BASE_URL}/api/onboard/${vendorId}/branches/${branchId}`,
    VENDOR_SETTINGS: `${API_BASE_URL}/api/settings/vendor`,
    IMAGE_PATH: (path: string) => {
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${API_BASE_URL}${cleanPath}`;
    }
};
