import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  Bell, 
  CreditCard, 
  Calendar,
  CheckCircle,
  ChevronRight,
  Shield,
  Smartphone,
  Mail,
  Star
} from "lucide-react";
import patternBg from "@/assets/pattern-bg.jpg";

const benefits = [
  {
    icon: Bell,
    title: "Meeting Reminders",
    description: "Get SMS and email notifications about upcoming parent meetings",
  },
  {
    icon: Calendar,
    title: "Event Updates",
    description: "Stay informed about school events, holidays, and important dates",
  },
  {
    icon: Star,
    title: "Grade Updates",
    description: "Receive notifications about your child's academic progress",
  },
  {
    icon: Shield,
    title: "Emergency Alerts",
    description: "Be the first to know about any urgent school announcements",
  },
];

const ParentPortal = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 gradient-primary relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url(${patternBg})`, backgroundSize: "cover" }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Parent <span className="text-gold">Portal</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              Stay connected with your child's education. Subscribe to receive important 
              updates, meeting reminders, and school announcements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Parent Subscription
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                Never Miss an Important Update
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                For just R10 per month, stay fully connected with your child's school life. 
                Receive instant notifications about meetings, events, and academic updates.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl"
                  >
                    <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Subscription Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-card rounded-2xl shadow-elevated overflow-hidden">
                {/* Pricing Header */}
                <div className="gradient-primary p-8 text-center">
                  <p className="text-primary-foreground/80 mb-2">Monthly Subscription</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-primary-foreground">R10</span>
                    <span className="text-primary-foreground/60">/month</span>
                  </div>
                  <p className="text-primary-foreground/70 text-sm mt-2">
                    Cancel anytime
                  </p>
                </div>

                {/* Form */}
                <div className="p-8">
                  {isSubscribed ? (
                    <div className="text-center py-6">
                      <div className="gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        Subscription Active!
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        You'll receive notifications via SMS and email.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); setIsSubscribed(true); }}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="parentName">Parent/Guardian Name</Label>
                          <Input id="parentName" placeholder="Enter full name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="studentName">Child's Name</Label>
                          <Input id="studentName" placeholder="Enter student name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number (for SMS)</Label>
                          <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="phone" type="tel" placeholder="+27 XX XXX XXXX" className="pl-10" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="email" type="email" placeholder="email@example.com" className="pl-10" required />
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                            <CreditCard className="h-5 w-5" />
                            <span>Secure payment via card or EFT</span>
                          </div>
                          <Button type="submit" variant="gold" className="w-full" size="lg">
                            Subscribe Now - R10/month
                          </Button>
                        </div>

                        <p className="text-xs text-center text-muted-foreground">
                          By subscribing, you agree to our terms of service and privacy policy
                        </p>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Already Registered Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-xl shadow-soft p-8 max-w-2xl mx-auto text-center">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">
              Already Subscribed?
            </h3>
            <p className="text-muted-foreground mb-6">
              Log in to manage your subscription, update contact details, or view your child's information.
            </p>
            <Link to="/login">
              <Button variant="outline">
                Login to Portal
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ParentPortal;
