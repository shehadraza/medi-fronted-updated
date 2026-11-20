
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Search, Plus, Pill, CalendarDays, Clock3, Utensils,
  Pencil, Trash2, X, LoaderCircle, PackageOpen, CheckCircle2,
  AlertCircle, Languages, RefreshCw, ArrowUpRight, Sparkles,
} from "lucide-react";

import MediLogo from "@/components/ui/medi-logo";
import MediAtmosphere from "@/components/3d/medi-atmosphere";
import DashboardMedicalScene from "@/components/3d/dashboard-medical-scene";

type MedicineCatalogInformation = {
  status: "matched" | "not_found" | "ambiguous" | "insufficient_identity";
  medicine_catalog_id?: string;
  generic_name?: string | null;
  brand_name?: string | null;
  manufacturer?: string | null;
  strength?: string | null;
  dosage_form?: string | null;
  route?: string | null;
  common_uses?: string[];
  safety_information?: string[];
  catalog_verified?: boolean;
  catalog_published?: boolean;
  message?: string;
  price?: {
    amount: string | null;
    currency: string | null;
    pack_size: string | null;
    source_name: string | null;
    source_url: string | null;
    source_reference: string | null;
    catalog_verified_at: string | null;
  };
};

type MedicationStatus = "active" | "completed" | "discontinued";

type Medication = {
  id: string;
  medicine_name: string;
  generic_name: string | null;
  brand_name: string | null;
  strength: string | null;
  dosage_form: string | null;
  dose: string | null;
  frequency: string | null;
  duration: string | null;
  food_instruction: string | null;
  additional_instructions: string | null;
  status: MedicationStatus;
  start_date: string | null;
  end_date: string | null;
  source: string;
  prescription_id: string | null;
    catalog_information: MedicineCatalogInformation | null;
  created_at: string;
  updated_at: string;
};

type MedicationForm = {
  medicine_name: string;
  generic_name: string;
  brand_name: string;
  strength: string;
  dosage_form: string;
  dose: string;
  frequency: string;
  duration: string;
  food_instruction: string;
  additional_instructions: string;
  start_date: string;
  end_date: string;
  status: MedicationStatus;
};

const emptyForm: MedicationForm = {
  medicine_name: "",
  generic_name: "",
  brand_name: "",
  strength: "",
  dosage_form: "",
  dose: "",
  frequency: "",
  duration: "",
  food_instruction: "",
  additional_instructions: "",
  start_date: "",
  end_date: "",
  status: "active",
};

const translations = {
  en: {
    title: "Medicine Cabinet",
    subtitle: "Your personal medication records, organized with care.",
    add: "Add medicine",
    back: "Dashboard",
    total: "Total medicines",
    activeCount: "Active treatments",
    completedCount: "Completed",
    search: "Search medicine, generic or brand...",
    all: "All medicines",
    active: "Active",
    completed: "Completed",
    discontinued: "Discontinued",
    results: "Your medication records",
    resultDesc: "A clear overview of your personal medicine cabinet.",
    empty: "Your cabinet is waiting for its first medicine",
    emptyDesc: "Add your medication details to keep your treatment information organized.",
    noResults: "No medicines found",
    noResultsDesc: "Try a different search or status filter.",
    addFirst: "Add your first medicine",
    edit: "Edit",
    delete: "Remove",
    details: "Medication information",
    name: "Medicine name",
    generic: "Generic name",
    brand: "Brand name",
    strength: "Strength",
    form: "Dosage form",
    dose: "Dose",
    frequency: "Frequency",
    duration: "Duration",
    food: "Food instructions",
    instructions: "Additional instructions",
    start: "Start date",
    end: "End date",
    status: "Status",
    save: "Save medicine",
    update: "Update medicine",
    cancel: "Cancel",
    saving: "Saving...",
    required: "Medicine name is required.",
    dateError: "End date cannot be earlier than start date.",
    deleteConfirm: "Are you sure you want to remove this medicine?",
    deleteError: "Unable to delete this medicine.",
    saveError: "Unable to save medicine.",
    loadError: "Unable to load your medicines.",
    retry: "Try again",
    manual: "Manually added",
    prescription: "Prescription",
    before: "Before food",
    after: "After food",
    with: "With food",
    anytime: "As instructed",
    noDate: "Not specified",
    source: "Source",
    loading: "Preparing your medicine cabinet...",
    close: "Close",
    catalog: "Medicine information",
    catalogDesc: "Verified medicine uses, safety guidance and Bangladesh market prices will appear here when the trusted medicine catalog is connected.",
    namePlaceholder: "e.g. Paracetamol",
    genericPlaceholder: "e.g. Paracetamol",
    brandPlaceholder: "e.g. Napa",
    strengthPlaceholder: "e.g. 500 mg",
    formPlaceholder: "e.g. Tablet",
    dosePlaceholder: "e.g. 1 tablet",
    frequencyPlaceholder: "e.g. Twice daily",
    durationPlaceholder: "e.g. 5 days",
    foodPlaceholder: "Choose instructions",
    instructionsPlaceholder: "Other instructions from your prescription or clinician",
  },
  bn: {
    title: "মেডিসিন ক্যাবিনেট",
    subtitle: "আপনার ব্যক্তিগত ওষুধের রেকর্ড, যত্নের সঙ্গে সাজানো।",
    add: "ওষুধ যোগ করুন",
    back: "ড্যাশবোর্ড",
    total: "মোট ওষুধ",
    activeCount: "চলমান চিকিৎসা",
    completedCount: "সম্পন্ন",
    search: "ওষুধ, জেনেরিক বা ব্র্যান্ড দিয়ে খুঁজুন...",
    all: "সব ওষুধ",
    active: "চলমান",
    completed: "সম্পন্ন",
    discontinued: "বন্ধ",
    results: "আপনার ওষুধের রেকর্ড",
    resultDesc: "আপনার ব্যক্তিগত মেডিসিন ক্যাবিনেটের বিবরণ।",
    empty: "আপনার ক্যাবিনেট এখনো খালি",
    emptyDesc: "চিকিৎসার তথ্য গুছিয়ে রাখতে আপনার প্রথম ওষুধটি যোগ করুন।",
    noResults: "কোনো ওষুধ পাওয়া যায়নি",
    noResultsDesc: "অন্য শব্দ দিয়ে খুঁজুন অথবা ফিল্টার পরিবর্তন করুন।",
    addFirst: "প্রথম ওষুধ যোগ করুন",
    edit: "সম্পাদনা",
    delete: "সরিয়ে ফেলুন",
    details: "ওষুধের বিবরণ",
    name: "ওষুধের নাম",
    generic: "জেনেরিক নাম",
    brand: "ব্র্যান্ড নাম",
    strength: "শক্তি",
    form: "ওষুধের ধরন",
    dose: "ডোজ",
    frequency: "কতবার",
    duration: "সময়কাল",
    food: "খাবারের নির্দেশনা",
    instructions: "অতিরিক্ত নির্দেশনা",
    start: "শুরুর তারিখ",
    end: "শেষের তারিখ",
    status: "অবস্থা",
    save: "ওষুধ সংরক্ষণ করুন",
    update: "তথ্য আপডেট করুন",
    cancel: "বাতিল",
    saving: "সংরক্ষণ হচ্ছে...",
    required: "ওষুধের নাম আবশ্যক।",
    dateError: "শেষের তারিখ শুরুর তারিখের আগে হতে পারবে না।",
    deleteConfirm: "আপনি কি নিশ্চিত যে ওষুধটি সরাতে চান?",
    deleteError: "ওষুধটি সরানো যায়নি।",
    saveError: "ওষুধ সংরক্ষণ করা যায়নি।",
    loadError: "ওষুধের তথ্য লোড করা যায়নি।",
    retry: "আবার চেষ্টা করুন",
    manual: "নিজে যোগ করেছেন",
    prescription: "প্রেসক্রিপশন",
    before: "খাবারের আগে",
    after: "খাবারের পরে",
    with: "খাবারের সাথে",
    anytime: "নির্দেশনা অনুযায়ী",
    noDate: "উল্লেখ নেই",
    source: "তথ্যের উৎস",
    loading: "মেডিসিন ক্যাবিনেট প্রস্তুত হচ্ছে...",
    close: "বন্ধ করুন",
    catalog: "ওষুধের তথ্য",
    catalogDesc: "বিশ্বস্ত মেডিসিন ক্যাটালগ যুক্ত হলে এখানে যাচাইকৃত ব্যবহার, নিরাপত্তা নির্দেশনা ও বাংলাদেশের বাজারমূল্য দেখানো হবে।",
    namePlaceholder: "যেমন: Paracetamol",
    genericPlaceholder: "যেমন: Paracetamol",
    brandPlaceholder: "যেমন: Napa",
    strengthPlaceholder: "যেমন: 500 mg",
    formPlaceholder: "যেমন: Tablet",
    dosePlaceholder: "যেমন: ১টি ট্যাবলেট",
    frequencyPlaceholder: "যেমন: দিনে দুইবার",
    durationPlaceholder: "যেমন: ৫ দিন",
    foodPlaceholder: "নির্দেশনা নির্বাচন করুন",
    instructionsPlaceholder: "প্রেসক্রিপশন বা চিকিৎসকের অন্যান্য নির্দেশনা",
  },
};

function errorMessage(data: unknown, fallback: string) {
  if (
    data &&
    typeof data === "object" &&
    "detail" in data &&
    typeof data.detail === "string"
  ) return data.detail;

  return fallback;
}

function formatDate(value: string | null, language: "en" | "bn") {
  if (!value) return language === "bn" ? "উল্লেখ নেই" : "Not specified";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

function dateInput(value: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

function toIsoDate(value: string) {
  return value ? `${value}T00:00:00+06:00` : null;
}

export default function MedicineCabinetPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const t = translations[language];

  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | MedicationStatus>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Medication | null>(null);
  const [form, setForm] = useState<MedicationForm>(emptyForm);
  const [formError, setFormError] = useState("");

  const loadMedications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/medicines", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(errorMessage(data, t.loadError));
      }

      setMedications(
        Array.isArray(data.medications) ? data.medications : [],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : t.loadError);
    } finally {
      setLoading(false);
    }
  }, [t.loadError]);

  useEffect(() => {
    void loadMedications();
  }, [loadMedications]);

  const counts = useMemo(() => ({
    total: medications.length,
    active: medications.filter((m) => m.status === "active").length,
    completed: medications.filter((m) => m.status === "completed").length,
  }), [medications]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return medications.filter((item) => {
      const matchesStatus = filter === "all" || item.status === filter;
      const searchable = [
        item.medicine_name,
        item.generic_name,
        item.brand_name,
      ].filter(Boolean).join(" ").toLowerCase();

      return matchesStatus && (!term || searchable.includes(term));
    });
  }, [medications, search, filter]);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(item: Medication) {
    setEditing(item);
    setForm({
      medicine_name: item.medicine_name || "",
      generic_name: item.generic_name || "",
      brand_name: item.brand_name || "",
      strength: item.strength || "",
      dosage_form: item.dosage_form || "",
      dose: item.dose || "",
      frequency: item.frequency || "",
      duration: item.duration || "",
      food_instruction: item.food_instruction || "",
      additional_instructions: item.additional_instructions || "",
      start_date: dateInput(item.start_date),
      end_date: dateInput(item.end_date),
      status: item.status,
    });
    setFormError("");
    setModalOpen(true);
  }

  function updateField<K extends keyof MedicationForm>(
    key: K,
    value: MedicationForm[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function saveMedication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!form.medicine_name.trim()) {
      setFormError(t.required);
      return;
    }

    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      setFormError(t.dateError);
      return;
    }

    const payload = {
      ...form,
      medicine_name: form.medicine_name.trim(),
      generic_name: form.generic_name.trim() || null,
      brand_name: form.brand_name.trim() || null,
      strength: form.strength.trim() || null,
      dosage_form: form.dosage_form.trim() || null,
      dose: form.dose.trim() || null,
      frequency: form.frequency.trim() || null,
      duration: form.duration.trim() || null,
      food_instruction: form.food_instruction || null,
      additional_instructions: form.additional_instructions.trim() || null,
      start_date: toIsoDate(form.start_date),
      end_date: toIsoDate(form.end_date),
    };

    setSaving(true);

    try {
      const response = await fetch(
        editing ? `/api/medicines/${editing.id}` : "/api/medicines",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = response.status === 204 ? null : await response.json();

      if (!response.ok) {
        throw new Error(errorMessage(data, t.saveError));
      }

      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await loadMedications();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t.saveError);
    } finally {
      setSaving(false);
    }
  }

  async function deleteMedication(item: Medication) {
    if (!window.confirm(t.deleteConfirm)) return;

    try {
      const response = await fetch(`/api/medicines/${item.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(errorMessage(data, t.deleteError));
      }

      setMedications((previous) => previous.filter((m) => m.id !== item.id));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : t.deleteError);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/80 bg-white/85 px-4 py-3 text-sm text-slate-800 outline-none backdrop-blur-xl transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10";

  const labelClass = "mb-2 block text-xs font-semibold tracking-wide text-slate-600";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f8fb] text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0">
        <MediAtmosphere />
      </div>

      <div className="pointer-events-none fixed inset-0 z-0 opacity-50">
        <DashboardMedicalScene />
      </div>

      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#f4f9fc]/45 via-transparent to-[#edf6f8]/70" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-white/75 bg-white/55 p-4 shadow-[0_10px_40px_rgba(37,91,116,0.07)] backdrop-blur-2xl sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white bg-white/80 text-slate-600 transition duration-300 hover:-translate-x-1 hover:border-cyan-300 hover:text-cyan-700"
              aria-label={t.back}
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex items-center gap-3">
              <MediLogo />
              <div className="hidden h-9 w-px bg-slate-200 sm:block" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-cyan-700">
                  MEDI / PERSONAL HEALTH
                </p>
                <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {t.title}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="inline-flex items-center gap-2 rounded-xl border border-white bg-white/75 px-3 py-2.5 text-sm font-semibold text-slate-600 backdrop-blur-xl transition hover:border-cyan-300"
            >
              <Languages size={16} />
              {language === "en" ? "বাংলা" : "English"}
            </button>

            <button
              onClick={openAdd}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#087e87] to-[#176b91] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(8,126,135,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(8,126,135,0.25)]"
            >
              <Plus size={17} className="transition group-hover:rotate-90" />
              {t.add}
            </button>
          </div>
        </header>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
          <div className="animate-[fadeUp_.7s_ease-out_both]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white/65 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-800 backdrop-blur-xl">
              <Sparkles size={13} />
              Personal medication space
            </div>

            <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#173d55] sm:text-4xl lg:text-5xl">
              {t.title}
              <span className="block bg-gradient-to-r from-[#087e87] to-[#2587a8] bg-clip-text text-transparent">
                {language === "en" ? "Carefully organized." : "যত্নে সাজানো।"}
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              {t.subtitle}
            </p>
          </div>

          <div className="relative hidden min-h-[150px] items-center justify-center overflow-hidden rounded-[28px] border border-white/80 bg-white/40 p-6 shadow-[0_12px_35px_rgba(36,93,118,0.06)] backdrop-blur-xl lg:flex">
            <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-cyan-300/15 blur-3xl" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-cyan-50 to-teal-50 text-[#087e87] shadow-inner">
                <Pill size={34} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#21475c]">Your treatment records</p>
                <p className="mt-1 max-w-[180px] text-xs leading-5 text-slate-500">
                  Organized information, in one secure space.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: t.total, value: counts.total, icon: PackageOpen, accent: "cyan" },
            { label: t.activeCount, value: counts.active, icon: Pill, accent: "teal" },
            { label: t.completedCount, value: counts.completed, icon: CheckCircle2, accent: "blue" },
          ].map((stat, index) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-[fadeUp_.65s_ease-out_both] rounded-[22px] border border-white/80 bg-white/65 p-5 shadow-[0_8px_28px_rgba(28,75,98,0.045)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:bg-white/85 hover:shadow-[0_15px_35px_rgba(28,75,98,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf6f7] text-[#087e87]">
                    <Icon size={19} />
                  </span>
                </div>
                <p className="mt-4 text-3xl font-bold tracking-tight text-[#173d55]">
                  {stat.value}
                </p>
              </article>
            );
          })}
        </section>

        <section className="rounded-[25px] border border-white/80 bg-white/65 p-4 shadow-[0_10px_40px_rgba(28,75,98,0.055)] backdrop-blur-2xl sm:p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-[#173d55]">{t.results}</h2>
              <p className="mt-1 text-sm text-slate-500">{t.resultDesc}</p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t.search}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {([
              ["all", t.all],
              ["active", t.active],
              ["completed", t.completed],
              ["discontinued", t.discontinued],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition duration-200 ${
                  filter === value
                    ? "bg-[#087e87] text-white shadow-[0_5px_14px_rgba(8,126,135,0.15)]"
                    : "border border-white bg-white/70 text-slate-600 hover:border-cyan-200 hover:text-cyan-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-slate-500">
              <LoaderCircle className="mb-3 animate-spin text-cyan-700" size={28} />
              <p className="text-sm">{t.loading}</p>
            </div>
          ) : error ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <AlertCircle size={30} className="mb-3 text-rose-500" />
              <p className="mb-4 text-sm text-slate-600">{error}</p>
              <button
                onClick={() => void loadMedications()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#087e87] px-4 py-2.5 text-sm font-semibold text-white"
              >
                <RefreshCw size={15} />
                {t.retry}
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-cyan-50 to-teal-50 text-cyan-700 shadow-inner">
                <Pill size={28} />
              </div>
              <h3 className="text-base font-bold text-[#173d55]">
                {medications.length === 0 ? t.empty : t.noResults}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {medications.length === 0 ? t.emptyDesc : t.noResultsDesc}
              </p>
              {medications.length === 0 && (
                <button onClick={openAdd} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#087e87] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                  <Plus size={16} />
                  {t.addFirst}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {filtered.map((item, index) => (
                <article
                  key={item.id}
                  style={{ animationDelay: `${index * 65}ms` }}
                  className="animate-[fadeUp_.5s_ease-out_both] rounded-[21px] border border-white/90 bg-white/75 p-5 shadow-[0_5px_22px_rgba(25,72,95,0.04)] transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:bg-white hover:shadow-[0_13px_32px_rgba(25,72,95,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#e8f7f7] to-[#eaf2fb] text-[#087e87]">
                        <Pill size={22} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-[#173d55]">{item.medicine_name}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {[item.brand_name, item.strength, item.dosage_form].filter(Boolean).join(" · ") || "—"}
                        </p>
                      </div>
                    </div>

                    <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
                      item.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : item.status === "completed"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-amber-50 text-amber-700"
                    }`}>
                      {item.status === "active" ? t.active : item.status === "completed" ? t.completed : t.discontinued}
                    </span>
                  </div>

                  <div className="my-5 grid grid-cols-2 gap-x-4 gap-y-4">
                    {[
                      { label: t.dose, value: item.dose, icon: Clock3 },
                      { label: t.frequency, value: item.frequency, icon: RefreshCw },
                      { label: t.start, value: formatDate(item.start_date, language), icon: CalendarDays },
                      { label: t.food, value: item.food_instruction, icon: Utensils },
                    ].map((detail) => {
                      const Icon = detail.icon;
                      return (
                        <div key={detail.label} className="flex items-start gap-2">
                          <Icon size={15} className="mt-0.5 shrink-0 text-cyan-700" />
                          <div className="min-w-0">
                            <p className="text-[11px] text-slate-400">{detail.label}</p>
                            <p className="mt-0.5 break-words text-sm font-medium text-slate-700">{detail.value || "—"}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>



                  {item.catalog_information && (
                    <section className="mb-5 rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50/70 to-white p-4">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-[#173d55]">
                          {language === "en"
                            ? "Verified medicine information"
                            : "যাচাইকৃত ওষুধের তথ্য"}
                        </h4>

                        {item.catalog_information.status === "matched" ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                            {language === "en" ? "Verified catalog" : "যাচাইকৃত ক্যাটালগ"}
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                            {language === "en" ? "Not matched" : "মিল পাওয়া যায়নি"}
                          </span>
                        )}
                      </div>

                      {item.catalog_information.status === "matched" ? (
                        <>
                          {(item.catalog_information.common_uses?.length ?? 0) > 0 && (
                            <div className="mb-3">
                              <p className="mb-1 text-xs font-semibold text-slate-500">
                                {language === "en" ? "Common uses" : "সাধারণ ব্যবহার"}
                              </p>
                              <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                                {item.catalog_information.common_uses?.map((use, index) => (
                                  <li key={index}>{use}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {(item.catalog_information.safety_information?.length ?? 0) > 0 && (
                            <div className="mb-3 rounded-xl border border-amber-100 bg-amber-50/70 p-3">
                              <p className="mb-1 text-xs font-semibold text-amber-800">
                                {language === "en" ? "Safety information" : "নিরাপত্তা ও সতর্কতা"}
                              </p>
                              <ul className="list-inside list-disc space-y-1 text-sm text-amber-900">
                                {item.catalog_information.safety_information?.map((warning, index) => (
                                  <li key={index}>{warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="rounded-xl border border-white bg-white/80 p-3">
                            <p className="text-xs font-semibold text-slate-500">
                              {language === "en" ? "Verified catalog price" : "যাচাইকৃত ক্যাটালগ মূল্য"}
                            </p>

                            {item.catalog_information.price?.amount ? (
                              <>
                                <p className="mt-1 text-xl font-bold text-[#087e87]">
                                  {item.catalog_information.price.currency || "BDT"}{" "}
                                  {item.catalog_information.price.amount}
                                </p>

                                {item.catalog_information.price.pack_size && (
                                  <p className="mt-1 text-xs text-slate-500">
                                    {language === "en" ? "Pack size: " : "প্যাক সাইজ: "}
                                    {item.catalog_information.price.pack_size}
                                  </p>
                                )}

                                {item.catalog_information.price.source_name && (
                                  <p className="mt-1 text-xs text-slate-500">
                                    {language === "en" ? "Source: " : "উৎস: "}
                                    {item.catalog_information.price.source_name}
                                  </p>
                                )}

                                {item.catalog_information.price.source_url && (
                                  <a
                                    href={item.catalog_information.price.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-block text-xs font-semibold text-cyan-800 underline"
                                  >
                                    {language === "en" ? "View price source" : "মূল্যের উৎস দেখুন"}
                                  </a>
                                )}
                              </>
                            ) : (
                              <p className="mt-1 text-sm text-slate-500">
                                {language === "en"
                                  ? "Price unavailable — no verified price recorded."
                                  : "মূল্য পাওয়া যায়নি — যাচাইকৃত মূল্য সংরক্ষিত নেই।"}
                              </p>
                            )}

                            {item.catalog_information.price?.catalog_verified_at && (
                              <p className="mt-2 text-[11px] text-slate-400">
                                {language === "en" ? "Catalog verified: " : "ক্যাটালগ যাচাই: "}
                                {formatDate(item.catalog_information.price.catalog_verified_at, language)}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-xs leading-5 text-slate-500">
                          {item.catalog_information.message ||
                            (language === "en"
                              ? "Verified medicine information is not currently available."
                              : "বর্তমানে যাচাইকৃত ওষুধের তথ্য পাওয়া যায়নি।")}
                        </p>
                      )}
                    </section>
                  )}


                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <span className="text-[11px] text-slate-400">
                      {t.source}: {item.source === "manual" ? t.manual : t.prescription}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-800"
                      >
                        <Pencil size={13} />
                        {t.edit}
                      </button>
                      <button
                        onClick={() => void deleteMedication(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-100 bg-white/80 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 size={13} />
                        {t.delete}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-5 rounded-[22px] border border-cyan-100/80 bg-white/55 p-5 shadow-[0_5px_20px_rgba(25,72,95,0.035)] backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-cyan-800"><AlertCircle size={19} /></div>
            <div>
              <h3 className="text-sm font-bold text-[#173d55]">{t.catalog}</h3>
              <p className="mt-1 text-xs leading-6 text-slate-600">{t.catalogDesc}</p>
            </div>
          </div>
        </section>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#102f45]/40 p-3 backdrop-blur-md sm:p-6 animate-[fadeIn_.2s_ease-out_both]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setModalOpen(false);
          }}
        >
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-[25px] border border-white/80 bg-white/95 shadow-[0_25px_90px_rgba(10,45,65,0.25)] backdrop-blur-2xl animate-[modalIn_.3s_ease-out_both]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#173d55]">{editing ? t.edit : t.add}</h2>
                <p className="mt-1 text-xs text-slate-500">{t.details}</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:rotate-90 hover:bg-slate-100"
                aria-label={t.close}
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={saveMedication} className="max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
                {([
                  ["medicine_name", t.name, "namePlaceholder", true],
                  ["generic_name", t.generic, "genericPlaceholder"],
                  ["brand_name", t.brand, "brandPlaceholder"],
                  ["strength", t.strength, "strengthPlaceholder"],
                  ["dosage_form", t.form, "formPlaceholder"],
                  ["dose", t.dose, "dosePlaceholder"],
                  ["frequency", t.frequency, "frequencyPlaceholder"],
                  ["duration", t.duration, "durationPlaceholder"],
                ] as const).map(([key, label, placeholder, required]) => (
                  <div key={key} className={key === "medicine_name" ? "sm:col-span-2" : ""}>
                    <label className={labelClass}>{label}{required ? " *" : ""}</label>
                    <input
                      required={Boolean(required)}
                      maxLength={200}
                      value={form[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      placeholder={t[placeholder]}
                      className={inputClass}
                    />
                  </div>
                ))}

                <div>
                  <label className={labelClass}>{t.food}</label>
                  <select value={form.food_instruction} onChange={(e) => updateField("food_instruction", e.target.value)} className={inputClass}>
                    <option value="">{t.foodPlaceholder}</option>
                    <option value="before food">{t.before}</option>
                    <option value="after food">{t.after}</option>
                    <option value="with food">{t.with}</option>
                    <option value="as instructed">{t.anytime}</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>{t.status}</label>
                  <select value={form.status} onChange={(e) => updateField("status", e.target.value as MedicationStatus)} className={inputClass}>
                    <option value="active">{t.active}</option>
                    <option value="completed">{t.completed}</option>
                    <option value="discontinued">{t.discontinued}</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>{t.start}</label>
                  <input type="date" value={form.start_date} onChange={(e) => updateField("start_date", e.target.value)} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>{t.end}</label>
                  <input type="date" value={form.end_date} min={form.start_date || undefined} onChange={(e) => updateField("end_date", e.target.value)} className={inputClass} />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>{t.instructions}</label>
                  <textarea rows={3} maxLength={2000} value={form.additional_instructions} onChange={(e) => updateField("additional_instructions", e.target.value)} placeholder={t.instructionsPlaceholder} className={inputClass} />
                </div>

                {formError && (
                  <div className="sm:col-span-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {formError}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
                <button type="button" onClick={() => setModalOpen(false)} disabled={saving} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                  {t.cancel}
                </button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#087e87] to-[#176b91] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 disabled:opacity-60">
                  {saving && <LoaderCircle size={15} className="animate-spin" />}
                  {saving ? t.saving : editing ? t.update : t.save}
                  {!saving && <ArrowUpRight size={15} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
