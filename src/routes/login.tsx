import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

import { SanadMark } from "@/components/site/brand";
import { PublicPage } from "@/components/site/public-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";

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
  const { session, user, signOut } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg("يرجى ملء البريد الإلكتروني وكلمة المرور.");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMsg("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMsg("يرجى تأكيد بريدك الإلكتروني أولاً عبر الرابط المرسل إليك.");
        } else {
          setErrorMsg(error.message || "فشل تسجيل الدخول. يرجى المحاولة لاحقاً.");
        }
        return;
      }

      if (data.session) {
        setSuccessMsg("تم تسجيل الدخول بنجاح! جاري توجيهك...");
        setTimeout(() => {
          navigate({ to: "/" });
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicPage>
      <section className="window-grid relative px-4 py-12 md:py-20">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-lift md:p-8">
          <div className="flex flex-col items-center text-center">
            <SanadMark className="size-14 rounded-2xl" />
            <h1 className="mt-4 text-2xl font-bold text-forest">الدخول إلى عمارتك</h1>
            <p className="mt-1 text-sm text-muted-foreground">بالبريد الإلكتروني وكلمة المرور</p>
          </div>

          {session && user ? (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-success-soft p-4 text-sm text-forest">
                <CheckCircle2 className="size-5 shrink-0 text-teal" />
                <div>
                  <p className="font-semibold">أنت مسجل الدخول حالياً</p>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link to="/">الرئيسية</Link>
                </Button>
                <Button variant="outline" onClick={() => signOut()} className="flex-1">
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="mt-6 flex items-start gap-3 rounded-xl bg-expense-soft p-4 text-sm text-expense animate-rise">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {successMsg && (
                <div className="mt-6 flex items-start gap-3 rounded-xl bg-success-soft p-4 text-sm text-forest animate-rise">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" />
                  <p>{successMsg}</p>
                </div>
              )}

              <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    dir="ltr"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-11 text-start"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">كلمة المرور</Label>
                  </div>
                  <div className="relative" dir="ltr">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      dir="ltr"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="h-11 pr-10 text-start"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-forest"
                      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" size="xl" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="me-2 size-4 animate-spin" />
                      جاري الدخول...
                    </>
                  ) : (
                    "دخول"
                  )}
                </Button>
              </form>
            </>
          )}

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
