import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout, sgbNavItems } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageComposer } from "@/components/messaging/MessageComposer";
import { MessageInbox } from "@/components/messaging/MessageInbox";
import { Users, FileText, Calendar, MessageSquare, AlertCircle } from "lucide-react";

interface DashboardStats {
  unreadMessages: number;
  upcomingMeetings: number;
}

interface Recipient {
  id: string;
  name: string;
  role: string;
}

export default function SGBDashboard() {
  const { user, isAccepted, primaryRole, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    unreadMessages: 0,
    upcomingMeetings: 0,
  });
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAccepted || primaryRole !== "sgb") {
        navigate("/pending");
      }
    }
  }, [user, isAccepted, primaryRole, isLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch unread messages
        const { count: unreadCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("recipient_id", user.id)
          .eq("is_read", false);

        // Fetch upcoming meetings
        const { count: meetingsCount } = await supabase
          .from("meetings")
          .select("*", { count: "exact", head: true })
          .gte("meeting_date", new Date().toISOString());

        setStats({
          unreadMessages: unreadCount || 0,
          upcomingMeetings: meetingsCount || 0,
        });

        // Fetch principal and other SGB members as potential recipients
        const { data: principalRoles } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "principal")
          .eq("application_status", "accepted");

        const { data: sgbRoles } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "sgb")
          .eq("application_status", "accepted")
          .neq("user_id", user.id);

        const allUserIds = [
          ...(principalRoles?.map((r) => r.user_id) || []),
          ...(sgbRoles?.map((r) => r.user_id) || []),
        ];

        if (allUserIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, first_name, last_name")
            .in("user_id", allUserIds);

          const recipientList: Recipient[] = [];

          profiles?.forEach((p) => {
            const isPrincipal = principalRoles?.some((r) => r.user_id === p.user_id);
            recipientList.push({
              id: p.user_id,
              name: `${p.first_name} ${p.last_name}`,
              role: isPrincipal ? "Principal" : "SGB Member",
            });
          });

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
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Upcoming Meetings",
      value: stats.upcomingMeetings,
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <DashboardLayout title="SGB Dashboard" navItems={sgbNavItems}>
      <div className="space-y-6">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                Welcome, {profile?.first_name}! 🤝
              </h2>
              <p className="text-muted-foreground">
                Govern with purpose. Communicate with the Principal, review documents, and help shape school policy.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Communication Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Communication Restriction</p>
                <p className="text-sm text-amber-700">
                  As an SGB member, you can only communicate with the Principal or other SGB members. 
                  Messages and documents will be visible in the Principal's dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
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
                <CardTitle>Communicate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Send messages, documents, or summon the Principal.
                </p>
                <div className="flex flex-wrap gap-3">
                  <MessageComposer 
                    recipients={recipients} 
                    title="Send Message"
                  />
                  <MessageComposer 
                    recipients={recipients.filter(r => r.role === "Principal")} 
                    messageType="summon"
                    title="Summon Principal"
                  />
                  <MessageComposer 
                    recipients={recipients} 
                    messageType="document"
                    title="Send Document"
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
