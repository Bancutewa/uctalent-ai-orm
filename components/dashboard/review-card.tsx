import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MessageSquareCode, Calendar, Globe, CheckCircle } from "lucide-react";
import { Review } from "@/lib/types";

interface ReviewCardProps {
  review: Review;
  onGenerateAI?: (reviewId: string) => void;
}

export function ReviewCard({ review, onGenerateAI }: ReviewCardProps) {
  const approvedReply = review.replies?.find(r => r.is_selected && r.status === 'approved');
  const hasReplies = review.replies && review.replies.length > 0;
  
  // Format Date
  const dateStr = new Date(review.created_at).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 shadow-sm flex flex-col justify-between h-full group">
      <div>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5 pb-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground tracking-tight text-base group-hover:text-primary transition-colors duration-300">
                {review.author_name}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {review.source}
              </span>
            </div>
            
            {/* Stars */}
            <div className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating ? "fill-amber-500" : "text-muted-foreground/35 fill-none"
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Status Badge */}
          {approvedReply ? (
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 gap-1 hover:bg-emerald-500/15">
              <CheckCircle className="h-3.5 w-3.5" />
              Resolved
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border border-amber-500/20 gap-1 hover:bg-amber-500/15">
              Pending
            </Badge>
          )}
        </CardHeader>
        
        <CardContent className="px-5 py-2">
          <p className="text-sm text-foreground/80 leading-relaxed break-words whitespace-pre-line">
            {review.content || <span className="italic text-muted-foreground">Không có nội dung đánh giá.</span>}
          </p>
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
              View Source
            </a>
          )}
        </div>

        {/* Selected Approved Reply */}
        {approvedReply ? (
          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3 mt-1">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold text-emerald-500">Selected Response</span>
              <span className="text-[10px] text-muted-foreground">Auto-approved</span>
            </div>
            <p className="text-xs text-foreground/85 italic leading-relaxed">
              "{approvedReply.content}"
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-1">
            {hasReplies && (
              <p className="text-xs text-muted-foreground italic">
                {review.replies!.length} AI options generated. Waiting approval.
              </p>
            )}
            <Button
              size="sm"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center justify-center gap-1.5 shadow-sm shadow-primary/10 transition-colors"
            >
              <MessageSquareCode className="h-4 w-4" />
              Generate AI Reply
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
