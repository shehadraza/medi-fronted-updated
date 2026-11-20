
"use client";
import MediAtmosphere from "@/components/3d/medi-atmosphere";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import MediLogo from "@/components/ui/medi-logo";

export default function VerificationPendingPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleResend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to resend the verification email. Please try again."
        );
      }

      setMessage(
        data.message ||
          "If your account needs verification, a new email will be sent shortly."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F3ED] px-5 py-10">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full border border-[#DCE2D6] opacity-60" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 h-[520px] w-[520px] rounded-full border border-[#DCE2D6] opacity-60" />

      <div className="relative w-full max-w-[480px]">
        <header className="mb-10 flex items-center justify-between">
          <MediLogo />
          <Link
            href="/"
            className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#D8E1D8] bg-[#FBFAF6] px-4 text-xs font-semibold text-[#405A56] transition hover:bg-[#173640] hover:text-white"
          >
            <ArrowLeft size={15} />
            Home
          </Link>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[28px] border border-[#E1E3D9] bg-[#FBFAF6] p-7 shadow-[0_20px_70px_rgba(39,65,54,0.06)] sm:p-10"
        >
          <div className="mb-7 flex h-[76px] w-[76px] items-center justify-center rounded-full border border-[#DCE2D6] bg-[#EBEEE5] text-[#668F83]">
            <Mail size={35} strokeWidth={1.3} />
          </div>

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8A9B87]">
            One more step
          </p>

          <h1 className="font-serif text-[36px] leading-tight tracking-[-0.035em] text-[#19343A]">
            Verify your email.
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#71817C]">
            Your MEDI account has been created. Please check your inbox and
            follow the verification link we sent you before signing in.
          </p>

          <div className="mt-7 rounded-2xl border border-[#E1E7DD] bg-[#F3F5EF] p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#668F83]" size={20} />
              <div>
                <p className="text-sm font-semibold text-[#29463F]">
                  Your account security matters
                </p>
                <p className="mt-1 text-xs leading-6 text-[#819087]">
                  Email verification helps protect your account and confirms
                  that you can access your registered email address.
                </p>
              </div>
            </div>
          </div>

          <div className="my-8 h-px bg-[#E8E8DF]" />

          <h2 className="text-sm font-semibold text-[#29463F]">
            Didn't receive the email?
          </h2>
          <p className="mt-2 text-xs leading-6 text-[#89938C]">
            Check your spam folder, or request another verification email below.
          </p>

          <form onSubmit={handleResend} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="verification-email"
                className="mb-2 block text-xs font-semibold text-[#536A63]"
              >
                Email address
              </label>
              <div className="flex items-center rounded-xl border border-[#E1E4DA] bg-white transition focus-within:border-[#829B89]">
                <Mail size={17} className="ml-4 shrink-0 text-[#91A095]" />
                <input
                  id="verification-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3.5 pl-3 pr-4 text-sm text-[#19343A] outline-none placeholder:text-[#A3AAA3]"
                />
              </div>
            </div>

            {message && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-xl border border-[#DCE7DA] bg-[#F0F5ED] px-4 py-3 text-xs leading-5 text-[#52765D]"
              >
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-[#E8D7D0] bg-[#FAF0EC] px-4 py-3 text-xs leading-5 text-[#A45F50]"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#193C40] px-5 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#28564F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Sending email...
                </>
              ) : (
                <>
                  Resend verification email
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 text-center">
            <Link
              href="/auth/sign-in"
              className="text-sm font-semibold text-[#668F83] transition hover:text-[#29463F]"
            >
              Continue to sign in
            </Link>
          </div>
        </motion.section>

        <p className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#929D94]">
          <ShieldCheck size={14} />
          Protected account authentication
        </p>
      </div>
    </main>
  );
}
