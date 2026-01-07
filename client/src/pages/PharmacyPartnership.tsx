import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, Package, Phone, Mail, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function PharmacyPartnership() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    pharmacyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/pharmacy-partnership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Partnership request submitted! We'll contact you within 24 hours.");
        setFormData({
          pharmacyName: "",
          contactName: "",
          email: "",
          phone: "",
          address: ""
        });
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-[#0A2540]/10">
        <div className="container flex items-center justify-between h-16 lg:h-20">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-[#0A2540] hover:text-[#0D9488] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#0D9488] flex items-center justify-center">
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'Space Grotesk' }}>S</span>
            </div>
            <span className="text-xl font-bold text-[#0A2540]" style={{ fontFamily: 'Space Grotesk' }}>
              Surecan
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#F8FAFC] to-[#0D9488]/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#0A2540] mb-6" style={{ fontFamily: 'Space Grotesk' }}>
              We Don't Steal Your Scripts
            </h1>
            <p className="text-xl text-[#0D9488] font-medium mb-6">
              Finally, a cannabis clinic that supports Community Pharmacy
            </p>
            <p className="text-lg text-[#0A2540]/70 leading-relaxed">
              We know the frustration. You refer a patient to an online telehealth platform, and the script disappears to a centralized warehouse in another state. Surecan Clinic is different. We are a local Specialist Bridge.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-bold text-[#0A2540] mb-12 text-center" style={{ fontFamily: 'Space Grotesk' }}>
            How the Partnership Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#0A2540]/10 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-[#0D9488]">1</span>
                </div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-4">You Refer</h3>
                <p className="text-[#0A2540]/70">
                  Send us a patient asking for advice on medicinal cannabis. No formal referral needed—just their contact details.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#0A2540]/10 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-[#0D9488]">2</span>
                </div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-4">We Assess</h3>
                <p className="text-[#0A2540]/70">
                  Dr. Lewis handles the clinical prescribing, TGA approvals, and patient education.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#0A2540]/10 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-[#0D9488]">3</span>
                </div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-4">We Return</h3>
                <p className="text-[#0A2540]/70">
                  The script comes back to <strong>YOU</strong> for dispensing. No lock-in, no warehouse.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Local First Promise */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#F8FAFC] to-[#0D9488]/5">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0A2540] mb-12 text-center" style={{ fontFamily: 'Space Grotesk' }}>
            Our "Local First" Promise
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-[#0A2540]/10">
              <CardContent className="p-6">
                <CheckCircle2 className="w-8 h-8 text-[#0D9488] mb-4" />
                <h3 className="text-xl font-bold text-[#0A2540] mb-3">No Lock-in Contracts</h3>
                <p className="text-[#0A2540]/70">
                  We write open eScripts or direct them specifically to the patient's nominated pharmacy. Your pharmacy, your patient.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#0A2540]/10">
              <CardContent className="p-6">
                <CheckCircle2 className="w-8 h-8 text-[#0D9488] mb-4" />
                <h3 className="text-xl font-bold text-[#0A2540] mb-3">Complex Care Support</h3>
                <p className="text-[#0A2540]/70">
                  We are available to discuss potential drug interactions (CYP450) with you directly. No automated responses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#0A2540]/10">
              <CardContent className="p-6">
                <CheckCircle2 className="w-8 h-8 text-[#0D9488] mb-4" />
                <h3 className="text-xl font-bold text-[#0A2540] mb-3">Inventory Advice</h3>
                <p className="text-[#0A2540]/70">
                  We can let you know which products we frequently prescribe so you can keep stock on hand, minimizing patient wait times.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#0A2540]/10">
              <CardContent className="p-6">
                <CheckCircle2 className="w-8 h-8 text-[#0D9488] mb-4" />
                <h3 className="text-xl font-bold text-[#0A2540] mb-3">Patient Education Support</h3>
                <p className="text-[#0A2540]/70">
                  Our nurse-led model ensures patients understand administration, storage, and driving laws before their first dispense.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnership Form */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2540] mb-4" style={{ fontFamily: 'Space Grotesk' }}>
              Partner with Us
            </h2>
            <p className="text-lg text-[#0A2540]/70">
              Join our network of community pharmacies. We'll send you a "Pharmacist Direct" contact card and add you to our preferred partner list.
            </p>
          </div>

          <Card className="border-[#0A2540]/10">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="pharmacyName">Pharmacy Name *</Label>
                  <Input
                    id="pharmacyName"
                    value={formData.pharmacyName}
                    onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Pharmacy Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="mt-2"
                    placeholder="Street, Suburb, State, Postcode"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Request Partnership"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-[#0A2540] text-white">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Space Grotesk' }}>
            Get in Touch
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#0D9488] flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/80 mb-2">Phone</p>
              <p className="font-medium">1300 SURECAN</p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-[#0D9488] flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/80 mb-2">Email</p>
              <p className="font-medium">pharmacy@surecan.clinic</p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-[#0D9488] flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/80 mb-2">Location</p>
              <p className="font-medium">Sydney, NSW</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
