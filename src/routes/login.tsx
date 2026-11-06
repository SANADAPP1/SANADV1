import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  UserCheck,
  ArrowRight,
} from "lucide-react";
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
      { title: "الدخول إلى منصة سند | الدخول الموحد للماستر والسكان" },
      { name: "description", content: "سجّل الدخول إلى حسابك في منصة سند لمتابعة صندوق عمارتك أو إدارة النظام." },
      { property: "og:title", content: "الدخول إلى منصة سند" },
      { property: "og:description", content: "ادخل إلى عمارتك على منصة سند." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { session, user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isAdminMode, setIsAdminMode] = useState(true); // default to master admin convenience
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState<string>("/admin");

  const determineRedirect = (userEmail: string, userRole?: string) => {
    // If the user email contains admin or role is admin or master mode is selected
    if (
      isAdminMode ||
      userRole === "admin" ||
      userEmail.toLowerCase().includes("admin") ||
      userEmail.toLowerCase().includes("alamara") ||
      userEmail.toLowerCase().includes("master")
    ) {
      return "/admin";
    }
    return "/admin"; // always direct to admin dashboard for full control
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg("يرجى ملء البريد الإلكتروني وكلمة المرور.");
      return;
    }

    try {
      setLoading(true);

      if (mode === "signup") {
        // Register new user (e.g. Master Admin or manager)
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName || (isAdminMode ? "المدير العام (Master Admin)" : "مقيم جديد"),
              role: isAdminMode ? "admin" : "resident",
            },
          },
        });

        if (error) {
          setErrorMsg(error.message || "فشل إنشاء الحساب.");
          return;
        }

        const target = determineRedirect(email.trim());
        setRedirectPath(target);
        setSuccessMsg("تم إنشاء الحساب بنجاح! جاري تحويلك إلى لوحة التحكم الرئيسية...");

        setTimeout(() => {
          navigate({ to: target as any });
        }, 800);
      } else {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setErrorMsg("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
          } else if (error.message.includes("Email not confirmed")) {
            // In case Supabase email confirmation is enabled, notify user
            setErrorMsg("يرجى تأكيد بريدك الإلكتروني أولاً أو تعطيل تأكيد الإيميل في Supabase Settings.");
          } else {
            setErrorMsg(error.message || "فشل تسجيل الدخول. يرجى المحاولة لاحقاً.");
          }
          return;
        }

        if (data.session) {
          const target = determineRedirect(data.user?.email || email.trim());
          setRedirectPath(target);
          setSuccessMsg("تم تسجيل الدخول بنجاح! جاري تحويلك إلى لوحة الإدارة...");
          setTimeout(() => {
            navigate({ to: target as any });
          }, 800);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const isMasterUser =
    user?.email?.toLowerCase().includes("admin") ||
    user?.email?.toLowerCase().includes("alamara") ||
    profile?.role === "admin";

  return (
    <PublicPage>
      <section className="window-grid relative px-4 py-10 md:py-16">
        <div className="mx-auto w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-lift md:p-8">
          <div className="flex flex-col items-center text-center">
            <SanadMark className="size-14 rounded-2xl" />
            <h1 className="mt-4 text-2xl font-bold text-forest">
              {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              بوابة الدخول الموحدة للماستر أدمن، مسيري العمارات والمقيمين
            </p>
          </div>

          {session && user ? (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-success-soft p-4 text-sm text-forest">
                <CheckCircle2 className="size-6 shrink-0 text-teal" />
                <div>
                  <p className="font-bold">أنت مسجل الدخول حالياً</p>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {user.email}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-teal">
                    الصفة: {isMasterUser ? "المدير العام (Master Admin)" : "مستخدم مصرح"}
                  </p>
                </div>
              </div>

              {/* Direct Access Buttons */}
              <div className="flex flex-col gap-2">
                <Button asChild size="lg" className="w-full bg-forest text-sand gap-2 font-bold">
                  <Link to="/admin">
                    <ShieldCheck className="size-5" />
                    الدخول المباشر إلى لوحة تحكم المدير العام (Master Admin)
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/">الصفحة الرئيسية</Link>
                  </Button>
                  <Button variant="outline" onClick={() => signOut()} className="flex-1 text-expense">
                    تسجيل الخروج
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Account Type Toggle */}
              <div className="mt-6 flex rounded-xl bg-sand p-1 border border-border">
                <button
                  type="button"
                  onClick={() => setIsAdminMode(true)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-colors ${
                    isAdminMode ? "bg-forest text-sand shadow-sm" : "text-muted-foreground hover:text-forest"
                  }`}
                >
                  <ShieldCheck className="size-4" />
                  حساب ماستر أدمن (إدارة شاملة)
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdminMode(false)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-colors ${
                    !isAdminMode ? "bg-forest text-sand shadow-sm" : "text-muted-foreground hover:text-forest"
                  }`}
                >
                  <UserCheck className="size-4" />
                  ساكن / مالك شقة
                </button>
              </div>

              {/* Mode Toggle (Login vs Register) */}
              <div className="mt-4 flex justify-center gap-4 text-xs font-semibold border-b border-border pb-3">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`pb-1 ${mode === "login" ? "border-b-2 border-forest text-forest font-bold" : "text-muted-foreground"}`}
                >
                  تسجيل الدخول
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`pb-1 ${mode === "signup" ? "border-b-2 border-forest text-forest font-bold" : "text-muted-foreground"}`}
                >
                  إنشاء حساب ماستر جديد
                </button>
              </div>

              {errorMsg && (
                <div className="mt-4 flex items-start gap-3 rounded-xl bg-expense-soft p-4 text-sm text-expense animate-rise">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {successMsg && (
                <div className="mt-4 space-y-3 rounded-xl bg-success-soft p-4 text-sm text-forest animate-rise">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" />
                    <div>
                      <p className="font-semibold">{successMsg}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">إذا لم يتم توجيهك تلقائياً اضغط الزر أدناه:</p>
                    </div>
                  </div>
                  <Button asChild size="sm" className="w-full bg-forest text-sand">
                    <Link to="/admin">
                      الانتقال إلى لوحة تحكم الماستر الآن
                      <ArrowRight className="ms-1 size-4" />
                    </Link>
                  </Button>
                </div>
              )}

              <form className="mt-4 space-y-4" onSubmit={handleAuth}>
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="fullname">الاسم الكامل</Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="مثال: المدير العام"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    dir="ltr"
                    placeholder="admin@alamara.dz"
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
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
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

                <Button type="submit" size="xl" className="w-full bg-forest text-sand hover:bg-forest-deep" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="me-2 size-4 animate-spin" />
                      جاري التنفيذ...
                    </>
                  ) : mode === "login" ? (
                    "دخول إلى لوحة التحكم"
                  ) : (
                    "إنشاء الحساب ودخول لوحة التحكم"
                  )}
                </Button>
              </form>

              {/* Fast Direct Bypass button for dev / preview convenience */}
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-xs text-forest hover:bg-forest/5"
                >
                  <Link to="/admin">
                    <ShieldCheck className="me-1.5 size-4 text-forest" />
                    معاينة لوحة تحكم الماستر مباشرة (Master Admin Dashboard)
                  </Link>
                </Button>
              </div>
            </>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            منصة سند المركزية لإدارة العمارات السكنية والاتحادات العقارية.{" "}
            <Link to="/help" className="font-medium text-forest underline underline-offset-4">
              مركز المساعدة
            </Link>
          </p>
        </div>
      </section>
    </PublicPage>
  );
}
