import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Trash2 } from "lucide-react";

interface Timetable {
  id: string;
  title: string;
  grade_level: string;
  term: number;
  academic_year: number;
  file_url: string | null;
  created_at: string;
}

export function TimetableUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", grade_level: "R", term: "1" });

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    if (!user) return;
    const { data } = await supabase.from("timetables").select("*").eq("uploaded_by", user.id).order("created_at", { ascending: false });
    if (data) setTimetables(data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    setUploading(true);
    const file = e.target.files[0];
    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage.from("timetables").upload(filePath, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("timetables").getPublicUrl(filePath);

    const { error } = await supabase.from("timetables").insert({
      title: form.title || `Timetable - Grade ${form.grade_level}`,
      grade_level: form.grade_level,
      term: parseInt(form.term),
      uploaded_by: user.id,
      file_url: urlData.publicUrl,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Timetable uploaded" });
      setForm({ title: "", grade_level: "R", term: "1" });
      fetchTimetables();
    }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Upload Timetable</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Term 1 Timetable" /></div>
            <div className="space-y-2">
              <Label>Grade Level</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.grade_level} onChange={(e) => setForm({ ...form, grade_level: e.target.value })}>
                {["R", "1", "2", "3", "4", "5", "6", "7"].map((g) => <option key={g} value={g}>Grade {g}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Term</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })}>
                {[1, 2, 3, 4].map((t) => <option key={t} value={t}>Term {t}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <Label>File</Label>
            <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleUpload} disabled={uploading} className="mt-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>My Uploaded Timetables</CardTitle></CardHeader>
        <CardContent>
          {timetables.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No timetables uploaded yet</p>
          ) : (
            <div className="space-y-3">
              {timetables.map((tt) => (
                <div key={tt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{tt.title}</p>
                      <p className="text-xs text-muted-foreground">Grade {tt.grade_level} • Term {tt.term} • {tt.academic_year}</p>
                    </div>
                  </div>
                  {tt.file_url && <a href={tt.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">View</a>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
