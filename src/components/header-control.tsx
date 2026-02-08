"use client";
import { memo } from "react";
import { RefreshCw } from "lucide-react";

const BASES = ["BTC", "ETH"] as const;
type Base = (typeof BASES)[number];

interface HeaderControlsProps {
  base: Base;
  loading: boolean;
  onBaseChange: (base: Base) => void;
  onRefresh: () => void;
}

const HeaderControls = memo(
  ({ base, loading, onBaseChange, onRefresh }: HeaderControlsProps) => {
    return (
      <header className="mb-6 w-full flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-muted-foreground mt-1">
            Live instruments · Binance European Options
          </p>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex ring-foreground/50 ring-1 rounded-md overflow-hidden">
            {BASES.map((b) => (
              <button
                key={b}
                onClick={() => onBaseChange(b)}
                className={`px-4 py-1.5 text-sm transition-colors hover:cursor-pointer ${
                  base === b
                    ? "bg-gray-200 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3 py-2.5 text-sm ring-foreground/50 ring-1 rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </header>
    );
  },
);

HeaderControls.displayName = "HeaderControls";

export { HeaderControls, type Base };
export const BASES_CONST = BASES;
