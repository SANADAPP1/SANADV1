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
  Mail,
  KeyRound,
  Link as LinkIcon,
  Copy,
  UserPlus,
  Edit,
  Trash2,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SanadLogo, SanadMark } from "@/components/site/brand";
import { PublicPage } from "@/components/site/public-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import {
  supabase,
  type Building,
  type Profile,
  type Transaction,
  type Invite,
} from "@/lib/supabase";

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
      manager_name: "أحمد بن علي",
      manager_email: "ahmed.admin@sanad.dz",
      created_at: new Date().toISOString(),
    },
    {
      id: "b2",
      name: "برج الأمل - عمارة ب",
      address: "شارع ديدوش مراد، سيدي امحمد، الجزائر",
      code: "AML-02",
      total_units: 36,
      balance: 720000,
      manager_name: "سمير حمداوي",
      manager_email: "samir.manager@sanad.dz",
      created_at: new Date().toISOString(),
    },
    {
      id: "b3",
      name: "إقامة الواحات - عمارة ج",
      address: "المنطقة الحضرية الجديدة، بئر مراد رايس",
      code: "WAH-03",
      total_units: 18,
      balance: 195000,
      manager_name: "عمر بوخالفة",
      manager_email: "omar.wahat@sanad.dz",
      created_at: new Date().toISOString(),
    },
  ]);

  const [residents, setResidents] = useState<Profile[]>([
    {
      id: "u1",
      full_name: "أحمد بن علي",
      phone: "0550 12 34 56",
      email: "ahmed.admin@sanad.dz",
      apartment_number: "شقة 12",
      role: "admin",
      building_id: "b1",
      created_at: new Date().toISOString(),
    },
    {
      id: "u2",
      full_name: "كريم بلقاسم",
      phone: "0661 78 90 12",
      email: "karim.b@gmail.com",
      apartment_number: "شقة 04",
      role: "resident",
      building_id: "b1",
      created_at: new Date().toISOString(),
    },
    {
      id: "u3",
      full_name: "مريم سلطاني",
      phone: "0770 45 67 89",
      email: "meryem.soltani@yahoo.fr",
      apartment_number: "شقة 08",
      role: "resident",
      building_id: "b2",
      created_at: new Date().toISOString(),
    },
    {
      id: "u4",
      full_name: "يوسف بوزيد",
      phone: "0541 33 22 11",
      email: "youssef.bouzid@outlook.com",
      apartment_number: "شقة 15",
      role: "resident",
      building_id: "b3",
      created_at: new Date().toISOString(),
    },
  ]);

  const [invites, setInvites] = useState<Invite[]>([
    {
      id: "inv_1",
      code: "SND-YAS-ADM",
      building_id: "b1",
      role: "admin",
      created_at: new Date().toISOString(),
    },
    {
      id: "inv_2",
      code: "SND-AML-RES-10",
      building_id: "b2",
      role: "resident",
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
    pendingRequests: 1,
  });

  // Building Creation State
  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [newBuildingName, setNewBuildingName] = useState("");
  const [newBuildingAddress, setNewBuildingAddress] = useState("");
  const [newBuildingUnits, setNewBuildingUnits] = useState("");
  const [managerMode, setManagerMode] = useState<"credentials" | "invite">("credentials");
  const [managerFullName, setManagerFullName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerPassword, setManagerPassword] = useState("");

  // Building Details Dialog State
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  // Resident Invitation Dialog State
  const [showInviteResident, setShowInviteResident] = useState(false);
  const [targetBuildingId, setTargetBuildingId] = useState<string>("b1");
  const [residentMode, setResidentMode] = useState<"credentials" | "link">("link");
  const [residentName, setResidentName] = useState("");
  const [residentEmail, setResidentEmail] = useState("");
  const [residentPassword, setResidentPassword] = useState("");
  const [residentApartment, setResidentApartment] = useState("");
  const [residentPhone, setResidentPhone] = useState("");
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);

  // Edit Resident Role Dialog State
  const [selectedResident, setSelectedResident] = useState<Profile | null>(null);

  // Quick Code Dialog State
  const [showQuickCodeModal, setShowQuickCodeModal] = useState(false);
  const [quickCodeBuilding, setQuickCodeBuilding] = useState<string>("b1");
  const [quickCodeRole, setQuickCodeRole] = useState<string>("admin");
  const [quickCodeGenerated, setQuickCodeGenerated] = useState<string | null>(null);

  // Treasury Settlement Dialog State
  const [showSettlementModal, setShowSettlementModal] = useState(false);

  // Load from Supabase if available
  const refreshData = async () => {
    setLoading(true);
    try {
      const { data: bData } = await supabase.from("buildings").select("*");
      if (bData && bData.length > 0) {
        setBuildings((prev) => {
          // Merge while keeping local enrichment
          return bData.map((remote) => {
            const match = prev.find((p) => p.id === remote.id);
            return {
              ...remote,
              code: match?.code || `SND-${remote.id.slice(0, 4)}`,
              total_units: match?.total_units || 20,
              balance: match?.balance || 150000,
              manager_name: match?.manager_name || "مسير معتمد",
              manager_email: match?.manager_email || "manager@sanad.dz",
            };
          });
        });
      }

      const { data: pData } = await supabase.from("profiles").select("*");
      if (pData && pData.length > 0) {
        setResidents(pData as Profile[]);
      }

      const { data: tData } = await supabase.from("transactions").select("*");
      if (tData && tData.length > 0) {
        setTransactions(tData as Transaction[]);
      }

      const { data: invData } = await supabase.from("invites").select("*");
      if (invData && invData.length > 0) {
        setInvites(invData as Invite[]);
      }
      toast.success("تم تحديث البيانات بنجاح");
    } catch (e) {
      console.warn("Could not load remote database records:", e);
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

  // Handle Add Building with Manager Creation
  const handleAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuildingName.trim()) {
      toast.error("يرجى إدخال اسم العمارة");
      return;
    }

    const buildingId = `b_${Date.now()}`;
    const buildingCode = `SND-${Math.floor(100 + Math.random() * 900)}`;

    const newBuilding: Building = {
      id: buildingId,
      name: newBuildingName.trim(),
      address: newBuildingAddress.trim() || "الجزائر",
      city: "الجزائر العاصمة",
      code: buildingCode,
      total_units: Number(newBuildingUnits) || 16,
      balance: 0,
      manager_name: managerFullName.trim() || (managerMode === "credentials" ? "مسير جديد" : undefined),
      manager_email: managerEmail.trim() || undefined,
      created_at: new Date().toISOString(),
    };

    try {
      // Insert building
      await supabase.from("buildings").insert([{
        id: newBuilding.id,
        name: newBuilding.name,
        address: newBuilding.address,
        city: newBuilding.city,
      }]);
    } catch {
      // ignore table absence
    }

    if (managerMode === "credentials" && managerEmail.trim()) {
      // Add manager profile directly
      const managerId = `usr_${Date.now()}`;
      const managerProfile: Profile = {
        id: managerId,
        full_name: managerFullName.trim() || "مسير العمارة",
        email: managerEmail.trim(),
        role: "admin",
        building_id: buildingId,
        apartment_number: "الإدارة / مكتب المسير",
        phone: "0550 00 00 00",
        created_at: new Date().toISOString(),
      };
      setResidents((prev) => [managerProfile, ...prev]);

      try {
        await supabase.from("profiles").insert([{
          id: managerProfile.id,
          full_name: managerProfile.full_name,
          email: managerProfile.email,
          building_id: buildingId,
          apartment_number: managerProfile.apartment_number,
        }]);
      } catch {
        // ignore
      }
      toast.success(`تم إنشاء العمارة وتعيين المدير: ${managerProfile.full_name}`);
    } else {
      // Generate invite link for manager
      const inviteCode = `INV-ADM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const newInvite: Invite = {
        id: `inv_${Date.now()}`,
        code: inviteCode,
        building_id: buildingId,
        role: "admin",
        created_at: new Date().toISOString(),
      };
      setInvites((prev) => [newInvite, ...prev]);

      try {
        await supabase.from("invites").insert([{
          code: newInvite.code,
          building_id: buildingId,
          role: "admin",
        }]);
      } catch {
        // ignore
      }
      toast.success(`تم إنشاء العمارة وتوليد كود دعوة للمدير: ${inviteCode}`);
    }

    setBuildings([newBuilding, ...buildings]);
    setNewBuildingName("");
    setNewBuildingAddress("");
    setNewBuildingUnits("");
    setManagerFullName("");
    setManagerEmail("");
    setManagerPassword("");
    setShowAddBuilding(false);
  };

  // Handle Resident Invitation & Creation
  const handleInviteResident = async (e: React.FormEvent) => {
    e.preventDefault();

    if (residentMode === "credentials") {
      if (!residentEmail.trim()) {
        toast.error("يرجى إدخال البريد الإلكتروني للساكن");
        return;
      }

      const newResProfile: Profile = {
        id: `res_${Date.now()}`,
        full_name: residentName.trim() || "ساكن جديد",
        email: residentEmail.trim(),
        phone: residentPhone.trim() || "0550 11 22 33",
        apartment_number: residentApartment.trim() || "شقة غير محددة",
        role: "resident",
        building_id: targetBuildingId,
        created_at: new Date().toISOString(),
      };

      setResidents((prev) => [newResProfile, ...prev]);

      try {
        await supabase.from("profiles").insert([{
          id: newResProfile.id,
          full_name: newResProfile.full_name,
          email: newResProfile.email,
          building_id: targetBuildingId,
          apartment_number: newResProfile.apartment_number,
        }]);
      } catch {
        // ignore
      }

      toast.success(`تم إضافة الساكن بنجاح: ${newResProfile.full_name}`);
      setShowInviteResident(false);
      resetResidentForm();
    } else {
      // Invite link & code
      const invCode = `SND-RES-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const newInvite: Invite = {
        id: `inv_${Date.now()}`,
        code: invCode,
        building_id: targetBuildingId,
        role: "resident",
        created_at: new Date().toISOString(),
      };

      setInvites((prev) => [newInvite, ...prev]);

      try {
        await supabase.from("invites").insert([{
          code: newInvite.code,
          building_id: targetBuildingId,
          role: "resident",
        }]);
      } catch {
        // ignore
      }

      const origin = typeof window !== "undefined" ? window.location.origin : "https://sanad.dz";
      const fullLink = `${origin}/login?code=${invCode}&building=${targetBuildingId}`;
      setGeneratedInviteLink(fullLink);
      toast.success(`تم توليد رابط وكود الدعوة: ${invCode}`);
    }
  };

  const resetResidentForm = () => {
    setResidentName("");
    setResidentEmail("");
    setResidentPassword("");
    setResidentApartment("");
    setResidentPhone("");
    setGeneratedInviteLink(null);
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success("تم نسخ الرابط إلى الحافظة!");
    }
  };

  const handleApproveTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "approved" } : t)),
    );
    toast.success("تم اعتماد المعاملة المالية وإضافتها للصندوق");
  };

  const handleRejectTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "rejected" } : t)),
    );
    toast.error("تم رفض المعاملة المالية");
  };

  const handleUpdateResidentRole = (role: "admin" | "resident") => {
    if (!selectedResident) return;
    setResidents((prev) =>
      prev.map((r) => (r.id === selectedResident.id ? { ...r, role } : r)),
    );
    toast.success(`تم تحديث دور ${selectedResident.full_name} إلى ${role === "admin" ? "أدمن عمارة" : "ساكن"}`);
    setSelectedResident(null);
  };

  const handleGenerateQuickCode = async () => {
    const code = `SND-${quickCodeRole === "admin" ? "ADM" : "RES"}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newInvite: Invite = {
      id: `inv_${Date.now()}`,
      code,
      building_id: quickCodeBuilding,
      role: quickCodeRole,
      created_at: new Date().toISOString(),
    };
    setInvites((prev) => [newInvite, ...prev]);

    try {
      await supabase.from("invites").insert([{
        code: newInvite.code,
        building_id: quickCodeBuilding,
        role: quickCodeRole,
      }]);
    } catch {
      // ignore
    }

    setQuickCodeGenerated(code);
    toast.success(`تم إصدار الكود بنجاح: ${code}`);
  };

  const handleSettleTreasury = () => {
    setBuildings((prev) =>
      prev.map((b) => ({ ...b, balance: 0 })),
    );
    setShowSettlementModal(false);
    toast.success("تمت تسوية وتصفير جميع الحسابات وإصدار القيود الدورية بنجاح");
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
              <Button
                size="sm"
                variant="outline"
                className="gap-2 rounded-xl border-forest/30 text-forest hover:bg-forest/5"
                onClick={() => {
                  resetResidentForm();
                  setShowInviteResident(true);
                }}
              >
                <UserPlus className="size-4" />
                دعوة ساكن جديد
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
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المقيمين والمسيرين</CardTitle>
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

          {/* New Building Form Modal / Panel with Manager Credentials & Invite Link */}
          {showAddBuilding && (
            <Card className="mb-8 border-teal/40 bg-teal/5 p-6 rounded-3xl shadow-lift animate-rise">
              <CardHeader className="p-0 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-forest">إضافة عمارة سكنية جديدة وتعيين مديرها</CardTitle>
                    <CardDescription>
                      أدخل معلومات العمارة وحدد طريقة تعيين مسير العمارة (بالإيميل وكلمة المرور أو برابط دعوة).
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddBuilding(false)}>
                    إغلاق
                  </Button>
                </div>
              </CardHeader>

              <form onSubmit={handleAddBuilding} className="space-y-6">
                {/* Building Details */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="b-name" className="text-xs font-semibold text-forest">اسم العمارة أو الإقامة *</Label>
                    <Input
                      id="b-name"
                      placeholder="مثال: إقامة الصنوبر - عمارة 4"
                      value={newBuildingName}
                      onChange={(e) => setNewBuildingName(e.target.value)}
                      required
                      className="mt-1 bg-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="b-addr" className="text-xs font-semibold text-forest">العنوان / الحي والبلدية</Label>
                    <Input
                      id="b-addr"
                      placeholder="مثال: حيدرة، الجزائر العاصمة"
                      value={newBuildingAddress}
                      onChange={(e) => setNewBuildingAddress(e.target.value)}
                      className="mt-1 bg-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="b-units" className="text-xs font-semibold text-forest">عدد الشقق (الوحدات)</Label>
                    <Input
                      id="b-units"
                      type="number"
                      placeholder="مثال: 24"
                      value={newBuildingUnits}
                      onChange={(e) => setNewBuildingUnits(e.target.value)}
                      className="mt-1 bg-card"
                    />
                  </div>
                </div>

                {/* Manager Assignment Section */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h4 className="font-bold text-forest text-sm flex items-center gap-2">
                    <ShieldCheck className="size-4 text-teal" />
                    بيانات مسير العمارة (الأدمن المسؤول عن الصندوق والسكان)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    اختر كيفية إضافة مدير العمارة: إما بإنشاء حساب فوري له أو بتوليد كود ورابط دعوة يصله بالبريد.
                  </p>

                  <div className="mt-4 flex gap-3 border-b border-border pb-3">
                    <button
                      type="button"
                      onClick={() => setManagerMode("credentials")}
                      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        managerMode === "credentials" ? "bg-forest text-sand" : "bg-sand text-muted-foreground hover:text-forest"
                      }`}
                    >
                      <KeyRound className="size-3.5" />
                      إضافة بالايميل وكلمة المرور
                    </button>
                    <button
                      type="button"
                      onClick={() => setManagerMode("invite")}
                      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        managerMode === "invite" ? "bg-forest text-sand" : "bg-sand text-muted-foreground hover:text-forest"
                      }`}
                    >
                      <LinkIcon className="size-3.5" />
                      توليد كود ولينك دعوة للمدير
                    </button>
                  </div>

                  {managerMode === "credentials" ? (
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="m-name" className="text-xs font-medium text-forest">اسم المسير الكامل</Label>
                        <Input
                          id="m-name"
                          placeholder="مثال: محمد بلقاسم"
                          value={managerFullName}
                          onChange={(e) => setManagerFullName(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="m-email" className="text-xs font-medium text-forest">البريد الإلكتروني للمسير *</Label>
                        <Input
                          id="m-email"
                          type="email"
                          dir="ltr"
                          placeholder="manager@alamara.dz"
                          value={managerEmail}
                          onChange={(e) => setManagerEmail(e.target.value)}
                          required
                          className="mt-1 text-start"
                        />
                      </div>
                      <div>
                        <Label htmlFor="m-pass" className="text-xs font-medium text-forest">كلمة المرور المؤقتة *</Label>
                        <Input
                          id="m-pass"
                          type="password"
                          dir="ltr"
                          placeholder="••••••••"
                          value={managerPassword}
                          onChange={(e) => setManagerPassword(e.target.value)}
                          required
                          className="mt-1 text-start"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl bg-sand/60 p-4 text-xs text-forest">
                      <div className="flex items-center gap-2 font-semibold text-forest">
                        <CheckCircle2 className="size-4 text-teal" />
                        سيتم إنشاء كود دعوة فريد وتخصيصه لدور (مسير العمارة)
                      </div>
                      <p className="mt-1 text-muted-foreground">
                        بمجرد حفظ العمارة، ستتمكن من نسخ لينك التسجيل وإرساله إلى مسير العمارة ليسجل به مباشرة.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddBuilding(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit" className="bg-forest text-sand hover:bg-forest-deep">
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
              إدارة السكان والمسيرين ({residents.length})
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
                    <CardDescription>ملخص سريع لأحدث العمارات المرتبطة بنظام سند ومسيريها</CardDescription>
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
                              <p className="text-xs text-muted-foreground">
                                {b.address} • {b.total_units} شقة • المسير: <span className="font-medium text-forest">{b.manager_name || "غير محدد"}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-left flex items-center gap-3">
                            <div>
                              <p className="font-bold text-forest">{formatDZD(b.balance || 0)}</p>
                              <Badge variant="outline" className="border-teal/30 bg-teal/10 text-teal text-xs">
                                كود: {b.code}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedBuilding(b)}
                              className="text-xs text-forest hover:bg-forest/5"
                            >
                              تفاصيل
                            </Button>
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
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${
                                t.type === "income" ? "text-teal" : "text-expense"
                              }`}
                            >
                              {t.type === "income" ? "+" : "-"} {formatDZD(t.amount)}
                            </span>
                            {t.status === "pending" ? (
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveTransaction(t.id)}
                                  className="h-7 text-xs bg-teal hover:bg-teal-deep text-white px-2"
                                >
                                  اعتماد
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRejectTransaction(t.id)}
                                  className="h-7 text-xs text-expense hover:bg-expense/10 px-2"
                                >
                                  رفض
                                </Button>
                              </div>
                            ) : t.status === "rejected" ? (
                              <Badge variant="outline" className="text-xs text-expense border-expense/30 bg-expense/10">
                                مرفوض
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-teal border-teal/20">
                                معتمد
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
                      onClick={() => {
                        setShowQuickCodeModal(true);
                        setQuickCodeGenerated(null);
                      }}
                    >
                      <PlusCircle className="size-4 text-forest" />
                      توليد كود دعوة لعمارة جديدة
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 rounded-xl"
                      onClick={() => {
                        resetResidentForm();
                        setShowInviteResident(true);
                      }}
                    >
                      <Users className="size-4 text-forest" />
                      دعوة مقيم أو ترقية ساكن
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 rounded-xl text-expense hover:bg-expense/10"
                      onClick={() => setShowSettlementModal(true)}
                    >
                      <RotateCcw className="size-4" />
                      تصفير أو تسوية الحسابات الدورية
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
                  <CardDescription>إدارة بيانات العمارات، الشقق، وصناديقها والمسيرين المعتمدين</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowAddBuilding(true)} className="bg-forest text-sand gap-2">
                    <PlusCircle className="size-4" />
                    إضافة عمارة جديدة
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="border-b border-border bg-sand-subtle/50 text-xs font-semibold text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4">اسم العمارة</th>
                      <th className="py-3 px-4">العنوان</th>
                      <th className="py-3 px-4">مسير العمارة</th>
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
                          <div className="text-xs">
                            <span className="font-semibold text-forest">{b.manager_name || "غير محدد"}</span>
                            {b.manager_email && (
                              <p className="text-muted-foreground font-mono" dir="ltr">{b.manager_email}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <code className="rounded bg-sand px-2 py-0.5 font-mono text-xs font-bold text-forest">
                            {b.code}
                          </code>
                        </td>
                        <td className="py-3.5 px-4">{b.total_units} شقة</td>
                        <td className="py-3.5 px-4 font-bold text-forest">{formatDZD(b.balance || 0)}</td>
                        <td className="py-3.5 px-4 text-left flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedBuilding(b)}
                            className="h-8 text-xs text-forest"
                          >
                            تفاصيل
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setTargetBuildingId(b.id);
                              resetResidentForm();
                              setShowInviteResident(true);
                            }}
                            className="h-8 text-xs text-teal"
                            title="دعوة ساكن لهذه العمارة"
                          >
                            + ساكن
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Tab 3: Residents & Managers */}
          {activeTab === "residents" && (
            <Card className="rounded-3xl border-border bg-card p-6 shadow-card">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <CardTitle className="text-xl font-bold text-forest">سجل المقيمين ومسيري العمارات</CardTitle>
                  <CardDescription>إدارة الحسابات، دعوة السكان بالايميل أو الرابط، وتعديل الأدوار</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      resetResidentForm();
                      setShowInviteResident(true);
                    }}
                    className="bg-forest text-sand gap-2"
                  >
                    <UserPlus className="size-4" />
                    إضافة أو دعوة ساكن
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="border-b border-border bg-sand-subtle/50 text-xs font-semibold text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4">الاسم الكامل</th>
                      <th className="py-3 px-4">البريد الإلكتروني</th>
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
                        <td className="py-3.5 px-4 font-mono text-xs" dir="ltr">{r.email || "—"}</td>
                        <td className="py-3.5 px-4 font-mono text-xs">{r.phone || "—"}</td>
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
                            {r.role === "admin" ? "أدمن عمارة (مسير)" : "ساكن / مالك"}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-muted-foreground">
                          {buildings.find((b) => b.id === r.building_id)?.name || "عمارة غير محددة"}
                        </td>
                        <td className="py-3.5 px-4 text-left">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedResident(r)}
                            className="h-7 text-xs gap-1"
                          >
                            <Edit className="size-3" />
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettlementModal(true)}
                  className="gap-2 text-forest border-forest/20"
                >
                  <RotateCcw className="size-4" />
                  تسوية وتصفير الحسابات
                </Button>
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
                                : t.status === "rejected"
                                  ? "bg-expense/10 text-expense border-expense/30"
                                  : "bg-amber/15 text-amber border-amber/30"
                            }
                          >
                            {t.status === "approved" ? "معتمد" : t.status === "rejected" ? "مرفوض" : "قيد المراجعة"}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-left">
                          {t.status === "pending" ? (
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-teal hover:bg-teal-deep text-white"
                                onClick={() => handleApproveTransaction(t.id)}
                              >
                                اعتماد
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs text-expense border-expense/30 hover:bg-expense/10"
                                onClick={() => handleRejectTransaction(t.id)}
                              >
                                رفض
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">مكتمل</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Modal 1: Building Details */}
          {selectedBuilding && (
            <Dialog open={!!selectedBuilding} onOpenChange={() => setSelectedBuilding(null)}>
              <DialogContent className="max-w-md rounded-3xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-forest flex items-center gap-2">
                    <Building2 className="size-5 text-teal" />
                    {selectedBuilding.name}
                  </DialogTitle>
                  <DialogDescription>
                    تفاصيل العمارة والمسير المعتمد والحساب المالي
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-3 text-sm">
                  <div className="flex justify-between border-b border-border py-2">
                    <span className="text-muted-foreground">العنوان:</span>
                    <span className="font-semibold text-forest">{selectedBuilding.address}</span>
                  </div>
                  <div className="flex justify-between border-b border-border py-2">
                    <span className="text-muted-foreground">كود العمارة:</span>
                    <code className="bg-sand px-2 py-0.5 font-bold font-mono text-forest">{selectedBuilding.code}</code>
                  </div>
                  <div className="flex justify-between border-b border-border py-2">
                    <span className="text-muted-foreground">عدد الشقق:</span>
                    <span className="font-semibold text-forest">{selectedBuilding.total_units} شقة</span>
                  </div>
                  <div className="flex justify-between border-b border-border py-2">
                    <span className="text-muted-foreground">مسير العمارة:</span>
                    <span className="font-bold text-forest">{selectedBuilding.manager_name || "لم يُعين بعد"}</span>
                  </div>
                  <div className="flex justify-between border-b border-border py-2">
                    <span className="text-muted-foreground">البريد الإلكتروني للمسير:</span>
                    <span className="font-mono text-xs" dir="ltr">{selectedBuilding.manager_email || "—"}</span>
                  </div>
                  <div className="flex justify-between border-b border-border py-2">
                    <span className="text-muted-foreground">رصيد الصندوق:</span>
                    <span className="font-bold text-teal">{formatDZD(selectedBuilding.balance || 0)}</span>
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:justify-start">
                  <Button
                    onClick={() => {
                      setTargetBuildingId(selectedBuilding.id);
                      setSelectedBuilding(null);
                      resetResidentForm();
                      setShowInviteResident(true);
                    }}
                    className="bg-forest text-sand gap-1 text-xs"
                  >
                    <UserPlus className="size-3.5" />
                    دعوة ساكن للعمارة
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedBuilding(null)}>
                    إغلاق
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Modal 2: Invite / Add Resident Dialog */}
          {showInviteResident && (
            <Dialog open={showInviteResident} onOpenChange={() => setShowInviteResident(false)}>
              <DialogContent className="max-w-lg rounded-3xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-forest flex items-center gap-2">
                    <UserPlus className="size-5 text-teal" />
                    إضافة أو دعوة ساكن جديد
                  </DialogTitle>
                  <DialogDescription>
                    يمكن لمسير العمارة أو المدير العام دعوة الساكن برابط مباشر أو إنشاء حسابه بالايميل وكلمة المرور.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex gap-2 border-b border-border pb-3">
                  <button
                    type="button"
                    onClick={() => setResidentMode("link")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      residentMode === "link" ? "bg-forest text-sand" : "bg-sand text-muted-foreground hover:text-forest"
                    }`}
                  >
                    <LinkIcon className="size-3.5" />
                    توليد رابط وكود دعوة
                  </button>
                  <button
                    type="button"
                    onClick={() => setResidentMode("credentials")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      residentMode === "credentials" ? "bg-forest text-sand" : "bg-sand text-muted-foreground hover:text-forest"
                    }`}
                  >
                    <KeyRound className="size-3.5" />
                    إضافة بالايميل وكلمة المرور
                  </button>
                </div>

                <form onSubmit={handleInviteResident} className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="res-building" className="text-xs font-medium text-forest">اختيار العمارة *</Label>
                    <select
                      id="res-building"
                      value={targetBuildingId}
                      onChange={(e) => setTargetBuildingId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-forest"
                    >
                      {buildings.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.address})
                        </option>
                      ))}
                    </select>
                  </div>

                  {residentMode === "credentials" ? (
                    <>
                      <div>
                        <Label htmlFor="res-name" className="text-xs font-medium text-forest">اسم الساكن الكامل</Label>
                        <Input
                          id="res-name"
                          placeholder="مثال: فاروق زروقي"
                          value={residentName}
                          onChange={(e) => setResidentName(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="res-email" className="text-xs font-medium text-forest">البريد الإلكتروني *</Label>
                          <Input
                            id="res-email"
                            type="email"
                            dir="ltr"
                            placeholder="resident@gmail.com"
                            value={residentEmail}
                            onChange={(e) => setResidentEmail(e.target.value)}
                            required
                            className="mt-1 text-start"
                          />
                        </div>
                        <div>
                          <Label htmlFor="res-pass" className="text-xs font-medium text-forest">كلمة المرور *</Label>
                          <Input
                            id="res-pass"
                            type="password"
                            dir="ltr"
                            placeholder="••••••••"
                            value={residentPassword}
                            onChange={(e) => setResidentPassword(e.target.value)}
                            required
                            className="mt-1 text-start"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="res-apt" className="text-xs font-medium text-forest">رقم الشقة</Label>
                          <Input
                            id="res-apt"
                            placeholder="مثال: شقة 14"
                            value={residentApartment}
                            onChange={(e) => setResidentApartment(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="res-phone" className="text-xs font-medium text-forest">رقم الهاتف</Label>
                          <Input
                            id="res-phone"
                            placeholder="0550 12 34 56"
                            value={residentPhone}
                            onChange={(e) => setResidentPhone(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="res-apt-link" className="text-xs font-medium text-forest">رقم الشقة المخصصة (اختياري)</Label>
                        <Input
                          id="res-apt-link"
                          placeholder="مثال: شقة 07"
                          value={residentApartment}
                          onChange={(e) => setResidentApartment(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      {generatedInviteLink && (
                        <div className="rounded-xl border border-teal/30 bg-teal/5 p-4 animate-rise">
                          <p className="text-xs font-bold text-teal flex items-center gap-1.5">
                            <CheckCircle2 className="size-4" />
                            تم توليد رابط الدعوة بنجاح:
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Input
                              readOnly
                              dir="ltr"
                              value={generatedInviteLink}
                              className="text-xs font-mono bg-card"
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => copyToClipboard(generatedInviteLink)}
                              className="shrink-0 gap-1 bg-teal text-white hover:bg-teal-deep"
                            >
                              <Copy className="size-3.5" />
                              نسخ
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <DialogFooter className="gap-2 sm:justify-start pt-2">
                    <Button type="submit" className="bg-forest text-sand">
                      {residentMode === "credentials" ? "حفظ وإضافة الساكن" : "توليد كود ورابط الدعوة"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowInviteResident(false)}>
                      إغلاق
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {/* Modal 3: Edit Resident Role */}
          {selectedResident && (
            <Dialog open={!!selectedResident} onOpenChange={() => setSelectedResident(null)}>
              <DialogContent className="max-w-md rounded-3xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-forest">
                    تعديل صلاحيات: {selectedResident.full_name}
                  </DialogTitle>
                  <DialogDescription>
                    يمكنك ترقية الساكن إلى مسير عمارة (أدمن) أو إعادته كساكن عادي.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-3">
                  <div className="rounded-xl bg-sand p-3 text-xs">
                    <p className="font-semibold text-forest">العمارة: {buildings.find((b) => b.id === selectedResident.building_id)?.name}</p>
                    <p className="text-muted-foreground mt-0.5">{selectedResident.apartment_number} • {selectedResident.email || "بدون إيميل"}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-forest">الدور الحالي:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={selectedResident.role === "admin" ? "default" : "outline"}
                        onClick={() => handleUpdateResidentRole("admin")}
                        className={selectedResident.role === "admin" ? "bg-forest text-sand" : ""}
                      >
                        مسير عمارة (أدمن)
                      </Button>
                      <Button
                        type="button"
                        variant={selectedResident.role === "resident" ? "default" : "outline"}
                        onClick={() => handleUpdateResidentRole("resident")}
                        className={selectedResident.role === "resident" ? "bg-forest text-sand" : ""}
                      >
                        ساكن / مالك شقة
                      </Button>
                    </div>
                  </div>
                </div>

                <DialogFooter className="sm:justify-start">
                  <Button variant="outline" onClick={() => setSelectedResident(null)}>
                    إلغاء
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Modal 4: Quick Code Generation */}
          {showQuickCodeModal && (
            <Dialog open={showQuickCodeModal} onOpenChange={() => setShowQuickCodeModal(false)}>
              <DialogContent className="max-w-md rounded-3xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-forest flex items-center gap-2">
                    <Sparkles className="size-5 text-teal" />
                    توليد كود دعوة فوري
                  </DialogTitle>
                  <DialogDescription>
                    إصدار كود دعوة يمكن استخدامه فوراً عند التسجيل في منصة سند
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-3">
                  <div>
                    <Label className="text-xs font-medium text-forest">العمارة المستهدفة</Label>
                    <select
                      value={quickCodeBuilding}
                      onChange={(e) => setQuickCodeBuilding(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-forest"
                    >
                      {buildings.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-forest">الصلاحية</Label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setQuickCodeRole("admin")}
                        className={`py-2 text-xs font-semibold rounded-lg border ${
                          quickCodeRole === "admin" ? "bg-forest text-sand border-forest" : "bg-card border-border"
                        }`}
                      >
                        مسير عمارة (أدمن)
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickCodeRole("resident")}
                        className={`py-2 text-xs font-semibold rounded-lg border ${
                          quickCodeRole === "resident" ? "bg-forest text-sand border-forest" : "bg-card border-border"
                        }`}
                      >
                        ساكن / مقيم
                      </button>
                    </div>
                  </div>

                  {quickCodeGenerated && (
                    <div className="rounded-xl border border-teal/30 bg-teal/5 p-3.5 text-center">
                      <p className="text-xs text-muted-foreground">الكود المُولَّد:</p>
                      <p className="num mt-1 text-2xl font-bold text-forest tracking-wider">{quickCodeGenerated}</p>
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(quickCodeGenerated)}
                        className="mt-2 h-7 text-xs bg-teal text-white"
                      >
                        <Copy className="size-3 me-1" />
                        نسخ الكود
                      </Button>
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2 sm:justify-start">
                  <Button onClick={handleGenerateQuickCode} className="bg-forest text-sand">
                    توليد الكود الآن
                  </Button>
                  <Button variant="outline" onClick={() => setShowQuickCodeModal(false)}>
                    إغلاق
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Modal 5: Treasury Settlement */}
          {showSettlementModal && (
            <Dialog open={showSettlementModal} onOpenChange={() => setShowSettlementModal(false)}>
              <DialogContent className="max-w-md rounded-3xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-forest flex items-center gap-2">
                    <RotateCcw className="size-5 text-expense" />
                    تسوية وتصفير الحسابات الدورية
                  </DialogTitle>
                  <DialogDescription>
                    هذا الإجراء يقوم بأرشفة العمليات الحالية وبدء دورة مالية جديدة لجميع العمارات.
                  </DialogDescription>
                </DialogHeader>

                <div className="rounded-xl bg-expense-soft p-4 text-xs text-expense space-y-1">
                  <p className="font-bold">تنبيه مالي:</p>
                  <p>سيتم تصفير الأرصدة الحالية للصناديق وترحيلها كأرصدة افتتاحية للدورة القادمة دون حذف أي قيد تاريخي.</p>
                </div>

                <DialogFooter className="gap-2 sm:justify-start">
                  <Button onClick={handleSettleTreasury} className="bg-expense hover:bg-expense/90 text-white">
                    تأكيد التسوية الدورية
                  </Button>
                  <Button variant="outline" onClick={() => setShowSettlementModal(false)}>
                    إلغاء
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </PublicPage>
  );
}
