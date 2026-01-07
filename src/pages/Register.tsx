import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { 
  Upload, 
  CheckCircle, 
  AlertCircle,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import patternBg from "@/assets/pattern-bg.jpg";

const Register = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you within 5-7 business days.",
    });
    
    setIsSubmitting(false);
    setStep(4); // Success step
  };

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
              Online <span className="text-gold">Registration</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              Apply for enrollment in just a few minutes. Fill out the form below and upload required documents.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-12">
              {[
                { num: 1, label: "Student Info" },
                { num: 2, label: "Parent Info" },
                { num: 3, label: "Documents" },
              ].map((item, index) => (
                <div key={item.num} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                    step >= item.num 
                      ? "gradient-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {step > item.num ? <CheckCircle className="h-5 w-5" /> : item.num}
                  </div>
                  <span className={`ml-2 text-sm font-medium hidden sm:block ${
                    step >= item.num ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {item.label}
                  </span>
                  {index < 2 && (
                    <div className={`w-12 sm:w-24 h-1 mx-3 rounded ${
                      step > item.num ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Success State */}
            {step === 4 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="gradient-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Application Submitted Successfully!
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Thank you for applying to Esiphukwini Junior Primary School. Our admin team will review 
                  your application and contact you within 5-7 business days.
                </p>
                <div className="bg-secondary/50 rounded-xl p-6 max-w-md mx-auto">
                  <p className="text-sm text-muted-foreground mb-2">Application Reference Number:</p>
                  <p className="font-mono text-lg font-bold text-primary">ESIP-2025-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="bg-card rounded-xl shadow-soft p-8">
                  {/* Step 1: Student Information */}
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
                          Student Information
                        </h2>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input id="firstName" placeholder="Enter first name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input id="lastName" placeholder="Enter last name" required />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth *</Label>
                          <Input id="dob" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="grade">Grade Applying For *</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grade-r">Grade R</SelectItem>
                              <SelectItem value="grade-1">Grade 1</SelectItem>
                              <SelectItem value="grade-2">Grade 2</SelectItem>
                              <SelectItem value="grade-3">Grade 3 (Waitlist)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="previousSchool">Previous School (if applicable)</Label>
                        <Input id="previousSchool" placeholder="Enter previous school name" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="medicalInfo">Medical Conditions / Allergies</Label>
                        <Textarea 
                          id="medicalInfo" 
                          placeholder="Please list any medical conditions or allergies we should be aware of"
                          rows={3}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Parent Information */}
                  {step === 2 && (
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
                          Parent/Guardian Information
                        </h2>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="parentName">Full Name *</Label>
                          <Input id="parentName" placeholder="Enter full name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="relationship">Relationship *</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mother">Mother</SelectItem>
                              <SelectItem value="father">Father</SelectItem>
                              <SelectItem value="guardian">Legal Guardian</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input id="email" type="email" placeholder="email@example.com" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input id="phone" type="tel" placeholder="+27 XX XXX XXXX" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Physical Address *</Label>
                        <Textarea 
                          id="address" 
                          placeholder="Enter full physical address"
                          rows={2}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact (if different)</Label>
                        <Input id="emergencyContact" placeholder="Name and phone number" />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Documents */}
                  {step === 3 && (
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
                          Required Documents
                        </h2>
                      </div>

                      <div className="bg-secondary/50 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          Please upload clear copies of all required documents. Accepted formats: PDF, JPG, PNG (max 5MB each)
                        </p>
                      </div>

                      {[
                        { name: "Birth Certificate", required: true },
                        { name: "Immunization Records", required: true },
                        { name: "Parent ID Document", required: true },
                        { name: "Previous School Report (if applicable)", required: false },
                        { name: "Proof of Address", required: true },
                      ].map((doc, index) => (
                        <div key={index} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">
                                {doc.name} {doc.required && <span className="text-destructive">*</span>}
                              </p>
                              <p className="text-sm text-muted-foreground">PDF, JPG or PNG, max 5MB</p>
                            </div>
                            <label className="cursor-pointer">
                              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                              <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                                <Upload className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-foreground">Upload</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}

                      <div className="border-t border-border pt-6">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" required className="mt-1" />
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
                      Previous
                    </Button>

                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={() => setStep(step + 1)}
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="gold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Register;
