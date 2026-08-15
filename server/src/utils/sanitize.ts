export function sanitizeText(value: string, maxLength = 500): string {
  let result = value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();

  if (result.length > maxLength) {
    result = result.slice(0, maxLength);
  }

  return result;
}
