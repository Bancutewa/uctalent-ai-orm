"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Save, X } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import type { FetchPreviewData } from "@/lib/types";

interface FetchPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: FetchPreviewData | null;
  onConfirm: () => void;
  isSaving: boolean;
}

export function FetchPreviewDialog({
  open,
  onOpenChange,
  data,
  onConfirm,
  isSaving,
}: FetchPreviewDialogProps) {
  const { t } = useLanguage();
  if (!data) return null;

  const { place_info, reviews } = data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            {place_info.title}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-2 pt-1">
            {place_info.address && <span>{place_info.address}</span>}
            {place_info.type && (
              <Badge variant="outline" className="text-xs">
                {place_info.type}
              </Badge>
            )}
            {place_info.rating && (
              <span className="flex items-center gap-1 text-amber-500 font-medium">
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                {place_info.rating}
              </span>
            )}
            {place_info.reviews && (
              <span className="text-muted-foreground">
                ({place_info.reviews.toLocaleString()} {t("header.reviews").toLowerCase()})
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Reviews preview list */}
        <div className="flex flex-col gap-3 py-2">
          <p className="text-sm font-medium text-muted-foreground">
            {t("dashboard.previewDialog.reviewsToSave", { count: reviews.length })}
          </p>

          {reviews.length === 0 ? (
            <div className="p-6 border border-dashed border-border/60 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                {t("dashboard.previewDialog.noReviews")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="border border-border/40 rounded-lg p-3 bg-card/30"
                >
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {review.author_avatar ? (
                        <Image
                          src={review.author_avatar}
                          alt={review.author_name}
                          width={24}
                          height={24}
                          unoptimized
                          className="h-6 w-6 rounded-full object-cover border border-border/60 bg-muted shrink-0"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-semibold text-[10px] shrink-0">
                          {review.author_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span
                        className="text-sm font-medium truncate"
                        title={review.author_name}
                      >
                        {review.author_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating
                              ? "fill-amber-500 text-amber-500"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                    {review.content}
                  </p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 mt-2 snap-x">
                      {review.images.map((imgUrl, i) => (
                        <div
                          key={i}
                          className="relative h-10 w-10 rounded-md overflow-hidden border border-border/40 shrink-0 snap-start bg-muted"
                        >
                          <Image
                            src={imgUrl}
                            alt={`Review image ${i + 1}`}
                            width={40}
                            height={40}
                            unoptimized
                            className="h-full w-full object-cover cursor-pointer"
                            onClick={() =>
                              window.open(imgUrl, "_blank")
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    {new Date(review.created_at).toLocaleDateString(
                      "vi-VN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            <X className="h-4 w-4 mr-1.5" />
            {t("common.cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSaving || reviews.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {isSaving
              ? t("dashboard.previewDialog.saving")
              : t("dashboard.previewDialog.confirmBtn", { count: reviews.length })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
