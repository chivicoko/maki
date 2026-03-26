'use client';

import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  useMapContext
} from 'react-simple-maps';
import { Card, CardContent } from '@/components/ui/card';

/* =========================
   DATA
========================= */
const geoUrl =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const center = { name: 'Europe Hub', coordinates: [10, 50] };

const points = [
  { name: 'USA', coordinates: [-100, 40], color: '#f97316', size: 8 },
  { name: 'Canada', coordinates: [-170, 65], color: '#ef4444', size: 7 },
  { name: 'Brazil', coordinates: [-70, -40], color: '#16a34a', size: 7 },
  { name: 'India', coordinates: [78, 22], color: '#16a34a', size: 7 },
  { name: 'China', coordinates: [105, 35], color: '#f97316', size: 7 },
  { name: 'Indonesia', coordinates: [120, -5], color: '#ef4444', size: 6 },
  { name: 'Nigeria', coordinates: [8, 9], color: '#ef4444', size: 6 },
  { name: 'Botswana', coordinates: [24, -72], color: '#1630a3', size: 7 },
  { name: 'Malawi', coordinates: [47, -19], color: '#9316f9', size: 7 },
  { name: 'Malaysia', coordinates: [132, 70], color: '#fb0404', size: 6 },
  { name: 'Japan', coordinates: [138, 36], color: '#44caef', size: 6 }
];

/* =========================
   CURVES
========================= */
const CurvedLines = ({ points, center }: any) => {
  const { projection } = useMapContext();

  if (!projection) return null;

  return (
    <g>
      {points.map((p: any, i: number) => {
        const from = projection(p.coordinates);
        const to = projection(center.coordinates);

        if (!from || !to) return null;

        const midX = (from[0] + to[0]) / 2;
        const midY = (from[1] + to[1]) / 2 - 60;

        const pathId = `flow-path-${i}`;

        return (
          <g key={i}>
            {/* FLOW LINE */}
            <path
              id={pathId}
              d={`M ${from[0]} ${from[1]} Q ${midX} ${midY} ${to[0]} ${to[1]}`}
              fill="none"
              stroke="#6FC1B2"
              strokeWidth={2.5}
              strokeDasharray="8 8"
              opacity={0.9}
              style={{ animation: 'dash 5s linear infinite' }}
            />

            {/* MOVING DOT */}
            <circle r={3} fill="#6FC1B2">
              <animateMotion dur={`${4 + i}s`} repeatCount="indefinite">
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </circle>
          </g>
        );
      })}
    </g>
  );
};

/* =========================
   COMPONENT
========================= */
const GeographyFlowMap = () => {
  const [tooltip, setTooltip] = useState<null | {
    name: string;
    x: number;
    y: number;
  }>(null);

  return (
    <Card className="flex-2/3 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] relative">
      <CardContent className="px-3">
        {/* TITLE */}
        <h4 className="text-[14px] md:text-[16px] font-semibold mb-2">
          Geographic flow → Origin → Port → Destination
        </h4>

        {/* MAP */}
        <div className="w-full h-[352px]">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 140 }}
            style={{ width: '100%', height: '100%' }}
          >
            {/* MAP BASE */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#e5e7eb"
                    stroke="#cbd5e1"
                    strokeWidth={0.5}
                  />
                ))
              }
            </Geographies>

            {/* CURVES */}
            <CurvedLines points={points} center={center} />

            {/* CENTER */}
            <Marker coordinates={center.coordinates}>
              <circle r={5} fill="#7c3aed" />
            </Marker>

            {/* POINTS */}
            {points.map((p, i) => (
              <Marker key={i} coordinates={p.coordinates}>
                <g
                  onMouseMove={(e) =>
                    setTooltip({
                      name: p.name,
                      x: e.clientX,
                      y: e.clientY
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* glow */}
                  <circle r={p.size + 6} fill={p.color} opacity={0.15} />

                  {/* main */}
                  <circle
                    r={p.size}
                    fill={p.color}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                </g>
              </Marker>
            ))}
          </ComposableMap>
        </div>

        {/* TOOLTIP */}
        {tooltip && (
          <div
            className="fixed z-[999] px-2 py-1 text-[12px] rounded bg-black text-white pointer-events-none"
            style={{
              top: tooltip.y + 10,
              left: tooltip.x + 10
            }}
          >
            {tooltip.name}
          </div>
        )}

        {/* ANIMATION */}
        <style>
          {`
            @keyframes dash {
              to {
                stroke-dashoffset: -100;
              }
            }
          `}
        </style>
      </CardContent>
    </Card>
  );
};

export default GeographyFlowMap;