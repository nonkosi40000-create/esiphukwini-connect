import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout, adminNavItems } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Check,
  X,
  Eye,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface ApplicationWithDetails {
  id: string;
  user_id: string;
  role: AppRole;
  application_status: "pending" | "accepted" | "rejected";
  created_at: string;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    identity_number: string;
    age: number;
    physical_address: string;
    identity_document_url?: string;
    proof_of_address_url?: string;
  };
  learner_registration?: {
    applying_for_grade: string;
    previous_grade?: string;
    parent_guardian_name: string;
    parent_guardian_phone: string;
    parent_guardian_email?: string;
    parent_guardian_id_url: string;
    previous_report_url: string;
    banking_details_url: string;
    student_number?: string;
  };
  staff_registration?: {
    grades_teaching?: string[];
    subjects_teaching?: string[];
    qualification_document_url: string;
    staff_number?: string;
  };
}

export default function AdminApplications() {
  const { user, isAccepted, primaryRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithDetails | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAccepted || primaryRole !== "admin") {
        navigate("/pending");
      }
    }
  }, [user, isAccepted, primaryRole, isLoading, navigate]);

  const fetchApplications = async () => {
    try {
      setLoadingApplications(true);

      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .order("created_at", { ascending: false });

      if (rolesError) throw rolesError;

      // Fetch profiles
      const { data: profilesData } = await supabase.from("profiles").select("*");

      // Fetch learner registrations
      const { data: learnerRegsData } = await supabase.from("learner_registrations").select("*");

      // Fetch staff registrations
      const { data: staffRegsData } = await supabase.from("staff_registrations").select("*");

      // Combine data
      const combinedApplications: ApplicationWithDetails[] = (rolesData || []).map((role) => {
        const profile = profilesData?.find((p) => p.user_id === role.user_id);
        const learnerReg = learnerRegsData?.find((l) => l.user_id === role.user_id);
        const staffReg = staffRegsData?.find((s) => s.user_id === role.user_id);

        return {
          id: role.id,
          user_id: role.user_id,
          role: role.role,
          application_status: role.application_status,
          created_at: role.created_at,
          profile: profile
            ? {
                first_name: profile.first_name,
                last_name: profile.last_name,
                email: profile.email,
                phone_number: profile.phone_number,
                identity_number: profile.identity_number,
                age: profile.age,
                physical_address: profile.physical_address,
                identity_document_url: profile.identity_document_url ?? undefined,
                proof_of_address_url: profile.proof_of_address_url ?? undefined,
              }
            : undefined,
          learner_registration: learnerReg
            ? {
                applying_for_grade: learnerReg.applying_for_grade,
                previous_grade: learnerReg.previous_grade ?? undefined,
                parent_guardian_name: learnerReg.parent_guardian_name,
                parent_guardian_phone: learnerReg.parent_guardian_phone,
                parent_guardian_email: learnerReg.parent_guardian_email ?? undefined,
                parent_guardian_id_url: learnerReg.parent_guardian_id_url,
                previous_report_url: learnerReg.previous_report_url,
                banking_details_url: learnerReg.banking_details_url,
                student_number: learnerReg.student_number ?? undefined,
              }
            : undefined,
          staff_registration: staffReg
            ? {
                grades_teaching: staffReg.grades_teaching ?? undefined,
                subjects_teaching: staffReg.subjects_teaching ?? undefined,
                qualification_document_url: staffReg.qualification_document_url,
                staff_number: staffReg.staff_number ?? undefined,
              }
            : undefined,
        };
      });

      setApplications(combinedApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    if (user && isAccepted) {
      fetchApplications();
    }
  }, [user, isAccepted]);

  const handleApplicationAction = async (
    applicationId: string,
    userId: string,
    action: "accepted" | "rejected"
  ) => {
    setProcessingId(applicationId);
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ application_status: action })
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: action === "accepted" ? "Application Accepted" : "Application Rejected",
        description: `The user has been ${action}.`,
      });

      // Refresh applications
      fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      console.error("Error updating application:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (activeTab === "all") return true;
    return app.application_status === activeTab;
  });

  const getRoleBadgeColor = (role: AppRole) => {
    switch (role) {
      case "learner":
        return "bg-blue-500/10 text-blue-500";
      case "teacher":
        return "bg-emerald-500/10 text-emerald-500";
      case "grade_head":
        return "bg-purple-500/10 text-purple-500";
      case "principal":
        return "bg-amber-500/10 text-amber-500";
      case "admin":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Accepted</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout title="Applications" navItems={adminNavItems}>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({applications.filter((a) => a.application_status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({applications.filter((a) => a.application_status === "accepted").length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({applications.filter((a) => a.application_status === "rejected").length})
            </TabsTrigger>
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{activeTab} Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingApplications ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : filteredApplications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No {activeTab} applications found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApplications.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">
                              {app.profile?.first_name} {app.profile?.last_name}
                            </TableCell>
                            <TableCell>
                              <Badge className={getRoleBadgeColor(app.role)}>
                                {app.role.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>{app.profile?.email}</TableCell>
                            <TableCell>
                              {new Date(app.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{getStatusBadge(app.application_status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedApplication(app)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {app.application_status === "pending" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                                      onClick={() =>
                                        handleApplicationAction(app.id, app.user_id, "accepted")
                                      }
                                      disabled={processingId === app.id}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() =>
                                        handleApplicationAction(app.id, app.user_id, "rejected")
                                      }
                                      disabled={processingId === app.id}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Application Detail Dialog */}
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review the complete application information
              </DialogDescription>
            </DialogHeader>

            {selectedApplication && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Full Name:</span>
                      <p className="font-medium">
                        {selectedApplication.profile?.first_name}{" "}
                        {selectedApplication.profile?.last_name}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Age:</span>
                      <p className="font-medium">{selectedApplication.profile?.age} years</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ID Number:</span>
                      <p className="font-medium">{selectedApplication.profile?.identity_number}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Role Applied:</span>
                      <Badge className={getRoleBadgeColor(selectedApplication.role)}>
                        {selectedApplication.role.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedApplication.profile?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedApplication.profile?.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedApplication.profile?.physical_address}</span>
                    </div>
                  </div>
                </div>

                {/* Role-Specific Information */}
                {selectedApplication.role === "learner" && selectedApplication.learner_registration && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" /> Learner Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Applying for Grade:</span>
                        <p className="font-medium">
                          Grade {selectedApplication.learner_registration.applying_for_grade}
                        </p>
                      </div>
                      {selectedApplication.learner_registration.previous_grade && (
                        <div>
                          <span className="text-muted-foreground">Previous Grade:</span>
                          <p className="font-medium">
                            Grade {selectedApplication.learner_registration.previous_grade}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Guardian Name:</span>
                        <p className="font-medium">
                          {selectedApplication.learner_registration.parent_guardian_name}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Guardian Phone:</span>
                        <p className="font-medium">
                          {selectedApplication.learner_registration.parent_guardian_phone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedApplication.staff_registration && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Briefcase className="h-4 w-4" /> Staff Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      {selectedApplication.staff_registration.grades_teaching?.length ? (
                        <div>
                          <span className="text-muted-foreground">Grades Teaching:</span>
                          <p className="font-medium">
                            {selectedApplication.staff_registration.grades_teaching.join(", ")}
                          </p>
                        </div>
                      ) : null}
                      {selectedApplication.staff_registration.subjects_teaching?.length ? (
                        <div>
                          <span className="text-muted-foreground">Subjects:</span>
                          <p className="font-medium">
                            {selectedApplication.staff_registration.subjects_teaching.join(", ")}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Documents
                  </h3>
                  <div className="grid gap-2">
                    {selectedApplication.profile?.identity_document_url && (
                      <a
                        href={selectedApplication.profile.identity_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Identity Document
                      </a>
                    )}
                    {selectedApplication.profile?.proof_of_address_url && (
                      <a
                        href={selectedApplication.profile.proof_of_address_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Proof of Address
                      </a>
                    )}
                    {selectedApplication.learner_registration?.parent_guardian_id_url && (
                      <a
                        href={selectedApplication.learner_registration.parent_guardian_id_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Guardian ID Document
                      </a>
                    )}
                    {selectedApplication.learner_registration?.previous_report_url && (
                      <a
                        href={selectedApplication.learner_registration.previous_report_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Previous School Report
                      </a>
                    )}
                    {selectedApplication.learner_registration?.banking_details_url && (
                      <a
                        href={selectedApplication.learner_registration.banking_details_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Banking Details
                      </a>
                    )}
                    {selectedApplication.staff_registration?.qualification_document_url && (
                      <a
                        href={selectedApplication.staff_registration.qualification_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Qualification Document
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              {selectedApplication?.application_status === "pending" && (
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                    onClick={() =>
                      handleApplicationAction(
                        selectedApplication.id,
                        selectedApplication.user_id,
                        "rejected"
                      )
                    }
                    disabled={processingId === selectedApplication.id}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    onClick={() =>
                      handleApplicationAction(
                        selectedApplication.id,
                        selectedApplication.user_id,
                        "accepted"
                      )
                    }
                    disabled={processingId === selectedApplication.id}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
