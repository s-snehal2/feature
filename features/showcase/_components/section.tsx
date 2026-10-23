import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type SectionProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export function Section({
  icon: Icon,
  title,
  description,
  badge,
  actions,
  children,
}: SectionProps) {
  return (
    <section className="bg-card text-card-foreground rounded-xl border shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
            <Icon className="size-4" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold">{title}</h2>
              {badge}
            </div>
            {description ? (
              <p className="text-muted-foreground truncate text-xs">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-1">{actions}</div>
        ) : null}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
