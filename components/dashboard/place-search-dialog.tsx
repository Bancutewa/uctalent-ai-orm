"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, Loader2, MessageSquare } from "lucide-react";
import { searchPlacesAction } from "@/actions/serp";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";
import type { SerpLocalResult } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface PlaceSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPlace: (placeId: string) => void;
}

export function PlaceSearchDialog({
  open,
  onOpenChange,
  onSelectPlace,
}: PlaceSearchDialogProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SerpLocalResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const res = await searchPlacesAction(query);
      if (res.success && res.data) {
        setResults(res.data);
      } else {
        toast.error(res.error || t("common.error"));
        setResults([]);
      }
    } catch (error) {
      toast.error(t("common.error"));
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (placeId: string) => {
    onSelectPlace(placeId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 border border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="p-5 pb-4 border-b border-border/40 bg-muted/20">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            {t("dashboard.searchDialog.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="p-5 flex-1 overflow-hidden flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex gap-2 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                placeholder={t("dashboard.searchDialog.placeholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 bg-background/50"
                autoFocus
              />
            </div>
            <Button type="submit" disabled={isSearching || !query.trim()} className="shrink-0 gap-1.5">
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {t("dashboard.searchDialog.button")}
            </Button>
          </form>

          <div className="flex-1 overflow-y-auto pr-1 -mr-1">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm">{t("dashboard.searchDialog.searching")}</p>
              </div>
            ) : hasSearched && results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center">
                <MapPin className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p>{t("dashboard.searchDialog.empty")}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pb-2">
                {results.map((place) => (
                  <div
                    key={place.place_id}
                    className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 rounded-xl border border-border/40 bg-card/40 hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => handleSelect(place.place_id)}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {place.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 truncate flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {place.address}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        {place.rating !== undefined && (
                          <span className="flex items-center gap-1 text-xs font-medium text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-amber-500" />
                            {place.rating}
                          </span>
                        )}
                        {place.reviews !== undefined && (
                          <Badge variant="secondary" className="text-[10px] h-5 bg-muted/60 text-muted-foreground gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {place.reviews}
                          </Badge>
                        )}
                        {place.type && (
                          <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted/50">
                            {place.type}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(place.place_id);
                      }}
                    >
                      {t("dashboard.searchDialog.selectBtn")}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
