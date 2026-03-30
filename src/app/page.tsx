'use client';

import GeographyFlowMap from "@/components/dashboard/geography-flow-chart";
import GuagePieChart from "@/components/dashboard/guage-pie-chart";
import SeverityTable from "@/components/dashboard/severity-table";
import ShipmentAccuracyLineChart from "@/components/dashboard/shipment-accuracy-line-chart";
import SupplierLineChart from "@/components/dashboard/supplier-line-chart";
import WeeklyAlertsBarChart from "@/components/dashboard/weekly-alerts-barchart";
import WeeklyAlertsStatusBarChart from "@/components/dashboard/weekly-alerts-status-barchart";

// import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Table } from 'lucide-react';

import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArchiveIcon,
  ArrowLeftIcon,
  CalendarPlusIcon,
  ClockIcon,
  ListFilterIcon,
  MailCheckIcon,
  MoreHorizontalIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react"
import { useState } from "react";
import { toast } from "sonner";
import HeadCards from "@/components/dashboard/head-cards";

/* =========================
   DATA
========================= */
const data = [
  { month: 'Sep', value: 150 },
  { month: 'Oct', value: 130 },
  { month: 'Nov', value: 110 },
  { month: 'Dec', value: 85 },
  { month: 'Jan', value: 60 },
  { month: 'Feb', value: 45 },
  { month: 'Mar', value: 30 }
];
const data2 = [
  { month: 'Sep', value: 30 },
  { month: 'Oct', value: 45 },
  { month: 'Nov', value: 60 },
  { month: 'Dec', value: 85 },
  { month: 'Jan', value: 110 },
  { month: 'Feb', value: 130 },
  { month: 'Mar', value: 150 }
];

export default function Home() {
  const [label, setLabel] = useState("personal");

  return (
    <main className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="w-full flex items-center justify-between flex-wrap">
          {/* TITLE */}
          <h2 className="text-[20px] sm:text-[25px] md:text-[30px] font-semibold">
            Alerts Overview
          </h2>

          {/* ACTIONS */}
          <ButtonGroup className="flex items-center flex-wrap">
            <ButtonGroup>
              <Button variant="outline" onClick={() => toast.info("Dashboard button clicked.")}>
                <LayoutDashboard className="w-3.5 h-3.5 mr-1" />
                Dashboard
              </Button>
              <Button variant="outline" onClick={() => toast.success("It's done. Yayyyy!")}>
                <Table className="w-3.5 h-3.5 mr-1" />
                View Alert Table
              </Button>
            </ButtonGroup>
            
            <ButtonGroup>
              <Button variant="outline">Snooze</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="More Options">
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <MailCheckIcon />
                      Mark as Read
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ArchiveIcon />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <ClockIcon />
                      Snooze
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CalendarPlusIcon />
                      Add to Calendar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ListFilterIcon />
                      Add to List
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <TagIcon />
                        Label As...
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                          value={label}
                          onValueChange={setLabel}
                        >
                          <DropdownMenuRadioItem value="personal">
                            Personal
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="work">
                            Work
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="other">
                            Other
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive">
                      <Trash2Icon />
                      Trash
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </ButtonGroup>
        </div>
      </div>

      <HeadCards />

      <div className="w-full mt-2">
        <GuagePieChart />
      </div>

      <div className="w-full flex flex-col md:flex-row items-start md:justify-between gap-3 flex-wrap">
        <WeeklyAlertsBarChart />
        <WeeklyAlertsStatusBarChart />
      </div>

      <div className="w-full flex flex-col md:flex-row items-start md:justify-between gap-3 flex-wrap">
        <GeographyFlowMap />
        <SeverityTable />
      </div>
      
      <ShipmentAccuracyLineChart />
      
      <div className="w-full flex flex-col md:flex-row items-start md:justify-between gap-3 flex-wrap">
        <div className="w-full flex-1">
          <SupplierLineChart
            data={data}
            title='Volume Adherence'
            color="#d90429"
            value="90%"
            change="3%"
            target="90%"
            targetDiff="-5% below"
          />
        </div>
        <div className="w-full flex-1">
          <SupplierLineChart
            data={data2}
            title='Avg Booking Confirmation Lead'
            color="#198a02"
            value="79%"
            change="3%"
            target="29D"
            targetDiff="On Track"
            getDotProps={({ index }) => ({
              r: index === 0 ? 6 : 5,
              fill: index === 0 ? '#198a02' : '#fff',
              // fill: payload.value === Math.min(...data2.map(d => d.value)) ? '#198a02' : '#fff',
              stroke: '#198a02'
            })}
          />
        </div>
      </div>
    </main>
  );
}
