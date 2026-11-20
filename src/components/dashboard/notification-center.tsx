
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  LoaderCircle,
  Pill,
  X,
} from "lucide-react";

type Language = "en" | "bn";

type NotificationItem = {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  created_at: string;
  sent_at?: string | null;
  read_at?: string | null;
  metadata?: Record<string, unknown>;
};

type NotificationResponse = {
  items: NotificationItem[];
  total: number;
  unread_count: number;
};

const copy = {
  en: {
    title: "Notifications",
    empty: "You're all caught up.",
    emptyDescription: "New notifications will appear here.",
    markAll: "Mark all as read",
    loading: "Loading notifications...",
    error: "Unable to load notifications.",
    retry: "Try again",
    viewAll: "Showing recent notifications",
    read: "Mark as read",
    unread: "Unread",
    today: "Today",
  },
  bn: {
    title: "নোটিফিকেশন",
    empty: "নতুন কোনো নোটিফিকেশন নেই।",
    emptyDescription: "নতুন নোটিফিকেশন এখানে দেখা যাবে।",
    markAll: "সবগুলো পড়া হয়েছে",
    loading: "নোটিফিকেশন লোড হচ্ছে...",
    error: "নোটিফিকেশন লোড করা যায়নি।",
    retry: "আবার চেষ্টা করুন",
    viewAll: "সাম্প্রতিক নোটিফিকেশন",
    read: "পড়া হয়েছে",
    unread: "নতুন",
    today: "আজ",
  },
};

function formatNotificationDate(
  value: string,
  language: Language,
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(
    language === "bn" ? "bn-BD" : "en-BD",
    {
      hour: "numeric",
      minute: "2-digit",
      day: "numeric",
      month: "short",
      timeZone: "Asia/Dhaka",
    },
  ).format(date);
}

export default function NotificationCenter({
  language,
}: {
  language: Language;
}) {
  const t = copy[language];

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch(
        "/api/notifications?limit=10&offset=0",
        { cache: "no-store" },
      );

      if (!response.ok) {
        throw new Error("Notification request failed");
      }

      const data: NotificationResponse = await response.json();

      setItems(Array.isArray(data.items) ? data.items : []);
      setUnreadCount(
        typeof data.unread_count === "number"
          ? data.unread_count
          : 0,
      );
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();

    const interval = window.setInterval(() => {
      void loadNotifications();
    }, 60000);

    return () => window.clearInterval(interval);
  }, [loadNotifications]);

  const markAsRead = async (id: string) => {
    setActionLoading(id);

    try {
      const response = await fetch(
        `/api/notifications/${encodeURIComponent(id)}/read`,
        { method: "PATCH" },
      );

      if (!response.ok) {
        throw new Error("Unable to mark notification as read");
      }

      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, read_at: new Date().toISOString() }
            : item,
        ),
      );

      setUnreadCount((count) => Math.max(0, count - 1));
    } catch {
      await loadNotifications();
    } finally {
      setActionLoading(null);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    setActionLoading("all");

    try {
      const response = await fetch(
        "/api/notifications/read-all",
        { method: "POST" },
      );

      if (!response.ok) {
        throw new Error("Unable to mark all notifications as read");
      }

      const now = new Date().toISOString();

      setItems((current) =>
        current.map((item) => ({
          ...item,
          read_at: item.read_at ?? now,
        })),
      );

      setUnreadCount(0);
    } catch {
      await loadNotifications();
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          const next = !open;
          setOpen(next);

          if (next) {
            void loadNotifications();
          }
        }}
        aria-label={t.title}
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#dce9ed] bg-white/80 text-[#37677b] shadow-sm transition hover:border-[#a9dce1] hover:bg-white hover:text-[#176b91]"
      >
        <Bell size={18} strokeWidth={1.8} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-white bg-[#e56c70] px-1 text-[9px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <section
            aria-label={t.title}
            className="absolute right-0 top-[calc(100%+14px)] z-50 w-[min(92vw,390px)] overflow-hidden rounded-[20px] border border-[#e2ecef] bg-white shadow-[0_18px_60px_rgba(24,63,82,0.16)]"
          >
            <div className="flex items-center justify-between border-b border-[#edf2f4] px-5 py-4">
              <div>
                <h2 className="text-[14px] font-semibold text-[#18364a]">
                  {t.title}
                </h2>
                <p className="mt-1 text-[10px] text-[#8a9ba5]">
                  {unreadCount} {t.unread}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => void markAllAsRead()}
                    disabled={actionLoading !== null}
                    title={t.markAll}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#328d9b] transition hover:bg-[#edf8f9] disabled:opacity-50"
                  >
                    {actionLoading === "all" ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <CheckCheck size={17} />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#8296a1] transition hover:bg-[#f1f6f7]"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className="max-h-[390px] overflow-y-auto">
              {loading && items.length === 0 ? (
                <div className="flex items-center justify-center gap-2 px-5 py-12 text-xs text-[#8296a1]">
                  <LoaderCircle size={16} className="animate-spin" />
                  {t.loading}
                </div>
              ) : error && items.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-xs text-[#8799a4]">{t.error}</p>
                  <button
                    type="button"
                    onClick={() => void loadNotifications()}
                    className="mt-3 text-xs font-semibold text-[#176b91]"
                  >
                    {t.retry}
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8fa] text-[#2695a4]">
                    <Bell size={21} />
                  </div>
                  <p className="mt-4 text-[13px] font-semibold text-[#365365]">
                    {t.empty}
                  </p>
                  <p className="mt-1.5 text-[11px] text-[#91a1aa]">
                    {t.emptyDescription}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#edf2f4]">
                  {items.map((item) => {
                    const unread = !item.read_at;

                    return (
                      <article
                        key={item.id}
                        className={`flex gap-3 px-5 py-4 transition ${
                          unread ? "bg-[#f5fbfc]" : "bg-white"
                        }`}
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf7f9] text-[#238da0]">
                          <Pill size={17} />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[12px] font-semibold leading-5 text-[#29495b]">
                              {item.title}
                            </p>

                            {unread && (
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2697a5]" />
                            )}
                          </div>

                          <p className="mt-1 text-[11px] leading-[1.65] text-[#718592]">
                            {item.message}
                          </p>

                          <div className="mt-2.5 flex items-center justify-between gap-2">
                            <span className="text-[9px] text-[#9aabb4]">
                              {formatNotificationDate(
                                item.created_at,
                                language,
                              )}
                            </span>

                            {unread && (
                              <button
                                type="button"
                                onClick={() => void markAsRead(item.id)}
                                disabled={actionLoading !== null}
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#21899a] transition hover:text-[#176b91] disabled:opacity-50"
                              >
                                {actionLoading === item.id ? (
                                  <LoaderCircle size={12} className="animate-spin" />
                                ) : (
                                  <Check size={12} />
                                )}
                                {t.read}
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-[#edf2f4] bg-[#fbfdfe] px-5 py-3">
              <p className="text-center text-[10px] font-medium text-[#91a2ac]">
                {t.viewAll}
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
