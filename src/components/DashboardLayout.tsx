// components/DashboardLayout.tsx
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Settings, User, GraduationCap, Menu } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  userName: string;
  userRole: string;
  /** base route for the current user's home (e.g. '/admin' or '/student'). Defaults to '/admin' */
  homeHref?: string;
}

const initialsFromName = (name = "") => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

const normalizePath = (p = "") => {
  if (!p) return "/";
  return p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
};

const DashboardLayout = ({
  children,
  navItems,
  userName,
  userRole,
  homeHref = "/admin",
}: DashboardLayoutProps) => {
  const location = useLocation();

  // notifications dropdown
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  // mobile sidebar state
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // close notifications when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [notifOpen]);

  // close mobile sidebar when clicking outside it (for small screens)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!mobileOpen) return;
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [mobileOpen]);

  // close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const normalizedLocation = normalizePath(location.pathname);
  const normalizedHome = normalizePath(homeHref);

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white">
        {/* logo links to homeHref now (role-aware) */}
        <Link to={normalizedHome} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-black">EduManage</h2>
            <p className="text-xs text-black/60">School Portal</p>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 py-4 bg-white">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            // more tolerant isActive: match exact or startsWith (handles nested routes)
            const itemPath = normalizePath(item.href);
            const isActive =
              normalizedLocation === itemPath || normalizedLocation.startsWith(itemPath + "/");

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive: navIsActive }) =>
                  cn(
                    "block w-full rounded-md overflow-hidden transition-colors",
                    isActive || navIsActive
                      ? "bg-gray-100 text-black font-medium"
                      : "hover:bg-gray-50"
                  )
                }
                aria-current={isActive ? "page" : undefined}
              >
                <Button variant="ghost" className="w-full justify-start gap-3 text-left">
                  {item.icon}
                  <span className="text-sm">{item.title}</span>
                </Button>
              </NavLink>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
          <Avatar className="h-10 w-10 ring-1 ring-black/6">
            <AvatarImage src="" alt={`${userName} avatar`} />
            <AvatarFallback className="bg-primary text-white">
              {initialsFromName(userName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black truncate">{userName}</p>
            <p className="text-xs text-black/60 capitalize">{userRole}</p>
          </div>

          {/* View link uses homeHref/profile so it opens the correct profile route */}
          <Link to={`${normalizedHome}/profile`} className="text-sm font-semibold text-black hover:underline">
            View
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-gray-200 bg-white">
        <SidebarContent />
      </aside>

      {/* Mobile slide-in sidebar (no overlay/backdrop). click outside closes it. */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-200 lg:hidden`}
        aria-hidden={!mobileOpen}
        ref={sidebarRef}
      >
        <div className="w-64 h-full border-r border-gray-200 bg-white shadow-lg">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile toggle button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
                onClick={() => setMobileOpen((s) => !s)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            <div>
              <p className="text-sm text-gray-500">Welcome back,</p>
              <h1 className="text-lg font-semibold text-black">{userName}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* notifications */}
            <div ref={notifRef} className="relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                onClick={() => setNotifOpen((s) => !s)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center text-[10px] bg-red-600 text-white rounded-full h-4 w-4">
                  3
                </span>
              </Button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow p-3 z-50">
                  <div className="text-sm font-semibold mb-2">Notifications</div>
                  <ul className="text-sm space-y-2 max-h-56 overflow-auto">
                    <li className="p-2 rounded hover:bg-gray-50">New student registered</li>
                    <li className="p-2 rounded hover:bg-gray-50">Fee payment received</li>
                    <li className="p-2 rounded hover:bg-gray-50">Low attendance alert</li>
                  </ul>
                  <div className="mt-3 text-right">
                    <Link to={`${normalizedHome}/notifications`} className="text-xs text-primary hover:underline">
                      View all
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* avatar dropdown */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full p-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" aria-label="Open profile menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={`${userName} avatar`} />
                      <AvatarFallback className="bg-primary text-white">{initialsFromName(userName)}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>

                  <DropdownMenuItem asChild>
                    <Link to={`${normalizedHome}/profile`} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to={`${normalizedHome}/settings`} className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/login" className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
