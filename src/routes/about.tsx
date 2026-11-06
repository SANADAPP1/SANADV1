import { createFileRoute, Link } from "@tanstack/react-router";

import logo from "@/assets/sanad-primary-logo.jpg.asset.json";
import { BrandIcon } from "@/components/site/brand";
import { PublicPage } from "@/components/site/public-page";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن منصة سند — تسيير العمارات في الجزائر" },
      {
        name: "description",
        content: "سند منصة رقمية لتنظيم صناديق العمارات والمساهمات والمصاريف والمشاريع ولقاءات الجيران بشفافية.",
      },
      { property: "og:title", content: "عن منصة سند" },
      { property: "og:description", content: "روح الجيرة الجزائرية، بأدوات مالية واضحة وموثقة." },
    ],
  }),
  component: AboutPage,
});

const STEPS = [
  { n: "1", t: "الماستر ينشئ العمارة", d: "ويعيّن أدمنها ويصدر أكواد الدخول للسكان." },
  { n: "2", t: "السكان يدخلون بالكود", d: "كل ساكن يُربط بعمارته، ويرى ما يخص عمارته فقط." },
  { n: "3", t: "الأدمن يسجل التحصيل", d: "الدفع نقداً يداً بيد، ثم يُسجَّل في التطبيق مع الوصل." },
  { n: "4", t: "الجميع يتابع الصندوق", d: "الرصيد، المصاريف وأسبابها، والمشاريع واللقاءات القادمة." },
];

function AboutPage() {
  return (
    <PublicPage>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1fr_auto] md:items-center md:py-20">
        <div>
          <p className="text-sm font-medium text-terracotta">عن المنصة</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-forest md:text-5xl">
            «سند» — لأن الجار سند لجاره
          </h1>
          <p className="mt-5 max-w-xl leading-8 text-muted-foreground">
            سند منصة ويب لإدارة العمارات السكنية في الجزائر: تنظيم صندوق العمارة، تتبع المساهمات والمصاريف
            بشفافية، وتسيير مشاريع الحي ولقاءات الجيران. مصممة للهاتف أولاً، وبالعربية أولاً.
          </p>
        </div>
        <img
          src={logo.url}
          alt="شعار سند الرئيسي"
          className="mx-auto w-56 rounded-3xl border border-border shadow-card md:w-72"
        />
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 className="text-2xl font-bold text-forest md:text-3xl">كيف يعمل سند؟</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-2xl border border-border bg-background p-5">
                <span className="num grid size-9 place-items-center rounded-lg bg-forest text-sm font-bold text-on-dark">
                  {s.n}
                </span>
                <h3 className="mt-4 font-semibold text-forest">{s.t}</h3>
                <p className="mt-1.5 text-sm leading-7 text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="text-2xl font-bold text-forest md:text-3xl">تصنيفات المصاريف والمشاريع</h2>
        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 md:max-w-xl">
          {(
            [
              ["garden", "تشجير"],
              ["security", "قفل وأمن"],
              ["painting", "طلاء ونظافة"],
            ] as const
          ).map(([icon, label]) => (
            <div key={icon} className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <BrandIcon name={icon} className="size-16" />
              <span className="text-sm font-medium text-forest">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Button asChild size="lg">
            <Link to="/help">الأسئلة الشائعة</Link>
          </Button>
        </div>
      </section>
    </PublicPage>
  );
}
