
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MediLogo from "@/components/ui/medi-logo";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  LockKeyhole,
  UserRound,
  ShieldCheck,
  Fingerprint,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordValid = password.length >= 8;
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedName.length < 2 || normalizedName.length > 150) {
      setError("Please enter a valid full name.");
      return;
    }

    if (!passwordValid) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: normalizedName,
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          typeof data.detail === "string"
            ? data.detail
            : typeof data.message === "string"
              ? data.message
              : "Unable to create your account. Please try again.";

        throw new Error(message);
      }

      router.replace("/verification-pending");
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

  const inputClass =
    "w-full bg-transparent py-3.5 pl-11 pr-4 text-sm text-[#19343A] outline-none placeholder:text-[#A3AAA3]";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F5F3ED] px-5 py-8 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full border border-[#DCE2D6] opacity-60" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 h-[520px] w-[520px] rounded-full border border-[#DCE2D6] opacity-60" />

      <div className="relative mx-auto max-w-[1240px]">
        <header className="flex items-center justify-between">
          <MediLogo />

         <Link
    href="/"
    className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-[#D8E1D8] bg-[#FBFAF6]/90 px-5 text-xs font-semibold text-[#405A56] shadow-[0_4px_14px_rgba(23,54,64,0.04)] backdrop-blur-sm transition-all duration-300 hover:border-[#668F83] hover:bg-[#173640] hover:text-white hover:shadow-[0_8px_22px_rgba(23,54,64,0.13)]"
  >
    <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
    Back to home
  </Link>
        </header>

        <section className="grid min-h-[calc(100vh-110px)] items-center gap-12 py-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto w-full max-w-[510px]"
          >
            <div className="mb-8 flex h-[76px] w-[76px] items-center justify-center rounded-full border border-[#DCE2D6] bg-[#EBEEE5] text-[#668F83]">
              <Fingerprint size={38} strokeWidth={1.2} />
            </div>

            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8A9B87]">
              Your health, your journey
            </p>

            <h1 className="max-w-[500px] font-serif text-5xl leading-[1.12] tracking-[-0.04em] text-[#173640] sm:text-6xl">
              Begin your
              <br />
              journey with
              <br />
              <span className="italic text-[#668F83]">better health.</span>
            </h1>

            <p className="mt-7 max-w-[430px] text-[15px] leading-8 text-[#71817C]">
              Create your personal MEDI account and take the first step
              towards a healthier, more mindful lifestyle.
            </p>

            <div className="mt-12 space-y-6">
              {[
                "Your own personalized health space",
                "Lifestyle insights tailored to you",
                "Privacy-focused account protection",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E5EBE1] text-[#668F83]">
                    <Check size={15} />
                  </div>
                  <span className="text-sm text-[#536A63]">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-14 flex items-center gap-4 border-t border-[#DFE3D9] pt-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E7EBE2] text-[#668F83]">
                <ShieldCheck size={21} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#29463F]">
                  Your privacy matters
                </p>
                <p className="mt-1 text-xs text-[#8A9690]">
                  Your account is protected with secure authentication.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mx-auto w-full max-w-[470px]"
          >
            <div className="rounded-[28px] border border-[#E1E3D9] bg-[#FBFAF6] p-7 shadow-[0_20px_70px_rgba(39,65,54,0.06)] sm:p-10">
              <div className="mb-8">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8A9B87]">
                  Create your account
                </p>

                <h2 className="font-serif text-[34px] tracking-[-0.03em] text-[#19343A]">
                  Join MEDI
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#89938C]">
                  Enter your details to create your personal account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-xs font-semibold text-[#536A63]"
                  >
                    Full name
                  </label>

                  <div className="flex items-center rounded-xl border border-[#E1E4DA] bg-white transition focus-within:border-[#829B89]">
                    <UserRound
                      size={17}
                      className="ml-4 shrink-0 text-[#91A095]"
                    />
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={150}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold text-[#536A63]"
                  >
                    Email address
                  </label>

                  <div className="flex items-center rounded-xl border border-[#E1E4DA] bg-white transition focus-within:border-[#829B89]">
                    <Mail
                      size={17}
                      className="ml-4 shrink-0 text-[#91A095]"
                    />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-semibold text-[#536A63]"
                  >
                    Password
                  </label>

                  <div className="flex items-center rounded-xl border border-[#E1E4DA] bg-white transition focus-within:border-[#829B89]">
                    <LockKeyhole
                      size={17}
                      className="ml-4 shrink-0 text-[#91A095]"
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      maxLength={128}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="mr-4 text-[#91A095] transition hover:text-[#29463F]"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-[#9AA39B]">
                    {password.length === 0
                      ? "Use at least 8 characters."
                      : passwordValid
                        ? "Password length looks good."
                        : `${8 - password.length} more characters required.`}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-xs font-semibold text-[#536A63]"
                  >
                    Confirm password
                  </label>

                  <div className="flex items-center rounded-xl border border-[#E1E4DA] bg-white transition focus-within:border-[#829B89]">
                    <LockKeyhole
                      size={17}
                      className="ml-4 shrink-0 text-[#91A095]"
                    />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      className="mr-4 text-[#91A095] transition hover:text-[#29463F]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>

                  {confirmPassword.length > 0 && (
                    <p
                      className={`mt-2 text-[11px] ${
                        passwordsMatch ? "text-[#668F83]" : "text-[#B68C63]"
                      }`}
                    >
                      {passwordsMatch
                        ? "Passwords match."
                        : "Passwords do not match."}
                    </p>
                  )}
                </div>

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
                  {loading ? "Creating your account..." : "Create account"}
                  {!loading && (
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#E8E8DF]" />
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#A2AAA1]">
                  Already a member?
                </span>
                <div className="h-px flex-1 bg-[#E8E8DF]" />
              </div>

              <Link
                href="/auth/sign-in"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DDE2D8] py-3.5 text-sm font-semibold text-[#36564C] transition hover:border-[#9CAF9D] hover:bg-[#F2F4ED]"
              >
                Sign in to your account
                <ArrowRight size={16} />
              </Link>

              <p className="mt-7 text-center text-[10px] leading-5 text-[#A0A79F]">
                By creating an account, you agree to use MEDI responsibly.
                <br />
                Your health journey starts with you.
              </p>
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#929D94]">
              <ShieldCheck size={14} />
              Protected account authentication
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
