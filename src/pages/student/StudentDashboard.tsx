import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  FileText,
  Calendar,
  BarChart3,
  Bell,
} from "lucide-react";

const studentNavItems = [
  { name: "Dashboard", href: "/student", icon: Home },
  { name: "My Classes", href: "/student/classes", icon: BookOpen },
  { name: "My Marks", href: "/student/marks", icon: BarChart3 },
  { name: "Content", href: "/student/content", icon: FileText },
  { name: "Schedule", href: "/student/schedule", icon: Calendar },
  { name: "Announcements", href: "/student/announcements", icon: Bell },
];

const StudentDashboard = () => {
  const { user, profile, isAccepted, isLoading, primaryRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAccepted) {
        navigate("/pending");
      } else if (primaryRole !== "learner") {
        // Redirect to correct dashboard
        switch (primaryRole) {
          case "admin":
            navigate("/admin");
            break;
          case "principal":
            navigate("/principal");
            break;
          case "grade_head":
            navigate("/grade-head");
            break;
          case "teacher":
            navigate("/teacher");
            break;
          case "sgb":
            navigate("/sgb");
            break;
        }
      }
    }
  }, [user, isAccepted, isLoading, primaryRole, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout title="Student Dashboard" navItems={studentNavItems}>
      <div className="space-y-6">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                Welcome back, {profile?.first_name}! 🎓
              </h2>
              <p className="text-muted-foreground">
                Access your marks, view class content, and stay updated with announcements from your teachers.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Average</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Current term average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Days present this term
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Pending assignments
            </p>
          </CardContent>
        </Card>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
