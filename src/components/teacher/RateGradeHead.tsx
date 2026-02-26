import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Send } from "lucide-react";

interface GradeHead {
  user_id: string;
  first_name: string;
  last_name: string;
}

export function RateGradeHead() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [gradeHeads, setGradeHeads] = useState<GradeHead[]>([]);
  const [selectedGH, setSelectedGH] = useState<string>("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data: ghRoles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "grade_head")
        .eq("application_status", "accepted");

      if (ghRoles && ghRoles.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, first_name, last_name")
          .in("user_id", ghRoles.map((r) => r.user_id));
        if (profiles) setGradeHeads(profiles);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const submitRating = async () => {
    if (!selectedGH || rating === 0) return;
    setSubmitting(true);

    const { error } = await supabase.from("staff_ratings").insert({
      rated_user_id: selectedGH,
      rated_role: "grade_head",
      rater_role: "teacher",
      rating,
      comment: comment || null,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Rating submitted anonymously" });
      setRating(0);
      setComment("");
      setSelectedGH("");
    }
    setSubmitting(false);
  };

  if (loading) return <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Grade Head (Anonymous)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {gradeHeads.length === 0 ? (
          <p className="text-muted-foreground">No grade heads found</p>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Grade Head</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedGH}
                onChange={(e) => setSelectedGH(e.target.value)}
              >
                <option value="">Choose...</option>
                {gradeHeads.map((gh) => (
                  <option key={gh.user_id} value={gh.user_id}>{gh.first_name} {gh.last_name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onMouseEnter={() => setHoveredStar(s)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(s)}
                    className="p-1"
                  >
                    <Star className={`h-8 w-8 transition-colors ${
                      s <= (hoveredStar || rating) ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Comment (optional)</label>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Your anonymous feedback..." />
            </div>

            <Button onClick={submitRating} disabled={!selectedGH || rating === 0 || submitting}>
              <Send className="h-4 w-4 mr-2" /> Submit Anonymous Rating
            </Button>
            <p className="text-xs text-muted-foreground">Your identity will not be stored with this rating.</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
