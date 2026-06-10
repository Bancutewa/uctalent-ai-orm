import { getPlaces } from "@/actions/db";
import { DashboardContainer } from "@/components/dashboard/dashboard-container";
import type { Place } from "@/lib/types";

export const revalidate = 0;

export default async function Home() {
  const result = await getPlaces();
  const places: Place[] =
    result.success && result.data ? (result.data as Place[]) : [];

  return <DashboardContainer initialPlaces={places} />;
}
