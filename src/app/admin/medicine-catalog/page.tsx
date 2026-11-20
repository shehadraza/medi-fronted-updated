
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MediLogo from "@/components/ui/medi-logo";
import MediAtmosphere from "@/components/3d/medi-atmosphere";
import {
  ArrowLeft, Search, Plus, RefreshCw, Pill, CheckCircle2,
  Clock3, Globe, Archive, Edit3, X, ShieldCheck,
  ExternalLink, Database, AlertCircle, Upload
} from "lucide-react";

type Medicine = {
  id: string;
  generic_name: string;
  brand_name?: string | null;
  manufacturer?: string | null;
  strength?: string | null;
  dosage_form?: string | null;
  route?: string | null;
  common_uses?: string[] | null;
  safety_information?: string[] | null;
  price_amount?: number | string | null;
  currency?: string;
  pack_size?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  source_reference?: string | null;
  is_verified: boolean;
  is_published: boolean;
  last_verified_at?: string | null;
  created_at?: string;
};

const emptyForm = {
  generic_name: "",
  brand_name: "",
  manufacturer: "",
  strength: "",
  dosage_form: "",
  route: "",
  common_uses: "",
  safety_information: "",
  price_amount: "",
  currency: "BDT",
  pack_size: "",
  source_name: "",
  source_url: "",
  source_reference: "",
};

export default function AdminMedicineCatalogPage() {
  const [items, setItems] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [modal, setModal] = useState<"create" | "edit" | "verify" | null>(null);
  const [selected, setSelected] = useState<Medicine | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const bn = language === "bn";

  const t = {
    title: bn ? "মেডিসিন ক্যাটালগ" : "Medicine Catalog",
    subtitle: bn ? "ওষুধের তথ্য, মূল্য ও যাচাইকরণ পরিচালনা করুন" : "Manage medicine information, pricing and verification",
    total: bn ? "মোট ওষুধ" : "Total medicines",
    verified: bn ? "যাচাইকৃত" : "Verified",
    published: bn ? "প্রকাশিত" : "Published",
    pending: bn ? "যাচাই বাকি" : "Pending review",
    search: bn ? "ওষুধ খুঁজুন..." : "Search medicines...",
    add: bn ? "ওষুধ যোগ করুন" : "Add medicine",
    all: bn ? "সব" : "All",
    review: bn ? "যাচাই বাকি" : "Pending",
    verifiedTab: bn ? "যাচাইকৃত" : "Verified",
    publishedTab: bn ? "প্রকাশিত" : "Published",
    medicine: bn ? "ওষুধ" : "Medicine",
    price: bn ? "মূল্য" : "Price",
    source: bn ? "তথ্যের উৎস" : "Source",
    status: bn ? "অবস্থা" : "Status",
    actions: bn ? "অ্যাকশন" : "Actions",
    edit: bn ? "সম্পাদনা" : "Edit",
    verify: bn ? "যাচাই করুন" : "Verify",
    publish: bn ? "প্রকাশ করুন" : "Publish",
    archive: bn ? "আর্কাইভ" : "Archive",
    save: bn ? "সংরক্ষণ করুন" : "Save medicine",
    cancel: bn ? "বাতিল" : "Cancel",
    empty: bn ? "কোনো ওষুধ পাওয়া যায়নি" : "No medicines found",
    loading: bn ? "লোড হচ্ছে..." : "Loading catalog...",
    verifiedLabel: bn ? "যাচাইকৃত" : "Verified",
    publishedLabel: bn ? "প্রকাশিত" : "Published",
    pendingLabel: bn ? "যাচাই বাকি" : "Pending review",
  };

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/medicine-catalog?limit=100&search=${encodeURIComponent(search)}`,
        { credentials: "include", cache: "no-store" }
      );

      if (response.status === 401) {
        window.location.href = "/auth/sign-in";
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Unable to load medicine catalog.");
      }

      const data = await response.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => void loadCatalog(), 300);
    return () => clearTimeout(timer);
  }, [loadCatalog]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filter === "pending") return !item.is_verified;
      if (filter === "verified") return item.is_verified;
      if (filter === "published") return item.is_published;
      return true;
    });
  }, [items, filter]);

  const stats = useMemo(() => ({
    total: items.length,
    verified: items.filter((i) => i.is_verified).length,
    published: items.filter((i) => i.is_published).length,
    pending: items.filter((i) => !i.is_verified).length,
  }), [items]);

  function openCreate() {
    setSelected(null);
    setForm(emptyForm);
    setError("");
    setModal("create");
  }

  function openEdit(item: Medicine) {
    setSelected(item);
    setForm({
      generic_name: item.generic_name || "",
      brand_name: item.brand_name || "",
      manufacturer: item.manufacturer || "",
      strength: item.strength || "",
      dosage_form: item.dosage_form || "",
      route: item.route || "",
      common_uses: item.common_uses?.join("\n") || "",
      safety_information: item.safety_information?.join("\n") || "",
      price_amount: item.price_amount?.toString() || "",
      currency: item.currency || "BDT",
      pack_size: item.pack_size || "",
      source_name: item.source_name || "",
      source_url: item.source_url || "",
      source_reference: item.source_reference || "",
    });
    setError("");
    setModal("edit");
  }

  function openVerify(item: Medicine) {
    setSelected(item);
    setForm({
      ...emptyForm,
      source_name: item.source_name || "",
      source_url: item.source_url || "",
      source_reference: item.source_reference || "",
    });
    setError("");
    setModal("verify");
  }

  function closeModal() {
    setModal(null);
    setSelected(null);
    setError("");
  }

  async function request(
    url: string,
    method: string,
    body?: unknown
  ) {
    const response = await fetch(url, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.detail || "Request failed.");
    }

    return data;
  }

  async function saveMedicine(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      generic_name: form.generic_name.trim(),
      brand_name: form.brand_name.trim() || null,
      manufacturer: form.manufacturer.trim() || null,
      strength: form.strength.trim() || null,
      dosage_form: form.dosage_form.trim() || null,
      route: form.route.trim() || null,
      common_uses: form.common_uses.split("\n").map(x => x.trim()).filter(Boolean),
      safety_information: form.safety_information.split("\n").map(x => x.trim()).filter(Boolean),
      price_amount: form.price_amount === "" ? null : Number(form.price_amount),
      currency: form.currency,
      pack_size: form.pack_size.trim() || null,
      source_name: form.source_name.trim() || null,
      source_url: form.source_url.trim() || null,
      source_reference: form.source_reference.trim() || null,
    };

    try {
      if (modal === "create") {
        await request("/api/admin/medicine-catalog", "POST", payload);
        setNotice("Medicine created as an unpublished draft.");
      } else if (modal === "edit" && selected) {
        await request(
          `/api/admin/medicine-catalog/${selected.id}`,
          "PATCH",
          payload
        );
        setNotice("Medicine updated. It requires verification again.");
      }

      closeModal();
      await loadCatalog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save medicine.");
    } finally {
      setSaving(false);
    }
  }

  async function verifyMedicine(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;

    setSaving(true);
    setError("");

    try {
      await request(
        `/api/admin/medicine-catalog/${selected.id}/verify`,
        "POST",
        {
          source_name: form.source_name.trim(),
          source_url: form.source_url.trim() || null,
          source_reference: form.source_reference.trim() || null,
          last_verified_at: new Date().toISOString(),
        }
      );

      setNotice("Medicine verified. It is not published yet.");
      closeModal();
      await loadCatalog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setSaving(false);
    }
  }

  async function publishMedicine(item: Medicine) {
    if (!window.confirm(`Publish ${item.generic_name}?`)) return;

    setError("");
    try {
      await request(
        `/api/admin/medicine-catalog/${item.id}/publish`,
        "POST"
      );
      setNotice("Medicine published successfully.");
      await loadCatalog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publication failed.");
    }
  }

  async function archiveMedicine(item: Medicine) {
    if (!window.confirm(`Archive ${item.generic_name}?`)) return;

    setError("");
    try {
      await request(
        `/api/admin/medicine-catalog/${item.id}/archive`,
        "POST"
      );
      setNotice("Medicine archived.");
      await loadCatalog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Archive failed.");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100";

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
              onClick={() => void loadCatalog()}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <RefreshCw size={15} /> <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        <section className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
            <Database size={14} /> MEDI ADMINISTRATION
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#173d50] sm:text-4xl">
                {t.title}
              </h1>
              <p className="mt-2 text-sm text-slate-500">{t.subtitle}</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-xl bg-[#176b91] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#125775]"
            >
              <Plus size={17} /> {t.add}
            </button>
          </div>
        </section>

        {error && !modal && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        {notice && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <span className="flex items-center gap-2"><CheckCircle2 size={17} />{notice}</span>
            <button onClick={() => setNotice("")}><X size={16} /></button>
          </div>
        )}

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: t.total, value: stats.total, icon: Pill, color: "text-cyan-700", bg: "bg-cyan-50" },
            { label: t.verified, value: stats.verified, icon: ShieldCheck, color: "text-emerald-700", bg: "bg-emerald-50" },
            { label: t.published, value: stats.published, icon: Globe, color: "text-blue-700", bg: "bg-blue-50" },
            { label: t.pending, value: stats.pending, icon: Clock3, color: "text-amber-700", bg: "bg-amber-50" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                    <Icon size={19} />
                  </span>
                </div>
                <div className="mt-3 text-3xl font-bold tabular-nums text-[#173d50]">{stat.value}</div>
              </div>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#173d50]">
                {bn ? "ওষুধের ডাটাবেস" : "Medicine database"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {bn ? "তথ্য যাচাই করে তারপর প্রকাশ করুন" : "Review medicine data before publishing"}
              </p>
            </div>
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.search}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-slate-100 px-5 py-3">
            {[
              ["all", t.all],
              ["pending", t.review],
              ["verified", t.verifiedTab],
              ["published", t.publishedTab],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                  filter === key
                    ? "bg-[#e5f5f7] text-[#176b91]"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="p-14 text-center text-sm text-slate-500">{t.loading}</div>
          ) : filtered.length === 0 ? (
            <div className="p-14 text-center">
              <Pill className="mx-auto mb-3 text-slate-300" size={32} />
              <p className="text-sm font-medium text-slate-500">{t.empty}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50/90 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4">{t.medicine}</th>
                    <th className="px-5 py-4">{t.price}</th>
                    <th className="px-5 py-4">{t.source}</th>
                    <th className="px-5 py-4">{t.status}</th>
                    <th className="px-5 py-4 text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="transition hover:bg-cyan-50/30">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#173d50]">{item.generic_name}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          {[item.brand_name, item.strength, item.dosage_form].filter(Boolean).join(" · ") || "—"}
                        </div>
                        {item.manufacturer && <div className="mt-1 text-[11px] text-slate-400">{item.manufacturer}</div>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-700">
                          {item.price_amount != null ? `${item.currency || "BDT"} ${item.price_amount}` : "Not listed"}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">{item.pack_size || "—"}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="max-w-[170px] truncate text-xs font-medium text-slate-600">
                          {item.source_name || "No source"}
                        </div>
                        {item.source_url && (
                          <a href={item.source_url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-[11px] text-cyan-700 hover:underline">
                            View source <ExternalLink size={11} />
                          </a>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-start gap-1.5">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            item.is_published ? "bg-emerald-50 text-emerald-700" :
                            item.is_verified ? "bg-blue-50 text-blue-700" :
                            "bg-amber-50 text-amber-700"
                          }`}>
                            {item.is_published ? t.publishedLabel : item.is_verified ? t.verifiedLabel : t.pendingLabel}
                          </span>
                          {item.last_verified_at && (
                            <span className="text-[10px] text-slate-400">
                              {new Date(item.last_verified_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1.5">
                          <button title={t.edit} onClick={() => openEdit(item)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-cyan-700">
                            <Edit3 size={15} />
                          </button>
                          {!item.is_verified && (
                            <button title={t.verify} onClick={() => openVerify(item)} className="rounded-lg p-2 text-emerald-700 hover:bg-emerald-50">
                              <ShieldCheck size={16} />
                            </button>
                          )}
                          {item.is_verified && !item.is_published && (
                            <button title={t.publish} onClick={() => void publishMedicine(item)} className="rounded-lg p-2 text-blue-700 hover:bg-blue-50">
                              <Upload size={16} />
                            </button>
                          )}
                          {item.is_published && (
                            <button title={t.archive} onClick={() => void archiveMedicine(item)} className="rounded-lg p-2 text-amber-700 hover:bg-amber-50">
                              <Archive size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
            {filtered.length} {bn ? "টি রেকর্ড দেখানো হচ্ছে" : "records shown"}
          </div>
        </section>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>MEDI · Medicine Data Administration</span>
          <span>Bangladesh market · BDT</span>
        </footer>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-3 backdrop-blur-sm">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="font-bold text-[#173d50]">
                  {modal === "create" ? "Add medicine" : modal === "edit" ? "Edit medicine" : "Verify medicine source"}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {modal === "verify" ? "Confirm the source used to verify this record." : "Enter accurate, source-backed medicine information."}
                </p>
              </div>
              <button onClick={closeModal} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={19} /></button>
            </div>

            <form onSubmit={modal === "verify" ? verifyMedicine : saveMedicine} className="max-h-[75vh] space-y-4 overflow-y-auto p-5">
              {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

              {modal !== "verify" ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Generic name *</label>
                    <input required className={inputClass} value={form.generic_name} onChange={e => setForm({...form, generic_name: e.target.value})} placeholder="e.g. Paracetamol" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">Brand name</label><input className={inputClass} value={form.brand_name} onChange={e => setForm({...form, brand_name: e.target.value})} /></div>
                    <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">Manufacturer</label><input className={inputClass} value={form.manufacturer} onChange={e => setForm({...form, manufacturer: e.target.value})} /></div>
                    <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">Strength</label><input className={inputClass} value={form.strength} onChange={e => setForm({...form, strength: e.target.value})} placeholder="500 mg" /></div>
                    <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">Dosage form</label><input className={inputClass} value={form.dosage_form} onChange={e => setForm({...form, dosage_form: e.target.value})} placeholder="Tablet" /></div>
                    <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">Route</label><input className={inputClass} value={form.route} onChange={e => setForm({...form, route: e.target.value})} placeholder="Oral" /></div>
                    <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">Pack size</label><input className={inputClass} value={form.pack_size} onChange={e => setForm({...form, pack_size: e.target.value})} placeholder="10 tablets / strip" /></div>
                  </div>

                  <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">Common uses (one per line)</label><textarea rows={3} className={inputClass} value={form.common_uses} onChange={e => setForm({...form, common_uses: e.target.value})} /></div>
                  <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">Safety information (one per line)</label><textarea rows={3} className={inputClass} value={form.safety_information} onChange={e => setForm({...form, safety_information: e.target.value})} /></div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">Price</label><input type="number" min="0" step="0.01" className={inputClass} value={form.price_amount} onChange={e => setForm({...form, price_amount: e.target.value})} placeholder="Leave empty if unknown" /></div>
                    <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">Currency</label><input maxLength={3} className={inputClass} value={form.currency} onChange={e => setForm({...form, currency: e.target.value.toUpperCase()})} /></div>
                  </div>

                  <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#176b91]"><Globe size={16} /> Price / information source</div>
                    <div className="space-y-3">
                      <input className={inputClass} placeholder="Source name" value={form.source_name} onChange={e => setForm({...form, source_name: e.target.value})} />
                      <input className={inputClass} placeholder="Source URL" value={form.source_url} onChange={e => setForm({...form, source_url: e.target.value})} />
                      <input className={inputClass} placeholder="Source reference (optional)" value={form.source_reference} onChange={e => setForm({...form, source_reference: e.target.value})} />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">A price cannot be saved without a source name and source URL or reference.</p>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Medicine to verify</p>
                    <p className="mt-1 font-bold text-[#173d50]">{selected?.generic_name}</p>
                    <p className="mt-1 text-xs text-slate-500">{selected?.brand_name} {selected?.strength}</p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Verification source name *</label>
                    <input required minLength={2} className={inputClass} value={form.source_name} onChange={e => setForm({...form, source_name: e.target.value})} placeholder="e.g. Verified medicine reference" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Source URL</label>
                    <input type="url" className={inputClass} value={form.source_url} onChange={e => setForm({...form, source_url: e.target.value})} placeholder="https://..." />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Source reference</label>
                    <textarea rows={2} className={inputClass} value={form.source_reference} onChange={e => setForm({...form, source_reference: e.target.value})} placeholder="Document ID, reference or evidence details" />
                  </div>
                  <p className="text-xs text-slate-500">Verification records the current date and time. Publishing remains a separate action.</p>
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">{t.cancel}</button>
                <button disabled={saving} type="submit" className="rounded-xl bg-[#176b91] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#125775] disabled:opacity-50">
                  {saving ? "Saving..." : modal === "verify" ? "Confirm verification" : t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
