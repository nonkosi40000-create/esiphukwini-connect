import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface Timetable {
  id: string;
  title: string;
  grade_level: string;
  term: number;
  academic_year: number;
  file_url: string | null;
  timetable_data: any;
}

export function TimetableView() {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("timetables").select("*").order("created_at", { ascending: false });
      if (data) setTimetables(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold flex items-center gap-2"><Calendar className="h-5 w-5" /> Timetables</h3>
      {timetables.length === 0 ? (
        <p className="text-muted-foreground">No timetables uploaded yet</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {timetables.map((tt) => (
            <Card key={tt.id}>
              <CardHeader>
                <CardTitle className="text-base">{tt.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Grade {tt.grade_level} • Term {tt.term} • {tt.academic_year}</p>
                {tt.file_url && (
                  <a href={tt.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    View / Download Timetable
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
