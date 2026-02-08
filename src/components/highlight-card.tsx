import { memo } from "react";
import { formatStrike } from "@/lib/utils";
import { MoveUp, MoveDown } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";

const HighlightCard = memo(
  ({
    instrument,
    type,
  }: {
    instrument: { symbol: string; strikePrice: string };
    type: "CALL" | "PUT";
  }) => {
    const isCall = type === "CALL";
    return (
      <Card
        className={`${isCall ? "border-call/30 bg-call-muted" : "border-put/30 bg-put-muted"}`}
      >
        <CardHeader className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold py-0.5 rounded ${
              isCall ? "bg-call/20 text-call" : "bg-put/20 text-put"
            }`}
          >
            {isCall ? (
              <>
                <MoveUp className="w-3 h-3 inline-block mr-1" />
                Call
              </>
            ) : (
              <>
                <MoveDown className="w-3 h-3 inline-block mr-1" /> Put
              </>
            )}
          </span>
          <span className="text-xs text-muted-foreground">Highlighted</span>
        </CardHeader>
        <CardContent className="font-mono text-sm text-foreground truncate">
          {instrument.symbol}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground mt-1">
          Strike: ${formatStrike(instrument.strikePrice)}
        </CardFooter>
      </Card>
    );
  },
);

HighlightCard.displayName = "HighlightCard";

export default HighlightCard;
