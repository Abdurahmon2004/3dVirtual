const normalizeBaseUrl = (value: string) => {
  if (!value) return '';
  return value.endsWith('/') ? value : `${value}/`;
};

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL || 'https://3dtur.backend-salehouse.uz/api'
);

export const STORAGE_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_STORAGE_BASE_URL || '/storage'
);

const trimLeadingSlash = (value: string) => value.replace(/^\//, '');

export const buildStorageUrl = (path?: string | null) => {
  if (!path) return '';
  return `${STORAGE_BASE_URL}${trimLeadingSlash(path)}`;
};
