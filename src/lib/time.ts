export function formatTime12Hour(value?: string | null) {
  if (!value) return "";

  const trimmed = String(value).trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})/);

  if (match) {
    const rawHours = Number(match[1]);
    const minutes = match[2];
    if (Number.isFinite(rawHours)) {
      const period = rawHours >= 12 ? "PM" : "AM";
      const hours = rawHours % 12 || 12;
      return `${String(hours).padStart(2, "0")}:${minutes}:${period}`;
    }
  }

  const date = new Date(trimmed);
  if (!Number.isNaN(date.getTime())) {
    const hours24 = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours = hours24 % 12 || 12;
    return `${String(hours).padStart(2, "0")}:${minutes}:${period}`;
  }

  return trimmed;
}
