import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout, financeNavItems } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Building2,
  FileText,
} from "lucide-react";

interface Payment {
  id: string;
  student_id: string;
  amount: number;
  payment_type: string;
  status: string;
  reference: string | null;
  proof_of_payment_url: string | null;
  payment_date: string;
  notes: string | null;
  created_at: string;
}

interface SchoolAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  branch_code: string;
  reference_instructions: string | null;
}

interface StudentProfile {
  user_id: string;
  first_name: string;
  last_name: string;
}

export default function FinanceDashboard() {
  const { user, isAccepted, primaryRole, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [schoolAccount, setSchoolAccount] = useState<SchoolAccount | null>(null);
  const [studentProfiles, setStudentProfiles] = useState<Record<string, StudentProfile>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [editingAccount, setEditingAccount] = useState(false);
  const [accountForm, setAccountForm] = useState({
    bank_name: "",
    account_number: "",
    account_holder: "",
    branch_code: "",
    reference_instructions: "",
  });

  useEffect(() => {
    if (!isLoading) {
      if (!user) navigate("/auth");
      else if (!isAccepted || primaryRole !== "finance") navigate("/pending");
    }
  }, [user, isAccepted, primaryRole, isLoading, navigate]);

  useEffect(() => {
    if (user && isAccepted) fetchData();
  }, [user, isAccepted]);

  const fetchData = async () => {
    try {
      const [paymentsRes, accountRes] = await Promise.all([
        supabase.from("fee_payments").select("*").order("created_at", { ascending: false }),
        supabase.from("school_account_info").select("*").limit(1).maybeSingle(),
      ]);

      if (paymentsRes.data) {
        setPayments(paymentsRes.data);
        // Fetch student profiles
        const studentIds = [...new Set(paymentsRes.data.map((p) => p.student_id))];
        if (studentIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, first_name, last_name")
            .in("user_id", studentIds);
          const map: Record<string, StudentProfile> = {};
          profiles?.forEach((p) => (map[p.user_id] = p));
          setStudentProfiles(map);
        }
      }

      if (accountRes.data) {
        setSchoolAccount(accountRes.data);
        setAccountForm({
          bank_name: accountRes.data.bank_name,
          account_number: accountRes.data.account_number,
          account_holder: accountRes.data.account_holder,
          branch_code: accountRes.data.branch_code,
          reference_instructions: accountRes.data.reference_instructions || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: string) => {
    const { error } = await supabase
      .from("fee_payments")
      .update({ status, verified_by: user!.id })
      .eq("id", paymentId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Payment " + status });
      fetchData();
    }
  };

  const saveAccountInfo = async () => {
    const payload = { ...accountForm, updated_by: user!.id };
    let error;
    if (schoolAccount) {
      ({ error } = await supabase.from("school_account_info").update(payload).eq("id", schoolAccount.id));
    } else {
      ({ error } = await supabase.from("school_account_info").insert(payload));
    }
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account info saved" });
      setEditingAccount(false);
      fetchData();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pendingPayments = payments.filter((p) => p.status === "pending");
  const verifiedPayments = payments.filter((p) => p.status === "verified");

  return (
    <DashboardLayout title="Finance Dashboard" navItems={financeNavItems}>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                Welcome, {profile?.first_name}! 💰
              </h2>
              <p className="text-muted-foreground">
                Manage school fee payments, verify proof of payments, and maintain banking details.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Pending Payments", value: pendingPayments.length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
            { title: "Verified Payments", value: verifiedPayments.length, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { title: "Total Payments", value: payments.length, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
          ].map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${s.bg}`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{loadingData ? <div className="h-8 w-16 bg-muted animate-pulse rounded" /> : s.value}</div></CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* School Account Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> School Banking Details</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setEditingAccount(!editingAccount)}>
              {editingAccount ? "Cancel" : schoolAccount ? "Edit" : "Add"}
            </Button>
          </CardHeader>
          <CardContent>
            {editingAccount ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Bank Name</Label><Input value={accountForm.bank_name} onChange={(e) => setAccountForm({ ...accountForm, bank_name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Account Number</Label><Input value={accountForm.account_number} onChange={(e) => setAccountForm({ ...accountForm, account_number: e.target.value })} /></div>
                <div className="space-y-2"><Label>Account Holder</Label><Input value={accountForm.account_holder} onChange={(e) => setAccountForm({ ...accountForm, account_holder: e.target.value })} /></div>
                <div className="space-y-2"><Label>Branch Code</Label><Input value={accountForm.branch_code} onChange={(e) => setAccountForm({ ...accountForm, branch_code: e.target.value })} /></div>
                <div className="space-y-2 md:col-span-2"><Label>Reference Instructions</Label><Textarea value={accountForm.reference_instructions} onChange={(e) => setAccountForm({ ...accountForm, reference_instructions: e.target.value })} /></div>
                <Button onClick={saveAccountInfo}>Save</Button>
              </div>
            ) : schoolAccount ? (
              <div className="grid gap-2 md:grid-cols-2 text-sm">
                <div><span className="text-muted-foreground">Bank:</span> <span className="font-medium">{schoolAccount.bank_name}</span></div>
                <div><span className="text-muted-foreground">Account:</span> <span className="font-medium">{schoolAccount.account_number}</span></div>
                <div><span className="text-muted-foreground">Holder:</span> <span className="font-medium">{schoolAccount.account_holder}</span></div>
                <div><span className="text-muted-foreground">Branch:</span> <span className="font-medium">{schoolAccount.branch_code}</span></div>
                {schoolAccount.reference_instructions && <div className="md:col-span-2"><span className="text-muted-foreground">Reference:</span> <span className="font-medium">{schoolAccount.reference_instructions}</span></div>}
              </div>
            ) : (
              <p className="text-muted-foreground">No banking details set. Click "Add" to configure.</p>
            )}
          </CardContent>
        </Card>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Fee Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted animate-pulse rounded" />)}</div>
            ) : payments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No payments found</p>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => {
                  const student = studentProfiles[payment.student_id];
                  return (
                    <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          {student ? `${student.first_name} ${student.last_name}` : "Unknown Student"}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>R{payment.amount}</span>
                          <Badge variant="outline">{payment.payment_type}</Badge>
                          {payment.reference && <span>Ref: {payment.reference}</span>}
                          <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={payment.status === "verified" ? "default" : payment.status === "rejected" ? "destructive" : "secondary"}>
                          {payment.status}
                        </Badge>
                        {payment.proof_of_payment_url && (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={payment.proof_of_payment_url} target="_blank" rel="noopener noreferrer"><Eye className="h-4 w-4" /></a>
                          </Button>
                        )}
                        {payment.status === "pending" && (
                          <>
                            <Button size="sm" variant="default" onClick={() => updatePaymentStatus(payment.id, "verified")}>
                              <CheckCircle className="h-4 w-4 mr-1" /> Verify
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => updatePaymentStatus(payment.id, "rejected")}>
                              <XCircle className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
