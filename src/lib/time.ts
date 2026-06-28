export function formatTime12Hour(value?: string | null) {
  if (!value) return "";

  const trimmed = String(value).trim();

  // Already formatted 12-hour time, e.g. "5:30 PM" or "05:30 pm".
  // This must be handled before the 24-hour parser, otherwise "5:30 PM"
  // gets read as just "5:30" and incorrectly becomes AM.
  const twelveHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*([AaPp]\.?[Mm]\.?)$/);
  if (twelveHourMatch) {
    const rawHours = Number(twelveHourMatch[1]);
    const minutes = twelveHourMatch[2];
    const period = twelveHourMatch[3].toUpperCase().replace(/\./g, "");
    if (Number.isFinite(rawHours) && rawHours >= 1 && rawHours <= 12) {
      return `${rawHours}:${minutes} ${period}`;
    }
  }

  // 24-hour time, e.g. "17:30" or ISO strings that begin with a time.
  const timeMatch = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    const rawHours = Number(timeMatch[1]);
    const minutes = timeMatch[2];
    if (Number.isFinite(rawHours) && rawHours >= 0 && rawHours <= 23) {
      const period = rawHours >= 12 ? "PM" : "AM";
      const hours = rawHours % 12 || 12;
      return `${hours}:${minutes} ${period}`;
    }
  }

  const date = new Date(trimmed);
  if (!Number.isNaN(date.getTime())) {
    const hours24 = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours = hours24 % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  }

  return trimmed;
}
