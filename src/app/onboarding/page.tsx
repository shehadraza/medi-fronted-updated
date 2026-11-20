
"use client";
import MediAtmosphere from "@/components/3d/medi-atmosphere";
import MediLogo from "@/components/ui/medi-logo";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Language = "en" | "bn";

type Profile = {
  age_years: number | null;
  sleep_hours: number | null;
  sleep_quality: "poor" | "fair" | "good" | "excellent" | null;
  water_intake_liters: number | null;
  activity_level: "sedentary" | "light" | "moderate" | "active" | "very_active" | null;
  exercise_days_per_week: number | null;
  screen_time_hours: number | null;
  diet_type: "balanced" | "vegetarian" | "vegan" | "non_vegetarian" | "other" | null;
  junk_food_frequency: "never" | "rarely" | "sometimes" | "often" | "daily" | null;
  stress_level: "low" | "moderate" | "high" | "very_high" | null;
  health_conditions: string[];
  allergies: string[];
  current_medications: string[];
  health_goals: string[];
  additional_notes: string | null;
};

const emptyProfile: Profile = {
  age_years: null,
  sleep_hours: null,
  sleep_quality: null,
  water_intake_liters: null,
  activity_level: null,
  exercise_days_per_week: null,
  screen_time_hours: null,
  diet_type: null,
  junk_food_frequency: null,
  stress_level: null,
  health_conditions: [],
  allergies: [],
  current_medications: [],
  health_goals: [],
  additional_notes: "",
};

const copy = {
  en: {
    eyebrow: "YOUR HEALTH JOURNEY STARTS HERE",
    title: "Let's get to know you.",
    subtitle: "A little about your lifestyle helps MEDI understand your health needs and personalize your experience.",
    personal: "Personal information",
    lifestyle: "Sleep & lifestyle",
    nutrition: "Nutrition & hydration",
    activity: "Physical activity",
    wellbeing: "Mental wellbeing",
    medical: "Health information",
    goals: "Your health goals",
    age: "Your age",
    sleep: "Average sleep hours per day",
    sleepQuality: "How would you rate your sleep?",
    water: "Daily water intake (litres)",
    activityLevel: "Activity level",
    exercise: "Exercise days per week",
    screen: "Daily screen time (hours)",
    diet: "Your eating preference",
    junk: "How often do you eat junk food?",
    stress: "Your current stress level",
    conditions: "Existing health conditions (comma separated)",
    allergies: "Known allergies (comma separated)",
    medications: "Current medications (comma separated)",
    goalPrompt: "What would you like to improve?",
    notes: "Anything else MEDI should know? (optional)",
    consent: "I agree to let MEDI use my health profile to personalize AI-powered health insights and recommendations. I understand this is optional and can be changed later.",
    save: "Save & continue",
    saving: "Saving your profile...",
    skip: "Complete later",
    privacy: "Your health information is encrypted and protected.",
    success: "Your health profile has been saved.",
    error: "Something went wrong. Please try again.",
    yes: "Yes, I agree",
    no: "Not now",
    choices: {
      sleepQuality: ["Poor", "Fair", "Good", "Excellent"],
      activity: ["Sedentary", "Light", "Moderate", "Active", "Very active"],
      diet: ["Balanced", "Vegetarian", "Vegan", "Non-vegetarian", "Other"],
      junk: ["Never", "Rarely", "Sometimes", "Often", "Daily"],
      stress: ["Low", "Moderate", "High", "Very high"],
    },
    goalOptions: ["Improve sleep", "Eat healthier", "Drink more water", "Exercise regularly", "Reduce stress", "Improve fitness", "Manage weight", "Build healthy habits"],
  },
  bn: {
    eyebrow: "আপনার সুস্থতার যাত্রা শুরু হোক",
    title: "আপনার সম্পর্কে জানতে চাই।",
    subtitle: "আপনার জীবনযাত্রা সম্পর্কে কিছু তথ্য MEDI-কে আপনার স্বাস্থ্য বুঝতে ও অভিজ্ঞতা ব্যক্তিগত করতে সাহায্য করবে।",
    personal: "ব্যক্তিগত তথ্য",
    lifestyle: "ঘুম ও জীবনযাপন",
    nutrition: "খাদ্য ও পানি",
    activity: "শারীরিক কার্যক্রম",
    wellbeing: "মানসিক সুস্থতা",
    medical: "স্বাস্থ্য সম্পর্কিত তথ্য",
    goals: "আপনার স্বাস্থ্য লক্ষ্য",
    age: "আপনার বয়স",
    sleep: "প্রতিদিন গড়ে কত ঘণ্টা ঘুমান?",
    sleepQuality: "আপনার ঘুমের মান কেমন?",
    water: "প্রতিদিন কত লিটার পানি পান করেন?",
    activityLevel: "আপনার দৈনন্দিন কার্যক্রম",
    exercise: "সপ্তাহে কয় দিন ব্যায়াম করেন?",
    screen: "প্রতিদিন কত ঘণ্টা স্ক্রিন ব্যবহার করেন?",
    diet: "আপনার খাদ্যাভ্যাস",
    junk: "কত ঘন ঘন জাঙ্ক ফুড খান?",
    stress: "আপনার বর্তমান মানসিক চাপ",
    conditions: "বিদ্যমান স্বাস্থ্য সমস্যা (কমা দিয়ে আলাদা করুন)",
    allergies: "অ্যালার্জি (কমা দিয়ে আলাদা করুন)",
    medications: "বর্তমানে ব্যবহৃত ওষুধ (কমা দিয়ে আলাদা করুন)",
    goalPrompt: "কোন বিষয়গুলো উন্নত করতে চান?",
    notes: "MEDI-কে আর কিছু জানাতে চান? (ঐচ্ছিক)",
    consent: "আমার স্বাস্থ্য প্রোফাইল ব্যবহার করে AI-ভিত্তিক স্বাস্থ্য পরামর্শ ও তথ্য ব্যক্তিগত করার জন্য আমি সম্মতি দিচ্ছি। এটি ঐচ্ছিক এবং পরে পরিবর্তন করা যাবে।",
    save: "সংরক্ষণ করুন ও এগিয়ে যান",
    saving: "সংরক্ষণ হচ্ছে...",
    skip: "পরে সম্পন্ন করব",
    privacy: "আপনার স্বাস্থ্য তথ্য এনক্রিপ্ট করে সুরক্ষিত রাখা হয়।",
    success: "আপনার স্বাস্থ্য প্রোফাইল সংরক্ষিত হয়েছে।",
    error: "সমস্যা হয়েছে। আবার চেষ্টা করুন।",
    yes: "হ্যাঁ, সম্মতি দিচ্ছি",
    no: "এখন নয়",
    choices: {
      sleepQuality: ["খারাপ", "মোটামুটি", "ভালো", "চমৎকার"],
      activity: ["কম সক্রিয়", "হালকা", "মাঝারি", "সক্রিয়", "খুব সক্রিয়"],
      diet: ["সুষম", "নিরামিষ", "ভেগান", "আমিষ", "অন্যান্য"],
      junk: ["কখনোই না", "কদাচিৎ", "মাঝেমধ্যে", "প্রায়ই", "প্রতিদিন"],
      stress: ["কম", "মাঝারি", "বেশি", "অনেক বেশি"],
    },
    goalOptions: ["ঘুমের উন্নতি", "স্বাস্থ্যকর খাবার", "বেশি পানি পান", "নিয়মিত ব্যায়াম", "মানসিক চাপ কমানো", "ফিটনেস বৃদ্ধি", "ওজন নিয়ন্ত্রণ", "স্বাস্থ্যকর অভ্যাস"],
  },
};

const sections = [
  { id: "personal", icon: "01" },
  { id: "lifestyle", icon: "02" },
  { id: "nutrition", icon: "03" },
  { id: "activity", icon: "04" },
  { id: "wellbeing", icon: "05" },
  { id: "medical", icon: "06" },
  { id: "goals", icon: "07" },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en");
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const t = copy[language];

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await fetch("/api/onboarding/profile", {
          cache: "no-store",
        });

        if (response.status === 401) {
          router.replace("/auth/sign-in");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load your health profile.");
        }

        const data = await response.json();

        if (!active) return;

        if (data.profile) {
          setProfile({
            ...emptyProfile,
            ...data.profile,
          });
        }

        setConsent(Boolean(data.ai_personalization_consent));
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : t.error);
        }
      } finally {
        if (active) setInitialLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [router, t.error]);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function parseList(value: string) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  async function saveProfile() {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const profileResponse = await fetch("/api/onboarding/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!profileResponse.ok) {
        const data = await profileResponse.json().catch(() => ({}));
        throw new Error(data.detail || t.error);
      }

      const consentResponse = await fetch("/api/onboarding/consent", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: consent }),
      });

      if (!consentResponse.ok) {
        const data = await consentResponse.json().catch(() => ({}));
        throw new Error(data.detail || t.error);
      }

      const completeResponse = await fetch("/api/onboarding/complete", {
        method: "POST",
      });

      if (!completeResponse.ok) {
        const data = await completeResponse.json().catch(() => ({}));
        throw new Error(data.detail || t.error);
      }

      setMessage(t.success);
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10";
  const labelClass = "text-sm font-semibold text-slate-700";

  function selectField(
    label: string,
    value: string | null,
    options: string[],
    onChange: (value: string) => void,
  ) {
    return (
      <label className="block">
        <span className={labelClass}>{label}</span>
        <select
          className={inputClass}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">-- Select --</option>
          {options.map((option) => (
            <option key={option} value={option}>{option.replaceAll("_", " ")}</option>
          ))}
        </select>
      </label>
    );
  }

  function numberField(
    label: string,
    value: number | null,
    onChange: (value: number | null) => void,
    min: number,
    max: number,
    step = 1,
  ) {
    return (
      <label className="block">
        <span className={labelClass}>{label}</span>
        <input
          className={inputClass}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value ?? ""}
          onChange={(event) => {
            const raw = event.target.value;
            onChange(raw === "" ? null : Number(raw));
          }}
        />
      </label>
    );
  }

  function textField(
    label: string,
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
  ) {
    return (
      <label className="block">
        <span className={labelClass}>{label}</span>
        <input
          className={inputClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      </label>
    );
  }

  function sectionHeading(id: string, title: string, description: string) {
    return (
      <div id={id} className="mb-6 scroll-mt-28">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f9fb]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-100 border-t-cyan-600" />
          <p className="mt-4 text-sm text-slate-500">Preparing your MEDI experience...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="onboarding-shell relative min-h-screen overflow-hidden bg-[#f5f9fb] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
  <MediAtmosphere />
      <div className="relative z-10 mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <MediLogo />
            <p className="mt-1 text-xs font-medium tracking-widest text-slate-400">PERSONAL HEALTH COMPANION</p>
          </div>

          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold shadow-sm transition hover:border-cyan-400"
          >
            {language === "en" ? "বাংলা" : "English"}
          </button>
        </header>

        <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_70px_-35px_rgba(15,70,90,0.25)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#e8f8fb] via-[#f1f9fc] to-[#e4f4fa] px-6 py-10 text-slate-800 sm:px-10 sm:py-14">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -right-4 -top-8 h-44 w-44 rounded-full border border-white/10" />

            <p className="text-xs font-bold tracking-[0.2em] text-[#087e91]">{t.eyebrow}</p>
            <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">{t.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{t.subtitle}</p>
            <div className="mt-7 flex items-center gap-3 text-xs text-[#087e91]">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Secure profile · Personalized insights · Your control
            </div>
          </div>

          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[190px_1fr] lg:p-10">
            <aside className="h-fit lg:sticky lg:top-8">
              <p className="mb-4 text-xs font-bold tracking-widest text-slate-400">YOUR PROFILE</p>
              <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-500 transition hover:bg-cyan-50 hover:text-cyan-800"
                  >
                    <span className="text-cyan-600">{section.icon}</span>
                    {t[section.id]}
                  </a>
                ))}
              </nav>
            </aside>

            <div className="onboarding-form min-w-0 space-y-7">
              {error && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </div>
              )}

              <section>
                {sectionHeading("personal", t.personal, "A few basics to help us understand your profile.")}
                {numberField(t.age, profile.age_years, (v) => update("age_years", v), 13, 120)}
              </section>

              <section>
                {sectionHeading("lifestyle", t.lifestyle, "Understand your everyday sleep routine.")}
                <div className="grid gap-5 sm:grid-cols-2">
                  {numberField(t.sleep, profile.sleep_hours, (v) => update("sleep_hours", v), 0, 24, 0.5)}
                  {selectField(t.sleepQuality, profile.sleep_quality, ["poor", "fair", "good", "excellent"], (v) => update("sleep_quality", v as Profile["sleep_quality"]))}
                </div>
                <div className="mt-5">
                  {numberField(t.screen, profile.screen_time_hours, (v) => update("screen_time_hours", v), 0, 24, 0.5)}
                </div>
              </section>

              <section>
                {sectionHeading("nutrition", t.nutrition, "Your food and hydration habits matter.")}
                <div className="grid gap-5 sm:grid-cols-2">
                  {numberField(t.water, profile.water_intake_liters, (v) => update("water_intake_liters", v), 0, 20, 0.25)}
                  {selectField(t.diet, profile.diet_type, ["balanced", "vegetarian", "vegan", "non_vegetarian", "other"], (v) => update("diet_type", v as Profile["diet_type"]))}
                  {selectField(t.junk, profile.junk_food_frequency, ["never", "rarely", "sometimes", "often", "daily"], (v) => update("junk_food_frequency", v as Profile["junk_food_frequency"]))}
                </div>
              </section>

              <section>
                {sectionHeading("activity", t.activity, "Tell us how active your daily routine is.")}
                <div className="grid gap-5 sm:grid-cols-2">
                  {selectField(t.activityLevel, profile.activity_level, ["sedentary", "light", "moderate", "active", "very_active"], (v) => update("activity_level", v as Profile["activity_level"]))}
                  {numberField(t.exercise, profile.exercise_days_per_week, (v) => update("exercise_days_per_week", v), 0, 7)}
                </div>
              </section>

              <section>
                {sectionHeading("wellbeing", t.wellbeing, "Your mental wellbeing is an important part of your health.")}
                {selectField(t.stress, profile.stress_level, ["low", "moderate", "high", "very_high"], (v) => update("stress_level", v as Profile["stress_level"]))}
              </section>

              <section>
                {sectionHeading("medical", t.medical, "Share only what you feel comfortable sharing.")}
                <div className="space-y-5">
                  {textField(t.conditions, profile.health_conditions.join(", "), (v) => update("health_conditions", parseList(v)), "e.g. Asthma, Diabetes")}
                  {textField(t.allergies, profile.allergies.join(", "), (v) => update("allergies", parseList(v)), "e.g. Peanuts, Dust")}
                  {textField(t.medications, profile.current_medications.join(", "), (v) => update("current_medications", parseList(v)), "e.g. Medication names")}
                  <label className="block">
                    <span className={labelClass}>{t.notes}</span>
                    <textarea
                      className={`${inputClass} min-h-28 resize-y`}
                      maxLength={3000}
                      value={profile.additional_notes ?? ""}
                      onChange={(event) => update("additional_notes", event.target.value)}
                      placeholder="Share any additional health context..."
                    />
                  </label>
                </div>
              </section>

              <section>
                {sectionHeading("goals", t.goals, t.goalPrompt)}
                <div className="grid gap-3 sm:grid-cols-2">
                  {t.goalOptions.map((goal, index) => {
                    const selected = profile.health_goals.includes(goal);
                    return (
                      <label key={goal} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${selected ? "border-cyan-500 bg-cyan-50 text-cyan-900" : "border-slate-200 hover:border-cyan-300"}`}>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(event) => {
                            const value = t.goalOptions[index];
                            update(
                              "health_goals",
                              event.target.checked
                                ? [...profile.health_goals, value]
                                : profile.health_goals.filter((item) => item !== value),
                            );
                          }}
                          className="h-4 w-4 accent-cyan-700"
                        />
                        {goal}
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl border border-cyan-100 bg-[#f2fafb] p-5">
                <p className="font-bold text-slate-900">AI personalization</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t.consent}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setConsent(true)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${consent ? "bg-cyan-800 text-white" : "border border-slate-200 bg-white text-slate-600"}`}
                  >
                    {t.yes}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsent(false)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${!consent ? "bg-slate-700 text-white" : "border border-slate-200 bg-white text-slate-600"}`}
                  >
                    {t.no}
                  </button>
                </div>
              </section>

              <footer className="border-t border-slate-100 pt-6">
                <p className="mb-5 text-center text-xs text-slate-500">{t.privacy}</p>
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => router.replace("/dashboard")}
                    className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
                  >
                    {t.skip}
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={saveProfile}
                    className="rounded-xl bg-gradient-to-r from-[#087e91] to-[#12a6a7] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-900/15 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? t.saving : t.save}
                  </button>
                </div>
                <p className="mt-4 text-center text-xs text-slate-400">
                  MEDI provides health information and wellness support, not a medical diagnosis.
                </p>
              </footer>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
