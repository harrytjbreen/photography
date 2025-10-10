export const URL_BASE = (import.meta.env.VITE_API_ENDPOINT || "").replace(
  /\/+$/,
  "",
);

export const getFullPhotoPath = (key: string) => `${URL_BASE}/assets/${key}`;
