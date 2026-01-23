import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Target, 
  Award, 
  Users, 
  ArrowRight,
  Heart,
  Lightbulb,
  Star,
  Trophy,
  Music,
  Dribbble
} from "lucide-react";
import patternBg from "@/assets/pattern-bg.jpg";

const timeline = [
  {
    year: "1985",
    title: "Foundation",
    description: "Esiphukwini Junior Primary School was established in the Ngonyameni Area with just 3 classrooms and 50 students.",
  },
  {
    year: "1995",
    title: "Expansion",
    description: "New buildings added including a library and computer lab, enrollment grew to 200 students.",
  },
  {
    year: "2010",
    title: "Recognition",
    description: "Received excellence award for academic performance in the district.",
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description: "Launched online learning platforms and began digital integration in classrooms.",
  },
  {
    year: "2025",
    title: "Today & Beyond",
    description: "Now serving 500+ students with a fully integrated digital school management system.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Ubuntu",
    description: "We believe in the power of community and treating every child with dignity and respect.",
  },
  {
    icon: Lightbulb,
    title: "Excellence",
    description: "We strive for the highest standards in academic achievement and personal development.",
  },
  {
    icon: Star,
    title: "Innovation",
    description: "Embracing technology and modern teaching methods to prepare students for the future.",
  },
  {
    icon: Users,
    title: "Inclusivity",
    description: "Every child belongs here regardless of background, ability, or circumstance.",
  },
];

const sports = [
  { name: "Netball", icon: Trophy },
  { name: "Soccer", icon: Dribbble },
  { name: "Athletics", icon: Trophy },
  { name: "Cricket", icon: Trophy },
  { name: "Spelling Bee", icon: BookOpen },
  { name: "Choir", icon: Music },
];

// School Governing Body structure
const sgbStructure = [
  {
    role: "SGB Chairperson",
    description: "Leads the School Governing Body and oversees school governance",
  },
  {
    role: "SGB Deputy Chairperson",
    description: "Assists the Chairperson and acts in their absence",
  },
  {
    role: "SGB Secretary",
    description: "Manages documentation and communication",
  },
  {
    role: "SGB Treasurer",
    description: "Oversees school finances and budgeting",
  },
  {
    role: "Parent Representatives",
    description: "Voice of parents in school matters",
  },
];

const schoolDepartments = [
  {
    title: "Administration",
    roles: ["Principal", "Admin Clerk", "Finance Officer"],
  },
  {
    title: "Academic Department",
    roles: ["Grade Heads (R-7)", "Subject Coordinators", "Teachers"],
  },
  {
    title: "Support Services",
    roles: ["Librarian", "IT Support", "Counselor"],
  },
  {
    title: "Operations",
    roles: ["Caretaker", "Security", "Cleaners"],
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 gradient-primary relative overflow-hidden">
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
              Our Story of <span className="text-gold">Excellence</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              For over 35 years, Esiphukwini Junior Primary School has been shaping young minds 
              and building a foundation for lifelong success in the Ngonyameni Area.
            </p>
            <p className="text-gold font-semibold text-xl mt-4 uppercase tracking-wider">
              Arise and Shine
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                description: "To provide quality education that nurtures the whole child - academically, socially, and emotionally - preparing them for a successful future.",
              },
              {
                icon: BookOpen,
                title: "Our Vision",
                description: "We are committed in providing quality education for all and thus developing the potential of each learner through effective communication and networking with all stakeholders.",
              },
              {
                icon: Award,
                title: "Our Goals",
                description: "To achieve academic excellence while fostering creativity, critical thinking, and character development in every student.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-8 shadow-soft text-center"
              >
                <div className="gradient-primary w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* School Organogram */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              School Structure
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              School Organogram
            </h2>
            <p className="text-muted-foreground">
              Our organizational structure ensures effective management and quality education
            </p>
          </motion.div>

          {/* SGB Section */}
          <div className="mb-12">
            <h3 className="font-display text-2xl font-bold text-center text-foreground mb-8">
              School Governing Body (SGB)
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {sgbStructure.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-card rounded-xl p-4 shadow-soft text-center border-2 border-primary/20"
                >
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-2">{item.role}</h4>
                  <p className="text-muted-foreground text-xs">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* School Departments */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {schoolDepartments.map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-soft"
              >
                <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary-foreground" />
                </div>
                <h4 className="font-display text-lg font-bold text-foreground mb-4">
                  {dept.title}
                </h4>
                <ul className="space-y-2">
                  {dept.roles.map((role, roleIndex) => (
                    <li key={roleIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {role}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports & Extra-Curricular */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Extra-Curricular
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              Sports & Activities
            </h2>
            <p className="text-muted-foreground">
              We offer a variety of sports and activities to develop well-rounded learners
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sports.map((sport, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-soft text-center hover:shadow-elevated transition-all duration-300 group"
              >
                <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <sport.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground" />
                </div>
                <h4 className="font-semibold text-foreground">{sport.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              What We Stand For
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-soft text-center group hover:shadow-elevated transition-all duration-300"
              >
                <div className="bg-secondary w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              History, Present & Future
            </h2>
            <p className="text-muted-foreground">
              From humble beginnings to a thriving educational institution
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 mb-8"
              >
                <div className="flex flex-col items-center">
                  <div className="gradient-primary w-16 h-16 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {item.year}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Become Part of Our Story
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Join the Esiphukwini family and give your child the foundation they need to succeed.
            </p>
            <Link to="/register">
              <Button variant="gold" size="lg">
                Apply Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
