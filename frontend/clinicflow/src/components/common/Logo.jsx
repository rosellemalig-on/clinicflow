import clinicflowIcon from "@/assets/clinicflow-icon.png";

export function Logo({ inverse = false }) {
  return (
    <div
      className={`inline-flex items-center gap-3 font-bold tracking-tight select-none ${inverse ? "text-white" : "text-slate-950"}`}
    >
      <img
        src={clinicflowIcon}
        alt="ClinicFlow logo"
        className={`size-10 rounded-xl object-contain ${inverse ? "ring-1 ring-white/15" : ""}`}
      />
      <span className="text-xl">ClinicFlow</span>
    </div>
  );
}
