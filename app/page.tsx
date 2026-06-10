import { getReviews } from "@/actions/db";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { ReviewCard } from "@/components/dashboard/review-card";
import { Review } from "@/lib/types";

export const revalidate = 0; // Disable caching to fetch fresh data from DB

export default async function Home() {
  const result = await getReviews();
  const reviews: Review[] = result.success && result.data ? (result.data as any[]) : [];

  // Calculate dynamic stats
  const total = reviews.length;
  const resolved = reviews.filter(r => 
    r.replies?.some(rep => rep.is_selected && rep.status === "approved")
  ).length;
  const pending = total - resolved;

  return (
    <main className="flex-1 flex flex-col gap-6 p-4 md:p-8 pt-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your Google Reviews and AI replies.
        </p>
      </div>
      
      <StatsBar total={total} pending={pending} resolved={resolved} />
      
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <h2 className="text-xl font-semibold tracking-tight">Recent Reviews</h2>
          <span className="text-xs text-muted-foreground">Sorted by newest</span>
        </div>
        
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/60 rounded-xl bg-card/10">
            <p className="text-muted-foreground text-sm">No reviews found. Try seeding the database first.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
