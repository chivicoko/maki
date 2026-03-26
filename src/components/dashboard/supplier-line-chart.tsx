'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
  data: any[];
  highlightLastPoint?: boolean;
  getDotProps?: (props: any) => any;
  title?: string;
  value?: string;
  change?: string;
  target?: string;
  targetDiff?: string;
  color?: string;
  targetValue?: number;
};

const SupplierLineChart = ({
  data,
  highlightLastPoint = true,
  getDotProps,
  title = 'PSS Pass Rate',
  value = '79%',
  change = '3%',
  target = '90%',
  targetDiff = '-11% below',
  color = '#d90429',
  targetValue = 150
}: Props) => {
  const lastIndex = data?.length - 1;

  return (
    <Card className="rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <CardContent className="p-3">
        {/* HEADER */}
        <div className="mb-2">
          <h3 className="text-[16px] font-medium">{title}</h3>

          <div className="flex justify-between mt-1">
            {/* LEFT */}
            <div className="flex items-center gap-2">
              <span
                className="text-[22px] font-bold"
                style={{ color }}
              >
                {value}
              </span>

              <span
                className="flex items-center gap-1 text-[13px]"
                style={{ color }}
              >
                <TrendingDown size={14} />
                {change}
              </span>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <p className="text-[14px]">Target {target}</p>
              <p className="text-[13px]" style={{ color }}>
                {targetDiff}
              </p>
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid stroke="#e5e7eb" vertical={false} />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />

              <YAxis
                domain={[0, 300]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />

              {/* TARGET LINE */}
              <ReferenceLine
                y={targetValue}
                stroke="#e0a96d"
                strokeDasharray="4 4"
              />

              {/* AREA */}
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={color}
                fillOpacity={0.1}
                baseValue={0}
                dot={(props: any) => {
                  const { cx, cy, index } = props;

                  const custom = getDotProps
                    ? getDotProps({ ...props, lastIndex })
                    : null;

                  const isLast = index === lastIndex;

                  const r =
                    custom?.r ??
                    (highlightLastPoint && isLast ? 6 : 5);

                  const fill =
                    custom?.fill ??
                    (highlightLastPoint && isLast ? color : '#fff');

                  const stroke = custom?.stroke ?? color;

                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={2}
                    />
                  );
                }}
              />

              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierLineChart;