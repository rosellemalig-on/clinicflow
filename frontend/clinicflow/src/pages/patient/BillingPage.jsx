import { useState } from "react";
import { useClinicFlowStore } from "@/data/clinicFlowStore";

const METHODS = ["GCash", "Maya", "Card", "Cash at Clinic"];

export default function BillingPage() {
  const { state, confirmPayment } = useClinicFlowStore();
  const [selectedMethods, setSelectedMethods] = useState({});
  const [referenceInputs, setReferenceInputs] = useState({});
  const [rowErrors, setRowErrors] = useState({});
  const [rowSuccess, setRowSuccess] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  const totalPaid = state.appointments
    .filter((a) => a.paymentStatus === "Paid")
    .reduce((sum, a) => sum + Number(a.fee || 0), 0);

  const totalVerifying = state.appointments
    .filter((a) => a.paymentStatus === "For Verification")
    .reduce((sum, a) => sum + Number(a.fee || 0), 0);

  const totalPending = state.appointments
    .filter((a) => a.paymentStatus !== "Paid" && a.paymentStatus !== "For Verification")
    .reduce((sum, a) => sum + Number(a.fee || 0), 0);

  const handleSubmitPayment = async (apt, chosenMethod) => {
    const isCash = chosenMethod === "Cash at Clinic";
    const refNumber = (referenceInputs[apt.id] || "").trim();

    setRowErrors((prev) => ({ ...prev, [apt.id]: "" }));
    setRowSuccess((prev) => ({ ...prev, [apt.id]: "" }));

    if (!isCash && refNumber.length < 4) {
      setRowErrors((prev) => ({
        ...prev,
        [apt.id]: "Please enter your payment reference number (at least 4 characters).",
      }));
      return;
    }

    setSubmittingId(apt.id);
    try {
      await confirmPayment(apt.id, chosenMethod, isCash ? "" : refNumber, "patient");
      if (isCash) {
        setRowSuccess((prev) => ({
          ...prev,
          [apt.id]: "Cash at Clinic selected — please pay at the front desk so staff can confirm.",
        }));
      } else {
        setReferenceInputs((prev) => ({ ...prev, [apt.id]: "" }));
        setRowSuccess((prev) => ({
          ...prev,
          [apt.id]: `Reference ${refNumber} (${chosenMethod}) submitted — waiting for clinic staff to verify.`,
        }));
      }
    } catch (err) {
      setRowErrors((prev) => ({
        ...prev,
        [apt.id]: err.message || "Unable to submit payment.",
      }));
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Colored Billing Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#052622] via-[#073630] to-[#0d544b] p-6 text-white shadow-xl shadow-teal-950/15 sm:p-7">
        <div className="pointer-events-none absolute -right-14 -top-14 size-56 rounded-full bg-teal-400/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-48 rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-300">
            Billing &amp; receipts
          </p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Payment &amp; Billing
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-teal-100/85 sm:text-sm">
            Submit your GCash, Maya, or Card reference number for staff verification, or select Cash at Clinic to settle at the front desk.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/15 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                Paid Total
              </p>
              <p className="mt-1 text-2xl font-extrabold text-white">
                ₱{totalPaid.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-sky-300/30 bg-sky-400/15 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-sky-200">
                For Verification
              </p>
              <p className="mt-1 text-2xl font-extrabold text-white">
                ₱{totalVerifying.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-amber-300/35 bg-amber-300/15 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                Pending Balance
              </p>
              <p className="mt-1 text-2xl font-extrabold text-amber-100">
                ₱{totalPending.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 space-y-3.5">
        {state.appointments.map((apt) => {
          const isPaid = apt.paymentStatus === "Paid";
          const isVerifying = apt.paymentStatus === "For Verification";
          const chosen =
            selectedMethods[apt.id] ||
            (apt.paymentMethod && apt.paymentMethod !== "Unselected"
              ? apt.paymentMethod
              : "GCash");
          const isCash = chosen === "Cash at Clinic";
          const isWaitingForStaffCash = !isPaid && !isVerifying && apt.paymentMethod === "Cash at Clinic";

          const cardTheme = isPaid
            ? "border-emerald-200/80 border-l-emerald-500 bg-gradient-to-r from-emerald-50/45 to-white"
            : isVerifying
              ? "border-sky-200/80 border-l-sky-500 bg-gradient-to-r from-sky-50/50 to-white"
              : "border-amber-200/80 border-l-amber-500 bg-gradient-to-r from-amber-50/40 to-white";

          return (
            <div
              key={apt.id}
              className={`rounded-2xl border border-l-4 p-5 shadow-2xs ${cardTheme}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-base font-bold text-[#062b26]">
                    {apt.serviceName} ·{" "}
                    <span className="text-teal-700">
                      ₱{Number(apt.fee || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {apt.id} · {apt.doctorName} · {apt.date} at {apt.time} · Queue{" "}
                    {apt.queueNumber}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isPaid
                        ? "bg-emerald-100 text-emerald-900"
                        : isVerifying
                          ? "bg-sky-100 text-sky-900"
                          : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {apt.paymentStatus}
                  </span>
                  {(isPaid || isVerifying) && (
                    <span className="rounded-full border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                      {apt.paymentMethod}
                      {apt.paymentReference ? (
                        <>
                          {" "}
                          ·{" "}
                          <span className="font-mono font-semibold text-[#062b26]">
                            Ref: {apt.paymentReference}
                          </span>
                        </>
                      ) : null}
                    </span>
                  )}
                </div>
              </div>

              {!isPaid && (
                <div className="mt-4 border-t border-slate-200/70 pt-4">
                  {isVerifying && (
                    <div className="mb-3 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2.5 text-xs font-medium text-sky-900">
                      Reference{" "}
                      <span className="font-mono font-bold">{apt.paymentReference}</span> ({apt.paymentMethod}) has been sent to clinic staff for verification. If you made a typo, you can update it below.
                    </div>
                  )}

                  {isWaitingForStaffCash && (
                    <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-medium text-amber-900">
                      Marked as <strong>Cash at Clinic</strong> — waiting for front desk staff to confirm receipt. You can still switch to GCash, Maya, or Card below.
                    </div>
                  )}

                  <div className="grid gap-3 md:grid-cols-[180px_1fr_auto] md:items-end">
                    <label className="block min-w-0">
                      <span className="mb-1 block text-xs font-semibold text-[#062b26]">
                        Payment method
                      </span>
                      <select
                        value={chosen}
                        onChange={(e) => {
                          setSelectedMethods((prev) => ({ ...prev, [apt.id]: e.target.value }));
                          setRowErrors((prev) => ({ ...prev, [apt.id]: "" }));
                        }}
                        className="w-full rounded-xl border border-teal-200/80 bg-teal-50/35 px-3 py-2 text-sm font-semibold text-[#062b26] outline-none transition focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/15"
                      >
                        {METHODS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </label>

                    {!isCash ? (
                      <label className="block min-w-0">
                        <span className="mb-1 block text-xs font-semibold text-[#062b26]">
                          {chosen} reference number
                        </span>
                        <input
                          type="text"
                          value={referenceInputs[apt.id] || ""}
                          onChange={(e) => {
                            setReferenceInputs((prev) => ({
                              ...prev,
                              [apt.id]: e.target.value,
                            }));
                            setRowErrors((prev) => ({ ...prev, [apt.id]: "" }));
                          }}
                          placeholder={`Enter ${chosen} ref # (e.g., 9048-2135-7120)`}
                          className="w-full min-w-0 rounded-xl border border-teal-200/80 bg-teal-50/30 px-3.5 py-2 text-sm font-medium text-[#062b26] outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/15"
                        />
                      </label>
                    ) : (
                      <div className="rounded-xl border border-teal-200/70 bg-teal-50/60 px-3.5 py-2 text-xs text-teal-900">
                        No reference number needed. Settle cash at the clinic front desk and staff will confirm your payment.
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={submittingId === apt.id}
                      onClick={() => handleSubmitPayment(apt, chosen)}
                      className="primary-button whitespace-nowrap px-4 py-2 text-xs disabled:opacity-60"
                    >
                      {submittingId === apt.id
                        ? "Submitting…"
                        : isCash
                          ? "Pay at Clinic"
                          : isVerifying
                            ? "Update Reference"
                            : "Submit Reference"}
                    </button>
                  </div>

                  {rowErrors[apt.id] && (
                    <p className="mt-2.5 text-xs font-medium text-rose-600">
                      {rowErrors[apt.id]}
                    </p>
                  )}
                  {rowSuccess[apt.id] && (
                    <p className="mt-2.5 text-xs font-medium text-teal-700">
                      {rowSuccess[apt.id]}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {state.appointments.length === 0 && (
          <div className="rounded-2xl border border-teal-200/70 bg-gradient-to-b from-white to-teal-50/40 py-12 text-center text-sm text-slate-500">
            No billing records yet.
          </div>
        )}
      </div>
    </div>
  );
}
