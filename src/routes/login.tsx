import { createFileRoute, Link } from "@tanstack/react-router";
import { Info } from "lucide-react";

import { SanadMark } from "@/components/site/brand";
import { PublicPage } from "@/components/site/public-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "الدخول إلى سند" },
      { name: "description", content: "سجّل الدخول إلى حسابك في منصة سند لمتابعة صندوق عمارتك." },
      { property: "og:title", content: "الدخول إلى سند" },
      { property: "og:description", content: "ادخل إلى عمارتك على منصة سند." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <PublicPage>
      <section className="window-grid relative px-4 py-12 md:py-20">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-lift md:p-8">
          <div className="flex flex-col items-center text-center">
            <SanadMark className="size-14 rounded-2xl" />
            <h1 className="mt-4 text-2xl font-bold text-forest">الدخول إلى عمارتك</h1>
            <p className="mt-1 text-sm text-muted-foreground">بالبريد الإلكتروني وكلمة المرور</p>
          </div>

          <div className="mt-6 flex gap-3 rounded-xl bg-pending-soft p-4 text-sm text-pending">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p>الدخول غير مفعّل بعد. سيُفتح فور ربط قاعدة بيانات المنصة.</p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()} aria-disabled="true">
            <fieldset disabled className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" dir="ltr" placeholder="name@example.com" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" dir="ltr" className="h-11" />
              </div>
              <Button type="submit" size="xl" className="w-full">
                دخول
              </Button>
            </fieldset>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ليس لديك حساب؟ اطلب كود دعوة من أدمن عمارتك.{" "}
            <Link to="/help" className="font-medium text-forest underline underline-offset-4">
              المساعدة
            </Link>
          </p>
        </div>
      </section>
    </PublicPage>
  );
}
