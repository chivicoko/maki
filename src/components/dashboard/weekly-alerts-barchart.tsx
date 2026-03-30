'use client';

import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, Legend } from 'recharts';
import { Card, CardContent } from '../ui/card';

const data = [
  { day: 'Mon', new: 90, resolved: 20 },
  { day: 'Tues', new: 80, resolved: 60 },
  { day: 'Wed', new: 150, resolved: 70 },
  { day: 'Thurs', new: 150, resolved: 65 },
  { day: 'Fri', new: 190, resolved: 90 },
  { day: 'Sat', new: 210, resolved: 150 },
  { day: 'Sun', new: 310, resolved: 210 }
];

const WeeklyAlertsBarChart = () => {
  return (
    <Card className="w-full flex-1 rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <CardContent className="p-2 md:p-3">
        {/* Title */}
        <h4 className='mb-2 text-[14px] md:text-[16px] font-semibold'>
          Weekly Alerts
        </h4>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <CartesianGrid stroke="#eee" />

            <XAxis dataKey="day" />
            <YAxis />

            <Tooltip />

            {/* Area (Resolved) */}
            <Area type="monotone" dataKey="resolved" fill="#9BBFA6" stroke="none" opacity={0.4} />

            {/* Bars (New Alerts) */}
            <Bar dataKey="new" fill="#AFC6E9" barSize={30} radius={[6, 6, 0, 0]} />

            <Legend />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WeeklyAlertsBarChart;
