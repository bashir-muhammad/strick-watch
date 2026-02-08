import { memo } from "react";
import { formatStrike } from "@/lib/utils";

interface StrikeRowProps {
  strike: string;
  call: { symbol: string } | null;
  put: { symbol: string } | null;
  isHighlighted: boolean;
  callHighlighted: boolean;
  putHighlighted: boolean;
}
const StrikeRow = memo(
  ({
    strike,
    call,
    put,
    isHighlighted,
    callHighlighted,
    putHighlighted,
  }: StrikeRowProps) => (
    <tr
      key={strike}
      className={`border-t border-gray-200 transition-colors ${
        isHighlighted
          ? "bg-highlight/10 border-gray-300"
          : "hover:bg-secondary/30 "
      }`}
    >
      <td
        className={`px-4 py-2 ${isHighlighted ? "text-highlight font-semibold" : "text-foreground"}`}
      >
        {formatStrike(strike)}
        {isHighlighted && (
          <span className="ml-2 text-xs text-highlight opacity-70">★</span>
        )}
      </td>
      <td className="px-4 py-2 text-center">
        {call ? (
          <span
            className={`${callHighlighted ? "text-highlight font-bold" : "text-call"}`}
          >
            {call.symbol.split("-").slice(-1)[0] === "C" ? "●" : ""}
            {" " + call.symbol}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-2 text-center">
        {put ? (
          <span
            className={`${putHighlighted ? "text-highlight font-bold" : "text-put"}`}
          >
            {put.symbol}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
    </tr>
  ),
);

StrikeRow.displayName = "StrikeRow";
export default StrikeRow;
