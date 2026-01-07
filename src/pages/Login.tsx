import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  LogIn, 
  Eye, 
  EyeOff,
  GraduationCap,
  Users,
  Shield
} from "lucide-react";
import patternBg from "@/assets/pattern-bg.jpg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"staff" | "parent">("staff");

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
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
                    Access your dashboard to manage content, upload materials, view student 
                    information, and stay connected with the school community.
                  </p>

                  <div className="space-y-4">
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
                <div className="text-center mb-8">
                  <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                    Sign In
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Enter your credentials to access the portal
                  </p>
                </div>

                {/* User Type Selector */}
                <div className="flex bg-muted rounded-lg p-1 mb-8">
                  <button
                    type="button"
                    onClick={() => setUserType("staff")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      userType === "staff"
                        ? "bg-card shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Staff Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("parent")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      userType === "parent"
                        ? "bg-card shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Parent Login
                  </button>
                </div>

                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email" 
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

                    <Button type="submit" className="w-full" size="lg">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </div>
                </form>

                {userType === "parent" && (
                  <div className="mt-6 pt-6 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link to="/parent-portal" className="text-primary hover:underline font-medium">
                        Subscribe now
                      </Link>
                    </p>
                  </div>
                )}

                {userType === "staff" && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-center text-muted-foreground">
                      Staff accounts are managed by the school administration. 
                      Contact the office if you need assistance.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
