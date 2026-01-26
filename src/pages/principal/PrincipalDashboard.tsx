import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout, principalNavItems } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageComposer } from "@/components/messaging/MessageComposer";
import { MessageInbox } from "@/components/messaging/MessageInbox";
import { Users, BookOpen, Bell, GraduationCap, MessageSquare } from "lucide-react";

interface DashboardStats {
  totalStaff: number;
  totalClasses: number;
  totalLearners: number;
  unreadMessages: number;
}

interface Recipient {
  id: string;
  name: string;
  role: string;
}

export default function PrincipalDashboard() {
  const { user, isAccepted, primaryRole, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalStaff: 0,
    totalClasses: 0,
    totalLearners: 0,
    unreadMessages: 0,
  });
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAccepted || primaryRole !== "principal") {
        navigate("/pending");
      }
    }
  }, [user, isAccepted, primaryRole, isLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch staff count
        const { data: staffRoles } = await supabase
          .from("user_roles")
          .select("user_id, role")
          .in("role", ["teacher", "grade_head"])
          .eq("application_status", "accepted");

        // Fetch classes count
        const { count: classesCount } = await supabase
          .from("classes")
          .select("*", { count: "exact", head: true });

        // Fetch learners count
        const { count: learnersCount } = await supabase
          .from("learner_registrations")
          .select("*", { count: "exact", head: true });

        // Fetch unread messages
        const { count: unreadCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("recipient_id", user.id)
          .eq("is_read", false);

        setStats({
          totalStaff: staffRoles?.length || 0,
          totalClasses: classesCount || 0,
          totalLearners: learnersCount || 0,
          unreadMessages: unreadCount || 0,
        });

        // Fetch recipients (all staff and learners)
        const userIds = staffRoles?.map((r) => r.user_id) || [];
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, first_name, last_name")
            .in("user_id", userIds);

          const recipientList = profiles?.map((p) => {
            const roleData = staffRoles?.find((r) => r.user_id === p.user_id);
            return {
              id: p.user_id,
              name: `${p.first_name} ${p.last_name}`,
              role: roleData?.role || "Staff",
            };
          }) || [];

          setRecipients(recipientList);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (user && isAccepted) {
      fetchData();
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
      title: "Total Staff",
      value: stats.totalStaff,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Classes",
      value: stats.totalClasses,
      icon: BookOpen,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Total Learners",
      value: stats.totalLearners,
      icon: GraduationCap,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <DashboardLayout title="Principal Dashboard" navItems={principalNavItems}>
      <div className="space-y-6">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                Welcome back, {profile?.first_name}!
              </h2>
              <p className="text-muted-foreground">
                Here's an overview of your school's activities and updates.
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

        {/* Messaging Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Send Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Select a staff member to send a message or summon them.
                </p>
                <div className="flex gap-3">
                  <MessageComposer 
                    recipients={recipients} 
                    title="Send Message"
                  />
                  <MessageComposer 
                    recipients={recipients} 
                    messageType="summon"
                    title="Summon Staff"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <MessageInbox />
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
