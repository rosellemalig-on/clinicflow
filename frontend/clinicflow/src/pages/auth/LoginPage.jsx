import { AuthForm } from "@/components/forms/AuthForm";

export function LoginPage({ role = "patient" }) {
  return (
    <>
      <p className="eyebrow mt-10">Secure clinic access</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#062b26] md:text-4xl">
        {role === "staff" ? "Staff workspace" : "Welcome back"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        {role === "staff"
          ? "Authorized clinic staff can manage schedules, queues, services, doctors, payments, and reports."
          : "Sign in to book visits, follow your queue, and manage your clinic records."}
      </p>
      <AuthForm role={role} />
    </>
  );
}
