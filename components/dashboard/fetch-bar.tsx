"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchPlacePreview, confirmSaveReviews } from "@/actions/db";
import { FetchPreviewDialog } from "@/components/dashboard/fetch-preview-dialog";
import { PlaceSearchDialog } from "@/components/dashboard/place-search-dialog";
import { Download, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/language-context";
import type { FetchPreviewData } from "@/lib/types";

export function FetchBar() {
  const { t } = useLanguage();
  const [placeId, setPlaceId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] =
    useState<FetchPreviewData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [previewPlaceId, setPreviewPlaceId] = useState("");

  // Step 1: Fetch preview
  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = placeId.trim();
    if (!id) {
      toast.error(t("dashboard.fetchBar.placeholder"));
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchPlacePreview(id);
      if (result.success && result.data) {
        setPreviewData(result.data);
        setPreviewPlaceId(id);
        setDialogOpen(true);
      } else {
        toast.error(result.error || t("dashboard.aiDialog.error"));
      }
    } catch {
      toast.error(t("dashboard.aiDialog.error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1.5: Auto fetch after searching
  const handleSelectPlaceFromSearch = async (selectedPlaceId: string) => {
    setPlaceId(selectedPlaceId);
    
    setIsLoading(true);
    try {
      const result = await fetchPlacePreview(selectedPlaceId);
      if (result.success && result.data) {
        setPreviewData(result.data);
        setPreviewPlaceId(selectedPlaceId);
        setDialogOpen(true);
      } else {
        toast.error(result.error || t("dashboard.aiDialog.error"));
      }
    } catch {
      toast.error(t("dashboard.aiDialog.error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: User confirm → save to DB
  const handleConfirmSave = async () => {
    if (!previewData) return;

    setIsSaving(true);
    try {
      const result = await confirmSaveReviews(
        previewPlaceId,
        previewData.place_info,
        previewData.reviews,
      );
      if (result.success) {
        toast.success(result.message);
        setDialogOpen(false);
        setPreviewData(null);
        setPlaceId("");
      } else {
        toast.error(result.error || t("dashboard.aiDialog.errorToast"));
      }
    } catch {
      toast.error(t("dashboard.aiDialog.errorToast"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden border border-border/40 bg-card/25 backdrop-blur-sm rounded-xl p-5 md:p-6 shadow-sm">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-semibold text-base tracking-tight flex items-center gap-1.5 text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("dashboard.fetchBar.title")}
            </h3>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              {t("dashboard.fetchBar.desc")}
            </p>
          </div>

          <form
            onSubmit={handleFetch}
            className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                placeholder={t("dashboard.fetchBar.placeholder")}
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                className="pl-10 pr-4 bg-background/40"
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => setSearchDialogOpen(true)}
                className="px-4 shadow-sm"
              >
                <Search className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{t("dashboard.fetchBar.searchBtn")}</span>
              </Button>
              <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 h-10 shadow-sm shadow-primary/10 transition-colors shrink-0 flex items-center justify-center gap-1.5"
            >
              <Download
                className={`h-4 w-4 ${isLoading ? "animate-bounce" : ""}`}
              />
              {isLoading ? t("dashboard.fetchBar.loading") : t("dashboard.fetchBar.button")}
            </Button>
            </div>
          </form>
        </div>
      </div>

      <FetchPreviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        data={previewData}
        onConfirm={handleConfirmSave}
        isSaving={isSaving}
      />

      <PlaceSearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        onSelectPlace={handleSelectPlaceFromSearch}
      />
    </>
  );
}
