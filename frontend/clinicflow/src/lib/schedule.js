export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const CALENDAR_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const TIME_OPTIONS = [];
for (let hour = 7; hour <= 20; hour += 1) {
  for (const minute of [0, 30]) {
    if (hour === 20 && minute === 30) continue;
    const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const label = `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
    TIME_OPTIONS.push({ value, label });
  }
}

export const TIME_PRESETS = [
  { label: "8:00 AM – 4:00 PM", start: "08:00", end: "16:00" },
  { label: "9:00 AM – 4:00 PM", start: "09:00", end: "16:00" },
  { label: "9:00 AM – 5:00 PM", start: "09:00", end: "17:00" },
  { label: "1:00 PM – 7:00 PM", start: "13:00", end: "19:00" },
];

export function toIsoDate(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getTodayIso() {
  const now = new Date();
  return toIsoDate(now.getFullYear(), now.getMonth(), now.getDate());
}

export function createDefaultSchedule() {
  return {
    mode: "calendar",
    dates: [getTodayIso()],
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    startTime: "09:00",
    endTime: "16:00",
  };
}

export function formatIsoShort(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${SHORT_MONTHS[(m || 1) - 1]} ${d}, ${y}`;
}

function formatTimeLabel(time24) {
  const match = TIME_OPTIONS.find((t) => t.value === time24);
  if (match) return match.label;
  const [hStr = "9", mStr = "00"] = String(time24 || "09:00").split(":");
  const h = Number(hStr);
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${mStr} ${period}`;
}

function formatCalendarDates(dates) {
  const sorted = [...dates].sort();
  if (sorted.length === 0) return "No date selected";
  if (sorted.length === 1) return formatIsoShort(sorted[0]);

  const parsed = sorted.map((iso) => {
    const [year, month, day] = iso.split("-").map(Number);
    return { year, month, day, iso };
  });

  const sameMonthAndYear = parsed.every(
    (p) => p.year === parsed[0].year && p.month === parsed[0].month,
  );
  if (sameMonthAndYear) {
    const monthName = SHORT_MONTHS[parsed[0].month - 1];
    const shownDays = parsed.slice(0, 5).map((p) => p.day).join(", ");
    const extra = parsed.length > 5 ? ` (+${parsed.length - 5} more)` : "";
    return `${monthName} ${shownDays}, ${parsed[0].year}${extra}`;
  }

  const shown = parsed
    .slice(0, 4)
    .map((p) => `${SHORT_MONTHS[p.month - 1]} ${p.day}`)
    .join(", ");
  const extra = parsed.length > 4 ? ` (+${parsed.length - 4} more)` : "";
  return `${shown}, ${parsed[0].year}${extra}`;
}

function formatWeekdays(days) {
  const ordered = WEEKDAYS.filter((d) => days.includes(d));
  if (ordered.length === 0) return "No days selected";
  if (ordered.length === 7) return "Daily";

  const indices = ordered.map((d) => WEEKDAYS.indexOf(d));
  const isContiguous =
    ordered.length >= 3 &&
    indices.every((idx, i) => i === 0 || idx === indices[i - 1] + 1);
  if (isContiguous) {
    return `${ordered[0]}–${ordered[ordered.length - 1]}`;
  }
  return ordered.join(", ");
}

export function formatDoctorSchedule(selection) {
  const timeRange = `${formatTimeLabel(selection.startTime)} – ${formatTimeLabel(selection.endTime)}`;
  if (selection.mode === "weekly") {
    return `${formatWeekdays(selection.weekdays)}, ${timeRange}`;
  }
  return `${formatCalendarDates(selection.dates)} · ${timeRange}`;
}

export function isScheduleValid(selection) {
  if (selection.mode === "weekly") {
    return selection.weekdays.length > 0;
  }
  return selection.dates.length > 0;
}
