/**
 * Bottom Navigation Component
 * Mobile-only bottom navigation bar with 4 tabs
 * Matches Figma design specification
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, User } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/challenge", label: "Challenge", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 transition-colors ${
                isActive ? "text-primary-500" : "text-gray-500"
              }`}
            >
              <Icon
                className={`h-6 w-6 ${isActive ? "fill-current" : ""}`}
                strokeWidth={isActive ? 0 : 2}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
