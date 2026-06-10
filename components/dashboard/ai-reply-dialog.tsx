"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Bot,
  Loader2,
  CheckCircle,
  Smile,
  Briefcase,
  Wrench,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { generateRepliesAction } from "@/actions/gemini";
import { saveAndApproveReply } from "@/actions/db";
import { Review } from "@/lib/types";
import { toast } from "sonner";

interface GeneratedReplies {
  standard: string;
  friendly: string;
  fixing: string;
}

interface AIReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review;
  onApproved: () => void;
}

type TabKey = "standard" | "friendly" | "fixing";

const TAB_CONFIG: {
  key: TabKey;
  label: string;
  Icon: React.ElementType;
  accent: string;
}[] = [
  {
    key: "standard",
    label: "Chuẩn mực",
    Icon: Briefcase,
    accent: "text-blue-400",
  },
  {
    key: "friendly",
    label: "Thân thiện",
    Icon: Smile,
    accent: "text-emerald-400",
  },
  {
    key: "fixing",
    label: "Khắc phục",
    Icon: Wrench,
    accent: "text-amber-400",
  },
];

export function AIReplyDialog({
  open,
  onOpenChange,
  review,
  onApproved,
}: AIReplyDialogProps) {
  const [replies, setReplies] = useState<GeneratedReplies | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("standard");
  const [copiedKey, setCopiedKey] = useState<TabKey | null>(null);
  const [isPending, startTransition] = useTransition();

  // Auto-generate when dialog opens
  useEffect(() => {
    if (!open) return;
    setReplies(null);
    setGenError(null);
    setIsGenerating(true);

    generateRepliesAction(review.content, review.rating)
      .then((result) => {
        if (result.success) {
          setReplies(result.data);
        } else {
          setGenError(result.error ?? "Không thể tạo phản hồi.");
        }
      })
      .finally(() => setIsGenerating(false));
  }, [open, review.content]);

  const handleCopy = async (key: TabKey) => {
    if (!replies) return;
    await navigator.clipboard.writeText(replies[key]);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApprove = (selectedKey: TabKey) => {
    if (!replies) return;

    startTransition(async () => {
      const selectedContent = replies[selectedKey];

      // Lưu duy nhất phản hồi đã chọn và duyệt luôn
      const result = await saveAndApproveReply(review.id, selectedContent);

      if (!result.success) {
        toast.error("Lỗi duyệt phản hồi", {
          description: result.error,
        });
        return;
      }

      toast.success("Phản hồi đã được duyệt!", {
        description: `Phong cách: ${TAB_CONFIG.find((t) => t.key === selectedKey)?.label}`,
      });

      onOpenChange(false);
      onApproved();
    });
  };

  const previewContent =
    review.content?.trim().slice(0, 120) +
    (review.content?.length > 120 ? "…" : "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold leading-tight">
                Phản hồi AI
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5 leading-relaxed">
                Của <span className="font-medium text-foreground/80">{review.author_name}</span>
              </DialogDescription>
            </div>
          </div>
          {/* Review excerpt */}
          <div className="mt-3 rounded-lg border border-border/30 bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              &ldquo;{previewContent}&rdquo;
            </p>
          </div>
        </DialogHeader>

        <div className="mt-1 min-h-[200px]">
          {/* Loading state */}
          {isGenerating && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm animate-pulse">Đang tạo phản hồi AI…</p>
            </div>
          )}

          {/* Error state */}
          {genError && !isGenerating && (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <AlertCircle className="h-8 w-8 text-destructive/70" />
              <p className="text-sm text-destructive/80">{genError}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsGenerating(true);
                  setGenError(null);
                  generateRepliesAction(review.content, review.rating)
                    .then((r) => {
                      if (r.success) setReplies(r.data);
                      else setGenError(r.error ?? "Lỗi không xác định.");
                    })
                    .finally(() => setIsGenerating(false));
                }}
              >
                Thử lại
              </Button>
            </div>
          )}

          {/* Tabs with generated replies */}
          {replies && !isGenerating && (
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as TabKey)}
            >
              <TabsList className="w-full bg-muted/40 border border-border/30">
                {TAB_CONFIG.map(({ key, label, Icon }) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex-1 flex items-center gap-1.5 text-xs"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {TAB_CONFIG.map(({ key, accent }) => (
                <TabsContent key={key} value={key} className="mt-3">
                  <div className="relative rounded-xl border border-border/30 bg-muted/20 p-4 pr-10 min-h-[100px]">
                    <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
                      {replies[key]}
                    </p>
                    {/* Copy button */}
                    <button
                      onClick={() => handleCopy(key)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                      title="Sao chép"
                    >
                      {copiedKey === key ? (
                        <Check className={`h-4 w-4 ${accent}`} />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <Button
                    className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-2 shadow-sm shadow-primary/10"
                    onClick={() => handleApprove(key)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Dùng câu này
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
