import { Layout } from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  LogIn, 
  Eye, 
  EyeOff,
  GraduationCap,
  Users,
  Shield,
  BookOpen,
  UserCheck,
  Crown,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { loginSchema } from "@/lib/validations";
import patternBg from "@/assets/pattern-bg.jpg";

type UserType = 'learner' | 'teacher' | 'grade_head' | 'principal' | 'admin';

const userTypeInfo = {
  learner: { icon: BookOpen, label: 'Learner', description: 'Student portal access' },
  teacher: { icon: Users, label: 'Teacher', description: 'Teaching & content management' },
  grade_head: { icon: UserCheck, label: 'Grade Head', description: 'Grade oversight & management' },
  principal: { icon: Crown, label: 'Principal', description: 'Full school oversight' },
  admin: { icon: Shield, label: 'Admin', description: 'System administration' },
};

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<UserType>('learner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, user, isAccepted, primaryRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (isAccepted) {
        // Redirect based on role
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
          case 'sgb':
            navigate('/sgb');
            break;
          default:
            navigate('/pending');
        }
      } else {
        navigate('/pending');
      }
    }
  }, [user, isAccepted, primaryRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const validation = loginSchema.safeParse({ email, password });
      if (!validation.success) {
        setError(validation.error.errors[0].message);
        setIsLoading(false);
        return;
      }

      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        if (signInError.message.includes('Invalid login')) {
          setError('Invalid email or password. Please try again.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please verify your email address before logging in.');
        } else {
          setError(signInError.message);
        }
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Side - Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block"
            >
              <div 
                className="relative rounded-2xl overflow-hidden p-12"
                style={{ backgroundImage: `url(${patternBg})`, backgroundSize: "cover" }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-primary-foreground/20 p-3 rounded-xl">
                      <GraduationCap className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-primary-foreground">
                        Esiphukwini
                      </h2>
                      <p className="text-primary-foreground/80 text-sm">Junior Primary School</p>
                    </div>
                  </div>

                  <h3 className="font-display text-3xl font-bold text-primary-foreground mb-6">
                    Welcome Back
                  </h3>
                  <p className="text-primary-foreground/80 leading-relaxed mb-8">
                    Access your personalized dashboard based on your role. Manage content, 
                    view progress, and stay connected with our school community.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-primary-foreground/80">
                      <BookOpen className="h-5 w-5" />
                      <span>Learners: View marks & resources</span>
                    </div>
                    <div className="flex items-center gap-4 text-primary-foreground/80">
                      <Users className="h-5 w-5" />
                      <span>Teachers: Upload content & results</span>
                    </div>
                    <div className="flex items-center gap-4 text-primary-foreground/80">
                      <Shield className="h-5 w-5" />
                      <span>Admin: Manage applications & users</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-card rounded-2xl shadow-elevated p-8">
                <div className="text-center mb-6">
                  <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                    Sign In
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Enter your credentials to access the portal
                  </p>
                </div>

                {/* User Type Selector */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {(['learner', 'teacher', 'admin'] as UserType[]).map((type) => {
                    const info = userTypeInfo[type];
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setUserType(type)}
                        className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                          userType === type
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                        }`}
                      >
                        <info.icon className="h-5 w-5 mb-1" />
                        <span className="text-xs font-medium">{info.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* More roles dropdown for advanced users */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {(['grade_head', 'principal'] as UserType[]).map((type) => {
                    const info = userTypeInfo[type];
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setUserType(type)}
                        className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                          userType === type
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                        }`}
                      >
                        <info.icon className="h-4 w-4" />
                        <span className="text-xs font-medium">{info.label}</span>
                      </button>
                    );
                  })}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Signing in...
                        </div>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In as {userTypeInfo[userType].label}
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary hover:underline font-medium">
                      Register here
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
