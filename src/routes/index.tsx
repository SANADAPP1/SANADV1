import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Eye, EyeOff, Lock, ShieldCheck, Undo2 } from "lucide-react";

import { BrandIcon, SanadMark, type BrandIconName } from "@/components/site/brand";
import { PublicPage } from "@/components/site/public-page";
import { Button } from "@/components/ui/button";
import { formatDZD } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سند — تسيير العمارات وصندوق السكان بشفافية" },
      {
        name: "description",
        content:
          "سند منصة جزائرية لإدارة العمارات: صندوق السكان، الاشتراكات، المصاريف، المشاريع والفعاليات، بسجل مالي شفاف لا يُحذف.",
      },
      { property: "og:title", content: "سند — تسيير العمارات وصندوق السكان" },
      {
        property: "og:description",
        content: "صندوق العمارة، المشاريع واللقاءات في مكان واحد، بشفافية تحترم خصوصية الجيران.",
      },
    ],
  }),
  component: Index,
});

const FEATURES: { icon: BrandIconName; title: string; text: string }[] = [
  { icon: "fund", title: "صندوق العمارة", text: "المداخيل والمصاريف والرصيد الحالي، واضحة لكل السكان." },
  { icon: "ledger", title: "سجل مالي لا يُحذف", text: "كل قيد موثق بالتاريخ والمسجّل والوصل، والخطأ يُصحَّح بقيد جديد." },
  { icon: "residents", title: "السكان والأدوار", text: "ماستر، أدمن لكل عمارة، وسكان؛ كلٌّ يرى ما يخصه فقط." },
  { icon: "projects", title: "مشاريع ممولة", text: "تشجير، قفل الباب، طلاء المدخل… بميزانية ونسبة إنجاز." },
  { icon: "events", title: "لقاءات السكان", text: "موعد ومكان وموضوع واضح، مع تأكيد الحضور أو الاعتذار." },
  { icon: "voting", title: "تصويت بعتبة نجاح", text: "مدة تصويت محددة (48 ساعة افتراضياً) ونسبة نجاح يختارها الأدمن." },
];

const ROLES = [
  {
    name: "الماستر",
    tag: "مالك المنصة",
    points: ["يدير كل العمارات وأدمناتها", "يصدر أكواد الدخول", "يفعّل الاشتراكات السنوية"],
  },
  {
    name: "أدمن العمارة",
    tag: "لعمارته فقط",
    points: ["يسجل الدفعات النقدية والمصاريف", "يرفق الوصولات والصور", "ينشئ المشاريع والفعاليات"],
  },
  {
    name: "الساكن",
    tag: "شفافية وخصوصية",
    points: ["يرى رصيد ومصاريف العمارة", "يرى دفعاته هو فقط", "يؤكد حضوره ويصوّت"],
  },
];

function Index() {
  return (
    <PublicPage>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="window-grid absolute inset-0 [mask-image:radial-gradient(80%_70%_at_70%_30%,black,transparent)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pb-24 md:pt-20">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-forest">
              <span className="size-1.5 rounded-full bg-teal" />
              منصة لتسيير العمارات وصندوق السكان
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.25] text-forest md:text-6xl md:leading-[1.2]">
              عمارتك، بحسابات واضحة
              <br />
              <span className="text-terracotta">وجيرة أقوى.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-muted-foreground md:text-lg">
              سند يجمع صندوق العمارة، الاشتراكات، المصاريف، المشاريع ولقاءات السكان في مكان واحد —
              بسجل شفاف لا يُمحى، ودون كشف دفعات جيرانك.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="xl">
                <Link to="/login">
                  الدخول إلى عمارتي
                  <ArrowLeft />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to="/about">كيف يعمل سند؟</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              اشتراك الحساب: <span className="num font-semibold text-forest">500</span> دج سنوياً فقط.
            </p>
          </div>

          <HeroPreview />
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-forest md:text-4xl">كل ما تحتاجه عمارتك</h2>
            <p className="mt-3 text-muted-foreground">من الدفعة الأولى إلى آخر مشروع — منظم وموثق.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="group flex gap-4 rounded-2xl border border-border bg-background p-5 transition-shadow hover:shadow-card"
              >
                <BrandIcon name={f.icon} className="size-14 rounded-xl" />
                <div>
                  <h3 className="font-semibold text-forest">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-7 text-muted-foreground">{f.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Two kinds of money */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-forest md:text-4xl">نوعان من الأموال، لا يختلطان أبداً</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          اشتراك استعمال التطبيق شيء، وصندوق العمارة شيء آخر تماماً. سند يفصل بينهما في كل شاشة.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="surface-dark relative overflow-hidden rounded-3xl p-7 shadow-lift">
            <div className="window-grid-dark absolute inset-0 opacity-60" />
            <div className="relative">
              <p className="text-sm text-on-dark-muted">اشتراك التطبيق</p>
              <p className="mt-2 text-4xl font-bold">
                <span className="num">500</span> دج <span className="text-base font-medium text-on-dark-muted">/ سنوياً</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-on-dark-muted">
                <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-teal" />لكل حساب ساكن أو أدمن، يُدفع لصاحب المنصة</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-teal" />يحدد أهلية استعمال الحساب، ولا يدخل في صندوق العمارة</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-teal" />عند انتهائه تبقى بياناتك وسجلاتك محفوظة بالكامل</li>
              </ul>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-7 shadow-card">
            <p className="text-sm text-muted-foreground">صندوق العمارة</p>
            <p className="mt-2 text-4xl font-bold text-forest">مساهمات السكان</p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-teal" />أدمن العمارة يحدد قيمة الاشتراك الدوري، ويُحسب على كل ساكن</li>
              <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-teal" />التحصيل نقداً يداً بيد، والأدمن يسجل كل دفعة مع وصلها</li>
              <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-teal" />يمول المصاريف والمشاريع: قفل، نظافة، تشجير، طلاء، إنارة</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h2 className="text-3xl font-bold text-forest md:text-4xl">لكل دور لوحته الخاصة</h2>
          <p className="mt-3 text-muted-foreground">لا أزرار غير مسموحة، ولا معلومات لا تخصك.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {ROLES.map((r, i) => (
              <article key={r.name} className="rounded-2xl border border-border bg-background p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-forest">{r.name}</h3>
                  <span
                    className={
                      i === 0
                        ? "rounded-full bg-forest px-2.5 py-1 text-xs font-medium text-on-dark"
                        : i === 1
                          ? "rounded-full bg-pending-soft px-2.5 py-1 text-xs font-medium text-pending"
                          : "rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-forest"
                    }
                  >
                    {r.tag}
                  </span>
                </div>
                <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                  {r.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-teal" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-forest md:text-4xl">شفافية، بدون كشف خصوصية أحد</h2>
            <p className="mt-3 leading-8 text-muted-foreground">
              السكان يرون مجموع الصندوق ومصاريفه وأسبابها. أما المبالغ الشخصية فتبقى بين الساكن والأدمن.
            </p>
          </div>
          <ul className="grid gap-3">
            {[
              { icon: Lock, t: "القيود المالية لا تُحذف ولا تُعدّل بصمت" },
              { icon: Undo2, t: "الخطأ يُصحَّح بقيد عكسي مرتبط بالأصل، مع السبب والتاريخ" },
              { icon: EyeOff, t: "لا أحد يرى دفعات جيرانه ولا أسماء المتأخرين" },
              { icon: Eye, t: "الوصولات محفوظة بشكل خاص لأصحاب الصلاحية فقط" },
              { icon: ShieldCheck, t: "عزل تام بين العمارات على مستوى قاعدة البيانات" },
            ].map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium text-forest">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary">
                  <Icon className="size-4 text-forest" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 md:pb-24">
        <div className="surface-dark relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-12 text-center md:py-16">
          <div className="window-grid-dark absolute inset-0" />
          <div className="relative flex flex-col items-center">
            <SanadMark variant="dark" className="size-16 rounded-2xl ring-1 ring-on-dark/10" />
            <h2 className="mt-6 text-3xl font-bold md:text-4xl">جاهز لتنظيم عمارتك؟</h2>
            <p className="mt-3 max-w-md text-on-dark-muted">
              الدخول يتم بكود دعوة يصلك من أدمن عمارتك أو من إدارة المنصة.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="xl" variant="hero">
                <Link to="/login">الدخول</Link>
              </Button>
              <Button asChild size="xl" variant="on-dark">
                <Link to="/help">الأسئلة الشائعة</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm animate-rise [animation-delay:150ms]" aria-label="مثال توضيحي للوحة الساكن">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-secondary/70 blur-2xl" />
      <div className="rounded-3xl border border-border bg-card p-5 pb-10 shadow-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">رصيد صندوق العمارة</p>
            <p className="text-xs text-muted-foreground">عمارة الياسمين 14 — وهران</p>
          </div>
          <BrandIcon name="fund" className="size-11" />
        </div>
        <p className="num mt-4 text-end text-4xl font-bold text-forest" dir="ltr">
          {(124500).toLocaleString("en-US")}
          <span className="ms-1.5 text-lg font-semibold">DZD</span>
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-success-soft p-3">
            <p className="text-xs text-muted-foreground">المداخيل</p>
            <p className="num text-sm font-semibold text-forest">+ {formatDZD(180000)}</p>
          </div>
          <div className="rounded-xl bg-expense-soft p-3">
            <p className="text-xs text-muted-foreground">المصاريف</p>
            <p className="num text-sm font-semibold text-expense">− {formatDZD(55500)}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2 border-t border-border pt-4">
          <Row title="مساهمة دورية" sub="اشتراك دوري · 05 نوفمبر" amount="+ 3,500 دج" positive />
          <Row title="تصليح قفل الباب الرئيسي" sub="قفل · 02 نوفمبر" amount="− 4,200 دج" />
        </div>
      </div>

      <div className="relative -mt-6 me-[-1rem] ms-10 rounded-2xl border border-border bg-card p-4 shadow-card md:me-[-2.5rem]">
        <div className="flex items-start gap-3">
          <BrandIcon name="events" className="size-10" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-forest">اجتماع سكان العمارة</p>
            <p className="text-xs text-muted-foreground">الأحد 10 نوفمبر · <span className="num">20:00</span> · مدخل العمارة</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <span className="rounded-lg bg-forest py-2 text-center text-xs font-semibold text-on-dark">سأحضر</span>
          <span className="rounded-lg border border-border py-2 text-center text-xs font-medium text-muted-foreground">لن أحضر</span>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">مثال توضيحي</p>
    </div>
  );
}

function Row({ title, sub, amount, positive }: { title: string; sub: string; amount: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-forest">{title}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <span className={positive ? "num shrink-0 text-sm font-semibold text-teal" : "num shrink-0 text-sm font-semibold text-expense"}>
        {amount}
      </span>
    </div>
  );
}
