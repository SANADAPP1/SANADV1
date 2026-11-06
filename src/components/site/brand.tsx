import iconLight from "@/assets/sanad-app-icon-light.jpg.asset.json";
import iconDark from "@/assets/sanad-app-icon-dark.jpg.asset.json";
import iconPack from "@/assets/sanad-ui-icons-pack.jpg.asset.json";
import { cn } from "@/lib/utils";

/** Square app symbol (2x2 window grid). */
export function SanadMark({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  return (
    <img
      src={variant === "dark" ? iconDark.url : iconLight.url}
      alt="شعار سند"
      width={40}
      height={40}
      className={cn("size-10 rounded-xl object-cover", className)}
    />
  );
}

export function SanadWordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span className={cn("text-lg font-bold", dark ? "text-on-dark" : "text-forest")}>سند</span>
      <span
        className={cn(
          "num text-[11px] font-semibold tracking-wide",
          dark ? "text-on-dark-muted" : "text-muted-foreground",
        )}
      >
        Sanad
      </span>
    </span>
  );
}

export type BrandIconName =
  | "fund"
  | "ledger"
  | "residents"
  | "projects"
  | "events"
  | "voting"
  | "garden"
  | "security"
  | "painting";

const ICON_POSITIONS: Record<BrandIconName, string> = {
  fund: "0% 0%",
  ledger: "50% 0%",
  residents: "100% 0%",
  projects: "0% 50%",
  events: "50% 50%",
  voting: "100% 50%",
  garden: "0% 100%",
  security: "50% 100%",
  painting: "100% 100%",
};

/** One of the 9 approved custom UI icons, cropped from the brand icon pack. */
export function BrandIcon({ name, className }: { name: BrandIconName; className?: string }) {
  return (
    <span
      role="img"
      aria-hidden="true"
      className={cn("inline-block size-14 shrink-0 bg-no-repeat", className)}
      style={{
        backgroundImage: `url(${iconPack.url})`,
        backgroundSize: "300% 300%",
        backgroundPosition: ICON_POSITIONS[name],
      }}
    />
  );
}
