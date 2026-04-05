// src/components/layout/Topbar.tsx

"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Topbar() {
  return (
    <header className="h-14 border-b bg-white px-6 flex items-center justify-between">
      <h2 className="font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Bell className="cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to see your notifications</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar>
              <AvatarFallback>VO</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to see your profile</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}