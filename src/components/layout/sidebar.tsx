"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, ClipboardList, LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/op-register", label: "OP Register", icon: ClipboardList },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 flex-1">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            pathname === href
              ? "bg-blue-50 text-blue-700"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          )}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-3 py-4 border-b border-slate-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Activity className="h-4 w-4 text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900">Sharon</p>
          <p className="text-[11px] text-slate-500">Physiotherapy Clinic</p>
        </div>
      </div>

      <div className="flex-1 px-3 py-4">
        <NavLinks onNavigate={onNavigate} />
      </div>

      <div className="px-3 py-3 border-t border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-slate-600 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <button className="inline-flex items-center justify-center rounded-md h-8 w-8 text-slate-500 hover:bg-slate-100 lg:hidden" />
        }
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-60 p-0">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-60 flex-shrink-0 flex-col border-r border-slate-200 bg-white">
      <SidebarContent />
    </aside>
  );
}
