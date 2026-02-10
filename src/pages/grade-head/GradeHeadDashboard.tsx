import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout, gradeHeadNavItems } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageComposer } from "@/components/messaging/MessageComposer";
import { MessageInbox } from "@/components/messaging/MessageInbox";
import { Users, BookOpen, ClipboardList, MessageSquare } from "lucide-react";

interface DashboardStats {
  totalTeachers: number;
  totalStudents: number;
  pendingAssessments: number;
  unreadMessages: number;
}

interface Recipient {
  id: string;
  name: string;
  role: string;
}

export default function GradeHeadDashboard() {
  const { user, isAccepted, primaryRole, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalTeachers: 0,
    totalStudents: 0,
    pendingAssessments: 0,
    unreadMessages: 0,
  });
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAccepted || primaryRole !== "grade_head") {
        navigate("/pending");
      }
    }
  }, [user, isAccepted, primaryRole, isLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch teachers
        const { data: teacherRoles } = await supabase
          .from("user_roles")
          .select("user_id, role")
          .eq("role", "teacher")
          .eq("application_status", "accepted");

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
          totalTeachers: teacherRoles?.length || 0,
          totalStudents: learnersCount || 0,
          pendingAssessments: 0,
          unreadMessages: unreadCount || 0,
        });

        // Fetch recipients (teachers and learners)
        const teacherIds = teacherRoles?.map((r) => r.user_id) || [];
        
        // Get teacher profiles
        if (teacherIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, first_name, last_name")
            .in("user_id", teacherIds);

          const recipientList = profiles?.map((p) => ({
            id: p.user_id,
            name: `${p.first_name} ${p.last_name}`,
            role: "Teacher",
          })) || [];

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
      title: "Teachers",
      value: stats.totalTeachers,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Students in Grade",
      value: stats.totalStudents,
      icon: BookOpen,
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
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <DashboardLayout title="Grade Head Dashboard" navItems={gradeHeadNavItems}>
      <div className="space-y-6">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                Welcome back, {profile?.first_name}! 📋
              </h2>
              <p className="text-muted-foreground">
                Coordinate your grade's success. Monitor teachers, track student performance, and manage assessments.
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
                <CardTitle>Send Message to Teacher</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Select a teacher to communicate with them directly.
                </p>
                <MessageComposer 
                  recipients={recipients} 
                  title="Select & Message"
                />
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
