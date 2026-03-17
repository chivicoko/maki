// src/components/layout/Topbar.tsx

"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Topbar() {
  return (
    <header className="h-14 border-b bg-white px-6 flex items-center justify-between">
      <h2 className="font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <Bell className="cursor-pointer" />

        <Avatar>
          <AvatarFallback>VO</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}