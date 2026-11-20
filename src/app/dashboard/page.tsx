
"use client";

import MediAtmosphere from "@/components/3d/medi-atmosphere";
import DashboardMedicalScene from "@/components/3d/dashboard-medical-scene";
import MediLogo from "@/components/ui/medi-logo";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Droplets,
  FileText,
  Footprints,
  HeartPulse,
  Hospital,
  LayoutDashboard,
  Menu,
  Moon,
  Pill,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Sunset,
  Target,
  UserRound,
  X,
  AlertCircle,
  ChartNoAxesCombined,
  BriefcaseMedical,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import NotificationCenter from "@/components/dashboard/notification-center";
import AICompanion from "@/components/ai/ai-companion";

type Language = "en" | "bn";

type HealthProfile = {
  age_years?: number | null;
  sleep_hours?: number | null;
  sleep_quality?: string | null;
  water_intake_liters?: number | null;
  activity_level?: string | null;
  exercise_days_per_week?: number | null;
  screen_time_hours?: number | null;
  diet_type?: string | null;
  junk_food_frequency?: string | null;
  stress_level?: string | null;
  health_conditions?: string[];
  allergies?: string[];
  current_medications?: string[];
  health_goals?: string[];
};

type UserData = {
  full_name?: string;
  name?: string;
  email?: string;
};

type ModuleItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  href?: string;
};

const translations = {
  en: {
    dashboard: "Dashboard",
    overview: "Your health, thoughtfully organized.",
    workspace: "PERSONAL HEALTH SPACE",
    overviewLabel: "YOUR OVERVIEW",
    dailyOverview: "Daily health overview",
    sleep: "Sleep duration",
    hydration: "Water intake",
    activity: "Activity level",
    screen: "Screen time",
    hours: "hours / day",
    liters: "litres / day",
    goals: "Your health goals",
    goalsDesc: "Small steps can create lasting change.",
    noGoals: "Your health goals will appear here after you add them.",
    profile: "Health profile",
    profileDesc: "Your saved health and lifestyle information.",
    companion: "MEDI AI Companion",
    companionDesc:
      "Your personalized health companion is being prepared. It will use your authorized health context to provide relevant support.",
    comingSoon: "In development",
    privacy: "Your health information is private and protected.",
    loading: "Loading your health information...",
    retry: "Try again",
    unavailable: "Not provided yet",
    quickActions: "Your healthcare tools",
    quickDesc: "Everything you need, organized in one place.",
    prescriptions: "Prescription Scanner",
    prescriptionsDesc: "Scan and organize your prescriptions.",
    cabinet: "Medicine Cabinet",
    cabinetDesc: "Keep your medicines and courses organized.",
    reminders: "Medicine Reminders",
    remindersDesc: "Stay on track with your medication schedule.",
    hospitals: "Find Hospital",
    hospitalsDesc: "Explore healthcare facilities by location.",
    doctors: "Find Doctor",
    doctorsDesc: "Explore doctors by specialty and location.",
    analytics: "Health Analytics",
    analyticsDesc: "Understand your health and lifestyle trends.",
    emergency: "Emergency Assistance",
    emergencyDesc: "Find emergency support and nearby care.",
    medicalRecords: "Medical Records",
    medicalRecordsDesc: "Your health information in one place.",
    journey: "YOUR HEALTH JOURNEY",
    intelligence: "PERSONALIZED HEALTH SUPPORT",
    viewProfile: "View health profile",
    seeAll: "View all",
    sleepQuality: "Sleep quality",
    diet: "Diet",
    stress: "Stress level",
    exercise: "Exercise days / week",
    unavailableTitle: "Not available yet",
    unavailableDesc:
      "This module is part of MEDI and is being prepared. Its real functionality will be connected here.",
    close: "Close",
    menu: "Menu",
    navigation: "Workspace",
    home: "Overview",
    health: "Health profile",
    signOut: "Sign out",
    welcome: "Welcome",
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    night: "Good night",
    yourGoals: "Your personal goals",
    profileComplete: "Your health profile",
    error: "We couldn't load your health information.",
    retryHint: "Please check your connection and try again.",
    explore: "EXPLORE YOUR HEALTH",
    trusted: "PRIVATE & SECURE",
    services: "MEDI SERVICES",
    profileLabel: "YOUR PROFILE",
    member: "MEDI MEMBER",
  },
  bn: {
    dashboard: "à¦¡à§à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§à¦¡",
    overview: "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯à§‡à¦° à¦¸à¦¬à¦•à¦¿à¦›à§, à¦¸à§à¦¨à§à¦¦à¦°à¦­à¦¾à¦¬à§‡ à¦à¦• à¦œà¦¾à§Ÿà¦—à¦¾à§Ÿà¥¤",
    workspace: "à¦†à¦ªà¦¨à¦¾à¦° à¦¬à§à¦¯à¦•à§à¦¤à¦¿à¦—à¦¤ à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦œà¦—à§Ž",
    overviewLabel: "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à¦¾à¦°à¦¸à¦‚à¦•à§à¦·à§‡à¦ª",
    dailyOverview: "à¦¦à§ˆà¦¨à¦¿à¦• à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦¸à¦¾à¦°à¦¸à¦‚à¦•à§à¦·à§‡à¦ª",
    sleep: "à¦˜à§à¦®à§‡à¦° à¦¸à¦®à§Ÿ",
    hydration: "à¦ªà¦¾à¦¨à¦¿ à¦ªà¦¾à¦¨",
    activity: "à¦¶à¦¾à¦°à§€à¦°à¦¿à¦• à¦•à¦¾à¦°à§à¦¯à¦•à§à¦°à¦®",
    screen: "à¦¸à§à¦•à§à¦°à¦¿à¦¨ à¦Ÿà¦¾à¦‡à¦®",
    hours: "à¦˜à¦£à§à¦Ÿà¦¾ / à¦¦à¦¿à¦¨",
    liters: "à¦²à¦¿à¦Ÿà¦¾à¦° / à¦¦à¦¿à¦¨",
    goals: "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦²à¦•à§à¦·à§à¦¯",
    goalsDesc: "à¦›à§‹à¦Ÿ à¦…à¦­à§à¦¯à¦¾à¦¸à¦‡ à¦¬à§œ à¦ªà¦°à¦¿à¦¬à¦°à§à¦¤à¦¨ à¦†à¦¨à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¥¤",
    noGoals: "à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦²à¦•à§à¦·à§à¦¯ à¦¯à§‹à¦— à¦•à¦°à¦²à§‡ à¦à¦–à¦¾à¦¨à§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤",
    profile: "à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦²",
    profileDesc: "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à¦‚à¦°à¦•à§à¦·à¦¿à¦¤ à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦“ à¦œà§€à¦¬à¦¨à¦¯à¦¾à¦ªà¦¨à§‡à¦° à¦¤à¦¥à§à¦¯à¥¤",
    companion: "MEDI AI Companion",
    companionDesc:
      "à¦†à¦ªà¦¨à¦¾à¦° à¦¬à§à¦¯à¦•à§à¦¤à¦¿à¦—à¦¤ à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦¸à¦¹à¦•à¦¾à¦°à§€ à¦¤à§ˆà¦°à¦¿à¦° à¦•à¦¾à¦œ à¦šà¦²à¦›à§‡à¥¤ à¦†à¦ªà¦¨à¦¾à¦° à¦…à¦¨à§à¦®à§‹à¦¦à¦¿à¦¤ à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦¤à¦¥à§à¦¯à§‡à¦° à¦­à¦¿à¦¤à§à¦¤à¦¿à¦¤à§‡ à¦à¦Ÿà¦¿ à¦¸à¦¹à¦¾à§Ÿà¦¤à¦¾ à¦•à¦°à¦¬à§‡à¥¤",
    comingSoon: "à¦¤à§ˆà¦°à¦¿à¦° à¦•à¦¾à¦œ à¦šà¦²à¦›à§‡",
    privacy: "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦¤à¦¥à§à¦¯ à¦¬à§à¦¯à¦•à§à¦¤à¦¿à¦—à¦¤ à¦“ à¦¸à§à¦°à¦•à§à¦·à¦¿à¦¤à¥¤",
    loading: "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦¤à¦¥à§à¦¯ à¦²à§‹à¦¡ à¦¹à¦šà§à¦›à§‡...",
    retry: "à¦†à¦¬à¦¾à¦° à¦šà§‡à¦·à§à¦Ÿà¦¾ à¦•à¦°à§à¦¨",
    unavailable: "à¦à¦–à¦¨à§‹ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà¦¨à¦¿",
    quickActions: "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯à¦¸à§‡à¦¬à¦¾",
    quickDesc: "à¦ªà§à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯à¦¸à§‡à¦¬à¦¾ à¦à¦• à¦œà¦¾à§Ÿà¦—à¦¾à§Ÿà¥¤",
    prescriptions: "à¦ªà§à¦°à§‡à¦¸à¦•à§à¦°à¦¿à¦ªà¦¶à¦¨ à¦¸à§à¦•à§à¦¯à¦¾à¦¨à¦¾à¦°",
    prescriptionsDesc: "à¦ªà§à¦°à§‡à¦¸à¦•à§à¦°à¦¿à¦ªà¦¶à¦¨ à¦¸à§à¦•à§à¦¯à¦¾à¦¨ à¦“ à¦¸à¦‚à¦°à¦•à§à¦·à¦£ à¦•à¦°à§à¦¨à¥¤",
    cabinet: "à¦®à§‡à¦¡à¦¿à¦¸à¦¿à¦¨ à¦•à§à¦¯à¦¾à¦¬à¦¿à¦¨à§‡à¦Ÿ",
    cabinetDesc: "à¦“à¦·à§à¦§ à¦“ à¦•à§‹à¦°à§à¦¸à§‡à¦° à¦¤à¦¥à§à¦¯ à¦—à§à¦›à¦¿à§Ÿà§‡ à¦°à¦¾à¦–à§à¦¨à¥¤",
    reminders: "à¦“à¦·à§à¦§à§‡à¦° à¦°à¦¿à¦®à¦¾à¦‡à¦¨à§à¦¡à¦¾à¦°",
    remindersDesc: "à¦“à¦·à§à¦§ à¦–à¦¾à¦“à§Ÿà¦¾à¦° à¦¸à¦®à§Ÿ à¦®à¦¨à§‡ à¦°à¦¾à¦–à§à¦¨à¥¤",
    hospitals: "à¦¹à¦¾à¦¸à¦ªà¦¾à¦¤à¦¾à¦² à¦–à§à¦à¦œà§à¦¨",
    hospitalsDesc: "à¦à¦²à¦¾à¦•à¦¾ à¦…à¦¨à§à¦¯à¦¾à§Ÿà§€ à¦¹à¦¾à¦¸à¦ªà¦¾à¦¤à¦¾à¦² à¦–à§à¦à¦œà§à¦¨à¥¤",
    doctors: "à¦¡à¦¾à¦•à§à¦¤à¦¾à¦° à¦–à§à¦à¦œà§à¦¨",
    doctorsDesc: "à¦¬à¦¿à¦¶à§‡à¦·à¦œà§à¦ž à¦“ à¦à¦²à¦¾à¦•à¦¾ à¦…à¦¨à§à¦¯à¦¾à§Ÿà§€ à¦¡à¦¾à¦•à§à¦¤à¦¾à¦° à¦–à§à¦à¦œà§à¦¨à¥¤",
    analytics: "à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦¬à¦¿à¦¶à§à¦²à§‡à¦·à¦£",
    analyticsDesc: "à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦“ à¦œà§€à¦¬à¦¨à¦¯à¦¾à¦ªà¦¨à§‡à¦° à¦ªà¦°à¦¿à¦¬à¦°à§à¦¤à¦¨ à¦¬à§à¦à§à¦¨à¥¤",
    emergency: "à¦œà¦°à§à¦°à¦¿ à¦¸à¦¹à¦¾à§Ÿà¦¤à¦¾",
    emergencyDesc: "à¦œà¦°à§à¦°à¦¿ à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯à¦¸à§‡à¦¬à¦¾ à¦–à§à¦à¦œà§‡ à¦¨à¦¿à¦¨à¥¤",
    medicalRecords: "à¦®à§‡à¦¡à¦¿à¦•à§‡à¦² à¦°à§‡à¦•à¦°à§à¦¡",
    medicalRecordsDesc: "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦¤à¦¥à§à¦¯ à¦à¦• à¦œà¦¾à§Ÿà¦—à¦¾à§Ÿà¥¤",
    journey: "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯à¦¯à¦¾à¦¤à§à¦°à¦¾",
    intelligence: "à¦¬à§à¦¯à¦•à§à¦¤à¦¿à¦—à¦¤ à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦¸à¦¹à¦¾à§Ÿà¦¤à¦¾",
    viewProfile: "à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦² à¦¦à§‡à¦–à§à¦¨",
    seeAll: "à¦¸à¦¬ à¦¦à§‡à¦–à§à¦¨",
    sleepQuality: "à¦˜à§à¦®à§‡à¦° à¦®à¦¾à¦¨",
    diet: "à¦–à¦¾à¦¦à§à¦¯à¦¾à¦­à§à¦¯à¦¾à¦¸",
    stress: "à¦®à¦¾à¦¨à¦¸à¦¿à¦• à¦šà¦¾à¦ª",
    exercise: "à¦¬à§à¦¯à¦¾à§Ÿà¦¾à¦®à§‡à¦° à¦¦à¦¿à¦¨ / à¦¸à¦ªà§à¦¤à¦¾à¦¹",
    unavailableTitle: "à¦à¦–à¦¨à§‹ à¦šà¦¾à¦²à§ à¦¹à§Ÿà¦¨à¦¿",
    unavailableDesc:
      "à¦à¦‡ à¦®à¦¡à¦¿à¦‰à¦²à¦Ÿà¦¿ MEDI-à¦à¦° à¦…à¦‚à¦¶ à¦à¦¬à¦‚ à¦¤à§ˆà¦°à¦¿à¦° à¦•à¦¾à¦œ à¦šà¦²à¦›à§‡à¥¤ à¦¬à¦¾à¦¸à§à¦¤à¦¬ functionality à¦ªà§à¦°à¦¸à§à¦¤à§à¦¤ à¦¹à¦²à§‡ à¦à¦–à¦¾à¦¨à§‡ à¦¯à§à¦•à§à¦¤ à¦¹à¦¬à§‡à¥¤",
    close: "à¦¬à¦¨à§à¦§ à¦•à¦°à§à¦¨",
    menu: "à¦®à§‡à¦¨à§",
    navigation: "à¦“à§Ÿà¦¾à¦°à§à¦•à¦¸à§à¦ªà§‡à¦¸",
    home: "à¦¸à¦¾à¦°à¦¸à¦‚à¦•à§à¦·à§‡à¦ª",
    health: "à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦²",
    signOut: "à¦¸à¦¾à¦‡à¦¨ à¦†à¦‰à¦Ÿ",
    welcome: "à¦¸à§à¦¬à¦¾à¦—à¦¤à¦®",
    morning: "à¦¶à§à¦­ à¦¸à¦•à¦¾à¦²",
    afternoon: "à¦¶à§à¦­ à¦¦à§à¦ªà§à¦°",
    evening: "à¦¶à§à¦­ à¦¸à¦¨à§à¦§à§à¦¯à¦¾",
    night: "à¦¶à§à¦­ à¦°à¦¾à¦¤à§à¦°à¦¿",
    yourGoals: "à¦†à¦ªà¦¨à¦¾à¦° à¦¬à§à¦¯à¦•à§à¦¤à¦¿à¦—à¦¤ à¦²à¦•à§à¦·à§à¦¯",
    profileComplete: "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦²",
    error: "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦¤à¦¥à§à¦¯ à¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦¯à¦¾à§Ÿà¦¨à¦¿à¥¤",
    retryHint: "à¦‡à¦¨à§à¦Ÿà¦¾à¦°à¦¨à§‡à¦Ÿ à¦¸à¦‚à¦¯à§‹à¦— à¦ªà¦°à§€à¦•à§à¦·à¦¾ à¦•à¦°à§‡ à¦†à¦¬à¦¾à¦° à¦šà§‡à¦·à§à¦Ÿà¦¾ à¦•à¦°à§à¦¨à¥¤",
    explore: "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦¸à¦®à§à¦ªà¦°à§à¦•à§‡ à¦œà¦¾à¦¨à§à¦¨",
    trusted: "à¦¬à§à¦¯à¦•à§à¦¤à¦¿à¦—à¦¤ à¦“ à¦¸à§à¦°à¦•à§à¦·à¦¿à¦¤",
    services: "MEDI à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯à¦¸à§‡à¦¬à¦¾",
    profileLabel: "à¦†à¦ªà¦¨à¦¾à¦° à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦²",
    member: "MEDI à¦¸à¦¦à¦¸à§à¦¯",
  },
};

function getGreeting(hour: number, language: Language) {
  if (hour >= 5 && hour < 12) {
    return language === "bn" ? translations.bn.morning : translations.en.morning;
  }
  if (hour >= 12 && hour < 17) {
    return language === "bn" ? translations.bn.afternoon : translations.en.afternoon;
  }
  if (hour >= 17 && hour < 20) {
    return language === "bn" ? translations.bn.evening : translations.en.evening;
  }
  return language === "bn" ? translations.bn.night : translations.en.night;
}

function formatValue(value: number | null | undefined) {
  return value === null || value === undefined ? "â€”" : String(value);
}

function formatLabel(value: string | null | undefined, language: Language) {
  if (!value) {
    return language === "bn" ? "à¦à¦–à¦¨à§‹ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà¦¨à¦¿" : "Not provided";
  }

  const labels: Record<string, string> = {
    sedentary: "Sedentary",
    light: "Light",
    moderate: "Moderate",
    active: "Active",
    very_active: "Very active",
    poor: "Poor",
    fair: "Fair",
    good: "Good",
    excellent: "Excellent",
    balanced: "Balanced",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    non_vegetarian: "Non-vegetarian",
    low: "Low",
    high: "High",
    very_high: "Very high",
    rarely: "Rarely",
    sometimes: "Sometimes",
    often: "Often",
    daily: "Daily",
    never: "Never",
  };

  return labels[value] ?? value.replaceAll("_", " ");
}

export default function DashboardPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentHour, setCurrentHour] = useState<number | null>(null);
  const [currentYear, setCurrentYear] = useState(2026);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeDescription, setNoticeDescription] = useState("");

  const t = translations[language];

  useEffect(() => {
    const savedLanguage = localStorage.getItem("medi-language");

    if (savedLanguage === "en" || savedLanguage === "bn") {
      setLanguage(savedLanguage);
    }

    const now = new Date();

    setCurrentHour(
      Number(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          hour12: false,
          timeZone: "Asia/Dhaka",
        }).format(now)
      )
    );

    setCurrentYear(
      Number(
        new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          timeZone: "Asia/Dhaka",
        }).format(now)
      )
    );

    setLanguageLoaded(true);
  }, []);

  useEffect(() => {
    if (languageLoaded) {
      localStorage.setItem("medi-language", language);
    }
  }, [language, languageLoaded]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const [userResponse, profileResponse] = await Promise.all([
        fetch("/api/auth/me", { cache: "no-store" }),
        fetch("/api/onboarding/profile", { cache: "no-store" }),
      ]);

      if (!userResponse.ok || !profileResponse.ok) {
        throw new Error("Unable to load dashboard data");
      }

      const userData = await userResponse.json();
      const profileData = await profileResponse.json();

      setUser(userData.user ?? userData.data?.user ?? userData);
      setProfile(profileData.profile ?? null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const fullName =
    user?.full_name?.trim() ||
    user?.name?.trim() ||
    (language === "bn" ? "à¦†à¦ªà¦¨à¦¾à¦•à§‡" : "there");

  const firstName = fullName.split(/\s+/)[0];
  const greeting =
    currentHour === null ? t.welcome : getGreeting(currentHour, language);

  const showModuleNotice = (item: ModuleItem) => {
    setNoticeTitle(item.title);
    setNoticeDescription(t.unavailableDesc);
    setNoticeOpen(true);
  };

  const modules: ModuleItem[] = [
    { title: t.prescriptions, description: t.prescriptionsDesc, icon: ScanLine, category: "PRESCRIPTION" },
    {
  title: t.cabinet,
  description: t.cabinetDesc,
  icon: Pill,
  category: "MEDICATION",
  href: "/medicines",
},
    { title: t.reminders, description: t.remindersDesc, icon: Bell, category: "REMINDERS" },
    { title: t.hospitals, description: t.hospitalsDesc, icon: Hospital, category: "CARE NETWORK" },
    { title: t.doctors, description: t.doctorsDesc, icon: BriefcaseMedical, category: "CARE NETWORK" },
    { title: t.analytics, description: t.analyticsDesc, icon: ChartNoAxesCombined, category: "INSIGHTS" },
    { title: t.emergency, description: t.emergencyDesc, icon: HeartPulse, category: "EMERGENCY" },
    { title: t.medicalRecords, description: t.medicalRecordsDesc, icon: FileText, category: "RECORDS" },
  ];

  const stats = [
    { title: t.sleep, value: formatValue(profile?.sleep_hours), unit: t.hours, icon: Moon },
    { title: t.hydration, value: formatValue(profile?.water_intake_liters), unit: t.liters, icon: Droplets },
    { title: t.activity, value: formatLabel(profile?.activity_level, language), unit: "", icon: Footprints },
    { title: t.screen, value: formatValue(profile?.screen_time_hours), unit: t.hours, icon: Smartphone },
  ];

  const profileDetails = [
    [t.sleepQuality, formatLabel(profile?.sleep_quality, language)],
    [t.diet, formatLabel(profile?.diet_type, language)],
    [t.stress, formatLabel(profile?.stress_level, language)],
    [
      t.exercise,
      profile?.exercise_days_per_week === null || profile?.exercise_days_per_week === undefined
        ? t.unavailable
        : String(profile.exercise_days_per_week),
    ],
  ];

  const navigation = [
    { href: "#overview", label: t.home, icon: LayoutDashboard },
    { href: "#health-overview", label: t.dailyOverview, icon: Activity },
    { href: "#health-tools", label: t.quickActions, icon: BriefcaseMedical },
    { href: "#ai-companion", label: t.companion, icon: BrainCircuit },
  ];

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#f5f9fb] text-[#18364a]">
      {/* Existing MEDI animated atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <MediAtmosphere />
      </div>

      {/* Soft page lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -right-48 -top-48 h-[520px] w-[520px] rounded-full bg-cyan-100/35 blur-[110px]" />
        <div className="absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-blue-100/35 blur-[110px]" />
      </div>

      <div className="relative z-10">
        {/* Glass Navigation */}
        <header className="sticky top-0 z-40 border-b border-white/60 bg-white/65 shadow-[0_8px_35px_rgba(30,75,95,0.045)] backdrop-blur-2xl">
          <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-7 xl:px-12">
           <div className="shrink-0">
  <MediLogo />
</div>

            <nav className="hidden items-center gap-1 lg:flex">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-semibold text-[#68808e] transition duration-300 hover:bg-[#eaf6f8]/90 hover:text-[#176b91]"
                  >
                    <Icon size={15} className="transition group-hover:scale-110" />
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                onClick={() => setLanguage((current) => current === "en" ? "bn" : "en")}
                className="rounded-full border border-[#dce9ed] bg-white/75 px-3.5 py-2 text-[11px] font-bold text-[#176b91] shadow-sm transition hover:border-[#8bd3d9] hover:bg-white sm:px-4"
              >
                {language === "en" ? "à¦¬à¦¾à¦‚à¦²à¦¾" : "English"}
              </button>

                            <NotificationCenter language={language} />

              <div className="hidden h-8 w-px bg-[#dfe9ed] sm:block" />

              <div className="hidden items-center gap-2.5 sm:flex">
                <div className="text-right">
                  <p className="max-w-[125px] truncate text-[11px] font-bold text-[#294b5d]">
                    {fullName}
                  </p>
                  <p className="text-[9px] tracking-wide text-[#91a4ae]">
                    {t.member}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white bg-gradient-to-br from-[#42c2c8] to-[#176b91] text-sm font-bold text-white shadow-[0_4px_14px_rgba(23,107,145,0.2)]">
                  {firstName.charAt(0).toUpperCase()}
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen((value) => !value)}
                aria-label={t.menu}
                aria-expanded={mobileMenuOpen}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dce9ed] bg-white/80 text-[#37677b] transition hover:bg-white lg:hidden"
              >
                {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </div>
          </div>

          {/* Mobile glass menu */}
          {mobileMenuOpen && (
            <div className="border-t border-white/70 bg-white/90 px-4 py-4 shadow-xl backdrop-blur-2xl lg:hidden">
              <nav className="mx-auto grid max-w-[700px] grid-cols-2 gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl border border-[#e8f0f3] bg-white/80 px-3 py-3 text-[12px] font-semibold text-[#547181] transition hover:border-[#b8e1e5] hover:bg-[#eff9fa]"
                    >
                      <Icon size={16} className="text-[#2696a5]" />
                      {item.label}
                    </a>
                  );
                })}
              </nav>
              <div className="mx-auto mt-3 flex max-w-[700px] items-center gap-2 px-2 text-[10px] text-[#8299a5]">
                <UserRound size={14} />
                {fullName}
              </div>
            </div>
          )}
        </header>

        {/* Main content */}
        <div className="mx-auto max-w-[1500px] px-4 pb-10 pt-7 sm:px-7 sm:pt-10 xl:px-12">
          {/* 3D Hero */}
          <section
            id="overview"
            className="relative isolate scroll-mt-28 overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(120deg,rgba(249,253,254,0.96),rgba(235,248,250,0.9),rgba(228,243,248,0.88))] shadow-[0_18px_60px_rgba(18,63,89,0.075)] backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-20 -top-28 h-[420px] w-[420px] rounded-full bg-[#bce8e9]/35 blur-[90px]" />
              <div className="absolute -bottom-36 left-[28%] h-[340px] w-[340px] rounded-full bg-[#d5eafa]/55 blur-[90px]" />
              <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.38)_48%,rgba(231,247,248,0.12)_100%)]" />
            </div>

            <div className="relative grid items-center gap-0 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="relative z-10 order-2 px-6 pb-9 pt-2 sm:px-10 lg:order-1 lg:py-12 xl:px-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#cfe7e9] bg-white/85 px-3.5 py-2 text-[10px] font-bold tracking-[0.14em] text-[#328d9b] shadow-sm">
                  {currentHour !== null && currentHour >= 5 && currentHour < 17 ? (
                    <Sun size={14} />
                  ) : currentHour !== null && currentHour < 20 ? (
                    <Sunset size={14} />
                  ) : (
                    <Moon size={14} />
                  )}
                  {t.workspace}
                </div>

                <h1 className="mt-6 max-w-xl text-[32px] font-semibold leading-[1.16] tracking-[-0.045em] text-[#183f52] sm:text-[43px] xl:text-[49px]">
                  {greeting}, {firstName}
                </h1>

                <p className="mt-4 max-w-[460px] text-sm leading-7 text-[#66808c] sm:text-[15px]">
                  {t.overview}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center gap-2 rounded-full bg-[#176b91] px-5 py-3 text-xs font-bold text-white shadow-[0_7px_20px_rgba(23,107,145,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#125675]"
                  >
                    {t.viewProfile}
                    <ArrowUpRight size={15} />
                  </Link>

                  <span className="inline-flex items-center gap-2 text-[11px] font-medium text-[#63818d]">
                    <ShieldCheck size={15} className="text-[#239eaa]" />
                    {t.privacy}
                  </span>
                </div>

                <div className="mt-9 flex items-center gap-3 border-t border-[#dcebed] pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#218da1] shadow-sm">
                    <HeartPulse size={19} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.12em] text-[#328d9b]">
                      MEDI
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#8ba0aa]">
                      {t.yourGoals} Â· {currentYear}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative order-1 min-w-0 lg:order-2">
                <DashboardMedicalScene />
              </div>
            </div>
          </section>

          {/* Health overview */}
          <section id="health-overview" className="mt-12 scroll-mt-28">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#239eaa]">
                  {t.overviewLabel}
                </p>
                <h2 className="mt-2 text-[22px] font-semibold tracking-tight text-[#18364a] sm:text-[25px]">
                  {t.dailyOverview}
                </h2>
              </div>

              <button
                onClick={() => void loadDashboard()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full border border-white bg-white/75 px-4 py-2.5 text-xs font-semibold text-[#597183] shadow-sm backdrop-blur transition hover:border-[#9ddbe0] hover:text-[#176b91] disabled:opacity-50"
              >
                <Activity size={15} />
                <span className="hidden sm:inline">{t.retry}</span>
              </button>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-white bg-white/75 p-10 text-center text-sm text-[#8193a0] shadow-sm backdrop-blur">
                {t.loading}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-rose-100 bg-white/90 p-8 text-center shadow-sm">
                <AlertCircle className="mx-auto text-rose-500" size={25} />
                <p className="mt-3 text-sm font-semibold text-[#344f60]">{t.error}</p>
                <p className="mt-1 text-xs text-[#91a2af]">{t.retryHint}</p>
                <button
                  onClick={() => void loadDashboard()}
                  className="mt-5 rounded-full bg-[#176b91] px-5 py-2.5 text-xs font-semibold text-white"
                >
                  {t.retry}
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <article
                      key={stat.title}
                      className="group rounded-[21px] border border-white/90 bg-white/75 p-5 shadow-[0_7px_28px_rgba(28,69,91,0.045)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_34px_rgba(28,69,91,0.09)] sm:p-6"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-[#718492]">
                          {stat.title}
                        </span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8fa] text-[#239eaa] transition group-hover:bg-[#176b91] group-hover:text-white">
                          <Icon size={19} />
                        </span>
                      </div>
                      <div className="mt-7 flex flex-wrap items-baseline gap-2">
                        <span className="text-[29px] font-semibold tracking-tight text-[#18364a]">
                          {stat.value}
                        </span>
                        <span className="text-[11px] text-[#9aa9b3]">{stat.unit}</span>
                      </div>
                      <div className="mt-5 h-px w-full bg-[#eaf0f3]" />
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* MEDI services */}
          <section id="health-tools" className="mt-14 scroll-mt-28">
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#239eaa]">
                {t.services}
              </p>
              <h2 className="mt-2 text-[22px] font-semibold tracking-tight text-[#18364a] sm:text-[25px]">
                {t.quickActions}
              </h2>
              <p className="mt-2 text-sm text-[#83939f]">{t.quickDesc}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {modules.map((item) => {
  const Icon = item.icon;

  const cardContent = (
    <>
      <div className="flex w-full items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#eef8fa] text-[#218da1] transition group-hover:bg-[#176b91] group-hover:text-white">
          <Icon size={21} strokeWidth={1.8} />
        </span>

        <span className="rounded-full border border-[#e8eef2] bg-white/80 px-2.5 py-1 text-[8px] font-bold tracking-[0.12em] text-[#9aabb5]">
          {item.category}
        </span>
      </div>

      <div className="mt-6 flex w-full items-end justify-between gap-2">
        <div>
          <h3 className="text-[14px] font-semibold text-[#244456]">
            {item.title}
          </h3>

          <p className="mt-1.5 text-[11px] leading-5 text-[#8a9aa5]">
            {item.description}
          </p>
        </div>

        <ArrowUpRight
          size={17}
          className="mb-1 shrink-0 text-[#9bb0bb] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#176b91]"
        />
      </div>
    </>
  );

  const cardClassName =
    "group flex min-h-[190px] flex-col rounded-[20px] border border-white/90 bg-white/75 p-5 text-left shadow-[0_7px_28px_rgba(28,69,91,0.04)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#b9e2e6] hover:bg-white hover:shadow-[0_14px_34px_rgba(28,69,91,0.09)]";

  if (item.href) {
    return (
      <Link
        key={item.title}
        href={item.href}
        className={cardClassName}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <button
      key={item.title}
      type="button"
      onClick={() => showModuleNotice(item)}
      className={cardClassName}
    >
      {cardContent}
    </button>
  );
})}
            </div>
          </section>

          {/* Goals and AI companion */}
          <section className="mt-14 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[21px] border border-white/90 bg-white/75 p-6 shadow-[0_7px_28px_rgba(28,69,91,0.04)] backdrop-blur-xl sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#239eaa]">
                    {t.journey}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[#18364a]">{t.goals}</h2>
                  <p className="mt-1.5 text-xs text-[#8999a4]">{t.goalsDesc}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff7e9] text-[#c18a39]">
                  <Target size={21} />
                </span>
              </div>

              <div className="mt-6 space-y-2.5">
                {profile?.health_goals && profile.health_goals.length > 0 ? (
                  profile.health_goals.map((goal, index) => (
                    <div
                      key={`${goal}-${index}`}
                      className="flex items-center gap-3 rounded-xl bg-[#f5f8fa]/90 px-4 py-3.5"
                    >
                      <CheckCircle2 size={17} className="shrink-0 text-[#2697a5]" />
                      <span className="text-[13px] font-medium text-[#506a79]">{goal}</span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-[#f5f8fa]/90 px-4 py-5 text-xs leading-6 text-[#8a9aa5]">
                    {t.noGoals}
                  </div>
                )}
              </div>

              <Link
                href="/onboarding"
                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#176b91] transition hover:gap-3"
              >
                {t.viewProfile}
                <ArrowRight size={14} />
              </Link>
            </article>

            <article
  id="ai-companion"
  className="relative scroll-mt-28"
>
  <AICompanion language={language} />
</article>
          </section>

          {/* Health profile */}
          <section className="mt-14 scroll-mt-28">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#239eaa]">
                  {t.profileLabel}
                </p>
                <h2 className="mt-2 text-[22px] font-semibold tracking-tight text-[#18364a]">
                  {t.profile}
                </h2>
                <p className="mt-1.5 text-xs text-[#8999a4]">{t.profileDesc}</p>
              </div>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#176b91] hover:underline"
              >
                {t.seeAll}
                <ChevronRight size={15} />
              </Link>
            </div>

            <div className="rounded-[20px] border border-white/90 bg-white/75 p-5 shadow-[0_7px_28px_rgba(28,69,91,0.035)] backdrop-blur-xl sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {profileDetails.map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-[#f5f8fa]/90 p-4">
                    <p className="text-[11px] font-medium text-[#8798a3]">{label}</p>
                    <p className="mt-2 text-[13px] font-semibold capitalize text-[#345466]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/80 py-7 text-center sm:flex-row sm:text-left">
            <p className="text-[11px] text-[#96a5af]">
              Â© {currentYear} MEDI.{" "}
              {language === "en"
                ? "Your personal health companion."
                : "à¦†à¦ªà¦¨à¦¾à¦° à¦¬à§à¦¯à¦•à§à¦¤à¦¿à¦—à¦¤ à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦¸à¦™à§à¦—à§€à¥¤"}
            </p>
            <div className="flex items-center gap-2 text-[11px] font-medium text-[#328d9b]">
              <ShieldCheck size={15} />
              {t.privacy}
            </div>
          </footer>
        </div>
      </div>

      {/* Module notice dialog */}
      {noticeOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#102d3c]/35 p-5 backdrop-blur-sm"
          onClick={() => setNoticeOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="module-notice-title"
            className="w-full max-w-[420px] rounded-[22px] border border-white bg-white p-7 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf7f8] text-[#218da1]">
              <Clock3 size={23} />
            </div>
            <h2
              id="module-notice-title"
              className="mt-5 text-xl font-semibold text-[#18364a]"
            >
              {noticeTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#718492]">
              {noticeDescription}
            </p>
            <button
              onClick={() => setNoticeOpen(false)}
              className="mt-6 w-full rounded-xl bg-[#176b91] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125675]"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

