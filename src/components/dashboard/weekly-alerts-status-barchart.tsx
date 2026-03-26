'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList
} from 'recharts';
import { Card, CardContent } from '../ui/card';

/* =========================
   DATA
========================= */
const data = [
  { day: 'Mon', total: 86, resolved: 41, pending: 45 },
  { day: 'Tues', total: 36, resolved: 15, pending: 18 },
  { day: 'Wed', total: 86, resolved: 41, pending: 45 },
  { day: 'Thurs', total: 76, resolved: 32, pending: 39 },
  { day: 'Fri', total: 66, resolved: 37, pending: 49 },
  { day: 'Sat', total: 96, resolved: 27, pending: 69 },
  { day: 'Sun', total: 108, resolved: 50, pending: 58 }
];

/* =========================
   LABELS
========================= */
const renderTopLabel = (props: any) => {
  const { x, y, width, value } = props;

  return (
    <text
      x={x + width / 2}
      y={y - 8}
      textAnchor="middle"
      className="fill-muted-foreground text-[12px]"
    >
      {value}
    </text>
  );
};

/* =========================
   COMPONENT
========================= */
const WeeklyAlertsStatusBarChart = () => {
  return (
    <Card className="flex-1/2 rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <CardContent className="p-2 md:p-3">
        {/* Title */}
        <h4 className='mb-2 text-[14px] md:text-[16px] font-semibold'>
          Weekly Alerts resolved vs pending
        </h4>

        <div className="w-full h-[297px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={20}>
              <CartesianGrid stroke="#eee" vertical={false} />

              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />

              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />

              <Tooltip />

              {/* RESOLVED */}
              <Bar
                dataKey="resolved"
                stackId="a"
                fill="#6FA58D"
                barSize={40}
              >
                <LabelList
                  dataKey="resolved"
                  content={(props: any) => {
                    const { value, payload, x, y, width, height } = props;
                    if (!payload?.total) return null;

                    const percent = Math.round(
                      (value / payload.total) * 100
                    );

                    return (
                      <text
                        x={x + width / 2}
                        y={y + height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-[#1f3d2b] text-[11px]"
                      >
                        {percent}%
                      </text>
                    );
                  }}
                />
              </Bar>

              {/* PENDING */}
              <Bar
                dataKey="pending"
                stackId="a"
                fill="#DCE9E2"
                radius={[6, 6, 0, 0]}
                barSize={40}
              >
                <LabelList
                  dataKey="pending"
                  content={(props: any) => {
                    const { value, payload, x, y, width, height } = props;
                    if (!payload?.total) return null;

                    const percent = Math.round(
                      (value / payload.total) * 100
                    );

                    return (
                      <text
                        x={x + width / 2}
                        y={y + height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-[#4a5f55] text-[11px]"
                      >
                        {percent}%
                      </text>
                    );
                  }}
                />

                {/* TOTAL LABEL */}
                <LabelList dataKey="total" content={renderTopLabel} />
              </Bar>

              {/* LEGEND */}
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ marginTop: 10, fontSize: '12px' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyAlertsStatusBarChart;