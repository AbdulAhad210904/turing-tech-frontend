"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { register } from "@/services/auth";
import { Credentials } from "@/types/auth";

export default function SignupPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<Credentials>({
    email: "",
    password: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (key: keyof Credentials, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!acceptTerms) {
      setError("Please accept the terms and privacy policy to continue.");
      return;
    }
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const result = await register(formValues);
      setSuccess(result.message ?? "Registration successful.");
      setTimeout(() => router.push("/login"), 1000);
    } catch (err: any) {
      const message =
        err?.data?.message ??
        err?.response?.data?.message ??
        "Unable to sign up. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Unlock your edge with TuringTech Test"
      subtitle="Create an account"
      helperSlot={
        <p className="text-center text-white/70">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-300 hover:underline">
            Login
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

        <label className="flex items-start gap-3 text-sm text-white/70">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(event) => setAcceptTerms(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border border-white/20 bg-transparent accent-amber-300"
          />
          <span>
            I accept the{" "}
            <Link
              href="#"
              className="text-amber-300 underline-offset-2 hover:underline"
            >
              terms and conditions
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-amber-300 underline-offset-2 hover:underline"
            >
              privacy policy
            </Link>
            .
          </span>
        </label>

        {error ? (
          <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
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
            Sign up with Google
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm text-white/80 transition hover:border-white/50"
          >
            <span className="text-xs uppercase tracking-wide text-white/50">
              A
            </span>
            Sign up with Apple
          </button>
        </div>
      </form>
    </AuthShell>
  );
}

