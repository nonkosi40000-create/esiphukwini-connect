import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Calendar,
  FileText,
  Bell,
  Bot,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Sparkles,
} from "lucide-react";
import heroImage from "@/assets/hero-school.jpg";
import patternBg from "@/assets/pattern-bg.jpg";

const features = [
  {
    icon: FileText,
    title: "Online Registration",
    description: "Register your child easily online with document upload and instant application tracking.",
  },
  {
    icon: BookOpen,
    title: "Past Papers Access",
    description: "Access comprehensive past papers and study materials to help students excel.",
  },
  {
    icon: Calendar,
    title: "Parent Meetings",
    description: "Stay updated with meeting schedules and receive reminders straight to your phone.",
  },
  {
    icon: Users,
    title: "Teacher Portal",
    description: "Teachers can upload content, results, and timetables seamlessly.",
  },
  {
    icon: Bot,
    title: "AI Study Assistant",
    description: "Get personalized study help with YouTube recommendations and effective learning tips.",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Subscribe for R20/month and never miss important school announcements.",
  },
];

const benefits = [
  "Save time with digital processes",
  "Reduce paper and ink usage",
  "More teacher-student interaction",
  "Easy access to resources 24/7",
];

const stats = [
  { value: "500+", label: "Students" },
  { value: "25+", label: "Teachers" },
  { value: "35+", label: "Years of Excellence" },
  { value: "98%", label: "Pass Rate" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Students at Esiphukwini Junior Primary School"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-hero opacity-90" />
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 text-gold-light text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Now accepting 2025 applications
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
            >
              Building Bright Futures at{" "}
              <span className="text-gold">Esiphukwini</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed"
            >
              A modern primary school experience where technology meets education.
              Register online, access resources, and stay connected with your child's learning journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/register">
                <Button variant="gold" size="lg" className="w-full sm:w-auto">
                  Apply Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="heroOutline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid grid-cols-2 gap-3"
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-primary-foreground/80">
                  <CheckCircle className="h-5 w-5 text-gold flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-background py-12 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl shadow-elevated p-8 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Our Platform
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-muted-foreground">
              Saving time, money, and resources while creating more opportunities for meaningful 
              teacher-student interaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-card rounded-xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div 
          className="absolute top-0 right-0 w-1/2 h-full opacity-5"
          style={{ backgroundImage: `url(${patternBg})`, backgroundSize: "cover" }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Why Choose Us
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                Empowering Education Through Innovation
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                At Esiphukwini Junior Primary School, we believe in combining traditional values 
                with modern technology. Our digital platform ensures parents stay connected while 
                teachers have more time to focus on what matters most – teaching.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Clock, text: "Save time with online processes" },
                  { icon: Shield, text: "Secure document handling" },
                  { icon: Sparkles, text: "AI-powered learning assistance" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="bg-secondary w-10 h-10 rounded-lg flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/about">
                  <Button variant="default" size="lg">
                    Learn About Our History
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-secondary rounded-2xl p-8">
                <div className="gradient-primary rounded-xl p-6 text-primary-foreground">
                  <h3 className="font-display text-2xl font-bold mb-4">
                    Parent Subscription
                  </h3>
                  <p className="text-primary-foreground/80 mb-6">
                    Stay connected with your child's education journey for just:
                  </p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl font-bold">R20</span>
                    <span className="text-primary-foreground/60">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Meeting reminders via SMS",
                      "Important announcements",
                      "Grade performance updates",
                      "School calendar alerts",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-gold" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/parent-portal">
                    <Button variant="gold" className="w-full" size="lg">
                      Subscribe Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url(${patternBg})`, backgroundSize: "cover" }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Join Our School Family?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Applications for 2025 are now open. Register your child online and start their 
              journey towards a bright future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="gold" size="lg">
                  Start Application
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/past-papers">
                <Button variant="heroOutline" size="lg">
                  Browse Past Papers
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
