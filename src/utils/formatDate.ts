export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const parsed = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    ...options,
  }).format(parsed);
}
