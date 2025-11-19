import { Typography } from "./Typography";
import { NumberTicker } from "./NumberTicker";

interface StatisticProps {
  statistic: number;
  formatOptions?: Intl.NumberFormatOptions;
  label: string;
  animated?: boolean;
}

export function Statistic({
  animated,
  statistic,
  label,
  formatOptions,
}: StatisticProps) {
  return (
    <div className="space-y-0.5 border-l-4 py-4 pl-8">
      <Typography variant="display" size="sm" color="primary">
        {animated ? (
          <NumberTicker value={statistic} formatOptions={formatOptions} />
        ) : (
          Intl.NumberFormat("en-GB", formatOptions).format(statistic)
        )}
      </Typography>
      <Typography variant="body" size="lg" color="secondary">
        {label}
      </Typography>
    </div>
  );
}
