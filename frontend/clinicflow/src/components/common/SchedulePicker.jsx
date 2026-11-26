import { useMemo, useState } from "react";
import {
  CALENDAR_HEADERS,
  formatDoctorSchedule,
  formatIsoShort,
  getTodayIso,
  isScheduleValid,
  MONTH_NAMES,
  TIME_OPTIONS,
  TIME_PRESETS,
  toIsoDate,
  WEEKDAYS,
} from "@/lib/schedule";

function CalendarIcon({ className = "size-4" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4.5" width="14" height="12.5" rx="2.5" />
      <path d="M6.5 2.5v3M13.5 2.5v3M3 8.5h14" strokeLinecap="round" />
    </svg>
  );
}

export function SchedulePicker({
  value,
  onChange,
  collapsible = false,
  defaultOpen = true,
  stacked = false,
}) {
  const initialDate = value.dates?.[0] || getTodayIso();
  const [initYear, initMonth] = initialDate.split("-").map(Number);

  const [viewYear, setViewYear] = useState(initYear || new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState((initMonth || new Date().getMonth() + 1) - 1);
  const [open, setOpen] = useState(!collapsible || defaultOpen);

  const todayIso = useMemo(() => getTodayIso(), []);
  const formattedPreview = useMemo(() => formatDoctorSchedule(value), [value]);

  const calendarCells = useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDayOfWeek; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({
        day,
        iso: toIsoDate(viewYear, viewMonth, day),
      });
    }
    return cells;
  }, [viewYear, viewMonth]);

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const toggleDate = (iso) => {
    const exists = value.dates.includes(iso);
    const nextDates = exists
      ? value.dates.filter((d) => d !== iso)
      : [...value.dates, iso].sort();
    onChange({ ...value, mode: "calendar", dates: nextDates });
  };

  const toggleWeekday = (day) => {
    const exists = value.weekdays.includes(day);
    const nextWeekdays = exists
      ? value.weekdays.filter((d) => d !== day)
      : WEEKDAYS.filter((d) => d === day || value.weekdays.includes(d));
    onChange({ ...value, mode: "weekly", weekdays: nextWeekdays });
  };

  const handleStartTimeChange = (nextStart) => {
    const startIdx = TIME_OPTIONS.findIndex((t) => t.value === nextStart);
    const endIdx = TIME_OPTIONS.findIndex((t) => t.value === value.endTime);
    let nextEnd = value.endTime;
    if (startIdx >= 0 && endIdx <= startIdx) {
      const adjusted = TIME_OPTIONS[Math.min(TIME_OPTIONS.length - 1, startIdx + 2)];
      nextEnd = adjusted.value;
    }
    onChange({ ...value, startTime: nextStart, endTime: nextEnd });
  };

  const handleEndTimeChange = (nextEnd) => {
    const startIdx = TIME_OPTIONS.findIndex((t) => t.value === value.startTime);
    const endIdx = TIME_OPTIONS.findIndex((t) => t.value === nextEnd);
    let nextStart = value.startTime;
    if (endIdx >= 0 && startIdx >= endIdx) {
      const adjusted = TIME_OPTIONS[Math.max(0, endIdx - 2)];
      nextStart = adjusted.value;
    }
    onChange({ ...value, startTime: nextStart, endTime: nextEnd });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs font-semibold text-[#062b26]">
          <CalendarIcon className="size-4 shrink-0 text-teal-700" />
          <span>Schedule:</span>
          <span className="max-w-full truncate rounded-full bg-teal-50 px-2.5 py-0.5 font-semibold text-teal-800">
            {formattedPreview}
          </span>
        </div>

        {collapsible && (
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="shrink-0 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-teal-600 hover:text-teal-800"
          >
            {open ? "Hide calendar" : "Pick date & time"}
          </button>
        )}
      </div>

      {open && (
        <div
          className={`mt-3 grid gap-3 ${
            stacked ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]"
          }`}
        >
          {/* Calendar or Weekly Picker */}
          <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3.5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => onChange({ ...value, mode: "calendar" })}
                  className={`whitespace-nowrap rounded-md px-2.5 py-1 transition ${
                    value.mode === "calendar"
                      ? "bg-[#052622] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Calendar
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...value, mode: "weekly" })}
                  className={`whitespace-nowrap rounded-md px-2.5 py-1 transition ${
                    value.mode === "weekly"
                      ? "bg-[#052622] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Weekly
                </button>
              </div>

              {value.mode === "calendar" && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const [y, m] = todayIso.split("-").map(Number);
                      setViewYear(y);
                      setViewMonth(m - 1);
                      if (!value.dates.includes(todayIso)) {
                        onChange({
                          ...value,
                          mode: "calendar",
                          dates: [...value.dates, todayIso].sort(),
                        });
                      }
                    }}
                    className="whitespace-nowrap rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-teal-700 hover:bg-teal-50"
                  >
                    Today
                  </button>
                  {value.dates.length > 0 && (
                    <button
                      type="button"
                      onClick={() => onChange({ ...value, dates: [] })}
                      className="whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-medium text-slate-500 hover:text-red-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>

            {value.mode === "calendar" ? (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={goPrevMonth}
                    aria-label="Previous month"
                    className="grid size-7 place-items-center rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:border-teal-600 hover:text-teal-800"
                  >
                    ‹
                  </button>
                  <p className="text-xs font-bold text-[#062b26]">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </p>
                  <button
                    type="button"
                    onClick={goNextMonth}
                    aria-label="Next month"
                    className="grid size-7 place-items-center rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:border-teal-600 hover:text-teal-800"
                  >
                    ›
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400">
                  {CALENDAR_HEADERS.map((h) => (
                    <div key={h} className="py-1">
                      {h}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((cell, idx) => {
                    if (!cell) {
                      return <div key={`empty-${idx}`} className="h-8" />;
                    }
                    const isSelected = value.dates.includes(cell.iso);
                    const isToday = cell.iso === todayIso;
                    return (
                      <button
                        key={cell.iso}
                        type="button"
                        onClick={() => toggleDate(cell.iso)}
                        className={`h-8 rounded-lg text-xs font-semibold transition ${
                          isSelected
                            ? "bg-teal-700 text-white shadow-2xs"
                            : isToday
                              ? "border border-teal-400 bg-teal-50/70 text-teal-900 hover:bg-teal-100"
                              : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>

                {value.dates.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2.5">
                    {value.dates.map((iso) => (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => toggleDate(iso)}
                        title="Click to remove date"
                        className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-800 hover:bg-red-50 hover:text-red-700"
                      >
                        {formatIsoShort(iso)}
                        <span aria-hidden="true">×</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div>
                <p className="mb-2 text-xs text-slate-500">
                  Click the recurring days this doctor is on duty:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {WEEKDAYS.map((day) => {
                    const active = value.weekdays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleWeekday(day)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          active
                            ? "bg-teal-700 text-white shadow-2xs"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-teal-500"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2.5">
                  {[
                    ["Mon–Fri", ["Mon", "Tue", "Wed", "Thu", "Fri"]],
                    ["Mon–Sat", ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]],
                    ["Tue–Sat", ["Tue", "Wed", "Thu", "Fri", "Sat"]],
                  ].map(([label, days]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => onChange({ ...value, mode: "weekly", weekdays: days })}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 hover:border-teal-500 hover:text-teal-800"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Time Selection */}
          <div className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-3.5">
            <div>
              <p className="text-xs font-bold text-[#062b26]">Duty hours</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Click a preset or pick start &amp; end times.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <label className="block min-w-0">
                  <span className="block text-[11px] font-semibold text-slate-500">Start time</span>
                  <select
                    value={value.startTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-teal-600"
                  >
                    {TIME_OPTIONS.slice(0, -1).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block min-w-0">
                  <span className="block text-[11px] font-semibold text-slate-500">End time</span>
                  <select
                    value={value.endTime}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-teal-600"
                  >
                    {TIME_OPTIONS.slice(1).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-3.5">
                <span className="block text-[11px] font-semibold text-slate-500">
                  Quick shift presets
                </span>
                <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                  {TIME_PRESETS.map((preset) => {
                    const active =
                      value.startTime === preset.start && value.endTime === preset.end;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          onChange({
                            ...value,
                            startTime: preset.start,
                            endTime: preset.end,
                          })
                        }
                        className={`whitespace-nowrap rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition ${
                          active
                            ? "border-teal-700 bg-teal-50 text-teal-800"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-teal-500 hover:bg-white"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {!isScheduleValid(value) && (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-800">
                Please click at least one{" "}
                {value.mode === "calendar" ? "date on the calendar" : "day of the week"}.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
