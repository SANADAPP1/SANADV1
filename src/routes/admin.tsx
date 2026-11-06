import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Users,
  Wallet,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  Search,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";

import { SanadLogo, SanadMark } from "@/components/site/brand";
import { PublicPage } from "@/components/site/public-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { supabase, type Building, type Profile, type Transaction } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة تحكم المدير العام (Master Admin) | منصة سند" },
      { name: "description", content: "إدارة كافة عمارات ومشاريع وسكان منصة سند المركزية." },
    ],
  }),
  component: MasterAdminPage,
});

interface StatsOverview {
  totalBuildings: number;
  totalResidents: number;
  totalTreasury: number;
  pendingRequests: number;
}

export function MasterAdminPage() {
  const { session, user, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"overview" | "buildings" | "residents" | "finance">("overview");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Live or fallback data
  const [buildings, setBuildings] = useState<Building[]>([
    {
      id: "b1",
      name: "إقامة الياسمين - عمارة أ",
      address: "حي 500 مسكن، باب الزوار، الجزائر",
      code: "YAS-01",
      total_units: 24,
      balance: 485000,
      created_at: new Date().toISOString(),
    },
    {
      id: "b2",
      name: "برج الأمل - عمارة ب",
      address: "شارع ديدوش مراد، سيدي امحمد، الجزائر",
      code: "AML-02",
      total_units: 36,
      balance: 720000,
      created_at: new Date().toISOString(),
    },
    {
      id: "b3",
      name: "إقامة الواحات - عمارة ج",
      address: "المنطقة الحضرية الجديدة، بئر مراد رايس",
      code: "WAH-03",
      total_units: 18,
      balance: 195000,
      created_at: new Date().toISOString(),
    },
  ]);

  const [residents, setResidents] = useState<Profile[]>([
    {
      id: "u1",
      full_name: "أحمد بن علي",
      phone: "0550 12 34 56",
      apartment_number: "شقة 12",
      role: "admin",
      building_id: "b1",
      created_at: new Date().toISOString(),
    },
    {
      id: "u2",
      full_name: "كريم بلقاسم",
      phone: "0661 78 90 12",
      apartment_number: "شقة 04",
      role: "resident",
      building_id: "b1",
      created_at: new Date().toISOString(),
    },
    {
      id: "u3",
      full_name: "مريم سلطاني",
      phone: "0770 45 67 89",
      apartment_number: "شقة 08",
      role: "resident",
      building_id: "b2",
      created_at: new Date().toISOString(),
    },
    {
      id: "u4",
      full_name: "يوسف بوزيد",
      phone: "0541 33 22 11",
      apartment_number: "شقة 15",
      role: "resident",
      building_id: "b3",
      created_at: new Date().toISOString(),
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "t1",
      building_id: "b1",
      type: "income",
      amount: 45000,
      description: "اشتراكات الصيانة الشهرية - مارس",
      date: "2025-03-01",
      status: "approved",
      category: "اشتراكات",
      created_at: new Date().toISOString(),
    },
    {
      id: "t2",
      building_id: "b1",
      type: "expense",
      amount: 18000,
      description: "صيانة المصعد الكهربائي وتغيير الكوابل",
      date: "2025-03-05",
      status: "approved",
      category: "صيانة",
      created_at: new Date().toISOString(),
    },
    {
      id: "t3",
      building_id: "b2",
      type: "income",
      amount: 60000,
      description: "اشتراكات النظافة والأمن - مارس",
      date: "2025-03-07",
      status: "approved",
      category: "اشتراكات",
      created_at: new Date().toISOString(),
    },
    {
      id: "t4",
      building_id: "b3",
      type: "expense",
      amount: 12500,
      description: "إصلاح تسرب مياه في المدخل الرئيسي",
      date: "2025-03-10",
      status: "pending",
      category: "إصلاحات",
      created_at: new Date().toISOString(),
    },
  ]);

  const [stats, setStats] = useState<StatsOverview>({
    totalBuildings: 3,
    totalResidents: 4,
    totalTreasury: 1400000,
    pendingRequests: 2,
  });

  const [newBuildingName, setNewBuildingName] = useState("");
  const [newBuildingAddress, setNewBuildingAddress] = useState("");
  const [newBuildingUnits, setNewBuildingUnits] = useState("");
  const [showAddBuilding, setShowAddBuilding] = useState(false);

  // Load from Supabase if connected
  const refreshData = async () => {
    setLoading(true);
    try {
      const { data: bData } = await supabase.from("buildings").select("*");
      if (bData && bData.length > 0) {
        setBuildings(bData as Building[]);
      }

      const { data: pData } = await supabase.from("profiles").select("*");
      if (pData && pData.length > 0) {
        setResidents(pData as Profile[]);
      }

      const { data: tData } = await supabase.from("transactions").select("*");
      if (tData && tData.length > 0) {
        setTransactions(tData as Transaction[]);
      }
    } catch (e) {
      console.warn("Could not load database records:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const totalTreasury = buildings.reduce((acc, curr) => acc + (curr.balance || 0), 0);
    const pendingReqs = transactions.filter((t) => t.status === "pending").length;
    setStats({
      totalBuildings: buildings.length,
      totalResidents: residents.length,
      totalTreasury,
      pendingRequests: pendingReqs,
    });
  }, [buildings, residents, transactions]);

  const handleAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuildingName.trim()) return;

    const newBuilding: Building = {
      id: `b_${Date.now()}`,
      name: newBuildingName.trim(),
      address: newBuildingAddress.trim() || "الجزائر",
      code: `SND-${Math.floor(100 + Math.random() * 900)}`,
      total_units: Number(newBuildingUnits) || 12,
      balance: 0,
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from("buildings").insert([newBuilding]);
    } catch {
      // ignore table absence
    }

    setBuildings([newBuilding, ...buildings]);
    setNewBuildingName("");
    setNewBuildingAddress("");
    setNewBuildingUnits("");
    setShowAddBuilding(false);
  };

  const handleApproveTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "approved" } : t)),
    );
  };

  const formatDZD = (val: number) => {
    return new Intl.NumberFormat("ar-DZ", { style: "currency", currency: "DZD", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <PublicPage>
      <div className="min-h-screen bg-sand-subtle pb-16 pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Admin Header Bar */}
          <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-forest/15 bg-card p-6 shadow-card md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-forest text-sand shadow-lift shrink-0">
                <ShieldCheck className="size-8 text-sand" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-forest">لوحة تحكم المدير العام (Master Admin)</h1>
                  <Badge variant="outline" className="border-forest/20 bg-forest/5 text-forest font-semibold">
                    إدارة شاملة
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  مرحباً بك {user?.email ? user.email : "المدير العام"} • إدارة كافة العمارات والسكان والصناديق المركزية
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loading}
                className="gap-2 rounded-xl"
              >
                <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
                تحديث البيانات
              </Button>
              <Button
                size="sm"
                className="gap-2 rounded-xl bg-forest text-white hover:bg-forest-deep"
                onClick={() => setShowAddBuilding(!showAddBuilding)}
              >
                <PlusCircle className="size-4 text-white" />
                <span className="text-white font-medium">إضافة عمارة جديدة</span>
              </Button>
              {session && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await signOut();
                    navigate({ to: "/login" });
                  }}
                  className="gap-2 text-expense hover:bg-expense/10"
                >
                  <LogOut className="size-4" />
                  خروج
                </Button>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-2xl border-border bg-card shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي العمارات المسجلة</CardTitle>
                <Building2 className="size-5 text-teal" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-forest">{stats.totalBuildings}</div>
                <p className="mt-1 text-xs text-muted-foreground">عمارات نشطة ومربوطة بالنظام</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المقيمين والملاك</CardTitle>
                <Users className="size-5 text-amber" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-forest">{stats.totalResidents}</div>
                <p className="mt-1 text-xs text-muted-foreground">حسابات مؤكدة في المنصة</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي رصيد الصناديق</CardTitle>
                <Wallet className="size-5 text-teal" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-forest">{formatDZD(stats.totalTreasury)}</div>
                <p className="mt-1 text-xs text-teal flex items-center gap-1 font-medium">
                  <TrendingUp className="size-3.5" />
                  محفظة مالية شفافة وآمنة
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">طلبات صيانة قيد المراجعة</CardTitle>
                <AlertTriangle className="size-5 text-expense" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-forest">{stats.pendingRequests}</div>
                <p className="mt-1 text-xs text-muted-foreground">تتطلب موافقة الصرف أو المتابعة</p>
              </CardContent>
            </Card>
          </div>

          {/* New Building Form Modal / Panel */}
          {showAddBuilding && (
            <Card className="mb-8 border-teal/40 bg-teal/5 p-6 rounded-3xl shadow-lift animate-rise">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg font-bold text-forest">إضافة عمارة سكنية جديدة إلى النظام</CardTitle>
                <CardDescription>أدخل معلومات العمارة لإنشاء كود اشتراك وتفعيل صندوقها المالي.</CardDescription>
              </CardHeader>
              <form onSubmit={handleAddBuilding} className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-forest">اسم العمارة أو الإقامة</label>
                  <Input
                    placeholder="مثال: إقامة الصنوبر - عمارة 4"
                    value={newBuildingName}
                    onChange={(e) => setNewBuildingName(e.target.value)}
                    required
                    className="mt-1 bg-card"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-forest">العنوان / الحي والبلدية</label>
                  <Input
                    placeholder="مثال: حيدرة، الجزائر العاصمة"
                    value={newBuildingAddress}
                    onChange={(e) => setNewBuildingAddress(e.target.value)}
                    className="mt-1 bg-card"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-forest">عدد الشقق (الوحدات)</label>
                  <Input
                    type="number"
                    placeholder="مثال: 24"
                    value={newBuildingUnits}
                    onChange={(e) => setNewBuildingUnits(e.target.value)}
                    className="mt-1 bg-card"
                  />
                </div>
                <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddBuilding(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit" className="bg-forest text-sand">
                    تأكيد وإضافة العمارة
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Navigation Tabs */}
          <div className="mb-6 flex gap-2 border-b border-border pb-3 overflow-x-auto">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              onClick={() => setActiveTab("overview")}
              className="rounded-xl gap-2 font-medium"
            >
              <ShieldCheck className="size-4" />
              نظرة عامة والتحكم
            </Button>
            <Button
              variant={activeTab === "buildings" ? "default" : "ghost"}
              onClick={() => setActiveTab("buildings")}
              className="rounded-xl gap-2 font-medium"
            >
              <Building2 className="size-4" />
              قائمة العمارات ({buildings.length})
            </Button>
            <Button
              variant={activeTab === "residents" ? "default" : "ghost"}
              onClick={() => setActiveTab("residents")}
              className="rounded-xl gap-2 font-medium"
            >
              <Users className="size-4" />
              إدارة السكان ({residents.length})
            </Button>
            <Button
              variant={activeTab === "finance" ? "default" : "ghost"}
              onClick={() => setActiveTab("finance")}
              className="rounded-xl gap-2 font-medium"
            >
              <Wallet className="size-4" />
              المعاملات المالية والصندوق
            </Button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Card className="rounded-3xl border-border bg-card shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-forest">حالة العمارات النشطة</CardTitle>
                    <CardDescription>ملخص سريع لأحدث العمارات المرتبطة بنظام سند</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y divide-border">
                      {buildings.slice(0, 4).map((b) => (
                        <div key={b.id} className="flex items-center justify-between py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
                              <Building2 className="size-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-forest">{b.name}</p>
                              <p className="text-xs text-muted-foreground">{b.address} • {b.total_units} شقة</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-forest">{formatDZD(b.balance || 0)}</p>
                            <Badge variant="outline" className="border-teal/30 bg-teal/10 text-teal text-xs">
                              كود: {b.code}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-border bg-card shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-forest">آخر العمليات المالية المسجلة</CardTitle>
                    <CardDescription>المدفوعات والمصروفات المسجلة عبر قاعدة بيانات Supabase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y divide-border">
                      {transactions.slice(0, 5).map((t) => (
                        <div key={t.id} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex size-9 items-center justify-center rounded-xl ${
                                t.type === "income" ? "bg-teal/15 text-teal" : "bg-expense/15 text-expense"
                              }`}
                            >
                              {t.type === "income" ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                            </div>
                            <div>
                              <p className="font-medium text-forest">{t.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {t.category || "عام"} • {t.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-bold ${
                                t.type === "income" ? "text-teal" : "text-expense"
                              }`}
                            >
                              {t.type === "income" ? "+" : "-"} {formatDZD(t.amount)}
                            </span>
                            {t.status === "pending" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveTransaction(t.id)}
                                className="h-7 text-xs border-amber/40 text-amber hover:bg-amber/10"
                              >
                                موافقة
                              </Button>
                            ) : (
                              <Badge variant="outline" className="text-xs text-teal border-teal/20">
                                مكتمل
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Quick Actions */}
              <div className="space-y-6">
                <Card className="rounded-3xl border-border bg-card p-6 shadow-card">
                  <h3 className="font-bold text-forest">حالة خادم Supabase وقاعدة البيانات</h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-sand p-3 text-sm">
                      <span className="text-muted-foreground">عنوان الاتصال:</span>
                      <span className="font-mono text-xs font-semibold text-forest">msqwsimmlupus...</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-sand p-3 text-sm">
                      <span className="text-muted-foreground">حماية المفتاح:</span>
                      <span className="flex items-center gap-1 font-semibold text-teal">
                        <CheckCircle2 className="size-4" />
                        100% آمن (Client Only)
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-sand p-3 text-sm">
                      <span className="text-muted-foreground">صلاحيات الحساب:</span>
                      <Badge className="bg-forest text-white">Master SuperAdmin</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-3xl border-border bg-card p-6 shadow-card">
                  <h3 className="font-bold text-forest">إجراءات الماستر السريعة</h3>
                  <div className="mt-4 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 rounded-xl"
                      onClick={() => setShowAddBuilding(true)}
                    >
                      <PlusCircle className="size-4 text-forest" />
                      توليد كود لعمارة جديدة
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 rounded-xl"
                      onClick={() => setActiveTab("residents")}
                    >
                      <Users className="size-4 text-forest" />
                      ترقية ساكن إلى مسير عمارة
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 rounded-xl"
                      onClick={() => setActiveTab("finance")}
                    >
                      <Wallet className="size-4 text-forest" />
                      تصفير أو تسوية الحسابات
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Tab 2: Buildings */}
          {activeTab === "buildings" && (
            <Card className="rounded-3xl border-border bg-card p-6 shadow-card">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <CardTitle className="text-xl font-bold text-forest">العمارات والمجمعات السكنية</CardTitle>
                  <CardDescription>إدارة بيانات العمارات، الشقق، وصناديقها المالية</CardDescription>
                </div>
                <Button onClick={() => setShowAddBuilding(true)} className="bg-forest text-sand gap-2">
                  <PlusCircle className="size-4" />
                  إضافة عمارة
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="border-b border-border bg-sand-subtle/50 text-xs font-semibold text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4">اسم العمارة</th>
                      <th className="py-3 px-4">العنوان</th>
                      <th className="py-3 px-4">كود الدعوة</th>
                      <th className="py-3 px-4">الشقق</th>
                      <th className="py-3 px-4">رصيد الصندوق</th>
                      <th className="py-3 px-4 text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {buildings.map((b) => (
                      <tr key={b.id} className="hover:bg-sand/30 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-forest">{b.name}</td>
                        <td className="py-3.5 px-4 text-muted-foreground">{b.address}</td>
                        <td className="py-3.5 px-4">
                          <code className="rounded bg-sand px-2 py-0.5 font-mono text-xs font-bold text-forest">
                            {b.code}
                          </code>
                        </td>
                        <td className="py-3.5 px-4">{b.total_units} شقة</td>
                        <td className="py-3.5 px-4 font-bold text-forest">{formatDZD(b.balance || 0)}</td>
                        <td className="py-3.5 px-4 text-left">
                          <Button size="sm" variant="ghost" className="h-8 text-xs text-forest">
                            تفاصيل
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Tab 3: Residents */}
          {activeTab === "residents" && (
            <Card className="rounded-3xl border-border bg-card p-6 shadow-card">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <CardTitle className="text-xl font-bold text-forest">سجل المقيمين والمسؤولين</CardTitle>
                  <CardDescription>إدارة الحسابات وصلاحيات الوصول لكل عمارة</CardDescription>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="border-b border-border bg-sand-subtle/50 text-xs font-semibold text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4">الاسم الكامل</th>
                      <th className="py-3 px-4">رقم الهاتف</th>
                      <th className="py-3 px-4">الشقة</th>
                      <th className="py-3 px-4">الصفة / الدور</th>
                      <th className="py-3 px-4">العمارة</th>
                      <th className="py-3 px-4 text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {residents.map((r) => (
                      <tr key={r.id} className="hover:bg-sand/30 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-forest">{r.full_name}</td>
                        <td className="py-3.5 px-4 font-mono text-xs">{r.phone}</td>
                        <td className="py-3.5 px-4">{r.apartment_number}</td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant="outline"
                            className={
                              r.role === "admin"
                                ? "bg-amber/15 text-amber border-amber/30 font-bold"
                                : "bg-teal/10 text-teal border-teal/20"
                            }
                          >
                            {r.role === "admin" ? "أدمن عمارة" : "ساكن / مالك"}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-muted-foreground">
                          {buildings.find((b) => b.id === r.building_id)?.name || "عمارة غير محددة"}
                        </td>
                        <td className="py-3.5 px-4 text-left">
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            تعديل الدور
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Tab 4: Finance */}
          {activeTab === "finance" && (
            <Card className="rounded-3xl border-border bg-card p-6 shadow-card">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <CardTitle className="text-xl font-bold text-forest">سجل المعاملات والمدفوعات</CardTitle>
                  <CardDescription>متابعة المداخيل والمصاريف وحالة اعتمادات الصيانة</CardDescription>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="border-b border-border bg-sand-subtle/50 text-xs font-semibold text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4">الوصف</th>
                      <th className="py-3 px-4">النوع</th>
                      <th className="py-3 px-4">المبلغ</th>
                      <th className="py-3 px-4">التاريخ</th>
                      <th className="py-3 px-4">الحالة</th>
                      <th className="py-3 px-4 text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-sand/30 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-forest">{t.description}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold ${
                              t.type === "income" ? "text-teal" : "text-expense"
                            }`}
                          >
                            {t.type === "income" ? "مدخول" : "مصروف"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-forest">{formatDZD(t.amount)}</td>
                        <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">{t.date}</td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant="outline"
                            className={
                              t.status === "approved"
                                ? "bg-teal/10 text-teal border-teal/20"
                                : "bg-amber/15 text-amber border-amber/30"
                            }
                          >
                            {t.status === "approved" ? "معتمد" : "قيد المراجعة"}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-left">
                          {t.status === "pending" ? (
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-teal hover:bg-teal-deep text-white"
                              onClick={() => handleApproveTransaction(t.id)}
                            >
                              اعتماد
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">لا إجراء</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PublicPage>
  );
}
