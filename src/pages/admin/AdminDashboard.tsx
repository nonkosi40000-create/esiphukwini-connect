import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout, adminNavItems } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Clock, GraduationCap, BookOpen } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  pendingApplications: number;
  acceptedUsers: number;
  rejectedUsers: number;
  totalClasses: number;
  totalLearners: number;
}

export default function AdminDashboard() {
  const { user, isAccepted, primaryRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingApplications: 0,
    acceptedUsers: 0,
    rejectedUsers: 0,
    totalClasses: 0,
    totalLearners: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAccepted || primaryRole !== "admin") {
        navigate("/pending");
      }
    }
  }, [user, isAccepted, primaryRole, isLoading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch user roles stats
        const { data: rolesData } = await supabase
          .from("user_roles")
          .select("application_status");

        const pending = rolesData?.filter((r) => r.application_status === "pending").length || 0;
        const accepted = rolesData?.filter((r) => r.application_status === "accepted").length || 0;
        const rejected = rolesData?.filter((r) => r.application_status === "rejected").length || 0;

        // Fetch classes count
        const { count: classesCount } = await supabase
          .from("classes")
          .select("*", { count: "exact", head: true });

        // Fetch learner registrations count
        const { count: learnersCount } = await supabase
          .from("learner_registrations")
          .select("*", { count: "exact", head: true });

        setStats({
          totalUsers: rolesData?.length || 0,
          pendingApplications: pending,
          acceptedUsers: accepted,
          rejectedUsers: rejected,
          totalClasses: classesCount || 0,
          totalLearners: learnersCount || 0,
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
      title: "Pending Applications",
      value: stats.pendingApplications,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Accepted Users",
      value: stats.acceptedUsers,
      icon: UserCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Rejected Users",
      value: stats.rejectedUsers,
      icon: UserX,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Classes",
      value: stats.totalClasses,
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Learners",
      value: stats.totalLearners,
      icon: GraduationCap,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" navItems={adminNavItems}>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/admin/applications")}
              className="flex items-center gap-4 p-4 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
            >
              <Clock className="h-8 w-8 text-amber-500" />
              <div className="text-left">
                <p className="font-medium text-foreground">Review Applications</p>
                <p className="text-sm text-muted-foreground">
                  {stats.pendingApplications} pending
                </p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/admin/users")}
              className="flex items-center gap-4 p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <Users className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">Manage Users</p>
                <p className="text-sm text-muted-foreground">{stats.totalUsers} total</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/admin/classes")}
              className="flex items-center gap-4 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
            >
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div className="text-left">
                <p className="font-medium text-foreground">Manage Classes</p>
                <p className="text-sm text-muted-foreground">{stats.totalClasses} classes</p>
              </div>
            </motion.button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
