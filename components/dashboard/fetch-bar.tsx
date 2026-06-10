"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchPlacePreview, confirmSaveReviews } from "@/actions/db";
import { FetchPreviewDialog } from "@/components/dashboard/fetch-preview-dialog";
import { Download, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { FetchPreviewData } from "@/lib/types";

export function FetchBar() {
  const [placeId, setPlaceId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] =
    useState<FetchPreviewData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  // Lưu placeId đang preview để dùng khi confirm
  const [previewPlaceId, setPreviewPlaceId] = useState("");

  // Step 1: Fetch preview
  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = placeId.trim();
    if (!id) {
      toast.error("Vui lòng nhập Google Place ID");
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
        toast.error(result.error || "Không lấy được dữ liệu");
      }
    } catch {
      toast.error("Không thể kết nối đến Google Maps");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: User xác nhận → lưu vào DB
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
        toast.error(result.error || "Không thể lưu");
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi lưu");
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
              Lấy đánh giá từ Google Maps
            </h3>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Nhập Google Place ID để xem trước và lưu đánh giá mới
              nhất. Hệ thống sẽ hiển thị thông tin địa điểm trước khi
              bạn xác nhận lưu.
            </p>
          </div>

          <form
            onSubmit={handleFetch}
            className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                placeholder="Nhập Google Place ID"
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                className="pl-10 pr-4 bg-background/40"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 h-10 shadow-sm shadow-primary/10 transition-colors shrink-0 flex items-center justify-center gap-1.5"
            >
              <Download
                className={`h-4 w-4 ${isLoading ? "animate-bounce" : ""}`}
              />
              {isLoading ? "Đang tải..." : "Lấy Review"}
            </Button>
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
    </>
  );
}
