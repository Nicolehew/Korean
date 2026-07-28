"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-xl border-2 border-border bg-card px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="rounded-xl border-2 border-border bg-card px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="pill-btn bg-primary py-3 text-primary-foreground shadow-md shadow-primary/30 disabled:opacity-60"
      >
        {pending ? "Logging in..." : "Log in"}
      </button>
      <p className="text-center text-sm text-muted">
        No account?{" "}
        <Link href="/signup" className="text-primary underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
