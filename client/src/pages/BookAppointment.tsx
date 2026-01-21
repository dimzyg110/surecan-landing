import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useLocation } from "wouter";

/**
 * Internal booking page - replaces external HotDoc redirect
 * Supports both direct bookings and referral-based bookings
 */
export default function BookAppointment() {
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [referralInfo, setReferralInfo] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientDob: "",
    appointmentType: "initial",
    preferredDate: "",
    preferredTime: "",
    medicalHistory: "",
    currentMedications: "",
    reasonForConsultation: "",
  });

  // Check if this is a referral-based booking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refId = params.get("ref");
    const token = params.get("token");
    
    if (refId && token) {
      // Fetch referral information
      fetch(`/api/referrals/by-id/${refId}?token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.referral) {
            setReferralInfo(data.referral);
            // Pre-fill form with referral data
            setFormData(prev => ({
              ...prev,
              patientName: data.referral.patientName || "",
              patientEmail: data.referral.patientEmail || "",
              patientPhone: data.referral.patientPhone || "",
              patientDob: data.referral.patientDob || "",
              reasonForConsultation: data.referral.clinicalIndication || "",
              currentMedications: data.referral.currentMedications || "",
            }));
          }
        })
        .catch(err => console.error("Error fetching referral:", err));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          referralId: referralInfo?.referralId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        // Redirect to confirmation page after 2 seconds
        setTimeout(() => {
          navigate("/booking-confirmation");
        }, 2000);
      } else {
        alert(data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred while booking your appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] to-[#0D9488]/5 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-[#0A2540]">Booking Submitted!</CardTitle>
            <CardDescription>
              We've received your appointment request. Our team will contact you shortly to confirm your booking.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#0D9488]/5 py-12 px-4">
      <div className="container max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#0A2540] mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            Book Your Consultation
          </h1>
          {referralInfo && (
            <p className="text-lg text-[#0D9488]">
              Referred by {referralInfo.referrerName} ({referralInfo.referrerPracticeName})
            </p>
          )}
          <p className="text-[#0A2540]/70 mt-2">
            Complete the form below and our team will contact you to confirm your appointment
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Please provide your details for the consultation</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Full Name *</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => handleChange("patientName", e.target.value)}
                    required
                    disabled={!!referralInfo}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientEmail">Email *</Label>
                  <Input
                    id="patientEmail"
                    type="email"
                    value={formData.patientEmail}
                    onChange={(e) => handleChange("patientEmail", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientPhone">Phone Number *</Label>
                  <Input
                    id="patientPhone"
                    type="tel"
                    value={formData.patientPhone}
                    onChange={(e) => handleChange("patientPhone", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientDob">Date of Birth *</Label>
                  <Input
                    id="patientDob"
                    type="date"
                    value={formData.patientDob}
                    onChange={(e) => handleChange("patientDob", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-2">
                <Label htmlFor="appointmentType">Appointment Type *</Label>
                <Select value={formData.appointmentType} onValueChange={(value) => handleChange("appointmentType", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initial">Initial Consultation</SelectItem>
                    <SelectItem value="follow_up">Follow-up Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleChange("preferredDate", e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time *</Label>
                  <Select value={formData.preferredTime} onValueChange={(value) => handleChange("preferredTime", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-2">
                <Label htmlFor="reasonForConsultation">Reason for Consultation *</Label>
                <Textarea
                  id="reasonForConsultation"
                  value={formData.reasonForConsultation}
                  onChange={(e) => handleChange("reasonForConsultation", e.target.value)}
                  rows={3}
                  required
                  placeholder="Please describe your medical condition and why you're seeking consultation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Textarea
                  id="currentMedications"
                  value={formData.currentMedications}
                  onChange={(e) => handleChange("currentMedications", e.target.value)}
                  rows={2}
                  placeholder="List any medications you're currently taking"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Relevant Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => handleChange("medicalHistory", e.target.value)}
                  rows={3}
                  placeholder="Any relevant medical history we should know about"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Book Appointment"}
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
