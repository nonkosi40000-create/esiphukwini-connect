import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout, teacherNavItems } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  ClipboardList,
  Calendar,
  FileText,
  Bell,
  TrendingUp,
} from "lucide-react";

interface TeacherStats {
  totalStudents: number;
  classesTeaching: number;
  pendingAssessments: number;
  recentAnnouncements: number;
}

export default function TeacherDashboard() {
  const { user, isAccepted, primaryRole, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<TeacherStats>({
    totalStudents: 0,
    classesTeaching: 0,
    pendingAssessments: 0,
    recentAnnouncements: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAccepted || !["teacher", "grade_head"].includes(primaryRole || "")) {
        navigate("/pending");
      }
    }
  }, [user, isAccepted, primaryRole, isLoading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Fetch staff registration to get grades teaching
        const { data: staffReg } = await supabase
          .from("staff_registrations")
          .select("grades_teaching, subjects_teaching")
          .eq("user_id", user.id)
          .maybeSingle();

        // Count classes (simplified - would need proper linking in production)
        const classesCount = staffReg?.grades_teaching?.length || 0;

        // Fetch recent announcements
        const { count: announcementsCount } = await supabase
          .from("announcements")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        setStats({
          totalStudents: 0, // Would need to calculate based on assigned classes
          classesTeaching: classesCount,
          pendingAssessments: 0, // Would need content table with due dates
          recentAnnouncements: announcementsCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (user && isAccepted) {
      fetchStats();
    }
  }, [user, isAccepted]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: "My Classes",
      value: stats.classesTeaching,
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Pending Assessments",
      value: stats.pendingAssessments,
      icon: ClipboardList,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Recent Announcements",
      value: stats.recentAnnouncements,
      icon: Bell,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <DashboardLayout title="Teacher Dashboard" navItems={teacherNavItems}>
      <div className="space-y-6">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                Welcome back, {profile?.first_name}! 📚
              </h2>
              <p className="text-muted-foreground">
                Ready to inspire! Manage your classes, enter marks, and share learning materials with your students.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loadingStats ? (
                      <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                      stat.value
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/teacher/marks")}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <ClipboardList className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Enter Marks</h3>
                  <p className="text-sm text-muted-foreground">Record student assessments</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/teacher/attendance")}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Take Attendance</h3>
                  <p className="text-sm text-muted-foreground">Mark today's attendance</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/teacher/content")}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <FileText className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Upload Content</h3>
                  <p className="text-sm text-muted-foreground">Share learning materials</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity to display</p>
              <p className="text-sm">Your teaching activities will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
