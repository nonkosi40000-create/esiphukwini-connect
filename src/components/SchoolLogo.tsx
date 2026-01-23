import { cn } from "@/lib/utils";

interface SchoolLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "default" | "white";
}

export function SchoolLogo({ 
  className, 
  size = "md", 
  showText = true,
  variant = "default" 
}: SchoolLogoProps) {
  const sizes = {
    sm: { container: "w-10 h-10", sun: 40, text: "text-sm" },
    md: { container: "w-14 h-14", sun: 56, text: "text-lg" },
    lg: { container: "w-20 h-20", sun: 80, text: "text-2xl" },
  };

  const currentSize = sizes[size];
  const isWhite = variant === "white";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo SVG - Sun rising with book */}
      <div className={cn(currentSize.container, "relative flex-shrink-0")}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Sun rays */}
          <g className={isWhite ? "stroke-white" : "stroke-primary"} strokeWidth="2">
            <line x1="50" y1="5" x2="50" y2="15" />
            <line x1="75" y1="15" x2="68" y2="22" />
            <line x1="90" y1="40" x2="80" y2="40" />
            <line x1="25" y1="15" x2="32" y2="22" />
            <line x1="10" y1="40" x2="20" y2="40" />
            <line x1="15" y1="60" x2="22" y2="55" />
            <line x1="85" y1="60" x2="78" y2="55" />
          </g>
          
          {/* Sun circle */}
          <circle
            cx="50"
            cy="45"
            r="25"
            className={isWhite ? "fill-white" : "fill-primary"}
          />
          
          {/* Horizon line */}
          <line
            x1="10"
            y1="70"
            x2="90"
            y2="70"
            className={isWhite ? "stroke-white" : "stroke-primary"}
            strokeWidth="2"
          />
          
          {/* Open book on top of sun */}
          <g transform="translate(30, 30)">
            {/* Left page */}
            <path
              d="M20 5 L5 10 L5 30 L20 25 Z"
              className={isWhite ? "fill-white stroke-primary" : "fill-white stroke-foreground"}
              strokeWidth="1.5"
            />
            {/* Right page */}
            <path
              d="M20 5 L35 10 L35 30 L20 25 Z"
              className={isWhite ? "fill-white stroke-primary" : "fill-white stroke-foreground"}
              strokeWidth="1.5"
            />
            {/* Book spine */}
            <line
              x1="20"
              y1="5"
              x2="20"
              y2="25"
              className={isWhite ? "stroke-primary" : "stroke-foreground"}
              strokeWidth="1"
            />
            {/* Text lines on left page */}
            <line x1="8" y1="14" x2="17" y2="12" className="stroke-muted-foreground" strokeWidth="0.5" />
            <line x1="8" y1="18" x2="17" y2="16" className="stroke-muted-foreground" strokeWidth="0.5" />
            <line x1="8" y1="22" x2="17" y2="20" className="stroke-muted-foreground" strokeWidth="0.5" />
            {/* Text lines on right page */}
            <line x1="23" y1="12" x2="32" y2="14" className="stroke-muted-foreground" strokeWidth="0.5" />
            <line x1="23" y1="16" x2="32" y2="18" className="stroke-muted-foreground" strokeWidth="0.5" />
            <line x1="23" y1="20" x2="32" y2="22" className="stroke-muted-foreground" strokeWidth="0.5" />
          </g>
          
          {/* School name on book */}
          <text
            x="50"
            y="42"
            textAnchor="middle"
            className={isWhite ? "fill-primary" : "fill-foreground"}
            fontSize="5"
            fontWeight="bold"
            fontFamily="serif"
          >
            ESIPHUKWINI
          </text>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-display font-bold leading-tight",
            currentSize.text,
            isWhite ? "text-white" : "text-foreground"
          )}>
            Esiphukwini
          </span>
          <span className={cn(
            "text-xs",
            isWhite ? "text-white/80" : "text-muted-foreground"
          )}>
            Junior Primary School
          </span>
          <span className={cn(
            "text-[10px] font-semibold tracking-wider uppercase",
            isWhite ? "text-gold" : "text-primary"
          )}>
            Arise and Shine
          </span>
        </div>
      )}
    </div>
  );
}
