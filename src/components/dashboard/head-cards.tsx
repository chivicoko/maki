'use client';

import React from 'react';
import {
  ShoppingCart,
  FlaskConical,
  Truck,
  Bus,
  Warehouse,
  Package,
  Factory
} from 'lucide-react';

const items = [
  { label: 'Purchases', icon: ShoppingCart, stat: '128' },
  { label: 'Sample', icon: FlaskConical, stat: '42' },
  { label: 'Shipments', icon: Truck, stat: '76' },
  { label: 'Transport', icon: Bus, stat: '54' },
  { label: 'Storage', icon: Warehouse, stat: '19' },
  { label: 'Delivery', icon: Package, stat: '88' },
  { label: 'Factory', icon: Factory, stat: '23' }
];

const HeadCards = () => {
  return (
    <div className="flex flex-wrap gap-[13px]">
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="
              bg-white rounded-[10px] p-4
              flex flex-col items-center justify-center text-center
              gap-1.5 transition-all duration-200

              w-[calc(50%-6.5px)] 
              sm:w-[calc(33.333%-8.7px)] 
              md:w-[calc(25%-9.75px)] 
              lg:w-[calc(14.285%-11.2px)]

              border border-transparent
              hover:-translate-y-[2px] 
              hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]
            "
          >
            {/* ICON */}
            <Icon className="w-[26px] h-[26px] text-[#42444A]" />

            {/* LABEL */}
            <p className="font-medium text-[13px] sm:text-[14px] md:text-[15px] text-[#565A60]">
              {item.label}
            </p>

            {/* STAT */}
            <p className="text-[16px] font-semibold text-gray-900">
              {item.stat}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default HeadCards;