import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Menu,
  X,
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
  Bell,
  BookOpen,
  ClipboardList,
  Calendar,
  BarChart3,
  UserCheck,
  Shield,
  MessageSquare,
  Send,
  Mail,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  navItems: NavItem[];
}

export function DashboardLayout({ children, title, navItems }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, signOut, primaryRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r border-border px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border">
            <div className="gradient-primary p-2 rounded-xl">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-foreground leading-tight">
                Esiphukwini
              </span>
              <span className="text-xs text-muted-foreground capitalize">{primaryRole} Portal</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-colors ${
                          location.pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* User Info */}
              <li className="mt-auto">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate capitalize">
                      {primaryRole}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 mt-2 text-muted-foreground hover:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-card px-4 py-4 shadow-sm lg:hidden border-b border-border">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-muted-foreground"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-foreground">{title}</div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-card lg:hidden"
            >
              <div className="flex h-16 shrink-0 items-center gap-3 px-6 border-b border-border">
                <div className="gradient-primary p-2 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-display text-lg font-bold text-foreground">Esiphukwini</span>
                <button
                  type="button"
                  className="ml-auto -m-2.5 p-2.5"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6 text-muted-foreground" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col px-6 py-4">
                <ul role="list" className="flex flex-1 flex-col gap-y-1">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-colors ${
                          location.pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="hidden lg:flex lg:items-center lg:justify-between mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

export const adminNavItems: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Applications", href: "/admin/applications", icon: UserCheck },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Classes", href: "/admin/classes", icon: BookOpen },
  { name: "Announcements", href: "/admin/announcements", icon: Bell },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export const teacherNavItems: NavItem[] = [
  { name: "Dashboard", href: "/teacher", icon: Home },
  { name: "My Classes", href: "/teacher/classes", icon: BookOpen },
  { name: "Marks Entry", href: "/teacher/marks", icon: ClipboardList },
  { name: "Attendance", href: "/teacher/attendance", icon: Calendar },
  { name: "Content", href: "/teacher/content", icon: FileText },
  { name: "Rate Grade Head", href: "/teacher/rate-grade-head", icon: BarChart3 },
  { name: "Reports", href: "/teacher/reports", icon: BarChart3 },
  { name: "Messages", href: "/teacher/messages", icon: MessageSquare },
];

export const principalNavItems: NavItem[] = [
  { name: "Dashboard", href: "/principal", icon: Home },
  { name: "Staff", href: "/principal/staff", icon: Users },
  { name: "Classes", href: "/principal/classes", icon: BookOpen },
  { name: "Messages", href: "/principal/messages", icon: MessageSquare },
  { name: "Announcements", href: "/principal/announcements", icon: Bell },
  { name: "Reports", href: "/principal/reports", icon: BarChart3 },
];

export const gradeHeadNavItems: NavItem[] = [
  { name: "Dashboard", href: "/grade-head", icon: Home },
  { name: "My Grade", href: "/grade-head/grade", icon: BookOpen },
  { name: "Teachers", href: "/grade-head/teachers", icon: Users },
  { name: "Timetable", href: "/grade-head/timetable", icon: Calendar },
  { name: "Teacher Ratings", href: "/grade-head/ratings", icon: BarChart3 },
  { name: "Messages", href: "/grade-head/messages", icon: MessageSquare },
  { name: "Reports", href: "/grade-head/reports", icon: BarChart3 },
];

export const sgbNavItems: NavItem[] = [
  { name: "Dashboard", href: "/sgb", icon: Home },
  { name: "Messages", href: "/sgb/messages", icon: MessageSquare },
  { name: "Documents", href: "/sgb/documents", icon: FileText },
  { name: "Meetings", href: "/sgb/meetings", icon: Calendar },
];

export const financeNavItems: NavItem[] = [
  { name: "Dashboard", href: "/finance", icon: Home },
  { name: "Fee Payments", href: "/finance/payments", icon: ClipboardList },
  { name: "School Account", href: "/finance/account", icon: Settings },
];

export const studentNavItems: NavItem[] = [
  { name: "Dashboard", href: "/student", icon: Home },
  { name: "My Classes", href: "/student/classes", icon: BookOpen },
  { name: "My Marks", href: "/student/marks", icon: BarChart3 },
  { name: "Quizzes", href: "/student/quizzes", icon: ClipboardList },
  { name: "Timetable", href: "/student/timetable", icon: Calendar },
  { name: "Content", href: "/student/content", icon: FileText },
  { name: "Announcements", href: "/student/announcements", icon: Bell },
];
