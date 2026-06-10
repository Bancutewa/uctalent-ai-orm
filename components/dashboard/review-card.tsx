"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  MessageSquareCode,
  Calendar,
  Globe,
  CheckCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { Review } from "@/lib/types";
import { AIReplyDialog } from "@/components/dashboard/ai-reply-dialog";
import { deleteReplyForReview } from "@/actions/db";
import { toast } from "sonner";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleRevoke = () => {
    startTransition(async () => {
      const result = await deleteReplyForReview(review.id);
      if (result.success) {
        toast.success(t("common.success"));
        setRevokeDialogOpen(false);
      } else {
        toast.error(result.error || t("common.error"));
      }
    });
  };

  const approvedReply = review.replies?.find(
    (r) => r.status === "approved",
  );
  const hasReplies = review.replies && review.replies.length > 0;

  // Format Date
  const dateStr = new Date(review.created_at).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Card className="border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 shadow-sm flex flex-col justify-between h-full group">
        <div>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5 pb-3">
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                {review.author_avatar ? (
                  <Image
                    src={review.author_avatar}
                    alt={review.author_name}
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 rounded-full object-cover border border-border/60 bg-muted shrink-0"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                    {review.author_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span
                    className="font-semibold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors duration-300 truncate max-w-[125px] sm:max-w-[145px]"
                    title={review.author_name}
                  >
                    {review.author_name}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Globe className="h-2.5 w-2.5" />
                    {review.source}
                  </span>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < review.rating
                        ? "fill-amber-500"
                        : "text-muted-foreground/35 fill-none"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Status Badge */}
            {approvedReply ? (
              <Badge
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 gap-1 hover:bg-emerald-500/15"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {t("dashboard.reviewCard.resolved")}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-500 border border-amber-500/20 gap-1 hover:bg-amber-500/15"
              >
                {t("dashboard.reviewCard.pending")}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="px-5 py-2 flex-1 flex flex-col justify-between">
            <p className="text-sm text-foreground/80 leading-relaxed break-words whitespace-pre-line">
              {review.content || (
                <span className="italic text-muted-foreground">
                  {t("dashboard.reviewCard.noContent")}
                </span>
              )}
            </p>
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 mt-3 snap-x">
                {review.images.map((imgUrl, i) => (
                  <div
                    key={i}
                    className="relative h-14 w-14 rounded-lg overflow-hidden border border-border/40 shrink-0 snap-start bg-muted"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Review image ${i + 1}`}
                      width={56}
                      height={56}
                      unoptimized
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110 cursor-pointer"
                      onClick={() => window.open(imgUrl, "_blank")}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </div>

        <CardFooter className="px-5 py-4 border-t border-border/40 bg-muted/5 mt-4 flex flex-col items-stretch gap-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {dateStr}
            </span>
            {review.url && (
              <a
                href={review.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-colors"
              >
                {t("dashboard.reviewCard.viewSource")}
              </a>
            )}
          </div>

          {/* Selected Approved Reply */}
          {approvedReply ? (
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3 mt-1">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold text-emerald-500">
                  {t("dashboard.reviewCard.selectedResponse")}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    {t("dashboard.reviewCard.autoApproved")}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    onClick={() => setRevokeDialogOpen(true)}
                    disabled={isPending}
                    title={t("dashboard.reviewCard.revokeBtn")}
                  >
                    {isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RotateCcw className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-foreground/85 italic leading-relaxed">
                &ldquo;{approvedReply.content}&rdquo;
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-1">
              {hasReplies && (
                <p className="text-xs text-muted-foreground italic">
                  {t("dashboard.reviewCard.aiOptionsCount", { count: review.replies!.length })}
                </p>
              )}
              <Button
                size="sm"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center justify-center gap-1.5 shadow-sm shadow-primary/10 transition-colors"
                onClick={() => setDialogOpen(true)}
              >
                <MessageSquareCode className="h-4 w-4" />
                {t("dashboard.reviewCard.generateBtn")}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* AI Reply Dialog */}
      <AIReplyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        review={review}
        onApproved={() => router.refresh()}
      />

      {/* Revoke Confirmation Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dashboard.reviewCard.revokeBtn")}</DialogTitle>
            <DialogDescription>
              {t("dashboard.reviewCard.revokeConfirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setRevokeDialogOpen(false)}
              disabled={isPending}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevoke}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("common.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
