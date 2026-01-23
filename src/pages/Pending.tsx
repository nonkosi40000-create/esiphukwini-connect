import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Clock, Mail, Phone, RefreshCw, LogOut } from "lucide-react";
import { useEffect } from "react";

const Pending = () => {
  const { user, profile, userRoles, signOut, refreshProfile, isAccepted, primaryRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isAccepted && primaryRole) {
      switch (primaryRole) {
        case 'admin':
          navigate('/admin');
          break;
        case 'principal':
          navigate('/principal');
          break;
        case 'grade_head':
          navigate('/grade-head');
          break;
        case 'teacher':
          navigate('/teacher');
          break;
        case 'learner':
          navigate('/student');
          break;
      }
    }
  }, [isAccepted, primaryRole, navigate]);

  const handleRefresh = async () => {
    await refreshProfile();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const currentRole = userRoles[0];
  const status = currentRole?.application_status || 'pending';

  return (
    <Layout>
      <section className="min-h-[70vh] flex items-center py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center"
          >
            {status === 'pending' && (
              <>
                <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-10 w-10 text-amber-600" />
                </div>
                
                <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                  Application Under Review
                </h1>
                
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Thank you for registering, {profile?.first_name || 'User'}! Your application is currently 
                  being reviewed by our administration team. You'll be notified once a decision has been made.
                </p>
              </>
            )}

            {status === 'rejected' && (
              <>
                <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">😔</span>
                </div>
                
                <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                  Application Not Approved
                </h1>
                
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  We regret to inform you that your application has not been approved at this time. 
                  Please contact the school office for more information.
                </p>
              </>
            )}

            <div className="bg-card rounded-xl shadow-soft p-6 mb-8">
              <h3 className="font-semibold text-foreground mb-4">Need help?</h3>
              <div className="space-y-3">
                <a 
                  href="mailto:esiphukwiniprimaryschool@gmail.com" 
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  <span>esiphukwiniprimaryschool@gmail.com</span>
                </a>
                <a 
                  href="tel:0752303304" 
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary" />
                  <span>075 230 3304 / 072 209 8878</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Status
              </Button>
              <Button onClick={handleSignOut} variant="ghost">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Pending;
