export function formatPostcode(value) {
  return String(value).padStart(4, '0');
}

export function isPostcode(value) {
  return /^\d{4}$/.test(String(value));
}