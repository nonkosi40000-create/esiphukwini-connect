import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Calculator, 
  Globe, 
  Palette, 
  Music, 
  Trophy,
  ArrowRight,
  Clock,
  Users,
  Star
} from "lucide-react";
import patternBg from "@/assets/pattern-bg.jpg";

const grades = [
  { grade: "Grade R", ages: "5-6 years", students: 45, available: true },
  { grade: "Grade 1", ages: "6-7 years", students: 52, available: true },
  { grade: "Grade 2", ages: "7-8 years", students: 48, available: true },
  { grade: "Grade 3", ages: "8-9 years", students: 55, available: false },
];

const subjects = [
  { icon: BookOpen, name: "Languages", description: "English & Home Language literacy development" },
  { icon: Calculator, name: "Mathematics", description: "Foundational numeracy and problem-solving" },
  { icon: Globe, name: "Life Skills", description: "Social development and well-being" },
  { icon: Palette, name: "Creative Arts", description: "Visual arts, drama, and music" },
  { icon: Music, name: "Physical Education", description: "Sports and movement activities" },
  { icon: Trophy, name: "Extra-Curricular", description: "Clubs, sports teams, and events" },
];

const scheduleItems = [
  { time: "07:30 - 08:00", activity: "Arrival & Morning Assembly" },
  { time: "08:00 - 10:00", activity: "Learning Sessions" },
  { time: "10:00 - 10:30", activity: "Break Time" },
  { time: "10:30 - 12:30", activity: "Learning Sessions" },
  { time: "12:30 - 13:00", activity: "Lunch Break" },
  { time: "13:00 - 14:00", activity: "Afternoon Activities" },
];

const Academics = () => {
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
              Academic <span className="text-gold">Programs</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              Our curriculum is designed to provide a strong foundation for lifelong learning, 
              following the CAPS guidelines while incorporating innovative teaching methods.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grade Levels */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Our Grades
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              Foundation Phase Education
            </h2>
            <p className="text-muted-foreground">
              We cater to learners from Grade R to Grade 3, providing age-appropriate education
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {grades.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-soft border border-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {item.grade}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.available 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {item.available ? "Spaces Available" : "Full"}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{item.students} students enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span>Ages: {item.ages}</span>
                  </div>
                </div>
                <Link to="/register" className="block mt-4">
                  <Button 
                    variant={item.available ? "default" : "outline"} 
                    className="w-full"
                    disabled={!item.available}
                  >
                    {item.available ? "Apply Now" : "Join Waitlist"}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Curriculum
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              What We Teach
            </h2>
            <p className="text-muted-foreground">
              A balanced curriculum covering all essential learning areas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-soft group hover:shadow-elevated transition-all duration-300"
              >
                <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <subject.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {subject.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {subject.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Schedule */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Daily Schedule
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                A Typical School Day
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Our school day is structured to maximize learning while ensuring students have 
                adequate breaks and time for physical activity.
              </p>
              <Link to="/past-papers">
                <Button variant="default">
                  View Full Timetable
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl shadow-soft overflow-hidden"
            >
              {scheduleItems.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-4 p-4 ${
                    index !== scheduleItems.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="bg-secondary rounded-lg p-3">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.time}</p>
                    <p className="text-sm text-muted-foreground">{item.activity}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Enroll Your Child?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Give your child the best start in their educational journey.
            </p>
            <Link to="/register">
              <Button variant="gold" size="lg">
                Start Application
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Academics;
