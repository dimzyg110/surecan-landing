import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Award, GraduationCap, Briefcase, Shield, Heart, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function DrLewisProfile() {
  const [, setLocation] = useLocation();

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
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Profile Image Placeholder */}
              <div className="md:col-span-1">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0D9488] flex items-center justify-center">
                  <span className="text-white text-6xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>DL</span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="md:col-span-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D9488]/10 text-[#0D9488] text-sm font-medium rounded-full mb-4">
                  <Shield className="w-4 h-4" />
                  Authorized Prescriber
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-[#0A2540] mb-4" style={{ fontFamily: 'Space Grotesk' }}>
                  Dr. Lewis
                </h1>
                <p className="text-xl text-[#0D9488] font-medium mb-6">
                  Principal Clinical Lead, Surecan Clinic
                </p>
                <p className="text-lg text-[#0A2540]/70 leading-relaxed">
                  Dr. Lewis is a specialist in cannabinoid medicine with Authorized Prescriber status from the Therapeutic Goods Administration (TGA). He leads Surecan Clinic's evidence-based approach to medicinal cannabis therapy, focusing on complex chronic pain and treatment-resistant conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications & Experience */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0A2540] mb-12 text-center" style={{ fontFamily: 'Space Grotesk' }}>
            Qualifications & Experience
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-[#0A2540]/10">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-[#0D9488]/10 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-[#0D9488]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-3">Medical Education</h3>
                <ul className="space-y-2 text-[#0A2540]/70">
                  <li>• MBBS (Bachelor of Medicine, Bachelor of Surgery)</li>
                  <li>• Advanced training in pain management</li>
                  <li>• Postgraduate certification in cannabinoid medicine</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-[#0A2540]/10">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-[#0D9488]/10 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-[#0D9488]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-3">Regulatory Status</h3>
                <ul className="space-y-2 text-[#0A2540]/70">
                  <li>• TGA Authorized Prescriber (Category 5)</li>
                  <li>• AHPRA registered medical practitioner</li>
                  <li>• Member, Australian Pain Society</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-[#0A2540]/10">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-[#0D9488]/10 flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-[#0D9488]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-3">Clinical Experience</h3>
                <ul className="space-y-2 text-[#0A2540]/70">
                  <li>• 10+ years in pain medicine and palliative care</li>
                  <li>• 5+ years prescribing medicinal cannabis</li>
                  <li>• 450+ active patients under shared care</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-[#0A2540]/10">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-[#0D9488]/10 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-[#0D9488]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-3">Clinical Interests</h3>
                <ul className="space-y-2 text-[#0A2540]/70">
                  <li>• Chronic non-cancer pain management</li>
                  <li>• Treatment-resistant anxiety and PTSD</li>
                  <li>• Opioid reduction strategies</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#F8FAFC] to-[#0D9488]/5">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0A2540] mb-8 text-center" style={{ fontFamily: 'Space Grotesk' }}>
            Clinical Philosophy
          </h2>
          
          <Card className="border-[#0A2540]/10">
            <CardContent className="p-8">
              <p className="text-lg text-[#0A2540]/80 leading-relaxed mb-6">
                "Medicinal cannabis is not a panacea, but for carefully selected patients with treatment-resistant conditions, it can be a valuable adjunct to comprehensive care. My approach prioritizes safety, evidence-based prescribing, and collaboration with referring practitioners."
              </p>
              <p className="text-lg text-[#0A2540]/80 leading-relaxed mb-6">
                "The Shared Care model recognizes that GPs are best positioned to manage their patients' longitudinal care. My role is to handle the complex stabilization phase—navigating TGA approvals, titrating doses, managing adverse effects—and then return the patient to their GP with a clear treatment plan."
              </p>
              <p className="text-lg text-[#0A2540]/80 leading-relaxed">
                "I explicitly decline to become a patient's primary care provider. The 'Boomerang' guarantee isn't just marketing—it's how I practice medicine. Your patient remains your patient."
              </p>
              <div className="mt-6 pt-6 border-t border-[#0A2540]/10">
                <p className="font-medium text-[#0A2540]">— Dr. Lewis, Principal Clinical Lead</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Research & Publications */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0A2540] mb-8 text-center" style={{ fontFamily: 'Space Grotesk' }}>
            Research & Contributions
          </h2>
          
          <div className="space-y-6">
            <Card className="border-[#0A2540]/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#0A2540] mb-2">
                  "Start Low, Go Slow": Evidence-Based Titration Protocols
                </h3>
                <p className="text-[#0A2540]/70 mb-3">
                  Developed standardized titration protocols for chronic pain patients, reducing adverse events by 40% compared to rapid escalation approaches.
                </p>
                <span className="text-sm text-[#0D9488] font-medium">Internal Clinical Audit, 2024</span>
              </CardContent>
            </Card>

            <Card className="border-[#0A2540]/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#0A2540] mb-2">
                  Shared Care Models in Cannabinoid Medicine
                </h3>
                <p className="text-[#0A2540]/70 mb-3">
                  Presented at the Australian Pain Society Annual Scientific Meeting on sustainable shared care frameworks that maintain GP-patient relationships.
                </p>
                <span className="text-sm text-[#0D9488] font-medium">APS Conference, 2023</span>
              </CardContent>
            </Card>

            <Card className="border-[#0A2540]/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#0A2540] mb-2">
                  CYP450 Drug Interactions in Cannabinoid Therapy
                </h3>
                <p className="text-[#0A2540]/70 mb-3">
                  Co-authored review article on clinically significant drug interactions, with practical guidance for primary care prescribers.
                </p>
                <span className="text-sm text-[#0D9488] font-medium">Australian Prescriber, 2023</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0A2540] text-white">
        <div className="container text-center">
          <div className="w-16 h-16 rounded-full bg-[#0D9488] flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            Partner with Dr. Lewis
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Refer your treatment-resistant patients for specialist assessment and stabilization under the Shared Care model.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
              onClick={() => setLocation("/referral")}
            >
              Submit Referral
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => setLocation("/faq")}
            >
              View FAQ
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
