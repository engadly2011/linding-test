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

/* ============================================================
   المكوّن الرئيسي
   ============================================================ */
export default function Home() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

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

  function scrollToAudit() {
    document.getElementById("audit-hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          <a href="#features" className="transition hover:text-ink">ماذا نفحص</a>
          <a href="#pricing" className="transition hover:text-ink">الأسعار</a>
          <a href="#faq" className="transition hover:text-ink">الأسئلة الشائعة</a>
        </nav>

        <a href="#pricing" className="rounded-full border border-ink/15 bg-white/60 px-5 py-2 text-sm font-semibold text-ink backdrop-blur transition hover:border-ink/30 hover:shadow-soft">
          ابدأ الآن
        </a>
      </header>

      {/* ===== القسم الرئيسي ===== */}
      <section id="audit-hero" className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-16">
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

        <div className="animate-fade-up lg:justify-self-end" style={{ animationDelay: "200ms" }}>
          <AuditCard result={result} loading={status === "loading"} />
        </div>
      </section>

      {/* ===== التقرير / الهيكل ===== */}
      {status === "loading" ? (
        <div ref={reportRef}>
          <ReportSkeleton />
        </div>
      ) : result ? (
        <div ref={reportRef}>
          <DetailedReport result={result} />
        </div>
      ) : null}

      {/* ===== الأقسام التسويقية ===== */}
      <BrandsTicker />
      <HowItWorks />
      <CoreFeatures />
      <PricingTable onFreeTier={scrollToAudit} />
      <FAQSection />
      <Footer />
    </main>
  );
}

/* ============================================================
   بطاقة تقرير الفحص
   ============================================================ */
function AuditCard({ result, loading }: { result: AuditResult | null; loading: boolean }) {
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

        <a href={live ? "#detailed-report" : "#pricing"} className="mt-6 block w-full rounded-xl bg-ink py-3 text-center font-display text-sm font-bold text-cream transition hover:bg-ink/90">
          عرض التقرير الكامل والتوصيات
        </a>
      </div>
    </div>
  );
}

/* ============ المؤشر الدائري ============ */
const RADIUS = 54;
const CIRC = 2 * Math.PI * RADIUS;

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
        <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="url(#ring-grad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }} />
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
        <div className="h-full rounded-full" style={{ width: `${w}%`, background: color, transition: "width 1s cubic-bezier(0.22,1,0.36,1)" }} />
      </div>
    </div>
  );
}

/* ============ هيكل التحميل ============ */
function ReportSkeleton() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-28" aria-busy="true" aria-label="جارٍ تحضير التقرير">
      <div className="animate-fade-up rounded-[28px] border border-ink/10 bg-white/70 p-7 shadow-card backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="skeleton h-6 w-28 rounded-full" />
            <div className="skeleton h-8 w-72 rounded-lg" />
            <div className="skeleton h-4 w-40 rounded" />
          </div>
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

      <div className="mt-6 flex flex-wrap gap-2.5">
        {[40, 46, 36].map((w, i) => (
          <div key={i} className="skeleton rounded-full" style={{ height: "44px", width: `${w * 4}px` }} />
        ))}
      </div>

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
      <div className="animate-fade-up rounded-[28px] border border-ink/10 bg-white/70 p-7 shadow-card backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-light px-3 py-1 text-xs font-bold text-emerald-dark">
              <Check /> اكتمل الفحص
            </span>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-ink">تقرير الفحص التفصيلي</h2>
            <p className="mt-1 text-sm text-ink-muted" dir="ltr">{safeHost(result.url) || result.scrapedTitle}</p>
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

      <div className="mt-6 flex flex-wrap gap-2.5">
        {TABS.map((t) => {
          const count = (result[t.key] as Issue[]).length;
          const isActive = active === t.key;
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setActive(t.key)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${isActive ? "border-ink bg-ink text-cream shadow-soft" : "border-ink/12 bg-white/70 text-ink-soft backdrop-blur hover:border-ink/30"}`}>
              <Icon active={isActive} />
              {t.label}
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${isActive ? "bg-cream/20 text-cream" : "bg-sand text-ink-soft"}`}>
                {toArabic(count)}
              </span>
            </button>
          );
        })}
      </div>

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

      <GoldenRecommendations changes={result.recommended_changes} />
    </section>
  );
}

/* ============ القسم الذهبي ============ */
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
    } catch {}
  }
  return (
    <button onClick={copy} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full font-display font-bold transition ${big ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs"} ${copied ? "bg-emerald text-white" : "border border-ink/15 bg-white/70 text-ink hover:border-ink/30"}`}>
      {copied ? (<><Check light /> تم النسخ</>) : (<><CopyIcon small /> {label}</>)}
    </button>
  );
}

/* ============================================================
   1) شريط البراندات المتحرك
   ============================================================ */
const BRANDS = ["Taager", "Ninja Sellers", "Salla", "Zid", "Shopify", "YouCan"];

function BrandsTicker() {
  return (
    <section className="border-y border-ink/5 bg-white/40 py-10 backdrop-blur-sm">
      <p className="mb-7 text-center text-sm font-medium tracking-wide text-ink-muted">
        نفحص ونُحسّن صفحات على أبرز منصات التجارة في الشرق الأوسط
      </p>
      <div className="marquee-mask relative overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-16 pr-16">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span
              key={i}
              className="group cursor-default whitespace-nowrap font-display text-2xl font-extrabold text-ink/25 transition-all duration-300 hover:text-emerald hover:[text-shadow:0_0_24px_rgba(15,157,107,0.45)] sm:text-3xl"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   2) كيف يعمل — ٣ خطوات سينمائية
   ============================================================ */
const STEPS = [
  {
    n: "1",
    title: "ألصق الرابط",
    desc: "ضع رابط صفحة الهبوط أو المتجر الخاص بك في الأعلى واضغط زر الفحص. لا حاجة لأي تثبيت أو تسجيل.",
    icon: LinkIcon,
  },
  {
    n: "2",
    title: "فحص نفسي بالذكاء الاصطناعي",
    desc: "يحلّل الذكاء الاصطناعي صفحتك من منظور المشتري الخليجي والمصري: النصوص، الثقة، ونقاط التردد التي تُفقدك البيع.",
    icon: BrainIcon,
  },
  {
    n: "3",
    title: "ضاعِف مبيعاتك",
    desc: "احصل على توصيات فورية قابلة للتطبيق ترفع تحويلاتك وتوقف نزيف ميزانيتك الإعلانية — جاهزة للنسخ والتنفيذ.",
    icon: RocketIcon,
  },
];

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald/25 bg-emerald-light px-4 py-1.5 text-sm font-semibold text-emerald-dark">
          ثلاث خطوات
        </span>
        <h2 className="mt-5 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
          من رابط عادي إلى صفحة تبيع
        </h2>
        <p className="mt-4 text-lg text-ink-soft">
          عملية بسيطة من ثلاث خطوات تكشف لك ما يراه عملاؤك ولا تراه أنت.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.n}
              className="group relative overflow-hidden rounded-[28px] border border-ink/10 bg-white/60 p-8 shadow-soft backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-emerald/30 hover:shadow-card"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="pointer-events-none absolute -bottom-8 -left-2 select-none font-display text-[10rem] font-black leading-none text-ink/5 transition-all duration-500 group-hover:text-emerald/10">
                {s.n}
              </span>
              <div className="relative">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-emerald-ring shadow-soft transition-transform duration-500 group-hover:scale-110">
                  <Icon />
                </span>
                <h3 className="mt-6 font-display text-2xl font-extrabold text-ink">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============================================================
   3) ماذا نفحص — ٣ بطاقات أساسية
   ============================================================ */
const FEATURES = [
  {
    title: "نصوص البيع وجذب الانتباه",
    en: "Copywriting & Hook Power",
    desc: "نقيّم قوة العنوان الرئيسي، وضوح عرض القيمة خلال أول ثانيتين، وصياغة أزرار الحث على الإجراء ومدى تحفيزها للشراء.",
    icon: PenIcon,
    points: ["قوة العنوان والخطّاف", "وضوح عرض القيمة", "صياغة أزرار CTA"],
    accent: "emerald",
  },
  {
    title: "تجربة المستخدم ونقاط التشتيت",
    en: "UI/UX & Frictional Points",
    desc: "نكشف العناصر التي تشتّت الزائر أو تعيق رحلته نحو الشراء، من ترتيب الصفحة إلى ظهور الزر على الجوال.",
    icon: CursorIcon,
    points: ["ظهور CTA فوق الطية", "مسار الشراء وسلاسته", "التشتيت البصري"],
    accent: "ink",
  },
  {
    title: "عناصر الثقة وعقلية المشتري الخليجي والمصري",
    en: "Trust & Gulf Credibility",
    desc: "نحلّل عناصر الثقة الحاسمة في السوق العربي: آراء العملاء، وسائل التواصل، الضمانات، وطرق الدفع المحلية.",
    icon: ShieldCheckIcon,
    points: ["التقييمات والمصداقية", "وسائل تواصل واضحة", "ضمان وطرق دفع محلية"],
    accent: "amber",
  },
];

function CoreFeatures() {
  return (
    <section id="features" className="relative bg-sand/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-4 py-1.5 text-sm font-semibold text-ink-soft">
            ماذا نفحص
          </span>
          <h2 className="mt-5 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
            ثلاثة محاور تصنع الفرق بين صفحة تتفرّج وصفحة تبيع
          </h2>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            const ring =
              f.accent === "emerald"
                ? "hover:border-emerald/40"
                : f.accent === "amber"
                ? "hover:border-amber-accent/50"
                : "hover:border-ink/40";
            const iconBg =
              f.accent === "emerald"
                ? "bg-emerald-light text-emerald-dark"
                : f.accent === "amber"
                ? "bg-[#FCF2E0] text-amber-accent"
                : "bg-ink/5 text-ink";
            return (
              <div key={f.en} className={`group flex flex-col rounded-[28px] border border-ink/10 bg-white/80 p-8 shadow-soft backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card ${ring}`}>
                <span className={`grid h-14 w-14 place-items-center rounded-2xl ${iconBg} transition-transform duration-500 group-hover:scale-110`}>
                  <Icon />
                </span>
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-ink-muted" dir="ltr">{f.en}</p>
                <h3 className="mt-1.5 font-display text-xl font-extrabold leading-snug text-ink">{f.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{f.desc}</p>
                <ul className="mt-6 space-y-2.5 border-t border-ink/5 pt-6">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm font-medium text-ink-soft">
                      <Check /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   4) الأسعار
   ============================================================ */
const PLANS = [
  {
    name: "التجربة المجانية",
    sub: "ديمو محدود",
    price: "0",
    unit: "مجانًا",
    cta: "ابدأ الفحص المجاني",
    popular: false,
    features: [
      "فحص واحد يوميًا",
      "النتيجة الإجمالية فقط",
      "أبرز ٣ توصيات",
      "بدون تسجيل",
    ],
    missing: ["تقرير تفصيلي كامل", "تحليل المنافسين", "دعم أولوية"],
  },
  {
    name: "الباقة الاحترافية للحيتان",
    sub: "Professional Whale Tier",
    price: "499",
    unit: "ريال / شهريًا",
    cta: "اشترك الآن",
    popular: true,
    features: [
      "فحوصات غير محدودة",
      "تقرير تفصيلي كامل بالتوصيات",
      "تحليل نفسي للمشتري الخليجي والمصري",
      "مقارنة بصفحات المنافسين",
      "تصدير التقرير PDF",
      "دعم أولوية عبر واتساب",
    ],
    missing: [],
  },
];

function PricingTable({ onFreeTier }: { onFreeTier: () => void }) {
  function handlePayment(plan: string) {
    // 🔌 نقطة ربط الدفع لاحقًا (Tap / Paymob / Stripe ...)
    alert(`سيتم توجيهك لإتمام الاشتراك في: ${plan}\n(نقطة ربط بوابة الدفع — قيد الإعداد)`);
  }

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-accent/40 bg-[#FCF2E0] px-4 py-1.5 text-sm font-semibold text-amber-accent">
          الأسعار
        </span>
        <h2 className="mt-5 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
          استثمار صغير مقابل ميزانية إعلانية لا تُهدر
        </h2>
        <p className="mt-4 text-lg text-ink-soft">
          ابدأ مجانًا، ثم انتقل للباقة الاحترافية حين تكون جاهزًا لمضاعفة تحويلاتك.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl items-start gap-6 md:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-[28px] p-8 transition-all duration-500 ${
              plan.popular
                ? "border-2 border-transparent bg-ink text-cream shadow-card [background:linear-gradient(#0E1116,#0E1116)_padding-box,linear-gradient(135deg,#34D399,#E8A33D)_border-box] md:-translate-y-3 md:hover:-translate-y-4"
                : "border border-ink/10 bg-white/80 text-ink shadow-soft backdrop-blur-sm hover:-translate-y-1"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 right-8 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-l from-emerald to-amber-accent px-4 py-1.5 font-display text-xs font-bold text-white shadow-glow">
                <StarIcon /> الأكثر اختيارًا
              </span>
            )}

            <div className="flex items-baseline justify-between">
              <div>
                <h3 className={`font-display text-xl font-extrabold ${plan.popular ? "text-cream" : "text-ink"}`}>{plan.name}</h3>
                <p className={`mt-1 text-xs ${plan.popular ? "text-cream/60" : "text-ink-muted"}`} dir="ltr">{plan.sub}</p>
              </div>
            </div>

            <div className="mt-6 flex items-end gap-2">
              <span className="font-display text-5xl font-black tabular-nums">{plan.price}</span>
              <span className={`mb-1.5 text-sm ${plan.popular ? "text-cream/70" : "text-ink-muted"}`}>{plan.unit}</span>
            </div>

            <button
              onClick={() => (plan.popular ? handlePayment(plan.name) : onFreeTier())}
              className={`mt-7 w-full rounded-full py-3.5 font-display text-base font-bold transition ${
                plan.popular
                  ? "bg-gradient-to-l from-emerald to-emerald-dark text-white shadow-[0_10px_24px_-8px_rgba(15,157,107,0.7)] hover:shadow-[0_14px_30px_-8px_rgba(15,157,107,0.9)]"
                  : "border border-ink/15 bg-cream text-ink hover:border-ink/30"
              }`}
            >
              {plan.cta}
            </button>

            <ul className="mt-8 space-y-3.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <span className={`mt-0.5 shrink-0 ${plan.popular ? "text-emerald-ring" : "text-emerald"}`}>
                    <Check light={plan.popular} />
                  </span>
                  <span className={plan.popular ? "text-cream/90" : "text-ink-soft"}>{f}</span>
                </li>
              ))}
              {plan.missing.map((m) => (
                <li key={m} className="flex items-start gap-3 text-sm opacity-50">
                  <span className="mt-0.5 shrink-0 text-ink-muted"><XIcon /></span>
                  <span className="text-ink-muted line-through">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   5) الأسئلة الشائعة (Accordion)
   ============================================================ */
const FAQS = [
  {
    q: "هل الفحص حقيقي أم مجرد نتائج عشوائية؟",
    a: "الفحص حقيقي بالكامل. يقرأ الذكاء الاصطناعي محتوى صفحتك فعليًا — العنوان، النصوص، أزرار الشراء، وعناصر الثقة — ويقيّمها وفق مبادئ تحسين معدلات التحويل (CRO) المثبتة، ثم يعطيك توصيات مخصّصة لصفحتك تحديدًا وليست نصائح عامة.",
  },
  {
    q: "كيف يساعدني الذكاء الاصطناعي في توفير ميزانية الإعلانات؟",
    a: "أغلب المعلنين يضخّون ميزانية على إعلانات تجلب زيارات، لكن الصفحة نفسها لا تحوّل هذه الزيارات إلى مبيعات. بإصلاح نقاط الضعف التي نكشفها، ترتفع نسبة التحويل من نفس عدد الزيارات — أي مبيعات أكثر بنفس الإنفاق الإعلاني، وأحيانًا بإنفاق أقل.",
  },
  {
    q: "هل الأداة مناسبة للسوق الخليجي والمصري تحديدًا؟",
    a: "نعم، هذا جوهر تميّزنا. التحليل مبني على عقلية المشتري العربي: أهمية التواصل المباشر عبر واتساب، الثقة في طرق الدفع المحلية والدفع عند الاستلام، ودور التقييمات والمصداقية في قرار الشراء لدى عملاء الخليج ومصر.",
  },
  {
    q: "هل أحتاج خبرة تقنية لتطبيق التوصيات؟",
    a: "إطلاقًا. التوصيات مكتوبة بلغة واضحة وعملية، وكل توصية قابلة للنسخ بضغطة زر. سواء كنت تستخدم سلة أو زد أو شوبيفاي أو صفحة خاصة، يمكنك تطبيق التغييرات بنفسك أو تسليمها لفريقك مباشرة.",
  },
  {
    q: "ما الفرق بين النسخة المجانية والباقة الاحترافية؟",
    a: "النسخة المجانية تعطيك النتيجة الإجمالية وأبرز التوصيات لتجربة الأداة. الباقة الاحترافية تفتح التقرير التفصيلي الكامل، تحليل المنافسين، تصدير PDF، وفحوصات غير محدودة — وهي الأنسب لمن يدير حملات إعلانية بشكل جادّ.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-sand/40 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-4 py-1.5 text-sm font-semibold text-ink-soft">
            الأسئلة الشائعة
          </span>
          <h2 className="mt-5 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
            كل ما تريد معرفته قبل أن تبدأ
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`overflow-hidden rounded-2xl border bg-white/80 shadow-soft backdrop-blur-sm transition-colors ${isOpen ? "border-emerald/30" : "border-ink/10"}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg font-bold text-ink">{item.q}</span>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${isOpen ? "rotate-180 border-emerald bg-emerald text-white" : "border-ink/15 text-ink-soft"}`}>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </button>
                <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 leading-relaxed text-ink-soft">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   6) التذييل
   ============================================================ */
function Footer() {
  const cols = [
    { title: "المنتج", links: ["كيف يعمل", "ماذا نفحص", "الأسعار", "الأسئلة الشائعة"] },
    { title: "الشركة", links: ["من نحن", "المدوّنة", "تواصل معنا", "الوظائف"] },
    { title: "قانوني", links: ["سياسة الخصوصية", "شروط الاستخدام", "سياسة الاسترجاع"] },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(40rem 30rem at 80% -10%, #0F9D6B, transparent 60%), radial-gradient(36rem 28rem at -5% 10%, #E8A33D, transparent 55%)" }} />
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cream text-ink">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight">
                Auditor<span className="text-emerald-ring">.ai</span>
              </span>
            </div>
            <p className="mt-5 max-w-xs leading-relaxed text-cream/60">
              أداة ذكاء اصطناعي لفحص صفحات الهبوط ومضاعفة التحويلات، مصمّمة خصيصًا لعقلية المشتري في الخليج ومصر.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-bold tracking-wide text-cream/90">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-cream/55 transition hover:text-emerald-ring">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 sm:flex-row">
          <p className="text-sm text-cream/50">© {new Date().getFullYear()} Auditor.ai — جميع الحقوق محفوظة.</p>
          <p className="text-sm text-cream/50">صُنع بشغف للسوق العربي 🚀</p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   شارات وأيقونات الـ severity
   ============================================================ */
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

/* ============================================================
   أيقونات (Inline SVG)
   ============================================================ */
function Check({ light = false }: { light?: boolean }) {
  return (
    <svg className={`h-4 w-4 ${light ? "text-current" : "text-emerald"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
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
function LinkIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  );
}
function BrainIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 0 0-3 3 3 3 0 0 0-3 3 3 3 0 0 0 0 6 3 3 0 0 0 6 0Z" />
      <path d="M12 5a3 3 0 0 1 3 3 3 3 0 0 1 3 3 3 3 0 0 1 0 6 3 3 0 0 1-6 0Z" />
    </svg>
  );
}
function RocketIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    </svg>
  );
}
function PenIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="m2 2 7.586 7.586" /><circle cx="11" cy="11" r="2" />
    </svg>
  );
}
function CursorIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /><path d="m13 13 6 6" />
    </svg>
  );
}
function ShieldCheckIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
    </svg>
  );
}

/* ============================================================
   مساعدات منطقية
   ============================================================ */
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
