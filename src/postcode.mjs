export function formatPostcode(value) {
  return String(value).padStart(4, '0');
}