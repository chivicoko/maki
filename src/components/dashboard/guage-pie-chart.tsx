'use client';

import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '../ui/card';

/* =========================
   DATA
========================= */
const segments = [
  { name: 'Critical', value: 20, fill: '#e63946' },
  { name: 'Immediate', value: 17, fill: '#f4a261' },
  { name: 'Monitor', value: 13, fill: '#e9c46a' },
  { name: 'Watch', value: 50, fill: '#8ab17d' }
];

const currentValue = 65;

/* =========================
   NEEDLE
========================= */
const Needle = ({ value }: { value: number }) => {
  const total = segments.reduce((acc, cur) => acc + cur.value, 0);

  // Convert value → angle (180 → 0)
  const angle = 180 - (value / total) * 180;

  const cx = 150; // center X (depends on chart width)
  const cy = 130; // center Y (matches cy="100%")
  const length = 77;

  const rad = (Math.PI / 180) * angle;

  const x = cx + length * Math.cos(rad);
  const y = cy - length * Math.sin(rad);

  return (
    <g>
      <circle cx={cx} cy={cy} r={4} fill="#2f2f2f" />
      <line
        x1={cx}
        y1={cy}
        x2={x}
        y2={y}
        stroke="#2f2f2f"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  );
};

/* =========================
   HELPER
========================= */
const getActiveIndex = (value: number) => {
  let cumulative = 0;

  for (let i = 0; i < segments.length; i++) {
    cumulative += segments[i].value;
    if (value <= cumulative) return i;
  }

  return segments.length - 1;
};

/* =========================
   ROW
========================= */
const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-wrap">
    <p className="text-[13px] text-muted-foreground">{label}</p>
    <p className="text-[13px] font-medium">{value}</p>
  </div>
);

/* =========================
   COMPONENT
========================= */
const GuagePieChart = () => {
  const activeIndex = getActiveIndex(currentValue);

  return (
    <Card className="p-2 md:p-3 rounded-xl bg-white">
      <CardContent className="p-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* ================= LEFT ================= */}
          <div className="flex-1 flex flex-col items-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
              <h4 className="text-[14px] md:text-[16px] font-semibold">
                PO & Stock Consumption
              </h4>

              <Badge className="bg-[#8ab17d] text-white text-xs px-2 py-[2px]">
                12 Weeks
              </Badge>
            </div>

            {/* CHART */}
            <div className="w-full max-w-[300px] h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segments}
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    cx="50%"
                    cy="100%"
                    innerRadius={87}
                    outerRadius={100}
                    paddingAngle={2}
                  />

                  <Needle value={currentValue} />
                  <Tooltip />

                  {/* Legend */}
                  {/* <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={10}
                    layout="horizontal"
                    wrapperStyle={{ fontSize: 12, marginTop: 10 }}
                  /> */}
                  
                  {/* <Legend
                    verticalAlign="bottom"
                    align="center"
                    layout="horizontal"
                    payload={segments.map((item) => ({
                      value: `${item.name} (${item.value})`,
                      type: 'circle',
                      color: item.fill
                    }))}
                    iconSize={10}
                    wrapperStyle={{ fontSize: 12, marginTop: 10, borderRadius: 2 }}
                  /> */}
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Labels */}
            <div className="w-full max-w-[300px] flex justify-between px-6">
              <p className="text-[12px] text-muted-foreground">0 weeks</p>
              <p className="text-[12px] text-muted-foreground">20 weeks</p>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="hidden md:block w-px bg-border" />

          {/* ================= RIGHT ================= */}
          <div className="flex-[2] mt-4 md:mt-0">
            <p className="text-[14px] md:text-[16px] font-semibold mb-1 md:mb-2">Alert Context</p>

            <div className="border-b mb-2" />

            <div className="flex flex-col gap-1.5">
              <Row label="Trend Direction" value="Increasing - from 14% (8wks ago)" />
              <Row label="Data Source" value="GQC - Brazil Origin" />
              <Row label="Rolling Window" value="26 Dec 2025 - 20 Feb 2026" />
              <Row label="Batches Evaluated" value="37 total, 10 rejected" />
              <Row label="Threshold" value=">20% in 8-week rolling window" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuagePieChart;