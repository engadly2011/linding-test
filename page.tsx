"use client";

import { useEffect, useRef, useState } from "react";

/* ============ الأنواع (مطابقة لمخرجات الـ API) ============ */
type Severity = "high" | "medium" | "low";
type Issue = { severity: Severity; issue: string };
type Change = { priority: Severity; change: string };

export type AuditResult = {
  ok?: boolean;
  url?: string;
  scrapedTitle?: string;
  score: number;
  summary: string;
  copywriting_issues: Issue[];
  ui_ux_issues: Issue[];
  trust_issues: Issue[];
  recommended_changes: Change[];
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  // مرّر الشاشة للتقرير/الهيكل بسلاسة فور بدء الفحص أو ظهور النتيجة
  useEffect(() => {
    if ((status === "loading" || result) && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status, result]);

  function normalize(value: string) {
    const v = value.trim();
    if (!v) return "";
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = normalize(url);
    try {
      new URL(cleaned);
    } catch {
      setStatus("error");
      setErrorMsg("من فضلك أدخل رابطًا صحيحًا، مثل: your-store.com");
      return;
    }

    setStatus("loading");
    setResult(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleaned }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "تعذّر إكمال الفحص.");
      setResult(data as AuditResult);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "حدث خطأ غير متوقع.");
    }
  }

  return (
    <main className="relative overflow-hidden">
      {/* ===== شريط التنقل ===== */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-emerald-ring shadow-soft">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink">
            Auditor<span className="text-emerald">.ai</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
          <a href="#how" className="transition hover:text-ink">كيف يعمل</a>
          <a href="#" className="transition hover:text-ink">الأسعار</a>
          <a href="#" className="transition hover:text-ink">أمثلة</a>
        </nav>

        <a href="#" className="rounded-full border border-ink/15 bg-white/60 px-5 py-2 text-sm font-semibold text-ink backdrop-blur transition hover:border-ink/30 hover:shadow-soft">
          تسجيل الدخول
        </a>
      </header>

      {/* ===== القسم الرئيسي ===== */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-16">
        {/* النص + النموذج */}
        <div className="max-w-xl">
          <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-emerald/25 bg-emerald-light px-4 py-1.5 text-sm font-semibold text-emerald-dark" style={{ animationDelay: "0ms" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
            </span>
            مدعوم بالذكاء الاصطناعي
          </span>

          <h1 className="mt-6 animate-fade-up font-display text-4xl font-black leading-[1.18] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]" style={{ animationDelay: "90ms" }}>
            اكتشف لماذا لا تبيع صفحتك
            <span className="relative mr-2 inline-block text-emerald">
              قبل أن تُهدر ميزانيتك
              <svg className="absolute -bottom-2 right-0 w-full text-emerald/35" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none">
                <path d="M2 9C60 3 240 3 298 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-6 animate-fade-up text-lg leading-relaxed text-ink-soft" style={{ animationDelay: "170ms" }}>
            افحص صفحة الهبوط الخاصة بك بالذكاء الاصطناعي خلال ثوانٍ، واحصل على
            تقرير دقيق يكشف نقاط الضعف التي تُضعف تحويلاتك — مع توصيات عملية قابلة
            للتطبيق لزيادة مبيعاتك.
          </p>

          {/* نموذج الفحص */}
          <form onSubmit={handleSubmit} className="mt-8 animate-fade-up" style={{ animationDelay: "250ms" }}>
            <div className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white/70 p-2 shadow-soft backdrop-blur sm:flex-row sm:items-center sm:rounded-full">
              <div className="flex flex-1 items-center gap-3 px-4">
                <svg className="h-5 w-5 shrink-0 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
                  <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
                </svg>
                <input
                  type="text"
                  inputMode="url"
                  dir="ltr"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="https://your-store.com"
                  className="w-full bg-transparent py-3 text-left text-ink placeholder:text-ink-muted/70 focus:outline-none"
                  aria-label="رابط موقعك"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-emerald px-6 py-3.5 font-display text-base font-bold text-white shadow-[0_10px_24px_-8px_rgba(15,157,107,0.7)] transition hover:bg-emerald-dark hover:shadow-[0_14px_30px_-8px_rgba(15,157,107,0.8)] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald/25 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    جارٍ الفحص…
                  </>
                ) : (
                  <>
                    افحص صفحتك الآن بالذكاء الاصطناعي
                    <svg className="h-5 w-5 transition group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5" />
                      <path d="m12 19-7-7 7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {status === "error" ? (
              <p className="mt-2.5 pr-2 text-sm font-medium text-red-600">
                {errorMsg || "حدث خطأ. حاول مجددًا."}
              </p>
            ) : (
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 pr-2 text-sm text-ink-muted">
                <span className="inline-flex items-center gap-1.5"><Check /> فحص مجاني تمامًا</span>
                <span className="inline-flex items-center gap-1.5"><Check /> بدون تسجيل</span>
                <span className="inline-flex items-center gap-1.5"><Check /> نتائج فورية</span>
              </p>
            )}
          </form>

          {/* دليل اجتماعي */}
          <div className="mt-10 flex animate-fade-up items-center gap-4" style={{ animationDelay: "330ms" }}>
            <div className="flex -space-x-2 space-x-reverse">
              {["#0F9D6B", "#E8A33D", "#3A4150", "#0B7C54"].map((c, i) => (
                <span key={i} className="grid h-9 w-9 place-items-center rounded-full border-2 border-cream font-display text-xs font-bold text-white" style={{ background: c }}>
                  {["م", "أ", "س", "ت"][i]}
                </span>
              ))}
            </div>
            <p className="text-sm leading-snug text-ink-soft">
              موثوق من أكثر من <span className="font-bold text-ink">٢٠٠ متجر ومُعلن</span> في الخليج ومصر
            </p>
          </div>
        </div>

        {/* بطاقة التقرير — تعرض الداتا الحقيقية لو موجودة */}
        <div className="animate-fade-up lg:justify-self-end" style={{ animationDelay: "200ms" }}>
          <AuditCard result={result} loading={status === "loading"} />
        </div>
      </section>

      {/* ===== أسفل الهيرو: هيكل التحميل أثناء الفحص، أو التقرير بعد نجاحه ===== */}
      {status === "loading" ? (
        <div ref={reportRef}>
          <ReportSkeleton />
        </div>
      ) : result ? (
        <div ref={reportRef}>
          <DetailedReport result={result} />
        </div>
      ) : null}
    </main>
  );
}

/* ============ بطاقة تقرير الفحص ============ */
function AuditCard({
  result,
  loading,
}: {
  result: AuditResult | null;
  loading: boolean;
}) {
  const demo = {
    title: "your-store.com",
    score: 68,
    verdict: "تحتاج تحسينًا",
    note: "٣ نقاط حرجة تُضعف تحويلاتك",
    metrics: [
      { label: "سرعة التحميل", value: 82, tone: "ok" as Tone },
      { label: "وضوح عرض القيمة", value: 54, tone: "warn" as Tone },
      { label: "قوة زر الحث على الإجراء", value: 47, tone: "bad" as Tone },
      { label: "التوافق مع الجوال", value: 91, tone: "ok" as Tone },
    ],
  };

  let title = demo.title;
  let score = demo.score;
  let verdict = demo.verdict;
  let note = demo.note;
  let metrics = demo.metrics;
  let live = false;

  if (result) {
    live = true;
    title = safeHost(result.url) || result.scrapedTitle || "موقعك";
    score = clamp(result.score);
    verdict = verdictFor(score);
    const highCount =
      countSeverity(result.copywriting_issues, "high") +
      countSeverity(result.ui_ux_issues, "high") +
      countSeverity(result.trust_issues, "high");
    note = highCount > 0 ? `${toArabic(highCount)} نقاط حرجة تُضعف تحويلاتك` : "لا توجد نقاط حرجة واضحة";
    metrics = [
      { label: "جودة النصوص", value: categoryScore(result.copywriting_issues), tone: "auto" as Tone },
      { label: "تجربة الاستخدام", value: categoryScore(result.ui_ux_issues), tone: "auto" as Tone },
      { label: "عناصر الثقة", value: categoryScore(result.trust_issues), tone: "auto" as Tone },
    ];
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute -right-4 -top-5 z-10 hidden animate-float rounded-2xl border border-ink/10 bg-white px-4 py-3 shadow-card sm:block">
        <p className="text-xs text-ink-muted">{live ? "الحالة" : "تحويلات متوقّعة"}</p>
        <p className="font-display text-lg font-extrabold text-emerald">
          {live ? (loading ? "…" : "مكتمل") : "‎+38%‎"}
        </p>
      </div>

      <div className="rounded-[28px] border border-ink/10 bg-white/85 p-6 shadow-card backdrop-blur-sm">
        <div className="mb-6 flex items-center gap-2 border-b border-ink/5 pb-4">
          <span className="h-3 w-3 rounded-full bg-[#ED6A5E]" />
          <span className="h-3 w-3 rounded-full bg-[#F4BF50]" />
          <span className="h-3 w-3 rounded-full bg-emerald" />
          <span className="mr-2 flex-1 truncate rounded-md bg-sand px-3 py-1 text-left text-xs text-ink-muted" dir="ltr">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-5">
          <ScoreRing score={score} />
          <div className="min-w-0">
            <p className="text-sm text-ink-muted">النتيجة الإجمالية</p>
            <p className="font-display text-2xl font-extrabold text-ink">{verdict}</p>
            <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{note}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {metrics.map((m) => (
            <Metric key={m.label} label={m.label} value={m.value} tone={m.tone} />
          ))}
        </div>

        <a
          href={live ? "#detailed-report" : "#"}
          className="mt-6 block w-full rounded-xl bg-ink py-3 text-center font-display text-sm font-bold text-cream transition hover:bg-ink/90"
        >
          عرض التقرير الكامل والتوصيات
        </a>
      </div>
    </div>
  );
}

/* ============ المؤشر الدائري المتحرك ============ */
const RADIUS = 54;
const CIRC = 2 * Math.PI * RADIUS; // ≈ 339.29

function ScoreRing({ score }: { score: number }) {
  const target = clamp(score);
  const [offset, setOffset] = useState(CIRC);
  const display = useCountUp(target);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOffset(CIRC * (1 - target / 100)));
    return () => cancelAnimationFrame(id);
  }, [target]);

  const c = scoreColors(target);

  return (
    <div className="relative grid h-28 w-28 shrink-0 place-items-center">
      <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90">
        <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#0E11160F" strokeWidth="12" />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }}
        />
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c.from} />
            <stop offset="100%" stopColor={c.to} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <span className="font-display text-3xl font-black tabular-nums text-ink">{display}</span>
        <span className="block text-[11px] text-ink-muted">من ١٠٠</span>
      </div>
    </div>
  );
}

type Tone = "ok" | "warn" | "bad" | "auto";

function Metric({ label, value, tone }: { label: string; value: number; tone: Tone }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setW(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  const resolved: Exclude<Tone, "auto"> =
    tone === "auto" ? (value >= 75 ? "ok" : value >= 50 ? "warn" : "bad") : tone;
  const color = resolved === "ok" ? "#0F9D6B" : resolved === "warn" ? "#E8A33D" : "#ED6A5E";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-ink-soft">{label}</span>
        <span className="font-display font-bold tabular-nums text-ink">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
        <div
          className="h-full rounded-full"
          style={{ width: `${w}%`, background: color, transition: "width 1s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </div>
    </div>
  );
}

/* ============ هيكل التحميل (Skeleton + Shimmer) ============ */
function ReportSkeleton() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-28" aria-busy="true" aria-label="جارٍ تحضير التقرير">
      {/* رأس التقرير */}
      <div className="animate-fade-up rounded-[28px] border border-ink/10 bg-white/70 p-7 shadow-card backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="skeleton h-6 w-28 rounded-full" />
            <div className="skeleton h-8 w-72 rounded-lg" />
            <div className="skeleton h-4 w-40 rounded" />
          </div>
          {/* صندوق النتيجة الداكن مع وميض داخلي */}
          <div className="flex items-center gap-4 rounded-2xl bg-ink px-6 py-5">
            <div className="space-y-2 text-center">
              <div className="skeleton h-9 w-12 rounded-md" style={{ backgroundColor: "rgba(250,247,242,0.18)" }} />
              <div className="skeleton h-3 w-10 rounded" style={{ backgroundColor: "rgba(250,247,242,0.12)" }} />
            </div>
            <div className="h-10 w-px bg-cream/20" />
            <div className="space-y-2">
              <div className="skeleton h-3.5 w-40 rounded" style={{ backgroundColor: "rgba(250,247,242,0.14)" }} />
              <div className="skeleton h-3.5 w-32 rounded" style={{ backgroundColor: "rgba(250,247,242,0.14)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* تبويبات وهمية */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        {[40, 46, 36].map((w, i) => (
          <div key={i} className="skeleton rounded-full" style={{ height: "44px", width: `${w * 4}px` }} />
        ))}
      </div>

      {/* بطاقات مشاكل وهمية */}
      <div className="mt-5 space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-white/80 p-5 shadow-soft backdrop-blur-sm">
            <div className="skeleton h-9 w-9 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2.5">
              <div className="skeleton h-5 w-28 rounded-full" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 rounded" style={{ width: i % 2 ? "70%" : "85%" }} />
            </div>
          </div>
        ))}
      </div>

      {/* القسم الذهبي وهو يتنفّس ببطء */}
      <div className="mt-10 overflow-hidden rounded-[28px] border border-amber-accent/40 bg-gradient-to-bl from-[#FCF4E0] to-[#F8EAC8] shadow-card">
        <div className="flex items-center justify-between gap-3 border-b border-amber-accent/30 bg-amber-accent/10 px-7 py-5">
          <div className="flex items-center gap-3">
            <div className="skeleton-gold skeleton h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <div className="skeleton-gold skeleton h-5 w-56 rounded" />
              <div className="skeleton-gold skeleton h-3.5 w-44 rounded" />
            </div>
          </div>
          <div className="skeleton-gold skeleton h-9 w-36 rounded-full" />
        </div>
        <div className="divide-y divide-amber-accent/15">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-start gap-4 px-7 py-5">
              <div className="skeleton-gold skeleton h-7 w-7 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2.5">
                <div className="skeleton-gold skeleton h-4 w-24 rounded-full" />
                <div className="skeleton-gold skeleton h-4 w-full rounded" />
                <div className="skeleton-gold skeleton h-4 rounded" style={{ width: i % 2 ? "60%" : "80%" }} />
              </div>
              <div className="skeleton-gold skeleton h-7 w-16 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* سطر طمأنة للمستخدم */}
      <p className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-muted">
        <svg className="h-4 w-4 animate-spin text-emerald" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        الذكاء الاصطناعي يحلّل صفحتك الآن… عادةً يستغرق ذلك بضع ثوانٍ.
      </p>
    </section>
  );
}

/* ============ التقرير التفصيلي ============ */
const TABS = [
  { key: "copywriting_issues", label: "النصوص والـ Copywriting", icon: CopyIcon },
  { key: "ui_ux_issues", label: "التصميم وتجربة الاستخدام", icon: LayoutIcon },
  { key: "trust_issues", label: "الثقة والمصداقية", icon: ShieldIcon },
] as const;

function DetailedReport({ result }: { result: AuditResult }) {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("copywriting_issues");
  const issues = result[active] as Issue[];

  return (
    <section id="detailed-report" className="mx-auto max-w-5xl scroll-mt-8 px-6 pb-28">
      {/* رأس التقرير */}
      <div className="animate-fade-up rounded-[28px] border border-ink/10 bg-white/70 p-7 shadow-card backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-light px-3 py-1 text-xs font-bold text-emerald-dark">
              <Check /> اكتمل الفحص
            </span>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-ink">
              تقرير الفحص التفصيلي
            </h2>
            <p className="mt-1 text-sm text-ink-muted" dir="ltr">
              {safeHost(result.url) || result.scrapedTitle}
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-ink px-5 py-4 text-cream">
            <div className="text-center">
              <p className="font-display text-4xl font-black leading-none tabular-nums">{clamp(result.score)}</p>
              <p className="mt-1 text-[11px] text-cream/70">من ١٠٠</p>
            </div>
            <div className="h-10 w-px bg-cream/20" />
            <p className="max-w-[14rem] text-sm leading-snug text-cream/90">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* التبويبات */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        {TABS.map((t) => {
          const count = (result[t.key] as Issue[]).length;
          const isActive = active === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "border-ink bg-ink text-cream shadow-soft"
                  : "border-ink/12 bg-white/70 text-ink-soft backdrop-blur hover:border-ink/30"
              }`}
            >
              <Icon active={isActive} />
              {t.label}
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${isActive ? "bg-cream/20 text-cream" : "bg-sand text-ink-soft"}`}>
                {toArabic(count)}
              </span>
            </button>
          );
        })}
      </div>

      {/* لوحة المشكلات */}
      <div key={active} className="mt-5 animate-fade-up space-y-3">
        {issues.length === 0 ? (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald/20 bg-emerald-light/60 p-5 text-emerald-dark">
            <Check />
            <p className="font-semibold">لا توجد مشكلات واضحة في هذا القسم — أداء جيد هنا.</p>
          </div>
        ) : (
          issues.map((it, i) => (
            <div key={i} className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-white/80 p-5 shadow-soft backdrop-blur-sm">
              <SeverityIcon level={it.severity} />
              <div className="flex-1">
                <SeverityBadge level={it.severity} kind="severity" />
                <p className="mt-2 leading-relaxed text-ink">{it.issue}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* القسم الذهبي */}
      <GoldenRecommendations changes={result.recommended_changes} />
    </section>
  );
}

/* ============ القسم الذهبي مع النسخ السريع ============ */
function GoldenRecommendations({ changes }: { changes: Change[] }) {
  const allText = changes.map((c, i) => `${i + 1}. ${c.change}`).join("\n");

  return (
    <div className="mt-10 animate-fade-up overflow-hidden rounded-[28px] border border-amber-accent/40 bg-gradient-to-bl from-[#FCF4E0] to-[#F8EAC8] shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-accent/30 bg-amber-accent/10 px-7 py-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-accent text-white shadow-soft">
            <BoltIcon />
          </span>
          <div>
            <h3 className="font-display text-xl font-extrabold text-ink">تعديلات فورية لزيادة المبيعات</h3>
            <p className="text-sm text-ink-soft">انسخ التوصية وطبّقها على صفحتك مباشرةً</p>
          </div>
        </div>
        <CopyButton text={allText} label="نسخ كل التوصيات" big />
      </div>

      <ol className="divide-y divide-amber-accent/15">
        {changes.map((c, i) => (
          <li key={i} className="flex items-start gap-4 px-7 py-5">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink font-display text-sm font-bold text-cream tabular-nums">
              {toArabic(i + 1)}
            </span>
            <div className="flex-1">
              <SeverityBadge level={c.priority} kind="priority" />
              <p className="mt-2 leading-relaxed text-ink">{c.change}</p>
            </div>
            <CopyButton text={c.change} label="نسخ" />
          </li>
        ))}
      </ol>
    </div>
  );
}

function CopyButton({ text, label, big = false }: { text: string; label: string; big?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* المتصفح منع الوصول للحافظة */
    }
  }

  return (
    <button
      onClick={copy}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full font-display font-bold transition ${
        big ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs"
      } ${copied ? "bg-emerald text-white" : "border border-ink/15 bg-white/70 text-ink hover:border-ink/30"}`}
    >
      {copied ? (
        <>
          <Check light /> تم النسخ
        </>
      ) : (
        <>
          <CopyIcon small /> {label}
        </>
      )}
    </button>
  );
}

/* ============ شارات وأيقونات الـ severity ============ */
const LEVELS = {
  high: { color: "#ED6A5E", bg: "#FCEBE9", severity: "حرجة", priority: "عاجل" },
  medium: { color: "#E8A33D", bg: "#FCF2E0", severity: "متوسطة", priority: "مهم" },
  low: { color: "#0F9D6B", bg: "#E6F6EF", severity: "منخفضة", priority: "لاحقًا" },
} as const;

function SeverityBadge({ level, kind }: { level: Severity; kind: "severity" | "priority" }) {
  const l = LEVELS[level];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: l.bg, color: l.color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: l.color }} />
      {kind === "severity" ? `أهمية ${l.severity}` : `أولوية: ${l.priority}`}
    </span>
  );
}

function SeverityIcon({ level }: { level: Severity }) {
  const l = LEVELS[level];
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: l.bg, color: l.color }}>
      {level === "low" ? (
        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 9v4" /><path d="M12 17h.01" /><circle cx="12" cy="12" r="9" />
        </svg>
      ) : (
        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4" /><path d="M12 17h.01" />
        </svg>
      )}
    </span>
  );
}

/* ============ أيقونات ============ */
function Check({ light = false }: { light?: boolean }) {
  return (
    <svg className={`h-4 w-4 ${light ? "text-white" : "text-emerald"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function CopyIcon({ small = false, active = false }: { small?: boolean; active?: boolean }) {
  return (
    <svg className={small ? "h-3.5 w-3.5" : "h-4 w-4"} viewBox="0 0 24 24" fill="none" stroke={active ? "#FAF7F2" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}
function LayoutIcon({ active = false }: { active?: boolean }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke={active ? "#FAF7F2" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
    </svg>
  );
}
function ShieldIcon({ active = false }: { active?: boolean }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke={active ? "#FAF7F2" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8Z" />
    </svg>
  );
}

/* ============ مساعدات منطقية ============ */
function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n || 0)));
}
function countSeverity(arr: Issue[] = [], level: Severity) {
  return arr.filter((x) => x.severity === level).length;
}
function categoryScore(issues: Issue[] = []) {
  let s = 100;
  for (const it of issues) s -= it.severity === "high" ? 22 : it.severity === "medium" ? 12 : 6;
  return clamp(s, 8, 100);
}
function verdictFor(score: number) {
  if (score >= 80) return "جاهزة للبيع";
  if (score >= 60) return "تحتاج تحسينًا";
  if (score >= 40) return "ضعيفة التحويل";
  return "تحتاج إعادة بناء";
}
function scoreColors(score: number) {
  if (score >= 75) return { from: "#34D399", to: "#0B7C54" };
  if (score >= 50) return { from: "#F4BF50", to: "#E8A33D" };
  return { from: "#F08B80", to: "#ED6A5E" };
}
function safeHost(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
function toArabic(n: number) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
}

/* عدّاد رقمي يتصاعد حتى القيمة المستهدفة */
function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}
