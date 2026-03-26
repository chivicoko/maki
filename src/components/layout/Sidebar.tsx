// src/components/layout/Sidebar.tsx

"use client";

import { LayoutDashboard, FolderKanban, Users } from "lucide-react";
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
    <aside className="w-48 bg-white border-r p-4">
      <h1 className="text-xl font-bold mb-6">TeamFlow</h1>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition",
                pathname === link.href
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              )}
            >
              <Icon className="size-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}