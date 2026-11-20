
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Building2,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Database,
  FileText,
  Globe2,
  LayoutDashboard,
  LogOut,
  Menu,
  Pill,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import MediLogo from "@/components/ui/medi-logo";
import MediAtmosphere from "@/components/3d/medi-atmosphere";

type Language = "en" | "bn";

type AdminUser = {
  full_name?: string;
  name?: string;
  email?: string;
  is_admin?: boolean;
  role?: "user" | "admin" | "super_admin";
};

type CatalogItem = {
  id: string;
  generic_name: string;
  brand_name?: string | null;
  is_verified: boolean;
  is_published: boolean;
};

type ModuleItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  count?: string;
  ready: boolean;
};

const translations = {
  en: {
    admin: "Administration",
    overview: "Overview",
    dashboard: "Dashboard",
    catalog: "Medicine Catalog",
    doctors: "Doctors",
    hospitals: "Hospitals",
    users: "Users",
    prescriptions: "Prescriptions",
    knowledge: "Medical Knowledge",
    aiSources: "AI / RAG Sources",
    analytics: "Analytics",
    settings: "Settings",
    search: "Search anything...",
    welcome: "Welcome back",
    subtitle: "Your MEDI platform at a glance.",
    systemStatus: "System overview",
    totalUsers: "Registered users",
    medicines: "Medicine entries",
    verified: "Verified medicines",
    published: "Published medicines",
    management: "Platform management",
    managementText: "Manage your healthcare ecosystem from one place.",
    open: "Open module",
    ready: "Available",
    coming: "Coming soon",
    recent: "Medicine catalog overview",
    recentText: "Current catalog records and verification status.",
    viewAll: "Manage catalog",
    name: "Medicine",
    verification: "Verification",
    publication: "Publication",
    loading: "Loading administration data...",
    accessDenied: "Administrator access required",
    accessText: "Your account does not have administrator permission.",
    login: "Sign in",
    failed: "Unable to load administrator data.",
    retry: "Try again",
    noRecords: "No medicine catalog entries found.",
    verifiedLabel: "Verified",
    pendingLabel: "Pending",
    publishedLabel: "Published",
    draftLabel: "Draft",
    greeting: "Platform control center",
    menu: "Navigation",
    profile: "Administrator",
    logout: "Sign out",
    language: "Language",
    security: "Protected administrator workspace",
  },
  bn: {
    admin: "প্রশাসন",
    overview: "সংক্ষিপ্ত বিবরণ",
    dashboard: "ড্যাশবোর্ড",
    catalog: "মেডিসিন ক্যাটালগ",
    doctors: "ডাক্তার",
    hospitals: "হাসপাতাল",
    users: "ব্যবহারকারী",
    prescriptions: "প্রেসক্রিপশন",
    knowledge: "মেডিকেল নলেজ",
    aiSources: "AI / RAG Sources",
    analytics: "অ্যানালিটিক্স",
    settings: "সেটিংস",
    search: "যেকোনো কিছু খুঁজুন...",
    welcome: "স্বাগতম",
    subtitle: "এক নজরে আপনার MEDI প্ল্যাটফর্ম।",
    systemStatus: "সিস্টেম ওভারভিউ",
    totalUsers: "নিবন্ধিত ব্যবহারকারী",
    medicines: "মেডিসিন এন্ট্রি",
    verified: "ভেরিফাইড মেডিসিন",
    published: "প্রকাশিত মেডিসিন",
    management: "প্ল্যাটফর্ম ম্যানেজমেন্ট",
    managementText: "এক জায়গা থেকে আপনার হেলথকেয়ার প্ল্যাটফর্ম পরিচালনা করুন।",
    open: "মডিউল খুলুন",
    ready: "চালু",
    coming: "শীঘ্রই আসছে",
    recent: "মেডিসিন ক্যাটালগ ওভারভিউ",
    recentText: "ক্যাটালগ রেকর্ড এবং ভেরিফিকেশন অবস্থা।",
    viewAll: "ক্যাটালগ পরিচালনা",
    name: "মেডিসিন",
    verification: "ভেরিফিকেশন",
    publication: "প্রকাশনা",
    loading: "অ্যাডমিন ডেটা লোড হচ্ছে...",
    accessDenied: "অ্যাডমিন অনুমতি প্রয়োজন",
    accessText: "আপনার অ্যাকাউন্টে অ্যাডমিন অনুমতি নেই।",
    login: "লগইন করুন",
    failed: "অ্যাডমিন ডেটা লোড করা যায়নি।",
    retry: "আবার চেষ্টা করুন",
    noRecords: "কোনো মেডিসিন ক্যাটালগ পাওয়া যায়নি।",
    verifiedLabel: "ভেরিফাইড",
    pendingLabel: "অপেক্ষমাণ",
    publishedLabel: "প্রকাশিত",
    draftLabel: "ড্রাফট",
    greeting: "প্ল্যাটফর্ম কন্ট্রোল সেন্টার",
    menu: "নেভিগেশন",
    profile: "অ্যাডমিনিস্ট্রেটর",
    logout: "সাইন আউট",
    language: "ভাষা",
    security: "সুরক্ষিত অ্যাডমিন ওয়ার্কস্পেস",
  },
};

export default function AdminDashboardPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");

  const t = translations[language];

  useEffect(() => {
    const saved = localStorage.getItem("medi-language");
    if (saved === "bn" || saved === "en") setLanguage(saved);
  }, []);

  const changeLanguage = (next: Language) => {
    setLanguage(next);
    localStorage.setItem("medi-language", next);
  };

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setDenied(false);
    setError("");

    try {
      const [userResponse, catalogResponse] = await Promise.all([
        fetch("/api/auth/me", { cache: "no-store" }),
        fetch("/api/admin/medicine-catalog", { cache: "no-store" }),
      ]);

      if (userResponse.status === 401 || catalogResponse.status === 401) {
        window.location.href = "/auth/sign-in";
        return;
      }

      if (catalogResponse.status === 403) {
        setDenied(true);
        setLoading(false);
        return;
      }

      if (!catalogResponse.ok) {
        throw new Error("Catalog access failed.");
      }

      const userData = userResponse.ok ? await userResponse.json() : {};
      const normalizedUser =
        userData.user ?? userData.data?.user ?? userData;

      const catalogData = await catalogResponse.json();

      setUser(normalizedUser);
      setCatalog(
        Array.isArray(catalogData)
          ? catalogData
          : catalogData.items ?? catalogData.data ?? [],
      );
    } catch {
      setError(t.failed);
    } finally {
      setLoading(false);
    }
  }, [t.failed]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);
   const isSuperAdmin = user?.role === "super_admin";
  const modules: ModuleItem[] = [
    {
      title: t.catalog,
      description:
        language === "bn"
          ? "মেডিসিন তথ্য, মূল্য, সোর্স ও ভেরিফিকেশন পরিচালনা"
          : "Manage medicine information, pricing, sources and verification.",
      icon: Pill,
      href: "/admin/medicine-catalog",
      ready: true,
      count: String(catalog.length),
    },
    {
  title: t.users,
  description:
    language === "bn"
      ? "ব্যবহারকারী এবং অ্যাডমিন অনুমতি পরিচালনা করুন।"
      : "Manage user accounts and administrator permissions.",
  icon: Users,
  href: isSuperAdmin ? "/admin/users" : undefined,
  ready: isSuperAdmin,
},
    {
      title: t.doctors,
      description: "Doctor profiles, qualifications and chamber information.",
      icon: Stethoscope,
      ready: false,
    },
    {
      title: t.hospitals,
      description: "Hospital, clinic and diagnostic facility management.",
      icon: Building2,
      ready: false,
    },
    {
      title: t.prescriptions,
      description: "Prescription records and review management.",
      icon: ClipboardList,
      ready: false,
    },
    {
      title: t.knowledge,
      description: "Trusted medical content and knowledge management.",
      icon: BookOpen,
      ready: false,
    },
    {
      title: t.aiSources,
      description: "Manage retrieval sources and AI knowledge connections.",
      icon: Database,
      ready: false,
    },
    {
      title: t.analytics,
      description: "Platform activity, usage and performance insights.",
      icon: Activity,
      ready: false,
    },
  ];
  const visibleModules = modules.filter(
  (module) => module.title !== t.users || isSuperAdmin,
);
  const filteredModules = useMemo(
  () =>
    visibleModules.filter((module) =>
      module.title.toLowerCase().includes(search.toLowerCase()),
    ),
  [visibleModules, search],
);

  const verifiedCount = catalog.filter((item) => item.is_verified).length;
  const publishedCount = catalog.filter((item) => item.is_published).length;
  
  const displayName =
    user?.full_name?.trim() ||
    user?.name?.trim() ||
    "Administrator";

  const stats = [
    {
      title: t.medicines,
      value: catalog.length,
      icon: Pill,
      color: "cyan",
    },
    {
      title: t.verified,
      value: verifiedCount,
      icon: ShieldCheck,
      color: "green",
    },
    {
      title: t.published,
      value: publishedCount,
      icon: Globe2,
      color: "blue",
    },
    {
      title: t.totalUsers,
      value: "—",
      icon: Users,
      color: "purple",
    },
  ];

  if (loading) {
    return (
      <main className="medi-atmosphere min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-cyan-200 border-t-cyan-600" />
          <p className="text-sm font-medium text-slate-600">{t.loading}</p>
        </div>
      </main>
    );
  }

  if (denied) {
    return (
      <main className="medi-atmosphere min-h-screen flex items-center justify-center p-6">
        <div className="relative z-10 max-w-md rounded-3xl border border-white/70 bg-white/80 p-9 text-center shadow-xl backdrop-blur-xl">
          <ShieldCheck className="mx-auto mb-5 h-12 w-12 text-rose-500" />
          <h1 className="text-2xl font-bold text-slate-800">
            {t.accessDenied}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            {t.accessText}
          </p>
          <Link
            href="/dashboard"
            className="mt-7 inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          >
            {t.login}
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="medi-atmosphere min-h-screen flex items-center justify-center p-6">
        <div className="relative z-10 rounded-3xl border border-white/70 bg-white/85 p-8 text-center shadow-xl">
          <CircleHelp className="mx-auto mb-4 h-10 w-10 text-amber-500" />
          <p className="font-semibold text-slate-800">{error}</p>
          <button
            onClick={loadDashboard}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm text-white"
          >
            {t.retry}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#f4f9fb] text-slate-800">
      <MediAtmosphere />

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,rgba(79,201,209,0.13),transparent_42%),linear-gradient(145deg,rgba(246,251,253,0.9),rgba(237,246,250,0.83))]" />

      <div className="relative z-10 flex min-h-screen">
        {mobileMenu && (
          <button
            aria-label="Close navigation"
            onClick={() => setMobileMenu(false)}
            className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-sm lg:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-white/70 bg-white/80 px-5 py-6 shadow-[12px_0_45px_rgba(27,76,99,0.05)] backdrop-blur-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-2">
            <MediLogo />
            <button
              onClick={() => setMobileMenu(false)}
              className="rounded-lg p-2 text-slate-500 lg:hidden"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-9 px-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
              {t.admin}
            </p>
            <p className="mt-1 text-xs font-medium text-cyan-800">
              {t.security}
            </p>
          </div>

          <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              {t.menu}
            </p>

            <Link
              href="/admin"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-3 rounded-xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 px-3 py-3 text-sm font-semibold text-[#176b91] shadow-sm"
            >
              <LayoutDashboard size={18} />
              {t.overview}
            </Link>

            {visibleModules.map((module) => {
              const Icon = module.icon;

              return (
                <div
                  key={module.title}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    module.ready
                      ? "text-slate-600 hover:bg-cyan-50 hover:text-[#176b91]"
                      : "text-slate-400"
                  }`}
                >
                  <Icon size={18} />
                  <span className="flex-1">{module.title}</span>
                  {!module.ready && (
                    <span className="text-[9px] font-medium uppercase tracking-wider">
                      Soon
                    </span>
                  )}
                </div>
              );
            })}

            <div className="my-4 border-t border-slate-100" />

            <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
              <Settings size={18} />
              {t.settings}
            </div>
          </nav>

          <div className="mt-5 rounded-2xl border border-cyan-100/80 bg-gradient-to-br from-cyan-50/90 to-blue-50/90 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#176b91]">
              <ShieldCheck size={15} />
              MEDI Security
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">
              Administrator permissions are enforced by the secure backend.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 text-sm font-bold text-[#176b91]">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {displayName}
              </p>
              <p className="text-[11px] text-slate-400">{t.profile}</p>
            </div>
            <LogOut size={16} className="text-slate-400" />
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-white/70 bg-white/65 px-5 py-4 backdrop-blur-2xl md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileMenu(true)}
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 lg:hidden"
                  aria-label="Open navigation"
                >
                  <Menu size={19} />
                </button>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700">
                    {t.greeting}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    MEDI / {t.admin}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative hidden sm:block">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t.search}
                    className="w-48 rounded-xl border border-slate-200/80 bg-white/75 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100 xl:w-64"
                  />
                </div>

                <button
                  onClick={() =>
                    changeLanguage(language === "en" ? "bn" : "en")
                  }
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:border-cyan-200"
                >
                  <Globe2 size={15} />
                  {language === "en" ? "বাংলা" : "EN"}
                </button>

                <button
                  aria-label="Notifications"
                  className="relative rounded-xl border border-slate-200 bg-white/80 p-2.5 text-slate-500"
                >
                  <Bell size={17} />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-500" />
                </button>

                <button
                  onClick={loadDashboard}
                  title="Refresh data"
                  className="hidden rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:border-cyan-200 sm:block"
                >
                  ↻
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 lg:px-10">
            <section className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/65 p-6 shadow-[0_18px_65px_rgba(31,83,105,0.07)] backdrop-blur-xl md:p-9">
              <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-cyan-200/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 right-1/3 h-52 w-52 rounded-full bg-blue-200/20 blur-3xl" />

              <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-end">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {t.systemStatus}
                  </div>

                  <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-[#173d50] md:text-4xl">
                    {t.welcome},{" "}
                    <span className="bg-gradient-to-r from-[#31b6c5] to-[#176b91] bg-clip-text text-transparent">
                      {displayName.split(" ")[0]}
                    </span>
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
                    {t.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-cyan-100/80 bg-white/70 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                    <ShieldCheck size={21} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      MEDI Admin
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {t.security}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#173d50]">
                    {t.systemStatus}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Live information from available admin APIs
                  </p>
                </div>
                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700">
                  API Connected
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.title}
                      className="group rounded-2xl border border-white/80 bg-white/75 p-5 shadow-[0_8px_32px_rgba(32,78,100,0.045)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-medium leading-5 text-slate-500">
                            {stat.title}
                          </p>
                          <p className="mt-3 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-[#173d50]">
                            {stat.value}
                          </p>
                        </div>

                        <div className="rounded-xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-3 text-[#238ca6] transition group-hover:scale-105">
                          <Icon size={20} />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                        <Activity size={12} />
                        Live catalog data
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-10">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-[#173d50]">
                  {t.management}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {t.managementText}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredModules.map((module, index) => {
                  const Icon = module.icon;

                  const content = (
                    <div
                      className={`group relative h-full overflow-hidden rounded-2xl border p-5 shadow-[0_8px_32px_rgba(32,78,100,0.04)] transition duration-300 ${
                        module.ready
                          ? "border-white/80 bg-white/75 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_15px_45px_rgba(31,126,157,0.10)]"
                          : "border-white/60 bg-white/45 opacity-75"
                      }`}
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="rounded-xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-3 text-[#218ca5] transition duration-300 group-hover:scale-105">
                          <Icon size={21} />
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                            module.ready
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {module.ready ? t.ready : t.coming}
                        </span>
                      </div>

                      <h3 className="mt-5 text-sm font-bold text-[#173d50]">
                        {module.title}
                      </h3>

                      <p className="mt-2 min-h-[42px] text-xs leading-6 text-slate-500">
                        {module.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-[10px] font-semibold text-slate-400">
                          {module.ready
                            ? `${module.count} records`
                            : "Not available yet"}
                        </span>
                        {module.ready ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-[#218ca5]">
                            {t.open}
                            <ArrowRight
                              size={14}
                              className="transition group-hover:translate-x-1"
                            />
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            Coming soon
                          </span>
                        )}
                      </div>
                    </div>
                  );

                  return module.ready && module.href ? (
                    <Link
                      key={module.title}
                      href={module.href}
                      onClick={() => setMobileMenu(false)}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={module.title}>{content}</div>
                  );
                })}
              </div>
            </section>

            <section className="mt-10 overflow-hidden rounded-2xl border border-white/80 bg-white/75 shadow-[0_8px_32px_rgba(32,78,100,0.04)] backdrop-blur-xl">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center md:px-6">
                <div>
                  <h2 className="text-base font-bold text-[#173d50]">
                    {t.recent}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {t.recentText}
                  </p>
                </div>

                <Link
                  href="/admin/medicine-catalog"
                  className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#31b6c5] to-[#176b91] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-900/10 transition hover:-translate-y-0.5 hover:shadow-lg sm:self-auto"
                >
                  {t.viewAll}
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                  <thead>
                    <tr className="bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-4">{t.name}</th>
                      <th className="px-6 py-4">{t.verification}</th>
                      <th className="px-6 py-4">{t.publication}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {catalog.slice(0, 5).map((item) => (
                      <tr
                        key={item.id}
                        className="text-xs text-slate-600 transition hover:bg-cyan-50/40"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">
                            {item.brand_name || item.generic_name}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {item.generic_name}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              item.is_verified
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {item.is_verified
                              ? t.verifiedLabel
                              : t.pendingLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              item.is_published
                                ? "bg-blue-50 text-blue-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {item.is_published ? t.publishedLabel : t.draftLabel}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {catalog.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-10 text-center text-xs text-slate-400"
                        >
                          {t.noRecords}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/80 py-6 text-[10px] text-slate-400 sm:flex-row">
              <span>© {new Date().getFullYear()} MEDI Healthcare</span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-emerald-600" />
                {t.security}
              </span>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
