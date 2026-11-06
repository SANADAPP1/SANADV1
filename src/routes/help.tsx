import { createFileRoute } from "@tanstack/react-router";

import { PublicPage } from "@/components/site/public-page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "المساعدة والأسئلة الشائعة — سند" },
      { name: "description", content: "إجابات عن الاشتراك السنوي، صندوق العمارة، أكواد الدخول، والخصوصية في منصة سند." },
      { property: "og:title", content: "المساعدة والأسئلة الشائعة — سند" },
      { property: "og:description", content: "كل ما تحتاج معرفته لاستعمال منصة سند في عمارتك." },
    ],
  }),
  component: HelpPage,
});

const FAQ = [
  {
    q: "ما الفرق بين اشتراك التطبيق وصندوق العمارة؟",
    a: "اشتراك التطبيق هو 500 دج سنوياً لكل حساب ساكن أو أدمن، يُدفع لصاحب المنصة ويحدد أهلية استعمال الحساب. صندوق العمارة هو مساهمات السكان التي يحددها أدمن العمارة لتمويل مصاريفها ومشاريعها، ولا علاقة له باشتراك التطبيق.",
  },
  {
    q: "كيف أحصل على حساب؟",
    a: "الدخول يتم بكود دعوة يصدره ماستر المنصة، أو أدمن عمارتك إذا فُعّلت له هذه الصلاحية. اطلب الكود من أدمن عمارتك.",
  },
  {
    q: "هل يمكنني الدفع عبر التطبيق؟",
    a: "ليس في النسخة الأولى. الدفع يكون نقداً يداً بيد مع أدمن العمارة، ثم يسجل الأدمن العملية في التطبيق ويرفق الوصل عند توفره.",
  },
  {
    q: "هل يرى جيراني كم دفعت؟",
    a: "لا. كل ساكن يرى دفعاته هو فقط، إضافة إلى مجموع الصندوق ومصاريفه وأسبابها. لا يرى أحد مبالغ جيرانه ولا أسماء المتأخرين في الدفع.",
  },
  {
    q: "ماذا لو أخطأ الأدمن في تسجيل مبلغ؟",
    a: "القيود المالية لا تُحذف ولا تُعدّل بصمت. يُصحَّح الخطأ بقيد عكسي أو تصحيحي جديد مرتبط بالأصل، مع ذكر السبب ومن قام به وتاريخه.",
  },
  {
    q: "ماذا يحدث عند انتهاء اشتراكي السنوي؟",
    a: "تظهر لك واجهة محجوبة تمنع استعمال المزايا حتى التجديد، لكن بياناتك وسجلاتك تبقى محفوظة بالكامل ولا يُحذف أي شيء.",
  },
  {
    q: "كيف يُحسب التصويت في الفعاليات؟",
    a: "تُحسب النتيجة من السكان الذين صوّتوا خلال مدة التصويت (48 ساعة افتراضياً). أدمن العمارة يحدد نسبة النجاح لكل فعالية عند إنشائها، مثل 50% أو 70%.",
  },
];

function HelpPage() {
  return (
    <PublicPage>
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <p className="text-sm font-medium text-terracotta">المساعدة</p>
        <h1 className="mt-3 text-4xl font-bold text-forest md:text-5xl">الأسئلة الشائعة</h1>
        <p className="mt-4 text-muted-foreground">إجابات مختصرة عن أكثر ما يسأل عنه السكان والأدمنات.</p>
        <Accordion type="single" collapsible className="mt-10 rounded-2xl border border-border bg-card px-5">
          {FAQ.map((item, i) => (
            <AccordionItem key={item.q} value={`q-${i}`}>
              <AccordionTrigger className="text-start text-base font-semibold text-forest hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="leading-8 text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </PublicPage>
  );
}
