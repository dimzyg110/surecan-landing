import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, UserPlus } from "lucide-react";
import { useLocation } from "wouter";

/**
 * Referral submission form for prescribers and pharmacies
 * Critical feature identified in UX audit - enables the referral system
 */
export default function SubmitReferral() {
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bookingLink, setBookingLink] = useState("");
  const [referralId, setReferralId] = useState("");
  
  const [formData, setFormData] = useState({
    // Patient Information
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientDob: "",
    // Referrer Information
    referrerType: "gp",
    referrerName: "",
    referrerEmail: "",
    referrerPhone: "",
    referrerPracticeName: "",
    // Clinical Information
    clinicalIndication: "",
    currentMedications: "",
    relevantHistory: "",
    urgency: "routine",
  });

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
        setSubmitSuccess(true);
        setBookingLink(data.uniqueBookingLink || "");
        setReferralId(data.referralId || "");
        
        // Send email notification to patient (handled by backend)
        // TODO: Implement email notification
      } else {
        alert(data.message || "Failed to submit referral");
      }
    } catch (error) {
      console.error("Referral submission error:", error);
      alert("An error occurred while submitting the referral");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const copyBookingLink = () => {
    navigator.clipboard.writeText(bookingLink);
    alert("Booking link copied to clipboard!");
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] to-[#0D9488]/5 p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-[#0A2540]">Referral Submitted Successfully!</CardTitle>
            <CardDescription>
              Referral ID: <span className="font-mono font-bold text-[#0D9488]">{referralId}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-[#0D9488]/10 p-6 rounded-lg">
              <h3 className="font-semibold text-[#0A2540] mb-2">Unique Booking Link for Patient</h3>
              <p className="text-sm text-[#0A2540]/70 mb-4">
                Share this link with your patient so they can complete their booking:
              </p>
              <div className="flex gap-2">
                <Input
                  value={bookingLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={copyBookingLink} className="bg-[#0D9488] hover:bg-[#0D9488]/90">
                  Copy
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-[#0A2540]">What Happens Next?</h3>
              <ul className="space-y-2 text-sm text-[#0A2540]/70">
                <li className="flex items-start gap-2">
                  <span className="text-[#0D9488] mt-1">1.</span>
                  <span>The patient will receive an email with the booking link</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0D9488] mt-1">2.</span>
                  <span>They can book their consultation at their convenience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0D9488] mt-1">3.</span>
                  <span>You'll receive a confirmation once the booking is completed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0D9488] mt-1">4.</span>
                  <span>After the consultation, we'll send you a summary report</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setSubmitSuccess(false);
                  setFormData({
                    patientName: "",
                    patientEmail: "",
                    patientPhone: "",
                    patientDob: "",
                    referrerType: "gp",
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
                className="flex-1 bg-[#0D9488] hover:bg-[#0D9488]/90"
              >
                Submit Another Referral
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#0D9488]/5 py-12 px-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#0A2540] mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            Submit Patient Referral
          </h1>
          <p className="text-[#0A2540]/70 max-w-2xl mx-auto">
            Refer your patient to Surecan for specialist ECS consultation. We'll stabilise and return them to your care.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Referral Information</CardTitle>
            <CardDescription>Complete the form below to refer a patient</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Patient Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#0A2540]">Patient Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Full Name *</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => handleChange("patientName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientEmail">Patient Email</Label>
                    <Input
                      id="patientEmail"
                      type="email"
                      value={formData.patientEmail}
                      onChange={(e) => handleChange("patientEmail", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientPhone">Patient Phone</Label>
                    <Input
                      id="patientPhone"
                      type="tel"
                      value={formData.patientPhone}
                      onChange={(e) => handleChange("patientPhone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientDob">Patient Date of Birth</Label>
                    <Input
                      id="patientDob"
                      type="date"
                      value={formData.patientDob}
                      onChange={(e) => handleChange("patientDob", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Referrer Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#0A2540]">Your Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="referrerType">Your Role *</Label>
                  <Select value={formData.referrerType} onValueChange={(value) => handleChange("referrerType", value)} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gp">General Practitioner</SelectItem>
                      <SelectItem value="pharmacist">Pharmacist</SelectItem>
                      <SelectItem value="allied_health">Allied Health Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referrerName">Your Name *</Label>
                    <Input
                      id="referrerName"
                      value={formData.referrerName}
                      onChange={(e) => handleChange("referrerName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referrerEmail">Your Email *</Label>
                    <Input
                      id="referrerEmail"
                      type="email"
                      value={formData.referrerEmail}
                      onChange={(e) => handleChange("referrerEmail", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referrerPhone">Your Phone</Label>
                    <Input
                      id="referrerPhone"
                      type="tel"
                      value={formData.referrerPhone}
                      onChange={(e) => handleChange("referrerPhone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referrerPracticeName">Practice Name</Label>
                    <Input
                      id="referrerPracticeName"
                      value={formData.referrerPracticeName}
                      onChange={(e) => handleChange("referrerPracticeName", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#0A2540]">Clinical Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="clinicalIndication">Clinical Indication *</Label>
                  <Textarea
                    id="clinicalIndication"
                    value={formData.clinicalIndication}
                    onChange={(e) => handleChange("clinicalIndication", e.target.value)}
                    rows={4}
                    required
                    placeholder="Please describe the patient's condition and reason for referral (minimum 10 characters)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentMedications">Current Medications</Label>
                  <Textarea
                    id="currentMedications"
                    value={formData.currentMedications}
                    onChange={(e) => handleChange("currentMedications", e.target.value)}
                    rows={3}
                    placeholder="List current medications and dosages"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relevantHistory">Relevant Medical History</Label>
                  <Textarea
                    id="relevantHistory"
                    value={formData.relevantHistory}
                    onChange={(e) => handleChange("relevantHistory", e.target.value)}
                    rows={3}
                    placeholder="Any relevant medical history"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency *</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleChange("urgency", value)} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Referral"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
