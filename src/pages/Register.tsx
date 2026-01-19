import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  CheckCircle, 
  AlertCircle,
  FileText,
  User,
  Phone,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  GraduationCap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { FileUpload } from "@/components/auth/FileUpload";
import { learnerRegistrationSchema, staffRegistrationSchema } from "@/lib/validations";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import patternBg from "@/assets/pattern-bg.jpg";

type UserType = 'learner' | 'teacher' | 'grade_head' | 'principal' | 'admin';
type GradeLevel = 'R' | '1' | '2' | '3' | '4' | '5' | '6' | '7';

const gradeOptions: { value: GradeLevel; label: string }[] = [
  { value: 'R', label: 'Grade R' },
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
  { value: '6', label: 'Grade 6' },
  { value: '7', label: 'Grade 7' },
];

const subjectOptions = [
  'Mathematics',
  'English',
  'Life Skills',
  'Natural Sciences',
  'Social Sciences',
  'Technology',
  'Creative Arts',
  'Physical Education',
];

const Register = () => {
  const { toast } = useToast();
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState<UserType>('learner');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    identityNumber: '',
    age: '',
    physicalAddress: '',
    previousGrade: '' as GradeLevel | '',
    applyingForGrade: '' as GradeLevel | '',
    parentGuardianName: '',
    parentGuardianPhone: '',
    parentGuardianEmail: '',
    nextOfKinContact: '',
    backupEmail: '',
    gradesTeaching: [] as GradeLevel[],
    subjectsTeaching: [] as string[],
  });

  // Document URLs
  const [documents, setDocuments] = useState({
    identityDocument: '',
    proofOfAddress: '',
    previousReport: '',
    parentGuardianId: '',
    bankingDetails: '',
    qualificationDocument: '',
  });

  // Check if class is full
  const [classCapacity, setClassCapacity] = useState<{ grade: string; isFull: boolean }[]>([]);

  useEffect(() => {
    const fetchClassCapacity = async () => {
      const { data } = await supabase
        .from('classes')
        .select('grade, max_capacity, current_count');
      
      if (data) {
        const capacityInfo = gradeOptions.map(grade => {
          const classesForGrade = data.filter(c => c.grade === grade.value);
          const totalCapacity = classesForGrade.reduce((sum, c) => sum + (c.max_capacity || 40), 0);
          const currentCount = classesForGrade.reduce((sum, c) => sum + (c.current_count || 0), 0);
          return {
            grade: grade.value,
            isFull: currentCount >= totalCapacity
          };
        });
        setClassCapacity(capacityInfo);
      }
    };
    fetchClassCapacity();
  }, []);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getTotalSteps = () => userType === 'learner' ? 4 : 3;

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!formData.email.includes('@gmail.com')) newErrors.email = 'Must be a Gmail address';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
      if (!formData.identityNumber) newErrors.identityNumber = 'ID number is required';
      else if (formData.identityNumber.length !== 13) newErrors.identityNumber = 'ID must be 13 digits';
      if (!formData.age) newErrors.age = 'Age is required';
      if (!formData.physicalAddress) newErrors.physicalAddress = 'Address is required';
    }

    if (step === 2 && userType === 'learner') {
      if (!formData.applyingForGrade) newErrors.applyingForGrade = 'Please select a grade';
      if (!formData.parentGuardianName) newErrors.parentGuardianName = 'Guardian name is required';
      if (!formData.parentGuardianPhone) newErrors.parentGuardianPhone = 'Guardian phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
    } else {
      toast({
        title: 'Please fix the errors',
        description: 'Some required fields are missing or invalid',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast({
        title: 'Terms & Conditions',
        description: 'Please agree to the terms and conditions',
        variant: 'destructive'
      });
      return;
    }

    // Validate required documents
    if (userType === 'learner') {
      if (!documents.identityDocument || !documents.previousReport || 
          !documents.parentGuardianId || !documents.bankingDetails) {
        toast({
          title: 'Missing Documents',
          description: 'Please upload all required documents',
          variant: 'destructive'
        });
        return;
      }
    } else {
      if (!documents.identityDocument || !documents.proofOfAddress || 
          !documents.qualificationDocument) {
        toast({
          title: 'Missing Documents',
          description: 'Please upload all required documents',
          variant: 'destructive'
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Create auth user
      const { error: signUpError } = await signUp(formData.email, formData.password);
      
      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          toast({
            title: 'Account exists',
            description: 'This email is already registered. Please login instead.',
            variant: 'destructive'
          });
        } else {
          throw signUpError;
        }
        setIsSubmitting(false);
        return;
      }

      // Wait for session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('Failed to create account');
      }

      const userId = session.user.id;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          identity_number: formData.identityNumber,
          age: parseInt(formData.age),
          physical_address: formData.physicalAddress,
          next_of_kin_contact: formData.nextOfKinContact || null,
          backup_email: formData.backupEmail || null,
          identity_document_url: documents.identityDocument,
          proof_of_address_url: documents.proofOfAddress || null,
        });

      if (profileError) throw profileError;

      // Create user role - admin is auto-accepted, others pending
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: userType,
          application_status: userType === 'admin' ? 'accepted' : 'pending'
        });

      if (roleError) throw roleError;

      // Create learner-specific or staff-specific registration
      if (userType === 'learner') {
        const { error: learnerError } = await supabase
          .from('learner_registrations')
          .insert([{
            user_id: userId,
            previous_grade: (formData.previousGrade || null) as Database["public"]["Enums"]["grade_level"] | null,
            applying_for_grade: formData.applyingForGrade as Database["public"]["Enums"]["grade_level"],
            parent_guardian_name: formData.parentGuardianName!,
            parent_guardian_phone: formData.parentGuardianPhone!,
            parent_guardian_email: formData.parentGuardianEmail || null,
            parent_guardian_id_url: documents.parentGuardianId!,
            previous_report_url: documents.previousReport!,
            banking_details_url: documents.bankingDetails!,
          }]);

        if (learnerError) throw learnerError;
      } else {
        const { error: staffError } = await supabase
          .from('staff_registrations')
          .insert({
            user_id: userId,
            qualification_document_url: documents.qualificationDocument,
            grades_teaching: formData.gradesTeaching,
            subjects_teaching: formData.subjectsTeaching,
          });

        if (staffError) throw staffError;
      }

      toast({
        title: 'Registration Successful!',
        description: userType === 'admin' 
          ? 'Your admin account is ready. Redirecting...'
          : 'Your application has been submitted for review.',
      });

      setStep(getTotalSteps() + 1); // Success step

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isGradeFull = (grade: string) => {
    return classCapacity.find(c => c.grade === grade)?.isFull || false;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 gradient-primary relative overflow-hidden">
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
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Online <span className="text-gold">Registration</span>
            </h1>
            <p className="text-primary-foreground/80">
              Create your account and submit your application
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            
            {/* User Type Selection (before starting) */}
            {step === 0 || (step === 1 && !formData.firstName) ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl shadow-soft p-8 mb-8"
              >
                <h2 className="font-display text-xl font-bold text-foreground mb-6 text-center">
                  I am registering as a:
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { type: 'learner' as UserType, icon: GraduationCap, label: 'Learner' },
                    { type: 'teacher' as UserType, icon: User, label: 'Teacher' },
                    { type: 'grade_head' as UserType, icon: User, label: 'Grade Head' },
                    { type: 'principal' as UserType, icon: Briefcase, label: 'Principal' },
                    { type: 'admin' as UserType, icon: Briefcase, label: 'Admin' },
                  ].map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setUserType(type)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        userType === type
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon className={`h-8 w-8 ${userType === type ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`font-medium ${userType === type ? 'text-primary' : 'text-foreground'}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {Array.from({ length: getTotalSteps() }, (_, i) => i + 1).map((num, index) => (
                <div key={num} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                    step >= num 
                      ? "gradient-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {step > num ? <CheckCircle className="h-5 w-5" /> : num}
                  </div>
                  {index < getTotalSteps() - 1 && (
                    <div className={`w-12 sm:w-20 h-1 mx-2 rounded ${
                      step > num ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Success State */}
            {step > getTotalSteps() ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-card rounded-xl shadow-soft"
              >
                <div className="gradient-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  {userType === 'admin' ? 'Admin Account Created!' : 'Application Submitted!'}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {userType === 'admin' 
                    ? 'Your admin account is ready. You can now access the admin dashboard.'
                    : 'Thank you for registering. Our admin team will review your application and you will be notified once a decision is made.'
                  }
                </p>
                <div className="flex gap-4 justify-center">
                  <Link to="/auth">
                    <Button>Go to Login</Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="bg-card rounded-xl shadow-soft p-8">
                  
                  {/* Step 1: Personal Information */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="gradient-primary p-2 rounded-lg">
                          <User className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h2 className="font-display text-xl font-bold text-foreground">
                          Personal Information
                        </h2>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input 
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                            placeholder="Enter first name"
                            className={errors.firstName ? 'border-destructive' : ''}
                          />
                          {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input 
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => updateField('lastName', e.target.value)}
                            placeholder="Enter last name"
                            className={errors.lastName ? 'border-destructive' : ''}
                          />
                          {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address * (Gmail)</Label>
                          <Input 
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            placeholder="example@gmail.com"
                            className={errors.email ? 'border-destructive' : ''}
                          />
                          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">Phone Number * (+27/0)</Label>
                          <Input 
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => updateField('phoneNumber', e.target.value)}
                            placeholder="0XX XXX XXXX"
                            className={errors.phoneNumber ? 'border-destructive' : ''}
                          />
                          {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="identityNumber">Identity Number * (13 digits)</Label>
                          <Input 
                            id="identityNumber"
                            value={formData.identityNumber}
                            onChange={(e) => updateField('identityNumber', e.target.value.replace(/\D/g, '').slice(0, 13))}
                            placeholder="Enter 13-digit ID"
                            maxLength={13}
                            className={errors.identityNumber ? 'border-destructive' : ''}
                          />
                          {errors.identityNumber && <p className="text-xs text-destructive">{errors.identityNumber}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="age">Age *</Label>
                          <Input 
                            id="age"
                            type="number"
                            value={formData.age}
                            onChange={(e) => updateField('age', e.target.value)}
                            placeholder="Enter age"
                            min={userType === 'learner' ? 4 : 21}
                            max={userType === 'learner' ? 15 : 70}
                            className={errors.age ? 'border-destructive' : ''}
                          />
                          {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="password">Password *</Label>
                          <Input 
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => updateField('password', e.target.value)}
                            placeholder="Min 8 characters"
                            className={errors.password ? 'border-destructive' : ''}
                          />
                          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password *</Label>
                          <Input 
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => updateField('confirmPassword', e.target.value)}
                            placeholder="Re-enter password"
                            className={errors.confirmPassword ? 'border-destructive' : ''}
                          />
                          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="physicalAddress">Physical Address *</Label>
                        <Textarea 
                          id="physicalAddress"
                          value={formData.physicalAddress}
                          onChange={(e) => updateField('physicalAddress', e.target.value)}
                          placeholder="Enter full physical address"
                          rows={2}
                          className={errors.physicalAddress ? 'border-destructive' : ''}
                        />
                        {errors.physicalAddress && <p className="text-xs text-destructive">{errors.physicalAddress}</p>}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="nextOfKinContact">Next of Kin Contact</Label>
                          <Input 
                            id="nextOfKinContact"
                            value={formData.nextOfKinContact}
                            onChange={(e) => updateField('nextOfKinContact', e.target.value)}
                            placeholder="0XX XXX XXXX"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="backupEmail">Backup Email</Label>
                          <Input 
                            id="backupEmail"
                            type="email"
                            value={formData.backupEmail}
                            onChange={(e) => updateField('backupEmail', e.target.value)}
                            placeholder="backup@email.com"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 for Learner: Parent/Guardian Information */}
                  {step === 2 && userType === 'learner' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="gradient-primary p-2 rounded-lg">
                          <Phone className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h2 className="font-display text-xl font-bold text-foreground">
                          Parent/Guardian & Grade Information
                        </h2>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="previousGrade">Previous Grade</Label>
                          <Select 
                            value={formData.previousGrade}
                            onValueChange={(value) => updateField('previousGrade', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select previous grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {gradeOptions.map(grade => (
                                <SelectItem key={grade.value} value={grade.value}>
                                  {grade.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="applyingForGrade">Applying for Grade *</Label>
                          <Select 
                            value={formData.applyingForGrade}
                            onValueChange={(value) => updateField('applyingForGrade', value)}
                          >
                            <SelectTrigger className={errors.applyingForGrade ? 'border-destructive' : ''}>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {gradeOptions.map(grade => (
                                <SelectItem 
                                  key={grade.value} 
                                  value={grade.value}
                                  disabled={isGradeFull(grade.value)}
                                >
                                  {grade.label} {isGradeFull(grade.value) && '(Full)'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.applyingForGrade && <p className="text-xs text-destructive">{errors.applyingForGrade}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="parentGuardianName">Parent/Guardian Full Name *</Label>
                          <Input 
                            id="parentGuardianName"
                            value={formData.parentGuardianName}
                            onChange={(e) => updateField('parentGuardianName', e.target.value)}
                            placeholder="Enter full name"
                            className={errors.parentGuardianName ? 'border-destructive' : ''}
                          />
                          {errors.parentGuardianName && <p className="text-xs text-destructive">{errors.parentGuardianName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parentGuardianPhone">Parent/Guardian Phone * (+27/0)</Label>
                          <Input 
                            id="parentGuardianPhone"
                            value={formData.parentGuardianPhone}
                            onChange={(e) => updateField('parentGuardianPhone', e.target.value)}
                            placeholder="0XX XXX XXXX"
                            className={errors.parentGuardianPhone ? 'border-destructive' : ''}
                          />
                          {errors.parentGuardianPhone && <p className="text-xs text-destructive">{errors.parentGuardianPhone}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parentGuardianEmail">Parent/Guardian Email</Label>
                        <Input 
                          id="parentGuardianEmail"
                          type="email"
                          value={formData.parentGuardianEmail}
                          onChange={(e) => updateField('parentGuardianEmail', e.target.value)}
                          placeholder="parent@gmail.com"
                        />
                      </div>

                      {formData.applyingForGrade && isGradeFull(formData.applyingForGrade) && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-800 dark:text-amber-200">Grade is Full</p>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                              The selected grade has reached maximum capacity. Your application will be placed on a waiting list.
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 2 for Staff: Teaching Information */}
                  {step === 2 && userType !== 'learner' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="gradient-primary p-2 rounded-lg">
                          <Briefcase className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h2 className="font-display text-xl font-bold text-foreground">
                          Professional Information
                        </h2>
                      </div>

                      {(userType === 'teacher' || userType === 'grade_head') && (
                        <>
                          <div className="space-y-2">
                            <Label>Grades Teaching</Label>
                            <div className="grid grid-cols-4 gap-2">
                              {gradeOptions.map(grade => (
                                <label 
                                  key={grade.value}
                                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                                    formData.gradesTeaching.includes(grade.value)
                                      ? 'border-primary bg-primary/5'
                                      : 'border-border hover:border-primary/50'
                                  }`}
                                >
                                  <Checkbox 
                                    checked={formData.gradesTeaching.includes(grade.value)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        updateField('gradesTeaching', [...formData.gradesTeaching, grade.value]);
                                      } else {
                                        updateField('gradesTeaching', formData.gradesTeaching.filter(g => g !== grade.value));
                                      }
                                    }}
                                  />
                                  <span className="text-sm">{grade.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Subjects Teaching</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {subjectOptions.map(subject => (
                                <label 
                                  key={subject}
                                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                                    formData.subjectsTeaching.includes(subject)
                                      ? 'border-primary bg-primary/5'
                                      : 'border-border hover:border-primary/50'
                                  }`}
                                >
                                  <Checkbox 
                                    checked={formData.subjectsTeaching.includes(subject)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        updateField('subjectsTeaching', [...formData.subjectsTeaching, subject]);
                                      } else {
                                        updateField('subjectsTeaching', formData.subjectsTeaching.filter(s => s !== subject));
                                      }
                                    }}
                                  />
                                  <span className="text-sm">{subject}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3 for Learner / Step 2+1 for Staff: Documents */}
                  {((step === 3 && userType === 'learner') || (step === 3 && userType !== 'learner')) && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="gradient-primary p-2 rounded-lg">
                          <FileText className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h2 className="font-display text-xl font-bold text-foreground">
                          Required Documents (Certified)
                        </h2>
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 flex items-start gap-3 mb-6">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          All documents must be certified copies. Accepted formats: PDF, JPG, PNG (max 5MB each)
                        </p>
                      </div>

                      <div className="space-y-4">
                        <FileUpload
                          label="Identity Document (Certified)"
                          required
                          bucket="documents"
                          folder={`identity`}
                          onUploadComplete={(url) => setDocuments(prev => ({ ...prev, identityDocument: url }))}
                        />

                        {userType === 'learner' ? (
                          <>
                            <FileUpload
                              label="Previous School Report (Certified)"
                              required
                              bucket="documents"
                              folder={`reports`}
                              onUploadComplete={(url) => setDocuments(prev => ({ ...prev, previousReport: url }))}
                            />
                            <FileUpload
                              label="Parent/Guardian ID (Certified)"
                              required
                              bucket="documents"
                              folder={`parent-id`}
                              onUploadComplete={(url) => setDocuments(prev => ({ ...prev, parentGuardianId: url }))}
                            />
                            <FileUpload
                              label="Banking Details / Proof of Payment"
                              required
                              bucket="documents"
                              folder={`banking`}
                              onUploadComplete={(url) => setDocuments(prev => ({ ...prev, bankingDetails: url }))}
                            />
                          </>
                        ) : (
                          <>
                            <FileUpload
                              label="Proof of Address (Certified)"
                              required
                              bucket="documents"
                              folder={`address`}
                              onUploadComplete={(url) => setDocuments(prev => ({ ...prev, proofOfAddress: url }))}
                            />
                            <FileUpload
                              label="Qualification Documents (Certified)"
                              required
                              bucket="documents"
                              folder={`qualifications`}
                              onUploadComplete={(url) => setDocuments(prev => ({ ...prev, qualificationDocument: url }))}
                            />
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Final Step: Confirmation */}
                  {step === getTotalSteps() && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="gradient-primary p-2 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h2 className="font-display text-xl font-bold text-foreground">
                          Review & Submit
                        </h2>
                      </div>

                      <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Name</p>
                            <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">{formData.email}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Phone</p>
                            <p className="font-medium">{formData.phoneNumber}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Role</p>
                            <p className="font-medium capitalize">{userType.replace('_', ' ')}</p>
                          </div>
                          {userType === 'learner' && (
                            <div>
                              <p className="text-muted-foreground">Applying for</p>
                              <p className="font-medium">Grade {formData.applyingForGrade}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-border pt-6">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <Checkbox 
                            checked={agreedToTerms}
                            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                          />
                          <span className="text-sm text-muted-foreground">
                            I confirm that all information provided is accurate and I agree to the school's 
                            terms and conditions. I understand that providing false information may result 
                            in application rejection.
                          </span>
                        </label>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      disabled={step === 1}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    {step < getTotalSteps() ? (
                      <Button type="button" onClick={handleNext}>
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="gold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            Submitting...
                          </div>
                        ) : (
                          'Submit Application'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            )}

            {/* Already have account? */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/auth" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Register;
