
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MediLogo from "@/components/ui/medi-logo";
import MediAtmosphere from "@/components/3d/medi-atmosphere";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  X,
  Loader2,
} from "lucide-react";

type UserRole = "user" | "admin" | "super_admin";

type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  is_admin: boolean;
  role: UserRole;
  created_at: string;
};

type UserListResponse = {
  items: AdminUser[];
  total: number;
  limit: number;
  offset: number;
};

type AuthUser = {
  role?: UserRole;
  is_admin?: boolean;
  email?: string;
};

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [confirmation, setConfirmation] = useState<{
    user: AdminUser;
    action: "grant" | "revoke";
  } | null>(null);

  const bn = language === "bn";

  const t = {
    title: bn ? "ইউজার ম্যানেজমেন্ট" : "User Management",
    subtitle: bn
      ? "ব্যবহারকারী এবং অ্যাডমিন অনুমতি পরিচালনা করুন"
      : "Manage user accounts and administrator permissions",
    total: bn ? "মোট ব্যবহারকারী" : "Total users",
    admins: bn ? "এই পৃষ্ঠায় অ্যাডমিন" : "Admins on this page",
    verified: bn ? "যাচাইকৃত অ্যাকাউন্ট" : "Verified on this page",
    search: bn ? "নাম অথবা ইমেইল দিয়ে খুঁজুন..." : "Search by name or email...",
    user: bn ? "ব্যবহারকারী" : "User",
    role: bn ? "রোল" : "Role",
    account: bn ? "অ্যাকাউন্ট অবস্থা" : "Account status",
    joined: bn ? "যোগদানের তারিখ" : "Joined",
    actions: bn ? "অ্যাকশন" : "Actions",
    admin: bn ? "অ্যাডমিন" : "Admin",
    superAdmin: bn ? "সুপার অ্যাডমিন" : "Super Admin",
    regularUser: bn ? "ইউজার" : "User",
    grant: bn ? "Grant Admin" : "Grant Admin",
    revoke: bn ? "Revoke Admin" : "Revoke Admin",
    active: bn ? "সক্রিয়" : "Active",
    inactive: bn ? "নিষ্ক্রিয়" : "Inactive",
    verifiedLabel: bn ? "যাচাইকৃত" : "Verified",
    unverified: bn ? "যাচাই হয়নি" : "Unverified",
    loading: bn ? "ব্যবহারকারী লোড হচ্ছে..." : "Loading users...",
    empty: bn ? "কোনো ব্যবহারকারী পাওয়া যায়নি" : "No users found",
    previous: bn ? "আগের পৃষ্ঠা" : "Previous",
    next: bn ? "পরের পৃষ্ঠা" : "Next",
    page: bn ? "পৃষ্ঠা" : "Page",
    of: bn ? "এর মধ্যে" : "of",
    confirmGrant: bn ? "অ্যাডমিন অনুমতি দেবেন?" : "Grant Admin access?",
    confirmRevoke: bn ? "অ্যাডমিন অনুমতি বাতিল করবেন?" : "Revoke Admin access?",
    grantDescription: bn
      ? "এই ব্যবহারকারী MEDI-এর অ্যাডমিন ফিচার ব্যবহার করতে পারবেন।"
      : "This user will receive access to MEDI administrator features.",
    revokeDescription: bn
      ? "এই ব্যবহারকারীর অ্যাডমিন অনুমতি বাতিল হয়ে সাধারণ ইউজার রোল হবে।"
      : "This user will lose administrator access and return to the User role.",
    confirm: bn ? "নিশ্চিত করুন" : "Confirm",
    cancel: bn ? "বাতিল" : "Cancel",
    restricted: bn ? "অনুমতি নেই" : "Access restricted",
    restrictedDescription: bn
      ? "এই পেজটি শুধুমাত্র Super Admin ব্যবহার করতে পারবেন।"
      : "Only the configured Super Admin can access this page.",
    back: bn ? "অ্যাডমিন ড্যাশবোর্ড" : "Admin Dashboard",
  };

  const loadUsers = useCallback(async () => {
    if (!authorized) return;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(page * PAGE_SIZE),
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(
        `/api/admin/users?${params.toString()}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        window.location.href = "/auth/sign-in";
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (response.status === 403) {
        setAuthorized(false);
        setError(data.detail || "Super Admin permission required.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.detail || "Unable to load users.");
      }

      const result = data as UserListResponse;

      setUsers(Array.isArray(result.items) ? result.items : []);
      setTotal(Number(result.total) || 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [authorized, page, search]);

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      setCheckingAuth(true);

      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          window.location.href = "/auth/sign-in";
          return;
        }

        const data = await response.json().catch(() => ({}));
        const currentUser: AuthUser =
          data.user ?? data.data?.user ?? data;

        if (!cancelled) {
          const isSuperAdmin =
            currentUser.role === "super_admin" &&
            currentUser.is_admin === true;

          setAuthorized(isSuperAdmin);

          if (!isSuperAdmin) {
            setError("Super Admin permission required.");
          }
        }
      } catch {
        if (!cancelled) {
          setAuthorized(false);
          setError("Unable to verify administrator permissions.");
        }
      } finally {
        if (!cancelled) {
          setCheckingAuth(false);
        }
      }
    }

    void checkAccess();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!authorized) return;

    const timer = window.setTimeout(() => {
      void loadUsers();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [authorized, loadUsers]);

  const stats = useMemo(
    () => ({
      admins: users.filter((user) => user.role === "admin" && user.is_admin).length,
      verified: users.filter((user) => user.is_verified).length,
    }),
    [users]
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const startRecord = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const endRecord = Math.min((page + 1) * PAGE_SIZE, total);

  function changeSearch(value: string) {
    setSearch(value);
    setPage(0);
  }

  async function performAction() {
    if (!confirmation) return;

    const { user, action } = confirmation;

    setSavingId(user.id);
    setError("");
    setNotice("");
    setConfirmation(null);

    try {
      const response = await fetch(
        `/api/admin/users/${encodeURIComponent(user.id)}/${action}`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        window.location.href = "/auth/sign-in";
        return;
      }

      if (response.status === 403) {
        throw new Error(
          data.detail || "Super Admin permission required."
        );
      }

      if (!response.ok) {
        throw new Error(data.detail || "Administrator action failed.");
      }

      setNotice(
        data.message ||
          (action === "grant"
            ? "Admin access granted successfully."
            : "Admin access revoked successfully.")
      );

      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSavingId(null);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100";

  if (checkingAuth) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-[#f4f9fb]">
        <MediAtmosphere />
        <div className="relative z-10 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-6 py-5 text-sm text-slate-600 shadow-sm">
          <Loader2 className="animate-spin text-cyan-700" size={20} />
          {bn ? "অনুমতি যাচাই হচ্ছে..." : "Checking permissions..."}
        </div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-[#f4f9fb] px-4">
        <MediAtmosphere />
        <section className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-8 text-center shadow-sm">
          <ShieldAlert className="mx-auto mb-4 text-amber-600" size={42} />
          <h1 className="text-2xl font-bold text-[#173d50]">
            {t.restricted}
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            {error || t.restrictedDescription}
          </p>
          <Link
            href="/admin"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#176b91] px-5 py-3 text-sm font-semibold text-white hover:bg-[#125775]"
          >
            <ArrowLeft size={16} />
            {t.back}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#f4f9fb] text-slate-800">
      <MediAtmosphere />

      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-br from-white/35 via-transparent to-cyan-50/40" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 py-6 sm:px-7 lg:px-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              <ArrowLeft size={18} />
            </Link>
            <MediLogo />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {language === "en" ? "বাংলা" : "English"}
            </button>

            <button
              onClick={() => void loadUsers()}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        <section className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
            <ShieldCheck size={14} />
            MEDI ADMINISTRATION
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#173d50] sm:text-4xl">
                {t.title}
              </h1>
              <p className="mt-2 text-sm text-slate-500">{t.subtitle}</p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-800">
              <ShieldCheck size={15} />
              {t.superAdmin}
            </span>
          </div>
        </section>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            {error}
            <button
              onClick={() => setError("")}
              className="ml-auto"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {notice && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} />
              {notice}
            </span>
            <button onClick={() => setNotice("")} aria-label="Dismiss notice">
              <X size={16} />
            </button>
          </div>
        )}

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            {
              label: t.total,
              value: total,
              icon: Users,
              color: "text-cyan-700",
              bg: "bg-cyan-50",
            },
            {
              label: t.admins,
              value: stats.admins,
              icon: ShieldCheck,
              color: "text-blue-700",
              bg: "bg-blue-50",
            },
            {
              label: t.verified,
              value: stats.verified,
              icon: UserCheck,
              color: "text-emerald-700",
              bg: "bg-emerald-50",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </span>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                  >
                    <Icon size={19} />
                  </span>
                </div>
                <div className="mt-3 text-3xl font-bold tabular-nums text-[#173d50]">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#173d50]">
                {bn ? "ব্যবহারকারীর তালিকা" : "Registered users"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {bn
                  ? "শুধুমাত্র সক্রিয় ও যাচাইকৃত ব্যবহারকারীকে অ্যাডমিন করা যাবে"
                  : "Only active and verified users can receive Admin access"}
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />
              <input
                value={search}
                onChange={(event) => changeSearch(event.target.value)}
                placeholder={t.search}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-14 text-sm text-slate-500">
              <Loader2 className="animate-spin text-cyan-700" size={19} />
              {t.loading}
            </div>
          ) : users.length === 0 ? (
            <div className="p-14 text-center">
              <Users className="mx-auto mb-3 text-slate-300" size={34} />
              <p className="text-sm font-medium text-slate-500">{t.empty}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-slate-50/90 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4">{t.user}</th>
                    <th className="px-5 py-4">{t.role}</th>
                    <th className="px-5 py-4">{t.account}</th>
                    <th className="px-5 py-4">{t.joined}</th>
                    <th className="px-5 py-4 text-right">{t.actions}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => {
                    const isSuperAdmin = user.role === "super_admin";
                    const isAdmin =
                      user.role === "admin" && user.is_admin;

                    const canGrant =
                      user.role === "user" &&
                      !user.is_admin &&
                      user.is_active &&
                      user.is_verified;

                    return (
                      <tr
                        key={user.id}
                        className="transition hover:bg-cyan-50/30"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-[#173d50]">
                            {user.full_name}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {user.email}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              isSuperAdmin
                                ? "bg-violet-50 text-violet-700"
                                : isAdmin
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {isSuperAdmin ? (
                              <ShieldCheck size={12} />
                            ) : isAdmin ? (
                              <ShieldCheck size={12} />
                            ) : null}
                            {isSuperAdmin
                              ? t.superAdmin
                              : isAdmin
                                ? t.admin
                                : t.regularUser}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-col items-start gap-1.5">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                user.is_active
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {user.is_active ? t.active : t.inactive}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {user.is_verified
                                ? t.verifiedLabel
                                : t.unverified}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-xs text-slate-500">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString(
                                bn ? "bn-BD" : "en-US"
                              )
                            : "—"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            {isSuperAdmin ? (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">
                                <ShieldCheck size={14} />
                                Protected
                              </span>
                            ) : isAdmin ? (
                              <button
                                disabled={savingId === user.id}
                                onClick={() =>
                                  setConfirmation({
                                    user,
                                    action: "revoke",
                                  })
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                              >
                                {savingId === user.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <UserX size={14} />
                                )}
                                {t.revoke}
                              </button>
                            ) : (
                              <button
                                disabled={!canGrant || savingId === user.id}
                                onClick={() =>
                                  setConfirmation({
                                    user,
                                    action: "grant",
                                  })
                                }
                                title={
                                  !canGrant
                                    ? "User must be active and verified"
                                    : t.grant
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-[#176b91] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#125775] disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {savingId === user.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <ShieldCheck size={14} />
                                )}
                                {t.grant}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
            <p className="text-xs text-slate-400">
              {startRecord}–{endRecord} / {total}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 0 || loading}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                {t.previous}
              </button>

              <span className="px-2 text-xs font-medium text-slate-500">
                {t.page} {page + 1} {t.of} {totalPages}
              </span>

              <button
                disabled={page + 1 >= totalPages || loading}
                onClick={() =>
                  setPage((current) => Math.min(totalPages - 1, current + 1))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                {t.next}
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>MEDI · User Administration</span>
          <span>Protected Super Admin controls</span>
        </footer>
      </div>

      {confirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-800">
              <ShieldCheck size={23} />
            </div>

            <h3 className="text-lg font-bold text-[#173d50]">
              {confirmation.action === "grant"
                ? t.confirmGrant
                : t.confirmRevoke}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {confirmation.action === "grant"
                ? t.grantDescription
                : t.revokeDescription}
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="font-semibold text-[#173d50]">
                {confirmation.user.full_name}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {confirmation.user.email}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirmation(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                {t.cancel}
              </button>

              <button
                onClick={() => void performAction()}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white ${
                  confirmation.action === "grant"
                    ? "bg-[#176b91] hover:bg-[#125775]"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
