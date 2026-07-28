"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/lib/actions/auth";

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="full_name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="full_name"
          name="full_name"
          required
          className="rounded-xl border-2 border-border bg-card px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>
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
          minLength={8}
          required
          className="rounded-xl border-2 border-border bg-card px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <fieldset className="flex flex-col gap-1">
        <legend className="text-sm font-medium">I am a...</legend>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" name="role" value="student" defaultChecked />
            Student
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="role" value="parent" />
            Parent
          </label>
        </div>
      </fieldset>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="pill-btn bg-primary py-3 text-primary-foreground shadow-md shadow-primary/30 disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Sign up"}
      </button>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
