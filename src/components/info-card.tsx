import { memo } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
const InfoCard = memo(
  ({
    label,
    value,
    sub,
    mono,
    accent,
  }: {
    label: string;
    value: string;
    sub?: string;
    mono?: boolean;
    accent?: boolean;
  }) => {
    return (
      <Card>
        <CardHeader className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </CardHeader>
        <CardContent
          className={`text-sm font-semibold truncate ${mono ? "text-xs" : ""} ${accent ? "text-highlight" : "text-foreground"}`}
        >
          {value}
        </CardContent>
        {sub && (
          <CardFooter className="text-xs text-muted-foreground">
            {sub}
          </CardFooter>
        )}
      </Card>
    );
  },
);

InfoCard.displayName = "InfoCard";

export default InfoCard;
