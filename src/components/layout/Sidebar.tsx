// src/components/layout/Sidebar.tsx

"use client";

import { LayoutDashboard, FolderKanban, Users, LucideAlignHorizontalDistributeCenter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/team", label: "Team", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-fit md:w-48 min-h-screen bg-white border-r py-4 px-1.5 md:p-4">
      <h1 className="text-xl font-bold mb-12 flex items-center justify-center md:justify-start gap-1">
        <LucideAlignHorizontalDistributeCenter />
        <span className="hidden md:inline">TeamFlow</span>
      </h1>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              title={link.label}
              className={clsx(
                "flex items-center gap-3 px-1.5 py-1.5 md:px-3 md:py-2 rounded-lg transition",
                pathname === link.href
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              )}
            >
              <Icon className="size-5" />
              <span className="hidden md:inline">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}