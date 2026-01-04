import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Info, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ReferralForm() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientDob: "",
    referrerType: "",
    referrerName: "",
    referrerEmail: "",
    referrerPhone: "",
    referrerPracticeName: "",
    clinicalIndication: "",
    currentMedications: "",
    relevantHistory: "",
    urgency: "routine",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        toast.success("Referral submitted successfully!");
      } else {
        toast.error(data.message || "Failed to submit referral");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white/95 backdrop-blur">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-teal-600" />
            </div>
            <CardTitle className="text-2xl">Referral Submitted</CardTitle>
            <CardDescription>
              Thank you for your referral. Our team will review it and contact you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  patientName: "",
                  patientEmail: "",
                  patientPhone: "",
                  patientDob: "",
                  referrerType: "",
                  referrerName: "",
                  referrerEmail: "",
                  referrerPhone: "",
                  referrerPracticeName: "",
                  clinicalIndication: "",
                  currentMedications: "",
                  relevantHistory: "",
                  urgency: "routine",
                });
              }}
              variant="outline"
              className="w-full"
            >
              Submit Another Referral
            </Button>
            <Button
              onClick={() => setLocation("/")}
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900">
      {/* Header */}
      <header className="bg-navy-950/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-display font-bold text-white">
            Surecan Referral
          </h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Education Section */}
        <Card className="mb-6 bg-teal-50/95 backdrop-blur border-teal-200">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <CardTitle className="text-lg text-teal-900">The Shared Care Bridge Model</CardTitle>
                <CardDescription className="text-teal-700">
                  Your Patient. Your Practice. Our Specialist Support.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="boomerang" className="border-teal-200">
                <AccordionTrigger className="text-teal-900 hover:text-teal-700">
                  The Boomerang Protocol
                </AccordionTrigger>
                <AccordionContent className="text-teal-800">
                  <p className="mb-2">
                    Patients return to your care after stabilization (typically 3 months):
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Initial assessment and titration by Surecan specialists</li>
                    <li>Nurse-led monitoring and education</li>
                    <li>Handover with full treatment plan and ongoing support</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="safety" className="border-teal-200">
                <AccordionTrigger className="text-teal-900 hover:text-teal-700">
                  Safety Framework
                </AccordionTrigger>
                <AccordionContent className="text-teal-800">
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Authorised Prescriber status (TGA Category A)</li>
                    <li>Nurse-led model with 3:1 support ratio</li>
                    <li>Real-time compliance monitoring via Cubiko/Halo Connect</li>
                    <li>Transparent data sharing with referring practitioners</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="revenue" className="border-teal-200">
                <AccordionTrigger className="text-teal-900 hover:text-teal-700">
                  Revenue Opportunity
                </AccordionTrigger>
                <AccordionContent className="text-teal-800">
                  <p className="mb-2 text-sm">
                    Medicare Items 967 (initial) and 10997 (follow-up) enable sustainable shared care:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>4-hour clinical session = $2,739 revenue</li>
                    <li>52% higher than standard GP consultations</li>
                    <li>Nurse-led prep reduces doctor time to 20 minutes per patient</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Referral Form */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-display">Submit Referral</CardTitle>
            <CardDescription>
              Complete this form to refer a patient to Surecan Clinic for medicinal cannabis assessment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-navy-900 border-b border-gray-200 pb-2">
                  Patient Information
                </h3>
                
                <div>
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => handleChange("patientName", e.target.value)}
                    required
                    placeholder="Full name"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientEmail">Patient Email</Label>
                    <Input
                      id="patientEmail"
                      type="email"
                      value={formData.patientEmail}
                      onChange={(e) => handleChange("patientEmail", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="patientPhone">Patient Phone</Label>
                    <Input
                      id="patientPhone"
                      type="tel"
                      value={formData.patientPhone}
                      onChange={(e) => handleChange("patientPhone", e.target.value)}
                      placeholder="04XX XXX XXX"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="patientDob">Date of Birth</Label>
                  <Input
                    id="patientDob"
                    type="date"
                    value={formData.patientDob}
                    onChange={(e) => handleChange("patientDob", e.target.value)}
                  />
                </div>
              </div>

              {/* Referrer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-navy-900 border-b border-gray-200 pb-2">
                  Referrer Information
                </h3>
                
                <div>
                  <Label htmlFor="referrerType">Your Role *</Label>
                  <Select
                    value={formData.referrerType}
                    onValueChange={(value) => handleChange("referrerType", value)}
                    required
                  >
                    <SelectTrigger id="referrerType">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gp">General Practitioner</SelectItem>
                      <SelectItem value="pharmacist">Pharmacist</SelectItem>
                      <SelectItem value="allied_health">Allied Health Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="referrerName">Your Name *</Label>
                  <Input
                    id="referrerName"
                    value={formData.referrerName}
                    onChange={(e) => handleChange("referrerName", e.target.value)}
                    required
                    placeholder="Full name"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="referrerEmail">Your Email *</Label>
                    <Input
                      id="referrerEmail"
                      type="email"
                      value={formData.referrerEmail}
                      onChange={(e) => handleChange("referrerEmail", e.target.value)}
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="referrerPhone">Your Phone</Label>
                    <Input
                      id="referrerPhone"
                      type="tel"
                      value={formData.referrerPhone}
                      onChange={(e) => handleChange("referrerPhone", e.target.value)}
                      placeholder="04XX XXX XXX"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="referrerPracticeName">Practice Name</Label>
                  <Input
                    id="referrerPracticeName"
                    value={formData.referrerPracticeName}
                    onChange={(e) => handleChange("referrerPracticeName", e.target.value)}
                    placeholder="Your practice or clinic name"
                  />
                </div>
              </div>

              {/* Clinical Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-navy-900 border-b border-gray-200 pb-2">
                  Clinical Information
                </h3>
                
                <div>
                  <Label htmlFor="clinicalIndication">Clinical Indication *</Label>
                  <Textarea
                    id="clinicalIndication"
                    value={formData.clinicalIndication}
                    onChange={(e) => handleChange("clinicalIndication", e.target.value)}
                    required
                    placeholder="Primary condition and relevant history (minimum 10 characters)"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Common indications: Chronic pain, anxiety, insomnia, PTSD, neuropathy
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="currentMedications">Current Medications</Label>
                  <Textarea
                    id="currentMedications"
                    value={formData.currentMedications}
                    onChange={(e) => handleChange("currentMedications", e.target.value)}
                    placeholder="List current medications and dosages"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="relevantHistory">Relevant Medical History</Label>
                  <Textarea
                    id="relevantHistory"
                    value={formData.relevantHistory}
                    onChange={(e) => handleChange("relevantHistory", e.target.value)}
                    placeholder="Previous treatments, allergies, comorbidities"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) => handleChange("urgency", value)}
                  >
                    <SelectTrigger id="urgency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine (7-14 days)</SelectItem>
                      <SelectItem value="urgent">Urgent (2-3 days)</SelectItem>
                      <SelectItem value="emergency">Emergency (24 hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Referral"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
