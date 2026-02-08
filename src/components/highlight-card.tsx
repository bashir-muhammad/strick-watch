import { formatStrike } from "@/lib/utils";
import { Card } from "./ui/card";

const HighlightCard = ({
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
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded ${
            isCall ? "bg-call/20 text-call" : "bg-put/20 text-put"
          }`}
        >
          {isCall ? "↑ CALL" : "↓ PUT"}
        </span>
        <span className="text-xs text-muted-foreground">Highlighted</span>
      </div>
      <div className="font-mono text-sm text-foreground truncate">
        {instrument.symbol}
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Strike: ${formatStrike(instrument.strikePrice)}
      </div>
    </Card>
  );
};

export default HighlightCard;
