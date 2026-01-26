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
import computerLabImage from "@/assets/computer-lab.jpg";

// Foundation Phase (Grade R-3)
const foundationPhaseGrades = [
  { grade: "Grade R", ages: "5-6 years", students: 45, available: true },
  { grade: "Grade 1", ages: "6-7 years", students: 52, available: true },
  { grade: "Grade 2", ages: "7-8 years", students: 48, available: true },
  { grade: "Grade 3", ages: "8-9 years", students: 55, available: false },
];

const foundationPhaseSubjects = [
  { icon: Calculator, name: "Mathematics", description: "Foundational numeracy and problem-solving skills" },
  { icon: BookOpen, name: "IsiZulu", description: "Home language literacy and communication" },
  { icon: Globe, name: "English", description: "First additional language development" },
  { icon: Palette, name: "Life Skills", description: "Personal, social and physical development" },
];

// Intermediate Phase (Grade 4-6)
const intermediatePhaseGrades = [
  { grade: "Grade 4", ages: "9-10 years", students: 50, available: true },
  { grade: "Grade 5", ages: "10-11 years", students: 48, available: true },
  { grade: "Grade 6", ages: "11-12 years", students: 52, available: false },
];

const intermediateAndSeniorSubjects = [
  { icon: Calculator, name: "Mathematics", description: "Numeracy, algebra and problem-solving" },
  { icon: BookOpen, name: "IsiZulu", description: "Home language literacy and literature" },
  { icon: Globe, name: "English", description: "First additional language proficiency" },
  { icon: BookOpen, name: "Natural Sciences", description: "Scientific inquiry and investigation" },
  { icon: Globe, name: "Social Sciences", description: "History and Geography" },
  { icon: Calculator, name: "EMS", description: "Economic and Management Sciences" },
  { icon: Palette, name: "Life Orientation", description: "Personal and social well-being" },
  { icon: Trophy, name: "Technology", description: "Design and technological skills", hasImage: true },
  { icon: Music, name: "Creative Arts", description: "Visual arts, drama, dance and music" },
];

// Senior Phase (Grade 7)
const seniorPhaseGrades = [
  { grade: "Grade 7", ages: "12-13 years", students: 45, available: true },
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

      {/* Foundation Phase - Grade R-3 */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Foundation Phase
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              Grade R - 3
            </h2>
            <p className="text-muted-foreground">
              Building strong foundations for lifelong learning
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {foundationPhaseGrades.map((item, index) => (
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

          {/* Foundation Phase Subjects */}
          <div className="bg-muted rounded-2xl p-8">
            <h3 className="font-display text-xl font-bold text-foreground mb-6 text-center">Foundation Phase Subjects</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {foundationPhaseSubjects.map((subject, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-card rounded-xl p-4 shadow-soft group hover:shadow-elevated transition-all duration-300"
                >
                  <div className="gradient-primary w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <subject.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h4 className="font-display font-bold text-foreground mb-1">{subject.name}</h4>
                  <p className="text-muted-foreground text-xs">{subject.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intermediate Phase - Grade 4-6 */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Intermediate Phase
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              Grade 4 - 6
            </h2>
            <p className="text-muted-foreground">
              Developing critical thinking and independent learning skills
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {intermediatePhaseGrades.map((item, index) => (
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

          {/* Intermediate Phase Subjects */}
          <div className="bg-card rounded-2xl p-8">
            <h3 className="font-display text-xl font-bold text-foreground mb-6 text-center">Intermediate & Senior Phase Subjects</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-4">
              {intermediateAndSeniorSubjects.map((subject, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`bg-muted rounded-xl shadow-soft group hover:shadow-elevated transition-all duration-300 overflow-hidden ${
                    subject.hasImage ? 'row-span-2' : ''
                  }`}
                >
                  {subject.hasImage ? (
                    <div className="h-full flex flex-col">
                      <img 
                        src={computerLabImage} 
                        alt="Students in computer lab" 
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="gradient-primary w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <subject.icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h4 className="font-display font-bold text-foreground mb-1">{subject.name}</h4>
                        <p className="text-muted-foreground text-xs">{subject.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="gradient-primary w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <subject.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <h4 className="font-display font-bold text-foreground mb-1">{subject.name}</h4>
                      <p className="text-muted-foreground text-xs">{subject.description}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Senior Phase - Grade 7 */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Senior Phase
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              Grade 7
            </h2>
            <p className="text-muted-foreground">
              Preparing learners for high school and beyond
            </p>
          </motion.div>

          <div className="max-w-md mx-auto">
            {seniorPhaseGrades.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
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
