import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface RatingSummary {
  teacher_id: string;
  teacher_name: string;
  avg_rating: number;
  total_ratings: number;
}

export function TeacherRatingsView() {
  const [ratings, setRatings] = useState<RatingSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      // Get teacher ratings
      const { data: ratingsData } = await supabase.from("teacher_ratings").select("teacher_id, rating");
      
      if (ratingsData && ratingsData.length > 0) {
        // Group by teacher
        const grouped: Record<string, number[]> = {};
        ratingsData.forEach((r) => {
          if (!grouped[r.teacher_id]) grouped[r.teacher_id] = [];
          grouped[r.teacher_id].push(r.rating);
        });

        // Get teacher names
        const teacherIds = Object.keys(grouped);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, first_name, last_name")
          .in("user_id", teacherIds);

        const summaries: RatingSummary[] = teacherIds.map((id) => {
          const profile = profiles?.find((p) => p.user_id === id);
          const scores = grouped[id];
          return {
            teacher_id: id,
            teacher_name: profile ? `${profile.first_name} ${profile.last_name}` : "Unknown",
            avg_rating: scores.reduce((a, b) => a + b, 0) / scores.length,
            total_ratings: scores.length,
          };
        });

        setRatings(summaries);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold">Anonymous Teacher Ratings by Students</h3>
      {ratings.length === 0 ? (
        <p className="text-muted-foreground">No ratings yet</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ratings.map((r) => (
            <Card key={r.teacher_id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{r.teacher_name}</p>
                    <p className="text-sm text-muted-foreground">{r.total_ratings} anonymous ratings</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-5 w-5 ${s <= Math.round(r.avg_rating) ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`} />
                    ))}
                    <span className="ml-2 font-bold text-sm">{r.avg_rating.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
