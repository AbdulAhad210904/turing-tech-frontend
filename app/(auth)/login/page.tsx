"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { login } from "@/services/auth";
import { Credentials } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<Credentials>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: keyof Credentials, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await login(formValues);
      router.push("/chat");
    } catch (err: any) {
      const message =
        err?.data?.message ??
        err?.response?.data?.message ??
        "Unable to login. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Login to TuringTech Test"
      subtitle="Welcome back"
      helperSlot={
        <p className="text-center text-white/70">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-amber-300 hover:underline">
            Sign up here
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm text-white/70" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formValues.email}
            onChange={(event) => handleChange("email", event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-[#1b1b1b] px-4 py-3 text-white outline-none transition focus:border-white/50"
            placeholder="Email"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/70" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formValues.password}
            onChange={(event) => handleChange("password", event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-[#1b1b1b] px-4 py-3 text-white outline-none transition focus:border-white/50"
            placeholder="Password"
            minLength={6}
            required
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-3 text-white/40">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-wide">Or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm text-white/80 transition hover:border-white/50"
          >
            <span className="text-xs uppercase tracking-wide text-white/50">
              G
            </span>
            Continue with Google
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm text-white/80 transition hover:border-white/50"
          >
            <span className="text-xs uppercase tracking-wide text-white/50">
              A
            </span>
            Continue with Apple
          </button>
        </div>
      </form>
    </AuthShell>
  );
}

