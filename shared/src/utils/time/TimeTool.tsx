export function formatRelativeDate(dateInput: Date | string): string {
  const date = new Date(dateInput);
  const now = new Date();

  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffInDays) > 30) {
    return new Intl.DateTimeFormat('en-EN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  const rtf = new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
    style: 'long',
  });

  if (diffInDays === 0) {
    const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMins = Math.ceil(diffInMs / (1000 * 60));
      return rtf.format(diffInMins, 'minute');
    }
    return rtf.format(diffInHours, 'hour');
  }

  return rtf.format(diffInDays, 'day');
}
