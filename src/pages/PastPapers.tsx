import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  Download, 
  Search, 
  FileText,
  BookOpen,
  Filter,
  Calendar
} from "lucide-react";
import patternBg from "@/assets/pattern-bg.jpg";

const pastPapers = [
  { 
    id: 1,
    subject: "Mathematics",
    grade: "Grade 3",
    year: "2024",
    term: "Term 3",
    downloads: 234,
  },
  { 
    id: 2,
    subject: "English",
    grade: "Grade 3",
    year: "2024",
    term: "Term 3",
    downloads: 198,
  },
  { 
    id: 3,
    subject: "Life Skills",
    grade: "Grade 2",
    year: "2024",
    term: "Term 2",
    downloads: 156,
  },
  { 
    id: 4,
    subject: "Mathematics",
    grade: "Grade 2",
    year: "2024",
    term: "Term 2",
    downloads: 189,
  },
  { 
    id: 5,
    subject: "English",
    grade: "Grade 1",
    year: "2024",
    term: "Term 2",
    downloads: 145,
  },
  { 
    id: 6,
    subject: "Mathematics",
    grade: "Grade 1",
    year: "2024",
    term: "Term 1",
    downloads: 267,
  },
  { 
    id: 7,
    subject: "Home Language",
    grade: "Grade 3",
    year: "2023",
    term: "Term 4",
    downloads: 312,
  },
  { 
    id: 8,
    subject: "Life Skills",
    grade: "Grade R",
    year: "2024",
    term: "Term 1",
    downloads: 98,
  },
];

const PastPapers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const filteredPapers = pastPapers.filter(paper => {
    const matchesSearch = paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          paper.grade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === "all" || paper.grade === selectedGrade;
    const matchesSubject = selectedSubject === "all" || paper.subject === selectedSubject;
    return matchesSearch && matchesGrade && matchesSubject;
  });

  const uniqueGrades = [...new Set(pastPapers.map(p => p.grade))];
  const uniqueSubjects = [...new Set(pastPapers.map(p => p.subject))];

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
              Past <span className="text-gold">Papers</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              Access previous examination papers to help students prepare and practice. 
              Download and study at your own pace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-background border-b border-border sticky top-20 z-30 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by subject or grade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-4 py-2 rounded-lg border border-input bg-background text-sm"
              >
                <option value="all">All Grades</option>
                {uniqueGrades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 rounded-lg border border-input bg-background text-sm"
              >
                <option value="all">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Papers Grid */}
      <section className="py-12 bg-muted min-h-[50vh]">
        <div className="container mx-auto px-4">
          {filteredPapers.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No papers found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPapers.map((paper, index) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-card rounded-xl shadow-soft overflow-hidden group hover:shadow-elevated transition-all duration-300"
                >
                  <div className="gradient-primary p-4 flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-primary-foreground" />
                    <div>
                      <p className="text-primary-foreground font-semibold">{paper.subject}</p>
                      <p className="text-primary-foreground/70 text-sm">{paper.grade}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{paper.year} - {paper.term}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {paper.downloads} downloads
                      </span>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Need More Resources?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our AI Study Assistant can help you find the best study materials and 
              recommend helpful YouTube videos based on your learning needs.
            </p>
            <Button variant="default">
              Chat with Study Assistant
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PastPapers;
