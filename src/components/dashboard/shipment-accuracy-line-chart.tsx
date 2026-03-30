'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  ReferenceArea
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

/* =========================
   DATA
========================= */
const data = [
  { month: '01.2026', value: 37 },
  { month: '02.2026', value: 50 },
  { month: '03.2026', value: 64 },
  { month: '04.2026', value: 34 },
  { month: '05.2026', value: 44 },
  { month: '06.2026', value: 39 },
  { month: '07.2026', value: 52 },
  { month: '08.2026', value: 42 },
  { month: '09.2026', value: 52 },
  { month: '10.2026', value: 29 },
  { month: '11.2026', value: 45 },
  { month: '12.2026', value: 50 },
  { month: '01.2027', value: 55 }
];

/* =========================
   LABEL
========================= */
const renderLabel = ({ x, y, value }: any) => (
  <text
    x={x}
    y={y - 10}
    textAnchor="middle"
    className="fill-muted-foreground text-[11px]"
  >
    {value}%
  </text>
);

/* =========================
   COMPONENT
========================= */
const ShipmentAccuracyLineChart = () => {
  return (
    <Card className="rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <CardContent className="p-3">
        {/* HEADER */}
        <h4 className="text-[14px] md:text-[16px] font-semibold mb-2">
          Shipment on-time accuracy
        </h4>

        {/* CHART */}
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              {/* BACKGROUND ZONES */}
              <ReferenceArea
                y1={50}
                y2={100}
                fill="#ECF2EB"
                ifOverflow="extendDomain"
              />
              <ReferenceArea
                y1={0}
                y2={50}
                fill="#FFF7F7"
                ifOverflow="extendDomain"
              />

              {/* GRID */}
              <CartesianGrid stroke="#eee" vertical={false} />

              {/* X AXIS */}
              <XAxis
                dataKey="month"
                angle={-90}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 11, fill: '#6b7280' }}
              />

              {/* Y AXIS */}
              <YAxis
                domain={[0, 100]}
                ticks={[0, 50, 100]}
                tickFormatter={(val) => `${val}%`}
                tick={{ fontSize: 11, fill: '#6b7280' }}
              />

              {/* TOOLTIP */}
              <Tooltip formatter={(val) => [`${Number(val ?? 0)}%`, 'Accuracy']} />

              {/* LINE */}
              <Line
                type="linear"
                dataKey="value"
                stroke="#6FA58D"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              >
                <LabelList content={renderLabel} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentAccuracyLineChart;