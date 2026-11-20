
"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import MediLogo from "@/components/ui/medi-logo";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Fingerprint,
  KeyRound,
  Check,
} from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset link. Please request a new one.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("Password must contain 8–128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
  "/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            new_password: password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to reset password. Please request a new link."
        );
      }

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
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

  const passwordStrength =
    password.length === 0
      ? 0
      : password.length < 8
        ? 1
        : password.length < 12
          ? 2
          : 3;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F5F3ED] text-[#19343A] selection:bg-[#A9BCA9]/50">
      {/* Subtle background details */}
      <div className="pointer-events-none absolute right-[-180px] top-[180px] h-[520px] w-[520px] rounded-full border border-[#173640]/[0.045]" />
      <div className="pointer-events-none absolute right-[-105px] top-[255px] h-[370px] w-[370px] rounded-full border border-[#173640]/[0.05]" />
      <div className="pointer-events-none absolute bottom-[-230px] left-[-160px] h-[470px] w-[470px] rounded-full bg-[#A9BCA9]/[0.16] blur-[100px]" />

      {/* Header */}
      
{/* Header */}
<header className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
  <MediLogo />

  <motion.div
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.97 }}
  >
    <Link
      href="/"
      className="group inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-full border border-[#D8E1D8] bg-[#FBFAF6] px-6 text-sm font-semibold text-[#405A56] shadow-[0_4px_14px_rgba(23,54,64,0.06)] transition-all duration-300 hover:border-[#668F83] hover:bg-[#173640] hover:text-white"
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
      Back to Home
    </Link>
  </motion.div>
</header>


      {/* Main content */}
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-100px)] w-full max-w-[1440px] items-center gap-12 px-6 pb-16 pt-8 sm:px-10 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:px-20 lg:pb-20">
        {/* Left editorial section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto w-full max-w-[570px] lg:mx-0"
        >
          <div className="mb-7 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#668F83]">
            <span className="h-[7px] w-[7px] rounded-full bg-[#B68C63]" />
            ACCOUNT SECURITY
          </div>

          <h2 className="max-w-[540px] text-[42px] font-semibold leading-[1.13] tracking-[-0.065em] text-[#173640] sm:text-[55px] lg:text-[62px]">
            A fresh start,
            <br />
            with a <span className="font-serif font-medium italic text-[#668F83]">stronger</span>
            <br />
            layer of security.
          </h2>

          <p className="mt-7 max-w-[440px] text-[14px] leading-[2] text-[#71817C]">
            Your health information deserves thoughtful protection.
            Create a new password to keep your personal MEDI account secure.
          </p>

          {/* Custom security illustration */}
          <div className="relative mt-12 flex min-h-[235px] max-w-[470px] items-center justify-center overflow-hidden border-y border-[#DDE3DA] bg-[#EEF0E8]/70">
            <div className="absolute left-1/2 top-1/2 h-[215px] w-[215px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A9BCA9]/50" />
            <div className="absolute left-1/2 top-1/2 h-[165px] w-[165px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#A9BCA9]/70" />

            <motion.div
              initial={{ scale: 0.86, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative z-10 flex h-[112px] w-[112px] items-center justify-center rounded-full border border-[#A9BCA9]/60 bg-[#F9F8F2] shadow-[0_18px_45px_rgba(23,54,64,0.09)]"
            >
              <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#173640]">
                <Fingerprint className="h-10 w-10 text-[#DCE9DF]" strokeWidth={1.2} />
              </div>
            </motion.div>

            <div className="absolute left-[12%] top-[25%] flex h-9 w-9 items-center justify-center rounded-full border border-[#DDE3DA] bg-[#FBF9F4] text-[#668F83]">
              <ShieldCheck size={17} strokeWidth={1.5} />
            </div>

            <div className="absolute bottom-[20%] right-[15%] flex h-9 w-9 items-center justify-center rounded-full border border-[#DDE3DA] bg-[#FBF9F4] text-[#B68C63]">
              <KeyRound size={16} strokeWidth={1.5} />
            </div>

            <div className="absolute bottom-4 left-5 text-[9px] font-bold tracking-[0.18em] text-[#87958D]">
              PRIVATE BY DESIGN
            </div>

            <div className="absolute right-5 top-4 text-[9px] font-bold tracking-[0.18em] text-[#87958D]">
              MEDI / SECURITY
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
            <div className="flex items-center gap-2 text-[11px] font-medium text-[#71817C]">
              <Check className="h-3.5 w-3.5 text-[#668F83]" />
              Personal account protection
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-[#71817C]">
              <Check className="h-3.5 w-3.5 text-[#668F83]" />
              Secure password update
            </div>
          </div>
        </motion.div>

        {/* Right form section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12 }}
          className="mx-auto w-full max-w-[470px]"
        >
          <div className="border border-[#E1E3D9] bg-[#FBFAF6] p-6 shadow-[0_24px_70px_rgba(23,54,64,0.055)] sm:p-10">
            <div className="mb-9 flex items-center justify-between border-b border-[#E5E6DE] pb-6">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#668F83]">
                  MEDI ACCOUNT
                </p>
                <p className="mt-1 text-xs text-[#87938D]">
                  Password recovery
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center border border-[#DDE3DA] bg-[#EEF0E8] text-[#668F83]">
                <LockKeyhole size={19} strokeWidth={1.5} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="py-5"
                >
                  <div className="mb-7 flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#E5EFE6] text-[#527F69]">
                    <CheckCircle2 size={32} strokeWidth={1.5} />
                  </div>

                  <p className="text-[10px] font-bold tracking-[0.2em] text-[#668F83]">
                    PASSWORD UPDATED
                  </p>

                  <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.055em] text-[#173640]">
                    You're all set.
                  </h1>

                  <p className="mt-4 text-sm leading-7 text-[#71817C]">
                    Your password has been changed successfully.
                    You can now sign in with your new password.
                  </p>

                  <div className="mt-7 flex items-start gap-3 border border-[#DDE7DC] bg-[#F0F4ED] p-4">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#668F83]" />
                    <p className="text-xs leading-6 text-[#526D61]">
                      Your updated password is ready to use for your MEDI account.
                    </p>
                  </div>

                  <Link
                    href="/auth/sign-in"
                    className="mt-8 flex min-h-[54px] w-full items-center justify-center gap-3 bg-[#173640] px-5 text-sm font-semibold text-white transition hover:bg-[#244D50]"
                  >
                    Continue to Sign In
                    <ArrowRight size={17} />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-[10px] font-bold tracking-[0.2em] text-[#668F83]">
                    RESET YOUR CREDENTIALS
                  </p>

                  <h1 className="mt-3 text-[34px] font-semibold leading-[1.15] tracking-[-0.06em] text-[#173640] sm:text-[39px]">
                    Create a new
                    <br />
                    <span className="font-serif font-medium italic text-[#668F83]">
                      password.
                    </span>
                  </h1>

                  <p className="mt-4 text-sm leading-7 text-[#71817C]">
                    Choose a strong password to keep your personal MEDI
                    account safe and secure.
                  </p>

                  {!token && (
                    <div
                      role="alert"
                      className="mt-6 flex items-start gap-3 border border-[#E8DCC6] bg-[#F7F0E4] p-4 text-xs leading-6 text-[#846C4B]"
                    >
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                      <span>
                        This reset link is missing its token. Please
                        request a new password reset email.
                      </span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* New password */}
                    <div>
                      <label
                        htmlFor="new-password"
                        className="mb-2.5 block text-xs font-bold text-[#405A56]"
                      >
                        New password
                      </label>

                      <div className="group relative">
                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#8A9990]" />

                        <input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your new password"
                          minLength={8}
                          maxLength={128}
                          autoComplete="new-password"
                          required
                          className="h-[54px] w-full border border-[#DDE2D9] bg-[#F7F6F0] pl-12 pr-12 text-sm text-[#19343A] outline-none transition placeholder:text-[#A0AAA1] hover:border-[#B9C9BD] focus:border-[#668F83] focus:bg-white focus:ring-4 focus:ring-[#668F83]/10"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#87958D] transition hover:text-[#173640]"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      <div className="mt-3 flex gap-1.5">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`h-[4px] flex-1 transition-colors duration-300 ${
                              passwordStrength >= level
                                ? level === 1
                                  ? "bg-[#C77D72]"
                                  : level === 2
                                    ? "bg-[#C7A77B]"
                                    : "bg-[#668F83]"
                                : "bg-[#E4E7DE]"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="mt-2 text-[11px] text-[#87938D]">
                        Use 8–128 characters. Longer passwords are recommended.
                      </p>
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="mb-2.5 block text-xs font-bold text-[#405A56]"
                      >
                        Confirm new password
                      </label>

                      <div className="group relative">
                        <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#8A9990]" />

                        <input
                          id="confirm-password"
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Enter your password again"
                          minLength={8}
                          maxLength={128}
                          autoComplete="new-password"
                          required
                          className="h-[54px] w-full border border-[#DDE2D9] bg-[#F7F6F0] pl-12 pr-12 text-sm text-[#19343A] outline-none transition placeholder:text-[#A0AAA1] hover:border-[#B9C9BD] focus:border-[#668F83] focus:bg-white focus:ring-4 focus:ring-[#668F83]/10"
                        />

                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          aria-label={showConfirm ? "Hide password" : "Show password"}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#87958D] transition hover:text-[#173640]"
                        >
                          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      {confirmPassword.length > 0 && (
                        <p
                          className={`mt-2 text-[11px] ${
                            password === confirmPassword
                              ? "text-[#527F69]"
                              : "text-[#B66E65]"
                          }`}
                        >
                          {password === confirmPassword
                            ? "Passwords match"
                            : "Passwords do not match yet"}
                        </p>
                      )}
                    </div>

                    {/* Error */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="alert"
                        className="flex items-start gap-3 border border-[#E9D4D0] bg-[#F8EEEA] p-4 text-xs leading-6 text-[#9C5F56]"
                      >
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}

                    {/* Submit */}
                    <motion.button
                      whileHover={{ y: loading ? 0 : -2 }}
                      whileTap={{ scale: loading ? 1 : 0.99 }}
                      type="submit"
                      disabled={loading || !token}
                      className="flex h-[56px] w-full items-center justify-center gap-3 bg-[#173640] px-5 text-sm font-bold text-white shadow-[0_12px_25px_rgba(23,54,64,0.12)] transition hover:bg-[#244D50] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Updating password...
                        </>
                      ) : (
                        <>
                          <LockKeyhole size={17} />
                          Reset Password
                          <ArrowRight size={16} />
                        </>
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-7 border-t border-[#E5E6DE] pt-6">
                    <Link
                      href="/auth/sign-in"
                      className="group flex items-center justify-center gap-2 text-xs font-semibold text-[#71817C] transition hover:text-[#173640]"
                    >
                      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      Back to Sign In
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-semibold tracking-[0.12em] text-[#87938D]">
            <ShieldCheck className="h-4 w-4 text-[#668F83]" />
            YOUR PRIVACY MATTERS · MEDI
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F5F3ED] text-[#173640]">
          Loading MEDI...
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
