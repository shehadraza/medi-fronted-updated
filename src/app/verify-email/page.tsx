
"use client";
import MediAtmosphere from "@/components/3d/medi-atmosphere";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ShieldCheck,
  MailCheck,
} from "lucide-react";
import MediLogo from "@/components/ui/medi-logo";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("We're securely verifying your email address.");

  useEffect(() => {
    let cancelled = false;

    async function verifyEmail() {
      if (!token) {
        setStatus("error");
        setMessage("The verification link is missing or invalid. Please request a new verification email.");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
          cache: "no-store",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            typeof data.detail === "string"
              ? data.detail
              : "This verification link is invalid or has expired."
          );
        }

        if (!cancelled) {
          setStatus("success");
          setMessage(
            data.message || "Your email has been verified successfully. You can now sign in to MEDI."
          );
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setMessage(
            err instanceof Error
              ? err.message
              : "Unable to verify your email. Please try again."
          );
        }
      }
    }

    verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F3ED] px-5 py-10">
      <MediAtmosphere />
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full border border-[#DCE2D6] opacity-60" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 h-[520px] w-[520px] rounded-full border border-[#DCE2D6] opacity-60" />

      <div className="relative w-full max-w-[480px]">
        <header className="mb-10 flex items-center justify-between">
          <MediLogo />
          <Link
            href="/"
            className="rounded-full border border-[#D8E1D8] bg-[#FBFAF6] px-5 py-3 text-xs font-semibold text-[#405A56] transition hover:bg-[#173640] hover:text-white"
          >
            Home
          </Link>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[28px] border border-[#E1E3D9] bg-[#FBFAF6] p-8 text-center shadow-[0_20px_70px_rgba(39,65,54,0.06)] sm:p-11"
        >
          <div className="mx-auto mb-8 flex h-[82px] w-[82px] items-center justify-center rounded-full border border-[#DCE2D6] bg-[#EBEEE5] text-[#668F83]">
            {status === "loading" && <LoaderCircle size={38} className="animate-spin" strokeWidth={1.3} />}
            {status === "success" && <MailCheck size={38} strokeWidth={1.3} />}
            {status === "error" && <AlertCircle size={38} strokeWidth={1.3} />}
          </div>

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8A9B87]">
            MEDI account security
          </p>

          <h1 className="font-serif text-[36px] leading-tight tracking-[-0.035em] text-[#19343A]">
            {status === "loading" && "Verifying your email"}
            {status === "success" && "Email verified."}
            {status === "error" && "Verification unsuccessful"}
          </h1>

          <p className="mt-5 text-sm leading-7 text-[#71817C]">
            {message}
          </p>

          {status === "loading" && (
            <p className="mt-7 text-xs text-[#929D94]">
              Please keep this page open for a moment.
            </p>
          )}

          {status === "success" && (
            <div className="mt-8 rounded-2xl border border-[#DCE7DA] bg-[#F0F5ED] p-5 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#668F83]" />
                <div>
                  <p className="text-sm font-semibold text-[#29463F]">
                    Your account is ready
                  </p>
                  <p className="mt-1 text-xs leading-6 text-[#819087]">
                    Your email address has been confirmed. You can now securely sign in to continue your health journey.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === "success" && (
            <Link
              href="/auth/sign-in"
              className="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#193C40] px-5 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#28564F]"
            >
              Continue to sign in
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          {status === "error" && (
            <Link
              href="/verification-pending"
              className="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#193C40] px-5 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#28564F]"
            >
              Request a new verification email
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-[#929D94]">
            <ShieldCheck size={14} />
            Protected account authentication
          </div>
        </motion.section>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F5F3ED]">
          <LoaderCircle className="animate-spin text-[#668F83]" size={32} />
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
