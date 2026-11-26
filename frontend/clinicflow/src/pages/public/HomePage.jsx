import { Link } from "react-router-dom";
import { Logo } from "@/components/common/Logo";

const features = [
  {
    number: "01",
    title: "Book with confidence",
    description:
      "Choose a service, doctor, date, and a slot whose capacity is verified again by the clinic.",
    surface: "border-teal-200/80 border-t-4 border-t-teal-600 bg-gradient-to-b from-teal-50/65 to-white",
    pill: "bg-teal-100 text-teal-800",
  },
  {
    number: "02",
    title: "Know when to arrive",
    description:
      "Follow your queue number, people ahead, live status, audio alerts, and estimated waiting time.",
    surface:
      "border-emerald-200/80 border-t-4 border-t-emerald-500 bg-gradient-to-b from-emerald-50/65 to-white",
    pill: "bg-emerald-100 text-emerald-800",
  },
  {
    number: "03",
    title: "Keep care organized",
    description:
      "Review appointments, billing, notifications, and saved patient information in one place.",
    surface:
      "border-amber-200/80 border-t-4 border-t-amber-500 bg-gradient-to-b from-amber-50/70 to-white",
    pill: "bg-amber-100 text-amber-900",
  },
];

const flowSteps = [
  { step: "01", label: "Create your secure profile", accent: "bg-teal-400 text-[#052622]" },
  { step: "02", label: "Choose a service and open slot", accent: "bg-emerald-300 text-[#052622]" },
  { step: "03", label: "Receive your live queue number", accent: "bg-amber-300 text-[#052622]" },
  { step: "04", label: "Track alerts through completion", accent: "bg-sky-300 text-[#052622]" },
];

export function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7f6] text-slate-950">
      {/* Top Hero Area */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#e2f5ef] via-[#f2faf7] to-[#d5eee6]">
        <div className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-teal-300/25 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/4 size-80 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 size-72 rounded-full bg-amber-200/25 blur-3xl" />

        <header className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#062b26]/80 md:flex">
            <a className="transition hover:text-teal-700" href="#how-it-works">
              How it works
            </a>
            <a className="transition hover:text-teal-700" href="#features">
              Patient care
            </a>
          </nav>
          <Link
            className="inline-flex items-center justify-center rounded-full bg-[#052622] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-900"
            to="/login"
          >
            Sign in
          </Link>
        </header>

        <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-10 md:px-10 lg:grid-cols-[1.05fr_.95fr] lg:pb-28 lg:pt-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/80 bg-white/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-teal-800 shadow-xs">
              <span className="size-2 rounded-full bg-emerald-500" />
              Community care, coordinated
            </div>
            <h1 className="mt-7 text-5xl font-bold leading-[1.04] tracking-[-.04em] text-[#052622] md:text-6xl lg:text-[4.25rem]">
              Less waiting.
              <br />
              <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                More caring.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              ClinicFlow brings appointments, live queue updates, billing, and patient records into
              one clear experience for your whole community clinic.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#052622] to-teal-800 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-teal-950/15 transition hover:from-[#073630] hover:to-teal-700"
                to="/register"
              >
                Book your first appointment →
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-xl border border-teal-700/25 bg-white/90 px-7 py-3.5 text-sm font-bold text-[#062b26] shadow-2xs transition hover:border-teal-600 hover:bg-teal-50"
                to="/staff-login"
              >
                Open staff workspace
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2.5 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white/80 px-3 py-1 text-teal-900">
                <span className="size-1.5 rounded-full bg-teal-500" />
                Secure patient accounts
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-emerald-900">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Capacity-safe booking
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-amber-900">
                <span className="size-1.5 rounded-full bg-amber-500" />
                Live queue &amp; audio alerts
              </span>
            </div>
          </div>

          {/* Live Queue Preview Card */}
          <div className="relative pb-6 sm:pb-24 lg:pl-4">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-6 text-white shadow-2xl shadow-teal-950/25 md:p-7">
              <div className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-teal-400/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 left-8 size-36 rounded-full bg-amber-300/15 blur-2xl" />

              <div className="relative flex items-start justify-between gap-4 border-b border-white/15 pb-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-300">
                    My queue
                  </p>
                  <p className="mt-1.5 text-lg font-semibold text-white">General Consultation</p>
                </div>
                <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-extrabold text-[#052622]">
                  Approaching
                </span>
              </div>

              <div className="relative mt-6 grid grid-cols-1 gap-4 sm:grid-cols-[1.15fr_.85fr]">
                <div className="flex flex-col justify-between rounded-2xl bg-white p-5 text-[#062b26] shadow-sm">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[.14em] text-teal-700">
                      Your number
                    </p>
                    <p className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Q-015</p>
                  </div>
                  <div className="mt-6">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-teal-100">
                      <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500" />
                    </div>
                    <p className="mt-2 text-xs font-medium text-teal-800">You&apos;re getting close.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border border-teal-300/20 bg-[#0f584f] p-5">
                    <p className="text-xs font-semibold text-teal-200">Now serving</p>
                    <p className="mt-2 text-2xl font-extrabold text-white">Q-012</p>
                  </div>
                  <div className="rounded-2xl bg-[#fde68a] p-5 text-[#062b26]">
                    <p className="text-xs font-bold text-[#6b5310]">Estimated wait</p>
                    <p className="mt-2 text-2xl font-extrabold">15 min</p>
                  </div>
                </div>
              </div>

              <p className="relative mt-5 text-left text-xs text-teal-100/85">
                Your turn is approaching. Please stay near the waiting area.
              </p>
            </div>

            {/* Floating Next Visit Card */}
            <div className="mt-4 rounded-2xl border border-teal-200/80 border-l-4 border-l-teal-600 bg-white px-5 py-4 shadow-xl shadow-teal-950/10 sm:absolute sm:bottom-2 sm:-left-2 sm:mt-0 sm:w-60">
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-teal-700">
                Next visit
              </p>
              <p className="mt-1 text-sm font-bold text-[#062b26]">Tomorrow · 9:30 AM</p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Dr. Maria Santos</p>
            </div>
          </div>
        </section>
      </div>

      {/* Section 2: Features */}
      <section className="bg-[#f4f7f6] py-20 md:py-24" id="features">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <p className="eyebrow">Designed around real clinic days</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#062b26] md:text-4xl">
            Every step, easier to follow.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((item) => (
              <article
                className={`rounded-2xl border p-7 shadow-2xs transition hover:-translate-y-0.5 hover:shadow-md ${item.surface}`}
                key={item.number}
              >
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${item.pill}`}
                >
                  {item.number}
                </span>
                <h3 className="mt-5 text-lg font-bold text-[#062b26]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: One Connected Flow */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] py-20 text-white"
        id="how-it-works"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-teal-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-12 size-64 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-300">
              One connected flow
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
              From booking to better care.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-teal-100/80">
              Patients and staff work from the same records, so updates stay clear across
              appointments, payments, and the live queue.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {flowSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-xs transition hover:border-teal-300/40 hover:bg-white/[0.11]"
              >
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${item.accent}`}
                >
                  {item.step}
                </span>
                <p className="mt-3 text-sm font-semibold text-white">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
