import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Play, CheckCircle, Clock, Trophy } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  grade_level: string;
  time_limit_minutes: number | null;
}

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string | null;
  option_d: string | null;
  correct_answer: string;
  points: number;
  sort_order: number;
}

export function QuizPlayer() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const { data } = await supabase.from("quizzes").select("*").eq("is_active", true);
    if (data) setQuizzes(data);
    setLoading(false);
  };

  const startQuiz = async (quiz: Quiz) => {
    const { data: qns } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quiz.id)
      .order("sort_order");
    if (qns && qns.length > 0) {
      setActiveQuiz(quiz);
      setQuestions(qns);
      setCurrentQ(0);
      setAnswers({});
      setScore(null);
    } else {
      toast({ title: "No questions found for this quiz" });
    }
  };

  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const submitQuiz = async () => {
    if (!activeQuiz || !user) return;
    let totalScore = 0;
    let totalPoints = 0;
    questions.forEach((q) => {
      totalPoints += q.points;
      if (answers[q.id] === q.correct_answer) totalScore += q.points;
    });

    await supabase.from("quiz_attempts").insert({
      quiz_id: activeQuiz.id,
      student_id: user.id,
      answers,
      score: totalScore,
      total_points: totalPoints,
      completed_at: new Date().toISOString(),
    });

    setScore(totalScore);
    toast({ title: `Quiz completed! Score: ${totalScore}/${totalPoints}` });
  };

  if (loading) return <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />;

  if (score !== null && activeQuiz) {
    const totalPoints = questions.reduce((s, q) => s + q.points, 0);
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-3xl font-bold text-primary mb-2">{score}/{totalPoints}</p>
          <p className="text-muted-foreground mb-4">{((score / totalPoints) * 100).toFixed(0)}%</p>
          <Button onClick={() => { setActiveQuiz(null); setScore(null); }}>Back to Quizzes</Button>
        </CardContent>
      </Card>
    );
  }

  if (activeQuiz && questions.length > 0) {
    const q = questions[currentQ];
    const options = [
      { key: "A", value: q.option_a },
      { key: "B", value: q.option_b },
      ...(q.option_c ? [{ key: "C", value: q.option_c }] : []),
      ...(q.option_d ? [{ key: "D", value: q.option_d }] : []),
    ];

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{activeQuiz.title}</CardTitle>
            <Badge variant="outline">Q{currentQ + 1}/{questions.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <p className="font-medium text-lg mb-4">{q.question_text}</p>
            <div className="space-y-2">
              {options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => selectAnswer(q.id, opt.key)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    answers[q.id] === opt.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 hover:bg-muted border-border"
                  }`}
                >
                  <span className="font-medium mr-2">{opt.key}.</span> {opt.value}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)}>Previous</Button>
              {currentQ < questions.length - 1 ? (
                <Button onClick={() => setCurrentQ(currentQ + 1)} disabled={!answers[q.id]}>Next</Button>
              ) : (
                <Button onClick={submitQuiz} disabled={Object.keys(answers).length < questions.length}>Submit Quiz</Button>
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold">Available Quizzes</h3>
      {quizzes.length === 0 ? (
        <p className="text-muted-foreground">No quizzes available</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{quiz.title}</h4>
                    <p className="text-sm text-muted-foreground">{quiz.subject} • Grade {quiz.grade_level}</p>
                    {quiz.description && <p className="text-sm mt-1">{quiz.description}</p>}
                    {quiz.time_limit_minutes && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> {quiz.time_limit_minutes} min</p>
                    )}
                  </div>
                  <Button size="sm" onClick={() => startQuiz(quiz)}><Play className="h-4 w-4 mr-1" /> Play</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
