import { Link } from "@tanstack/react-router";
import { SanadMark, SanadWordmark } from "./brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <SanadMark className="size-9" />
          <div>
            <SanadWordmark />
            <p className="mt-1 text-xs text-muted-foreground">تسيير العمارات وصندوق السكان — الجزائر</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground" aria-label="روابط">
          <Link to="/about" className="hover:text-forest">عن المنصة</Link>
          <Link to="/help" className="hover:text-forest">المساعدة والأسئلة</Link>
          <Link to="/login" className="hover:text-forest">الدخول</Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          © <span className="num">2026</span> سند. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
