import { Link } from "react-router-dom";
import { Logo } from "@/components/common/Logo";

const features = [
  [
    "01",
    "Book with confidence",
    "Choose a service, doctor, date, and a slot whose capacity is verified again by the clinic.",
  ],
  [
    "02",
    "Know when to arrive",
    "Follow your queue number, people ahead, current status, and estimated waiting time.",
  ],
  [
    "03",
    "Keep care organized",
    "Review appointments, billing, notifications, and saved patient information in one place.",
  ],
];

const flowSteps = [
  ["01", "Create your secure profile"],
  ["02", "Choose a service and open slot"],
  ["03", "Receive your queue number"],
  ["04", "Track updates through completion"],
];

export function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      {/* Top Hero Area */}
      <div className="bg-gradient-to-br from-[#f4faf8] via-[#f7fbfa] to-[#e5f4ef]">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a className="transition hover:text-teal-800" href="#how-it-works">
              How it works
            </a>
            <a className="transition hover:text-teal-800" href="#features">
              Patient care
            </a>
          </nav>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-xs transition hover:border-teal-600 hover:text-teal-800"
            to="/login"
          >
            Sign in
          </Link>
        </header>

        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-12 md:px-10 lg:grid-cols-[1.05fr_.95fr] lg:pb-28 lg:pt-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-teal-800 shadow-xs">
              <span className="size-2 rounded-full bg-emerald-400" />
              Community care, coordinated
            </div>
            <h1 className="mt-7 text-5xl font-bold leading-[1.04] tracking-[-.04em] text-[#062b26] md:text-6xl lg:text-[4.25rem]">
              Less waiting.
              <br />
              <span className="text-teal-700">More caring.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              ClinicFlow brings appointments, queue updates, payments, and patient records into one
              clear experience for your whole community clinic.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="primary-button px-7 py-3.5" to="/register">
                Book your first appointment
              </Link>
              <Link className="secondary-button px-7 py-3.5" to="/staff-login">
                Open staff workspace
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
              <span>Secure patient accounts</span>
              <span>Capacity-safe booking</span>
              <span>Shared live queue</span>
            </div>
          </div>

          {/* Live Queue Preview Card */}
          <div className="relative pb-6 sm:pb-24 lg:pl-4">
            <div className="rounded-[2rem] bg-[#062b26] p-6 text-white shadow-2xl shadow-teal-950/25 md:p-7">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-300">
                    My queue
                  </p>
                  <p className="mt-1.5 text-lg font-semibold text-white">General Consultation</p>
                </div>
                <span className="rounded-full bg-emerald-300/95 px-3 py-1 text-xs font-bold text-[#062b26]">
                  Approaching
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-[1.15fr_.85fr]">
                <div className="flex flex-col justify-between rounded-2xl bg-white p-5 text-[#062b26]">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[.14em] text-slate-400">
                      Your number
                    </p>
                    <p className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Q-015</p>
                  </div>
                  <div className="mt-6">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-4/5 rounded-full bg-teal-600" />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">You&apos;re getting close.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl bg-[#0f4a43] p-5">
                    <p className="text-xs font-medium text-teal-200">Now serving</p>
                    <p className="mt-2 text-2xl font-bold text-white">Q-012</p>
                  </div>
                  <div className="rounded-2xl bg-[#f7dc7a] p-5 text-[#062b26]">
                    <p className="text-xs font-semibold text-[#5b4b12]">Estimated wait</p>
                    <p className="mt-2 text-2xl font-extrabold">15 min</p>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-left text-xs text-teal-200/80">
                Your turn is approaching. Please stay near the waiting area.
              </p>
            </div>

            {/* Floating Next Visit Card */}
            <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-xl shadow-slate-900/10 sm:absolute sm:bottom-2 sm:-left-2 sm:mt-0 sm:w-56">
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-teal-700">
                Next visit
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">Tomorrow · 9:30 AM</p>
              <p className="mt-0.5 text-xs text-slate-500">Dr. Maria Santos</p>
            </div>
          </div>
        </section>
      </div>

      {/* Section 2: Features */}
      <section className="bg-white py-20 md:py-24" id="features">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <p className="eyebrow">Designed around real clinic days</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#062b26] md:text-4xl">
            Every step, easier to follow.
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 md:grid-cols-3">
            {features.map(([number, title, description]) => (
              <article className="bg-white p-8" key={number}>
                <span className="text-xs font-bold text-teal-700">{number}</span>
                <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: One Connected Flow */}
      <section className="bg-[#052622] py-20 text-white" id="how-it-works">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-300">
              One connected flow
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
              From booking to better care.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-teal-100/75">
              Patients and staff work from the same records, so updates stay clear across
              appointments, payments, and the live queue.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {flowSteps.map(([step, label]) => (
              <div
                key={step}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-teal-400/30 hover:bg-white/[0.07]"
              >
                <span className="text-xs font-bold text-teal-300">{step}</span>
                <p className="mt-2.5 text-sm font-semibold text-white">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
