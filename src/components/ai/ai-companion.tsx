
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BrainCircuit,
  Send,
  Sparkles,
  ShieldCheck,
  LoaderCircle,
  MessageCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react";

type Language = "en" | "bn";

type Citation = {
  source_name?: string | null;
  source_url?: string | null;
  document_title?: string | null;
  title?: string | null;
  publisher?: string | null;
};

type AIResponse = {
  conversation_id?: string;
  response?: string;
  guidance?: string;
  personalization_used?: boolean;
  evidence_available?: boolean;
  citations?: Citation[];
  safety_indicators?: string[];
};

type Props = {
  language: Language;
};

export default function AICompanion({ language }: Props) {
  const bn = language === "bn";

  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; citations?: Citation[] }[]
  >([]);
  const [personalization, setPersonalization] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [guidanceLoading, setGuidanceLoading] = useState(false);
  const [error, setError] = useState("");

  const loadContext = useCallback(async () => {
    try {
      const response = await fetch("/api/ai/context", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = await response.json();
      setPersonalization(data.personalization_enabled === true);
    } catch {
      setPersonalization(null);
    }
  }, []);

  useEffect(() => {
    void loadContext();
  }, [loadContext]);

  async function sendMessage() {
    const text = message.trim();
    if (!text || loading) return;

    setError("");
    setMessage("");
    setMessages((previous) => [
      ...previous,
      { role: "user", content: text },
    ]);
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          locale: language,
          use_conversation_history: false,
          ...(conversationId ? { conversation_id: conversationId } : {}),
        }),
      });

      const data: AIResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data === "object" && "detail" in data
            ? String((data as Record<string, unknown>).detail)
            : bn
              ? "উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।"
              : "Unable to get a response. Please try again.",
        );
      }

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.response || "",
          citations: data.citations || [],
        },
      ]);

      await loadContext();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : bn
            ? "সংযোগে সমস্যা হয়েছে।"
            : "A connection error occurred.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function getDailyGuidance() {
    if (guidanceLoading || loading) return;

    setError("");
    setGuidanceLoading(true);

    try {
      const response = await fetch("/api/ai/guidance/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: language }),
      });

      const data: AIResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          String(
            (data as Record<string, unknown>).detail ||
              (bn ? "গাইডেন্স পাওয়া যায়নি।" : "Unable to generate guidance."),
          ),
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.guidance || "",
          citations: data.citations || [],
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : bn
            ? "গাইডেন্স তৈরি করা যায়নি।"
            : "Could not generate guidance.",
      );
    } finally {
      setGuidanceLoading(false);
    }
  }

  return (
    <div className="relative mt-7 overflow-hidden rounded-[18px] border border-[#d9e9ed] bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7eff1] px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f7f7] text-[#218da1]">
            <BrainCircuit size={21} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#23495b]">
              {bn ? "MEDI AI Companion" : "MEDI AI Companion"}
            </h3>
            <p className="text-[10px] text-[#8297a2]">
              {bn ? "আপনার স্বাস্থ্য সহায়ক" : "Your health companion"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-[#d8ece8] bg-[#f1faf7] px-3 py-1.5 text-[10px] font-semibold text-[#368477]">
          <ShieldCheck size={13} />
          {bn ? "সুরক্ষিত সংযোগ" : "Secure connection"}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-5">
        <p className="text-[11px] text-[#718894]">
          {personalization === null
            ? bn
              ? "ব্যক্তিগতকরণের অবস্থা যাচাই করা যাচ্ছে না।"
              : "Personalization status unavailable."
            : personalization
              ? bn
                ? "ব্যক্তিগত AI context সক্রিয়।"
                : "Personalized AI context is enabled."
              : bn
                ? "সাধারণ স্বাস্থ্য তথ্য ব্যবহার হচ্ছে।"
                : "Using general health information."}
        </p>

        <button
          type="button"
          onClick={getDailyGuidance}
          disabled={guidanceLoading || loading}
          className="inline-flex items-center gap-2 rounded-full border border-[#cce8e8] bg-[#f0fafa] px-3.5 py-2 text-[11px] font-semibold text-[#287f91] transition hover:bg-[#e5f5f5] disabled:opacity-50"
        >
          {guidanceLoading ? (
            <LoaderCircle size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} />
          )}
          {bn ? "আজকের Health Guidance" : "Daily Health Guidance"}
        </button>
      </div>

      <div className="mx-4 my-4 max-h-[420px] min-h-[190px] space-y-4 overflow-y-auto rounded-xl bg-[#f7fafb] p-4 sm:mx-5">
        {messages.length === 0 && (
          <div className="flex min-h-[155px] flex-col items-center justify-center text-center">
            <MessageCircle size={27} className="text-[#75b9c1]" />
            <p className="mt-3 text-sm font-semibold text-[#426273]">
              {bn ? "কীভাবে সাহায্য করতে পারি?" : "How can I help you today?"}
            </p>
            <p className="mt-1 max-w-sm text-[11px] leading-6 text-[#879ba5]">
              {bn
                ? "স্বাস্থ্য, ওষুধের নির্দেশনা বা সুস্থ জীবনযাপন নিয়ে প্রশ্ন করুন।"
                : "Ask about health, your confirmed medication instructions, or healthy habits."}
            </p>
          </div>
        )}

        {messages.map((item, index) => (
          <div
            key={`${index}-${item.role}`}
            className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[92%] rounded-2xl px-4 py-3 ${
                item.role === "user"
                  ? "rounded-br-md bg-[#176b91] text-white"
                  : "rounded-bl-md border border-[#e0ebed] bg-white text-[#3e5c6c]"
              }`}
            >
              <p className="whitespace-pre-wrap text-[12px] leading-7">
                {item.content}
              </p>

              {item.citations && item.citations.length > 0 && (
                <div className="mt-3 border-t border-[#e5edef] pt-3">
                  <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold text-[#58818c]">
                    <BookOpen size={12} />
                    {bn ? "তথ্যসূত্র" : "Sources"}
                  </p>
                  <div className="space-y-1.5">
                    {item.citations.map((citation, citationIndex) => {
                      const title =
                        citation.title ||
                        citation.document_title ||
                        citation.source_name ||
                        citation.publisher ||
                        (bn ? "তথ্যসূত্র" : "Source");

                      return (
                        <div key={citationIndex}>
                          {citation.source_url &&
                          /^https?:\/\//i.test(citation.source_url) ? (
                            <a
                              href={citation.source_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-medium text-[#287f91] underline underline-offset-2"
                            >
                              {title}
                            </a>
                          ) : (
                            <p className="text-[10px] text-[#718894]">
                              {title}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {(loading || guidanceLoading) && (
          <div className="flex items-center gap-2 text-[11px] text-[#638a96]">
            <LoaderCircle size={15} className="animate-spin" />
            {bn ? "MEDI উত্তর তৈরি করছে..." : "MEDI is preparing a response..."}
          </div>
        )}
      </div>

      {error && (
        <div className="mx-4 mb-3 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-[11px] leading-5 text-red-700 sm:mx-5">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <form
        className="flex items-center gap-2 px-4 pb-4 sm:px-5"
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage();
        }}
      >
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={4000}
          placeholder={
            bn ? "আপনার স্বাস্থ্য বিষয়ক প্রশ্ন লিখুন..." : "Ask MEDI a health question..."
          }
          className="h-12 min-w-0 flex-1 rounded-xl border border-[#dce9ed] bg-white px-4 text-xs text-[#345466] outline-none transition placeholder:text-[#9aabb3] focus:border-[#78c4cb] focus:ring-2 focus:ring-[#d9f1f1]"
          disabled={loading || guidanceLoading}
        />
        <button
          type="submit"
          disabled={!message.trim() || loading || guidanceLoading}
          aria-label={bn ? "পাঠান" : "Send"}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#176b91] text-white transition hover:bg-[#125878] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={17} />
        </button>
      </form>

      <p className="px-5 pb-4 text-[9px] leading-5 text-[#91a1a9]">
        {bn
          ? "MEDI চিকিৎসকের বিকল্প নয়। জরুরি অবস্থায় স্থানীয় জরুরি চিকিৎসা সেবা নিন।"
          : "MEDI is not a substitute for a clinician. Seek urgent medical care in an emergency."}
      </p>
    </div>
  );
}
