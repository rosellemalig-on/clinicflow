import { AuthForm } from "@/components/forms/AuthForm";

export function RegisterPage({ role = "patient" }) {
  const isStaff = role === "staff";
  return (
    <>
      <p className="eyebrow mt-10">
        {isStaff ? "Authorized staff onboarding" : "Secure clinic access"}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#062b26] md:text-4xl">
        {isStaff ? "Create a staff account" : "Create your patient account"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        {isStaff
          ? "Enter your clinic staff invite code to set up access to schedules, queues, and patient records."
          : "Register once, keep your information secure, and reuse it for every future appointment."}
      </p>
      <AuthForm mode="register" role={role} />
    </>
  );
}
