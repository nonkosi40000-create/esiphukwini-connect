import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  BookOpen,
  CreditCard,
  Upload,
  Save,
  FileText,
  BarChart3,
} from "lucide-react";

interface Mark {
  id: string;
  assessment_name: string;
  marks_obtained: number;
  total_marks: number;
  percentage: number | null;
  feedback: string | null;
  term: number;
  subject_id: string;
}

interface Subject {
  id: string;
  name: string;
}

interface Payment {
  id: string;
  amount: number;
  payment_type: string;
  status: string;
  reference: string | null;
  proof_of_payment_url: string | null;
  payment_date: string;
}

interface SchoolAccount {
  bank_name: string;
  account_number: string;
  account_holder: string;
  branch_code: string;
  reference_instructions: string | null;
}

export default function ParentDashboard() {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    physical_address: "",
    next_of_kin_contact: "",
    backup_email: "",
  });
  const [childMarks, setChildMarks] = useState<Mark[]>([]);
  const [subjects, setSubjects] = useState<Record<string, string>>({});
  const [payments, setPayments] = useState<Payment[]>([]);
  const [schoolAccount, setSchoolAccount] = useState<SchoolAccount | null>(null);
  const [childId, setChildId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentType, setPaymentType] = useState("school_fees");

  useEffect(() => {
    if (!isLoading && !user) navigate("/auth");
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number,
        physical_address: profile.physical_address,
        next_of_kin_contact: profile.next_of_kin_contact || "",
        backup_email: profile.backup_email || "",
      });
      fetchChildData();
    }
  }, [profile]);

  const fetchChildData = async () => {
    if (!profile) return;
    // Find child via learner_registrations parent_guardian_email
    const { data: learnerReg } = await supabase
      .from("learner_registrations")
      .select("user_id")
      .eq("parent_guardian_email", profile.email)
      .limit(1)
      .maybeSingle();

    if (learnerReg) {
      setChildId(learnerReg.user_id);
      // Fetch marks
      const { data: marks } = await supabase
        .from("marks")
        .select("*")
        .eq("student_id", learnerReg.user_id)
        .order("term", { ascending: true });
      if (marks) setChildMarks(marks);

      // Fetch subjects
      const { data: subjectList } = await supabase.from("subjects").select("id, name");
      const subMap: Record<string, string> = {};
      subjectList?.forEach((s) => (subMap[s.id] = s.name));
      setSubjects(subMap);

      // Fetch payments
      const { data: paymentData } = await supabase
        .from("fee_payments")
        .select("*")
        .eq("student_id", learnerReg.user_id)
        .order("created_at", { ascending: false });
      if (paymentData) setPayments(paymentData);
    }

    // Fetch school account
    const { data: account } = await supabase.from("school_account_info").select("*").limit(1).maybeSingle();
    if (account) setSchoolAccount(account);
  };

  const saveProfile = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update(profileForm)
      .eq("user_id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated" });
      setEditMode(false);
      refreshProfile();
    }
  };

  const handlePaymentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !childId || !user) return;
    setUploading(true);
    const file = e.target.files[0];
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, file);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(filePath);
    
    const { error } = await supabase.from("fee_payments").insert({
      student_id: childId,
      amount: parseFloat(paymentAmount) || 0,
      payment_type: paymentType,
      reference: paymentRef,
      proof_of_payment_url: urlData.publicUrl,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Payment submitted for verification" });
      setPaymentRef("");
      setPaymentAmount("");
      fetchChildData();
    }
    setUploading(false);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <Layout>
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-3xl font-bold text-foreground mb-6">
            Parent Portal
          </motion.h1>

          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" /> My Profile</TabsTrigger>
              <TabsTrigger value="marks"><BarChart3 className="h-4 w-4 mr-2" /> Student Marks</TabsTrigger>
              <TabsTrigger value="payments"><CreditCard className="h-4 w-4 mr-2" /> Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Personal Details</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => editMode ? saveProfile() : setEditMode(true)}>
                    {editMode ? <><Save className="h-4 w-4 mr-1" /> Save</> : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries({
                      first_name: "First Name",
                      last_name: "Last Name",
                      phone_number: "Phone Number",
                      physical_address: "Physical Address",
                      next_of_kin_contact: "Next of Kin Contact",
                      backup_email: "Backup Email",
                    }).map(([key, label]) => (
                      <div key={key} className="space-y-2">
                        <Label>{label}</Label>
                        <Input
                          value={profileForm[key as keyof typeof profileForm]}
                          onChange={(e) => setProfileForm({ ...profileForm, [key]: e.target.value })}
                          disabled={!editMode}
                        />
                      </div>
                    ))}
                    {profile && (
                      <>
                        <div className="space-y-2"><Label>Email</Label><Input value={profile.email} disabled /></div>
                        <div className="space-y-2"><Label>ID Number</Label><Input value={profile.identity_number} disabled /></div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marks">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Student Results & Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  {childMarks.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No marks available yet</p>
                  ) : (
                    <div className="space-y-3">
                      {childMarks.map((mark) => (
                        <div key={mark.id} className="p-4 rounded-lg bg-muted/50 border">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{mark.assessment_name}</p>
                              <p className="text-sm text-muted-foreground">{subjects[mark.subject_id] || "Subject"} • Term {mark.term}</p>
                            </div>
                            <Badge variant={mark.percentage && mark.percentage >= 50 ? "default" : "destructive"}>
                              {mark.marks_obtained}/{mark.total_marks} ({mark.percentage?.toFixed(0)}%)
                            </Badge>
                          </div>
                          {mark.feedback && (
                            <p className="text-sm text-muted-foreground mt-2 p-2 bg-background rounded border-l-2 border-primary">
                              <span className="font-medium">Feedback:</span> {mark.feedback}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <div className="space-y-6">
                {/* School Account */}
                {schoolAccount && (
                  <Card>
                    <CardHeader><CardTitle>School Banking Details</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid gap-2 md:grid-cols-2 text-sm">
                        <div><span className="text-muted-foreground">Bank:</span> <span className="font-medium">{schoolAccount.bank_name}</span></div>
                        <div><span className="text-muted-foreground">Account:</span> <span className="font-medium">{schoolAccount.account_number}</span></div>
                        <div><span className="text-muted-foreground">Holder:</span> <span className="font-medium">{schoolAccount.account_holder}</span></div>
                        <div><span className="text-muted-foreground">Branch:</span> <span className="font-medium">{schoolAccount.branch_code}</span></div>
                        {schoolAccount.reference_instructions && (
                          <div className="md:col-span-2"><span className="text-muted-foreground">Reference:</span> <span className="font-medium">{schoolAccount.reference_instructions}</span></div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Upload Payment */}
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Upload Proof of Payment</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2"><Label>Amount (R)</Label><Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="e.g. 500" /></div>
                      <div className="space-y-2">
                        <Label>Payment Type</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                          <option value="school_fees">School Fees</option>
                          <option value="levy">Levy</option>
                          <option value="subscription">Monthly Subscription (R10)</option>
                        </select>
                      </div>
                      <div className="space-y-2"><Label>Reference *</Label><Input value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} placeholder="Payment reference" required /></div>
                      <div className="space-y-2">
                        <Label>Proof of Payment</Label>
                        <Input type="file" accept="image/*,.pdf" onChange={handlePaymentUpload} disabled={uploading || !paymentRef || !paymentAmount} />
                      </div>
                    </div>
                    {(!paymentRef || !paymentAmount) && <p className="text-xs text-muted-foreground mt-2">Please fill in amount and reference before uploading</p>}
                  </CardContent>
                </Card>

                {/* Payment History */}
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Payment History</CardTitle></CardHeader>
                  <CardContent>
                    {payments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No payments yet</p>
                    ) : (
                      <div className="space-y-3">
                        {payments.map((p) => (
                          <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                            <div className="text-sm">
                              <p className="font-medium">R{p.amount} - {p.payment_type}</p>
                              <p className="text-muted-foreground">{p.reference && `Ref: ${p.reference} • `}{new Date(p.payment_date).toLocaleDateString()}</p>
                            </div>
                            <Badge variant={p.status === "verified" ? "default" : p.status === "rejected" ? "destructive" : "secondary"}>{p.status}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
