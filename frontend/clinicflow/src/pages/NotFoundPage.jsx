import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl font-bold">Page not found</h1>
        <p className="mt-4 text-slate-500">The page you requested does not exist.</p>
        <Link className="primary-button mt-7" to="/">
          Return home
        </Link>
      </div>
    </main>
  );
}
