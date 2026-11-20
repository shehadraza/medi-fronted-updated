
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  BrainCircuit,
  Check,
  ChevronDown,
  HeartPulse,
  MapPin,
  Menu,
  Pill,
  ScanLine,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";

import MedicalOrb from "@/components/3d/medical-orb";
import MediAtmosphere from "@/components/3d/medi-atmosphere";
import MediLogo from "@/components/ui/medi-logo";

import {
  mediTranslations,
  type MediLanguage,
} from "@/lib/medi-translations";

const featureIcons = [
  BrainCircuit,
  ScanLine,
  Pill,
  HeartPulse,
  Stethoscope,
  MapPin,
];

const trustIcons = [
  ShieldCheck,
  BrainCircuit,
  BellRing,
  HeartPulse,
];

const stepNumbers = ["01", "02", "03"];

const metricValues = [
  { value: "78%", width: "78%" },
  { value: "65%", width: "65%" },
  { value: "84%", width: "84%" },
  { value: "58%", width: "58%" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<MediLanguage>("en");
  const [languageLoaded, setLanguageLoaded] = useState(false);

  const t = mediTranslations[language];

  useEffect(() => {
    const savedLanguage = localStorage.getItem("medi-language");

    if (savedLanguage === "en" || savedLanguage === "bn") {
      setLanguage(savedLanguage);
    }

    setLanguageLoaded(true);
  }, []);

  useEffect(() => {
    if (!languageLoaded) return;

    localStorage.setItem("medi-language", language);
  }, [language, languageLoaded]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="site-shell">
      <MediAtmosphere />

      {/* NAVBAR */}

      <header className="navbar">
        <div className="container nav-inner">
          <MediLogo />

          <nav className="nav-links">
            <Link href="/">{t.nav.home}</Link>
            <Link href="#about">{t.nav.about}</Link>
          </nav>

          <div className="nav-actions">
            <button
              className="language-toggle"
              onClick={() =>
                setLanguage(language === "en" ? "bn" : "en")
              }
              aria-label="Change language"
            >
              {language === "en" ? "বাংলা" : "English"}
            </button>

            <Link href="/auth/sign-in" className="nav-login">
              {t.nav.login}
            </Link>

            <Link href="/auth/sign-up" className="btn-primary">
              {t.nav.signup}
            </Link>

            <button
              className="mobile-toggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="mobile-menu">
            <Link href="/" onClick={closeMenu}>
              {t.nav.home}
            </Link>

            <Link href="#about" onClick={closeMenu}>
              {t.nav.about}
            </Link>

            <Link href="/auth/sign-in" onClick={closeMenu}>
              {t.nav.login}
            </Link>

            <Link href="/auth/sign-up" onClick={closeMenu}>
              {t.nav.signup}
            </Link>

            <button
              className="language-toggle"
              onClick={() => {
                setLanguage(language === "en" ? "bn" : "en");
                closeMenu();
              }}
            >
              {language === "en" ? "বাংলা" : "English"}
            </button>
          </nav>
        )}
      </header>

      {/* HERO */}

      <section className="container hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            {t.hero.eyebrow}
          </div>

          <h1>
            {t.hero.title1}
            <br />
            {t.hero.title2}
            <br />
            <em>{t.hero.title3}</em>
          </h1>

          <p className="hero-description">
            {t.hero.description}
          </p>

          <div className="hero-actions">
            <Link href="/auth/sign-up" className="btn-primary">
              {t.hero.start}
              <ArrowRight size={17} />
            </Link>

            <Link href="#features" className="btn-outline">
              {t.hero.discover}
            </Link>
          </div>

          <div className="hero-note">
            <ShieldCheck size={17} />
            {t.hero.note}
          </div>
        </div>

        <MedicalOrb />

        <a
          href="#features"
          className="hero-scroll"
          aria-label={t.hero.scroll}
        >
          <span className="hero-scroll-label">
            {t.hero.scroll}
          </span>

          <span className="hero-scroll-icon">
            <ChevronDown size={19} strokeWidth={1.8} />
          </span>
        </a>
      </section>

      {/* TRUST */}

      <section className="trust-strip">
        <div className="container trust-grid">
          {trustIcons.map((Icon, index) => (
            <div className="trust-item" key={index}>
              <Icon size={24} className="trust-icon" />

              <div>
                <strong>{t.trust[index][0]}</strong>
                <small>{t.trust[index][1]}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}

      <section className="section" id="features">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">
              {t.features.eyebrow}
            </div>

            <h2>
              {t.features.title}
              <br />
              <em>{t.features.titleAccent}</em>
            </h2>

            <p>{t.features.description}</p>
          </div>

          <div className="feature-grid">
            {featureIcons.map((Icon, index) => (
              <article className="feature-card" key={index}>
                <div className="feature-icon">
                  <Icon size={24} strokeWidth={1.7} />
                </div>

                <h3>{t.features.items[index][0]}</h3>

                <p>{t.features.items[index][1]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PERSONALIZATION */}

      <section
        className="section personal-section"
        id="personalization"
      >
        <div className="container personal-grid">
          <div className="personal-copy">
            <div className="eyebrow">
              {t.personal.eyebrow}
            </div>

            <h2>
              {t.personal.title}
              <br />
              {t.personal.title2}
              <br />
              <em>{t.personal.accent}</em>
            </h2>

            <p>{t.personal.description}</p>

            <div className="personal-list">
              {t.personal.benefits.map((benefit, index) => (
                <div key={index}>
                  <Check size={18} />
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <div className="personal-panel">
            <div className="panel-header">
              <strong>
                <Activity
                  size={17}
                  className="inline mr-2 text-[#176b91]"
                />
                {t.personal.overview}
              </strong>

              <span className="panel-status">
                {t.personal.preview}
              </span>
            </div>

            {metricValues.map((metric, index) => (
              <div className="metric" key={index}>
                <div className="metric-row">
                  <span>{t.personal.metrics[index]}</span>
                  <span>{metric.value}</span>
                </div>

                <div className="metric-track">
                  <div
                    className="metric-fill"
                    style={{ width: metric.width }}
                  />
                </div>
              </div>
            ))}

            <p className="mt-5 text-xs leading-6 text-[#8195a2]">
              {t.personal.disclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">
              {t.steps.eyebrow}
            </div>

            <h2>
              {t.steps.title}
              <br />
              <em>{t.steps.accent}</em>
            </h2>

            <p>{t.steps.description}</p>
          </div>

          <div className="steps-grid">
            {stepNumbers.map((number, index) => (
              <article className="step-card" key={number}>
                <div className="step-number">
                  {language === "en" ? "STEP" : "ধাপ"} {number}
                </div>

                <h3>{t.steps.items[index][0]}</h3>

                <p>{t.steps.items[index][1]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="cta-section" id="get-started">
        <div className="container">
          <div className="cta-panel">
            <HeartPulse size={38} strokeWidth={1.5} />

            <h2>
              {t.cta.title}
              <br />
              {t.cta.title2}
            </h2>

            <p>{t.cta.description}</p>

            <Link href="/auth/sign-up" className="btn-primary">
              {t.cta.button}
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="footer" id="about">
        <div className="container footer-inner">
          <MediLogo />

          <span>{t.footer.copyright}</span>

          <div className="footer-links">
            <Link href="#features">
              {t.footer.features}
            </Link>

            <Link href="#personalization">
              {t.footer.approach}
            </Link>

            <Link href="#get-started">
              {t.footer.start}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
