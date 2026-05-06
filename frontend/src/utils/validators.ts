// ============================================================
// Cleanly - Validadores
// ============================================================

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8;
}

export function isValidPhone(phone: string): boolean {
  return /^\+507\s?\d{4}-\d{4}$/.test(phone);
}

export function isAtLeast24hAhead(dateStr: string): boolean {
  const target = new Date(dateStr);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours >= 24;
}
