import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { useLocation } from "wouter";

export default function FAQ() {
  const [, setLocation] = useLocation();

  const faqs = [
    {
      question: "Do I need to apply for the TGA permit?",
      answer: "No. As Authorized Prescribers, we hold the permits. If you choose to take over prescribing later, we provide you with the necessary SAS-B data to streamline your application.",
      category: "Regulatory"
    },
    {
      question: "What about patients with a history of substance abuse?",
      answer: "We view this as a high-risk category. We require strict dispensing intervals (e.g., weekly dispensing) and engage our pharmacy partners to monitor compliance closely.",
      category: "Safety"
    },
    {
      question: "Does this affect my PIP QI measures?",
      answer: "No. In fact, by stabilizing chronic pain or anxiety, patients are often better able to engage with your Chronic Disease Management plans (Item 721).",
      category: "Practice Management"
    },
    {
      question: "How long does the stabilization phase take?",
      answer: "Typically 3-6 months. We manage the complex assessment and titration phase using evidence-based chemovars with a 'Start Low, Go Slow' protocol.",
      category: "Clinical Process"
    },
    {
      question: "What happens after stabilization?",
      answer: "You receive a Comprehensive Transfer of Care Letter detailing the effective strain and dose, the TGA approval number (SAS/AP), and a clear plan for repeat prescribing should you wish to take over.",
      category: "Clinical Process"
    },
    {
      question: "Do you handle all TGA reporting?",
      answer: "Yes. We handle all TGA reporting and permit compliance. There's no paperwork burden on referring practitioners.",
      category: "Regulatory"
    },
    {
      question: "How quickly do you triage referrals?",
      answer: "We triage all referrals within 48 hours of receipt. Urgent cases are prioritized and assessed within 24 hours.",
      category: "Clinical Process"
    },
    {
      question: "What if the patient wants to stay with your clinic long-term?",
      answer: "We explicitly decline requests to take over general health duties. Our model is specialist support, not primary care replacement. The 'Boomerang' guarantee ensures patients return to you.",
      category: "Practice Management"
    },
    {
      question: "Can I refer via HealthLink?",
      answer: "Yes. You can send a standard referral via HealthLink (ID: [Insert]) or Fax. Please include a summary of conditions and current medications.",
      category: "Referral Process"
    },
    {
      question: "What safety screening do you perform?",
      answer: "We screen heavily for contraindications including active psychosis, unstable cardiac issues, pregnancy, and severe hepatic impairment. Our 3:1 nurse-to-doctor model ensures extensive patient education on driving laws, drug interactions, and administration methods.",
      category: "Safety"
    }
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

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
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-[#0A2540]/70 mb-8">
              Common questions from GPs, specialists, and practice managers about the Shared Care model
            </p>
            <Button
              size="lg"
              className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white gap-2"
              onClick={() => window.open('/downloads/eligibility-cheat-sheet.pdf', '_blank')}
            >
              <Download className="w-5 h-5" />
              Download Eligibility Cheat Sheet
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-4xl">
          {categories.map((category, idx) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-[#0A2540] mb-6 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk' }}>
                <div className="w-8 h-8 rounded-full bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                {category}
              </h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqs
                  .filter(faq => faq.category === category)
                  .map((faq, faqIdx) => (
                    <AccordionItem
                      key={faqIdx}
                      value={`${category}-${faqIdx}`}
                      className="border border-[#0A2540]/10 rounded-lg px-6 bg-white"
                    >
                      <AccordionTrigger className="text-left font-medium text-[#0A2540] hover:text-[#0D9488] py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-[#0A2540]/70 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0A2540] text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            Still Have Questions?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Our team is here to help. Contact us directly or submit a referral to discuss your patient's case.
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
              onClick={() => window.location.href = "mailto:referrals@surecan.clinic"}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
