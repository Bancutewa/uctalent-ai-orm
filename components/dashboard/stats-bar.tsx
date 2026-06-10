import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Clock, CheckCircle2, MapPin } from "lucide-react";

interface StatsBarProps {
  totalPlaces?: number;
  total?: number;
  pending?: number;
  resolved?: number;
}

export function StatsBar({ totalPlaces = 0, total = 0, pending = 0, resolved = 0 }: StatsBarProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Places Card */}
      <Card className="relative overflow-hidden border border-border/40 bg-card/40 backdrop-blur-sm shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:border-violet-500/30 hover:shadow-md hover:shadow-violet-500/5 group">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-violet-500/5 rounded-full blur-xl group-hover:bg-violet-500/10 transition-all duration-300" />
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Địa điểm</p>
            <div className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {totalPlaces}
            </div>
            <p className="text-xs text-muted-foreground/85">Đã đồng bộ</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-500 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-violet-500/20">
            <MapPin className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
      {/* Total Card */}
      <Card className="relative overflow-hidden border border-border/40 bg-card/40 backdrop-blur-sm shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 group">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all duration-300" />
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Total Reviews</p>
            <div className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {total}
            </div>
            <p className="text-xs text-muted-foreground/85">All synced reviews</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/20">
            <MessageSquare className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Pending Card */}
      <Card className="relative overflow-hidden border border-border/40 bg-card/40 backdrop-blur-sm shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:border-amber-500/30 hover:shadow-md hover:shadow-amber-500/5 group">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all duration-300" />
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Pending Action</p>
            <div className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {pending}
            </div>
            <p className="text-xs text-muted-foreground/85">Reviews waiting for reply</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-amber-500/20">
            <Clock className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Resolved Card */}
      <Card className="relative overflow-hidden border border-border/40 bg-card/40 backdrop-blur-sm shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/5 group">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all duration-300" />
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Resolved</p>
            <div className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {resolved}
            </div>
            <p className="text-xs text-muted-foreground/85">Successfully replied</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-emerald-500/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
