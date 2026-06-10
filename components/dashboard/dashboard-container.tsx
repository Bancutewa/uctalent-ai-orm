"use client";

import { useLanguage } from "@/lib/language-context";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { FetchBar } from "@/components/dashboard/fetch-bar";
import { PlaceCard } from "@/components/dashboard/place-card";
import type { Place } from "@/lib/types";

interface DashboardContainerProps {
  initialPlaces: Place[];
}

export function DashboardContainer({ initialPlaces }: DashboardContainerProps) {
  const { t } = useLanguage();

  const allReviews = initialPlaces.flatMap((p) => p.reviews ?? []);
  const totalReviews = allReviews.length;
  const resolvedReviews = allReviews.filter((r) =>
    r.replies?.some((rep) => rep.status === "approved")
  ).length;
  const pendingReviews = totalReviews - resolvedReviews;

  return (
    <main className="flex-1 flex flex-col gap-6 p-4 md:p-8 pt-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("dashboard.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("dashboard.subtitle")}
        </p>
      </div>

      <StatsBar
        totalPlaces={initialPlaces.length}
        total={totalReviews}
        pending={pendingReviews}
        resolved={resolvedReviews}
      />

      <FetchBar />

      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <h2 className="text-xl font-semibold tracking-tight">
            {t("dashboard.savedPlaces.title")}
          </h2>
          <span className="text-xs text-muted-foreground">
            {t("dashboard.savedPlaces.count", { count: initialPlaces.length })}
          </span>
        </div>

        {initialPlaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/60 rounded-xl bg-card/10">
            <p className="text-muted-foreground text-sm">
              {t("dashboard.savedPlaces.empty")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {initialPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
