import { getPlaces } from "@/actions/db";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { PlaceCard } from "@/components/dashboard/place-card";
import { FetchBar } from "@/components/dashboard/fetch-bar";
import type { Place } from "@/lib/types";

export const revalidate = 0;

export default async function Home() {
  const result = await getPlaces();
  const places: Place[] =
    result.success && result.data ? (result.data as any[]) : [];

  const allReviews = places.flatMap((p) => p.reviews ?? []);
  const totalReviews = allReviews.length;
  const resolvedReviews = allReviews.filter((r) =>
    r.replies?.some(
      (rep) => rep.is_selected && rep.status === "approved",
    ),
  ).length;
  const pendingReviews = totalReviews - resolvedReviews;

  return (
    <main className="flex-1 flex flex-col gap-6 p-4 md:p-8 pt-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Quản lý đánh giá Google Maps và phản hồi AI cho các địa
          điểm.
        </p>
      </div>

      <StatsBar
        totalPlaces={places.length}
        total={totalReviews}
        pending={pendingReviews}
        resolved={resolvedReviews}
      />

      <FetchBar />

      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Địa điểm đã lưu
          </h2>
          <span className="text-xs text-muted-foreground">
            {places.length} địa điểm
          </span>
        </div>

        {places.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/60 rounded-xl bg-card/10">
            <p className="text-muted-foreground text-sm">
              Chưa có địa điểm nào. Hãy nhập Place ID ở trên để bắt
              đầu lấy đánh giá.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
