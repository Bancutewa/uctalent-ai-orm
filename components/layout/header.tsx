import Link from "next/link";
import { MessageSquareShare } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center px-4 md:px-8 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105">
            <MessageSquareShare className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
            UCTalent AI-ORM
          </span>
        </Link>
        
        <nav className="ml-auto flex items-center gap-6 text-sm font-medium">
          <Link 
            href="/" 
            className="relative text-foreground transition-colors hover:text-primary py-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Reviews
          </Link>
          <Link 
            href="/settings" 
            className="relative text-muted-foreground transition-colors hover:text-primary py-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
}
