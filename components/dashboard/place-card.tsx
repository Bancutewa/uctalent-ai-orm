"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ChevronDown, ChevronUp, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { ReviewCard } from "@/components/dashboard/review-card";
import type { Place, Review } from "@/lib/types";

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const reviews = place.reviews ?? [];
  const totalReviews = reviews.length;
  const resolvedCount = reviews.filter(r =>
    r.replies?.some(rep => rep.is_selected && rep.status === "approved")
  ).length;
  const pendingCount = totalReviews - resolvedCount;

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    if (expanded) {
      const timer = setTimeout(() => {
        handleScroll();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [expanded, reviews.length]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <Card className="border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-primary/20">
      {/* Place Header — clickable */}
      <CardHeader
        className="cursor-pointer select-none p-5"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base tracking-tight truncate">
                {place.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                {place.address && (
                  <span className="text-xs text-muted-foreground truncate">
                    {place.address}
                  </span>
                )}
                {place.type && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {place.type}
                  </Badge>
                )}
                {place.rating && (
                  <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                    <Star className="h-3 w-3 fill-amber-500" />
                    {place.rating}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Stats badges */}
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="secondary" className="bg-muted/50 gap-1">
                <MessageSquare className="h-3 w-3" />
                {totalReviews}
              </Badge>
              {pendingCount > 0 && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">
                  {pendingCount} pending
                </Badge>
              )}
              {resolvedCount > 0 && (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
                  {resolvedCount} resolved
                </Badge>
              )}
            </div>

            <Button variant="ghost" size="icon" className="h-8 w-8">
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Expanded: show reviews */}
      {expanded && (
        <CardContent className="px-5 pb-5 pt-0">
          <div className="border-t border-border/40 pt-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Chưa có đánh giá nào cho địa điểm này.
              </p>
            ) : (
              <div className="relative">
                {/* Title */}
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                  Danh sách đánh giá ({reviews.length})
                </h4>

                {/* Carousel with side buttons */}
                <div className="relative group/carousel">
                  {/* Left Arrow Button */}
                  {reviews.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => scroll("left")}
                      className={`absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/95 border border-border/80 shadow-md backdrop-blur-xs transition-all duration-300 hover:scale-105 active:scale-95 ${
                        showLeftArrow
                          ? "opacity-100 scale-100 pointer-events-auto"
                          : "opacity-0 scale-90 pointer-events-none"
                      }`}
                      title="Trượt sang trái"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Right Arrow Button */}
                  {reviews.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => scroll("right")}
                      className={`absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/95 border border-border/80 shadow-md backdrop-blur-xs transition-all duration-300 hover:scale-105 active:scale-95 ${
                        showRightArrow
                          ? "opacity-100 scale-100 pointer-events-auto"
                          : "opacity-0 scale-90 pointer-events-none"
                      }`}
                      title="Trượt sang phải"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Horizontal Scrolling Carousel Container */}
                  <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-3 pt-1 px-1"
                  >
                    {reviews.map((review: Review) => (
                      <div
                        key={review.id}
                        className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] shrink-0 snap-start snap-always"
                      >
                        <ReviewCard review={review} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
